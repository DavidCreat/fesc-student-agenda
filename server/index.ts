import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import figlet from 'figlet';
import chalk from 'chalk';
import { createServer } from 'net';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../src/models/User';
import { SessionLog } from '../src/models/SessionLog'; 
import { Task } from '../src/models/Task';
import { ScheduleEntry } from '../src/models/ScheduleEntry';
import { HfInference } from "@huggingface/inference";
import fetch from 'node-fetch';

// Load environment variables
dotenv.config();

// Extender el tipo Request de Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        [key: string]: any;
      };
    }
  }
}

const app = express();
const DEFAULT_PORT = 5000;
let PORT = parseInt(process.env.VITE_PORT || DEFAULT_PORT.toString(), 10);
const MONGODB_URI = process.env.VITE_MONGODB_URI;
const JWT_SECRET = process.env.VITE_JWT_SECRET || 'your-secret-key' as string;

const inference = new HfInference(process.env.VITE_HUGGINGFACE_TOKEN);

const findAvailablePort = (startPort: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const server = createServer();
    
    server.listen(startPort, () => {
      const { port } = server.address() as { port: number };
      server.close(() => resolve(port));
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        findAvailablePort(startPort + 1)
          .then(resolve)
          .catch(reject);
      } else {
        reject(err);
      }
    });
  });
};

app.use(cors());
app.use(express.json());

// Función para validar enlaces
async function validateLinks(recommendations: any) {
  const validatedRecommendations = {
    books: [] as any[],
    videos: [] as any[]
  };

  // Validar enlaces de Amazon
  for (const book of recommendations.books || []) {
    try {
      const response = await fetch(book.link);
      if (response.ok && !response.url.includes('404')) {
        validatedRecommendations.books.push(book);
      }
    } catch (error) {
      console.log(`Invalid book link: ${book.link}`);
    }
  }

  // Validar enlaces de YouTube
  for (const video of recommendations.videos || []) {
    try {
      const response = await fetch(video.link);
      if (response.ok && !response.url.includes('unavailable') && !response.url.includes('removed')) {
        validatedRecommendations.videos.push(video);
      }
    } catch (error) {
      console.log(`Invalid video link: ${video.link}`);
    }
  }

  return validatedRecommendations;
}

// Recommendations endpoint
app.post('/api/recommendations/generate', async (req, res) => {
  const { career, semester } = req.body;
  console.log('Generating recommendations for:', { career, semester });

  const systemPrompt = `Eres un experto en educación que recomienda recursos de aprendizaje. Proporciona recomendaciones específicas y relevantes. Asegúrate de que los enlaces sean reales y actuales.`;
  const userPrompt = `Necesito 4 recomendaciones de libros y 4 videos educativos para un estudiante de ${career} en el semestre ${semester}. 
  Los libros deben ser relevantes para su nivel académico y la carrera, con enlaces reales de Amazon. 
  Los videos deben ser tutoriales o cursos específicos que le ayuden en su formación, con enlaces reales de YouTube.
  Cada vez que te pregunte, debes dar recomendaciones diferentes pero igualmente relevantes.
  Responde SOLO en formato JSON con la siguiente estructura exacta:
  {
    "books": [
      {"title": "título del libro", "link": "enlace real de amazon al libro", "description": "descripción breve"}
    ],
    "videos": [
      {"title": "título del video", "link": "enlace real de youtube al video", "description": "descripción breve"}
    ]
  }`;

  async function generateRecommendations(retryCount = 0): Promise<any> {
    if (retryCount >= 3) {
      console.log('Máximo número de intentos alcanzado');
      return DEFAULT_RECOMMENDATIONS;
    }

    try {
      const chatCompletion = await inference.chatCompletion({
        model: "deepseek-ai/DeepSeek-R1",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ],
        provider: "together",
        max_tokens: 1500,
        temperature: 0.9, // Aumentado para más variedad
        top_p: 0.95,
        frequency_penalty: 0.5, // Penaliza la repetición de términos
        presence_penalty: 0.5 // Fomenta la diversidad
      });

      const generatedText = chatCompletion.choices?.[0]?.message?.content;
      if (!generatedText) {
        throw new Error("No generated text in response");
      }

      // Limpiar y validar el JSON antes de parsearlo
      let jsonText = generatedText;
      
      // Intentar extraer solo la parte JSON
      const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }
      
      jsonText = jsonMatch[0];
      
      // Limpiar caracteres problemáticos
      jsonText = jsonText
        .replace(/[\u0000-\u001F]+/g, '') // Eliminar caracteres de control
        .replace(/\\n/g, '') // Eliminar saltos de línea escapados
        .replace(/\\"/g, '"') // Manejar comillas escapadas
        .replace(/"\s+/g, '"') // Eliminar espacios después de comillas
        .replace(/\s+"/g, '"') // Eliminar espacios antes de comillas
        .trim();

      // Validar estructura básica del JSON
      if (!jsonText.startsWith('{') || !jsonText.endsWith('}')) {
        throw new Error("Invalid JSON structure");
      }

      let recommendations;
      try {
        recommendations = JSON.parse(jsonText);
      } catch (parseError) {
        console.error("JSON parsing error:", parseError, "Text:", jsonText);
        throw new Error("Invalid JSON format");
      }

      // Validar estructura de las recomendaciones
      if (!recommendations.books || !Array.isArray(recommendations.books) ||
          !recommendations.videos || !Array.isArray(recommendations.videos)) {
        throw new Error("Invalid recommendations structure");
      }

      // Validar y limpiar las recomendaciones
      const cleanRecommendations = {
        books: recommendations.books
          .filter(book => book && typeof book === 'object' && book.title && book.link)
          .slice(0, 4)
          .map(book => ({
            title: String(book.title).trim(),
            link: String(book.link).trim(),
            description: String(book.description || "Libro relevante para tu carrera").trim()
          })) || [],
        videos: recommendations.videos
          .filter(video => video && typeof video === 'object' && video.title && video.link)
          .slice(0, 4)
          .map(video => ({
            title: String(video.title).trim(),
            link: String(video.link).trim(),
            description: String(video.description || "Video educativo relevante").trim()
          })) || []
      };

      if (cleanRecommendations.books.length === 0 || cleanRecommendations.videos.length === 0) {
        throw new Error("No valid recommendations found");
      }

      // Validar enlaces
      const validatedRecommendations = await validateLinks(cleanRecommendations);

      // Verificar si tenemos suficientes recomendaciones válidas
      if (validatedRecommendations.books.length < 4 || validatedRecommendations.videos.length < 4) {
        console.log('No hay suficientes enlaces válidos, intentando de nuevo...');
        return generateRecommendations(retryCount + 1);
      }

      return validatedRecommendations;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return generateRecommendations(retryCount + 1);
    }
  }

  try {
    const recommendations = await generateRecommendations();
    return res.json(recommendations);
  } catch (error) {
    console.error('Error final:', error);
    return res.json(DEFAULT_RECOMMENDATIONS);
  }
});

const DEFAULT_RECOMMENDATIONS = {
  books: [
    {
      title: "Introducción a la carrera",
      link: "https://www.amazon.com/",
      description: "Libro básico recomendado para el semestre"
    }
  ],
  videos: [
    {
      title: "Fundamentos básicos",
      link: "https://www.youtube.com/",
      description: "Video introductorio recomendado"
    }
  ]
};

app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:;"
  );
  next();
});

// Utility function to format full name
function formatFullName(name: string): string {
  return name
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Validate full name format (at least two names and two surnames)
function validateFullName(name: string): { isValid: boolean; message?: string } {
  const parts = name.trim().split(/\s+/);
  
  if (parts.length < 4) {
    return {
      isValid: false,
      message: 'Debe ingresar nombre completo (2 nombres y 2 apellidos). Ejemplo: David Alexander Fonseca Perez'
    };
  }

  // Check if each part is at least 2 characters long
  const invalidParts = parts.filter(part => part.length < 2);
  if (invalidParts.length > 0) {
    return {
      isValid: false,
      message: 'Cada parte del nombre debe tener al menos 2 caracteres'
    };
  }

  return { isValid: true };
}

const startServer = async () => {
  try {
    PORT = await findAvailablePort(PORT);
    
    await mongoose.connect(MONGODB_URI!);
    
    console.clear(); 
    
    console.log('\n');
    console.log(chalk.cyan(figlet.textSync('FESC AGENDA', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default'
    })));
    
    console.log('\n');
    console.log(chalk.green('✓ MongoDB Connection Status:'));
    console.log(chalk.green('  ├── Database: ') + chalk.yellow(process.env.VITE_MONGODB_DB_NAME));
    console.log(chalk.green('  └── Status: ') + chalk.bgGreen.black(' CONNECTED '));
    console.log('\n');
    
    app.listen(PORT, () => {
      console.log(chalk.cyan('✓ Server Status:'));
      console.log(chalk.cyan('  ├── Environment: ') + chalk.yellow(process.env.NODE_ENV));
      console.log(chalk.cyan('  └── Port: ') + chalk.yellow(PORT));
      console.log('\n');
    });
  } catch (error: any) {
    console.error(chalk.red('✗ Error starting server:'));
    console.error(chalk.red('  └── ') + chalk.red(error.message));
    process.exit(1);
  }
};

startServer();

// Define the request body interfaces
interface LoginRequestBody {
  email: string;
  password: string;
}

interface RegisterRequestBody {
  fullName: string;
  email: string;
  password: string;
  career: string;
  semester: number;
  schedule: 'day' | 'night';
}

app.post('/api/auth/login', async (req: express.Request<{}, {}, LoginRequestBody>, res) => {
  try {
    const { email, password } = req.body;
    console.log(chalk.cyan.bold('\n🔐 Intento de inicio de sesión'));
    console.log(chalk.cyan('├── Email:'), chalk.white(email));

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log(chalk.red('└── ❌ Usuario no encontrado'));
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    console.log(chalk.green('├── ✅ Usuario encontrado'));
    console.log(chalk.green('│   ├── ID:'), chalk.white(user._id));
    console.log(chalk.green('│   ├── Email:'), chalk.white(user.email));
    console.log(chalk.green('│   └── Nombre:'), chalk.white(user.fullName));

    // Check password
    try {
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        console.log(chalk.red('└── ❌ Contraseña incorrecta'));
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }
    } catch (passwordError) {
      console.error(chalk.red('└── ❌ Error al verificar la contraseña:'), passwordError);
      return res.status(500).json({ message: 'Error al verificar las credenciales' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        career: user.career,
        semester: user.semester,
        schedule: user.schedule
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(chalk.green('└── ✅ Inicio de sesión exitoso'));
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        career: user.career,
        semester: user.semester,
        schedule: user.schedule
      }
    });
  } catch (error) {
    console.error(chalk.red('└── ❌ Error en el servidor:'), error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

app.post('/api/auth/register', async (req: express.Request<{}, {}, RegisterRequestBody>, res) => {
  try {
    const { fullName, email, password, career, semester, schedule } = req.body;

    console.log(chalk.cyan.bold('\n📝 Intento de registro'));
    console.log(chalk.cyan('├── Email:'), chalk.white(email));
    console.log(chalk.cyan('├── Nombre:'), chalk.white(fullName));

    // Validate required fields
    if (!fullName || !email || !password || !career || !semester || !schedule) {
      console.log(chalk.red('└── ❌ Campos incompletos'));
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // Validate and format full name
    const nameValidation = validateFullName(fullName);
    if (!nameValidation.isValid) {
      console.log(chalk.red('└── ❌ Nombre inválido:'), nameValidation.message);
      return res.status(400).json({ message: nameValidation.message });
    }

    // Format the full name
    const formattedFullName = formatFullName(fullName);
    console.log(chalk.green('├── ✅ Nombre formateado:'), chalk.white(formattedFullName));

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log(chalk.red('└── ❌ El correo ya está registrado'));
      return res.status(400).json({ message: 'El correo ya está registrado' });
    }

    // Validate email format
    const emailRegex = /^est_[a-z0-9]+_[a-z0-9]+@fesc\.edu\.co$/;
    if (!emailRegex.test(email.toLowerCase())) {
      console.log(chalk.red('└── ❌ Formato de correo inválido'));
      return res.status(400).json({ 
        message: 'El correo debe tener el formato est_nombre_apellido@fesc.edu.co (ejemplo: est_breiner_sierra@fesc.edu.co)' 
      });
    }

    // Create new user with formatted name
    const user = await User.create({
      fullName: formattedFullName,
      email: email.toLowerCase(),
      password,
      career,
      semester,
      schedule
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        career: user.career,
        semester: user.semester,
        schedule: user.schedule
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log(chalk.green('└── ✅ Registro exitoso'));
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        career: user.career,
        semester: user.semester,
        schedule: user.schedule
      }
    });
  } catch (error: any) {
    console.error(chalk.red('└── ❌ Error en el registro:'), error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: Object.values(error.errors).map((err: any) => err.message).join(', ') });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Interfaces
interface JwtPayload {
  id: string;
  [key: string]: any;
}

// Middleware para verificar el token JWT
const verifyToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.log('Verificando token...');
  console.log('Headers:', req.headers);
  
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log('No se encontró header de autorización');
    return res.status(401).json({ message: 'No autorizado' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    console.log('No se encontró token en el header');
    return res.status(401).json({ message: 'No autorizado' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    console.log('Token verificado exitosamente:', decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al verificar token:', error);
    return res.status(401).json({ message: 'Token inválido o expirado' });
  }
};

// Get current user endpoint
app.get('/api/auth/me', async (req, res) => {
  console.log('Headers:', req.headers);
  const token = req.headers.authorization?.split(' ')[1];
  console.log('Token recibido:', token);
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    console.log('Verificando token con secret:', JWT_SECRET);
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    console.log('Token decodificado:', decoded);
    
    const user = await User.findById(decoded.id).select('-password');
    console.log('Usuario encontrado:', user);
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error detallado:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.get('/api/auth/verify', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    res.json({ valid: true });
  } else {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Session routes
app.post('/api/sessions', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const { startTime, endTime, duration, activity } = req.body;

    const sessionLog = new SessionLog({
      userId: decoded.id,
      startTime,
      endTime,
      duration,
      activity
    });

    await sessionLog.save();
    res.status(201).json(sessionLog);
  } catch (error) {
    console.error('Error creating session log:', error);
    res.status(500).json({ message: 'Error al guardar la sesión' });
  }
});

app.get('/api/sessions', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const sessions = await SessionLog.find({ userId: decoded.id })
      .sort({ startTime: -1 })
      .populate('userId', 'fullName email');

    res.json(sessions);
  } catch (error) {
    console.error('Error getting sessions:', error);
    res.status(500).json({ message: 'Error al obtener las sesiones' });
  }
});

// Task routes
app.post('/api/tasks', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const taskData = { ...req.body, userId: decoded.id };

    const task = new Task(taskData);
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error al crear la tarea' });
  }
});

app.get('/api/tasks', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const tasks = await Task.find({ userId: decoded.id })
      .sort({ dueDate: 1 })
      .populate('userId', 'fullName email');

    res.json(tasks);
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ message: 'Error al obtener las tareas' });
  }
});

app.put('/api/tasks/:taskId', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { taskId } = req.params;
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const task = await Task.findOne({ _id: taskId, userId: decoded.id });

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    Object.assign(task, req.body);
    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Error al actualizar la tarea' });
  }
});

app.delete('/api/tasks/:taskId', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { taskId } = req.params;
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const task = await Task.findOneAndDelete({ _id: taskId, userId: decoded.id });

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error al eliminar la tarea' });
  }
});

// Schedule routes
app.post('/api/schedule', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const scheduleData = { 
      ...req.body, 
      userId: decoded.id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const schedule = new ScheduleEntry(scheduleData);
    await schedule.save();
    res.status(201).json(schedule);
  } catch (error) {
    console.error('Error creating schedule entry:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: `Error al crear el horario: ${error.message}` });
    } else {
      res.status(500).json({ message: 'Error al crear el horario' });
    }
  }
});

app.get('/api/schedule', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const schedules = await ScheduleEntry.find({ userId: decoded.id })
      .sort({ dayOfWeek: 1, startTime: 1 });

    res.json(schedules);
  } catch (error) {
    console.error('Error getting schedule:', error);
    res.status(500).json({ message: 'Error al obtener el horario' });
  }
});

app.put('/api/schedule/:entryId', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { entryId } = req.params;
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const schedule = await ScheduleEntry.findOne({ _id: entryId, userId: decoded.id });

    if (!schedule) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }

    // Verificar conflictos de horario
    const { startTime, endTime, dayOfWeek } = req.body;
    if (startTime && endTime && dayOfWeek) {
      const conflictingSchedule = await ScheduleEntry.findOne({
        userId: decoded.id,
        dayOfWeek,
        _id: { $ne: entryId },
        $or: [
          {
            startTime: { $lt: endTime },
            endTime: { $gt: startTime }
          }
        ]
      });

      if (conflictingSchedule) {
        return res.status(400).json({
          message: 'El horario se solapa con otra clase existente'
        });
      }
    }

    Object.assign(schedule, req.body);
    await schedule.save();
    res.json(schedule);
  } catch (error) {
    console.error('Error updating schedule entry:', error);
    res.status(500).json({ message: 'Error al actualizar el horario' });
  }
});

app.delete('/api/schedule/:entryId', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { entryId } = req.params;
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const schedule = await ScheduleEntry.findOneAndDelete({ _id: entryId, userId: decoded.id });

    if (!schedule) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }

    res.json({ message: 'Horario eliminado correctamente' });
  } catch (error) {
    console.error('Error deleting schedule entry:', error);
    res.status(500).json({ message: 'Error al eliminar el horario' });
  }
});

// Endpoint para obtener reportes
app.get('/api/reports', async (req, res) => {
  console.log('Recibida solicitud de reportes');
  console.log('Headers:', req.headers);
  
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    console.log('No se encontró token de autorización');
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    const userId = decoded.id;
    console.log('ID de usuario:', userId);

    // Obtener datos de sesiones
    const sessions = await SessionLog.find({ userId });
    console.log('Sesiones encontradas:', sessions.length);
    
    const lastSession = sessions.length > 0 ? 
      sessions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime())[0].startTime : 
      null;

    // Obtener datos de tareas
    const tasks = await Task.find({ userId });
    console.log('Tareas encontradas:', tasks.length);
    
    const completedTasks = tasks.filter(task => task.completed);
    const pendingTasks = tasks.filter(task => !task.completed);
    const overdueTasks = tasks.filter(task => 
      !task.completed && new Date(task.dueDate) < new Date()
    );

    // Obtener datos de horarios
    const schedules = await ScheduleEntry.find({ userId });
    console.log('Horarios encontrados:', schedules.length);
    
    const classesPerDay: Record<string, number> = {
      'Lunes': 0,
      'Martes': 0,
      'Miércoles': 0,
      'Jueves': 0,
      'Viernes': 0,
      'Sábado': 0,
      'Domingo': 0
    };

    const roomCounts: Record<string, number> = {};
    
    schedules.forEach(schedule => {
      classesPerDay[schedule.dayOfWeek]++;
      roomCounts[schedule.room] = (roomCounts[schedule.room] || 0) + 1;
    });

    const mostFrequentRoom = Object.entries(roomCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';

    const reportData = {
      sessions: {
        totalSessions: sessions.length,
        lastSession: lastSession || new Date(),
        averageSessionDuration: sessions.reduce((acc, session) => acc + (session.duration || 0), 0) / sessions.length || 0
      },
      tasks: {
        total: tasks.length,
        completed: completedTasks.length,
        pending: pendingTasks.length,
        overdue: overdueTasks.length
      },
      schedule: {
        totalClasses: schedules.length,
        classesPerDay,
        mostFrequentRoom
      }
    };

    console.log('Enviando datos de reporte:', reportData);
    res.json(reportData);
  } catch (error: any) {
    console.error('Error detallado al obtener reportes:', {
      error,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ 
      message: 'Error al obtener reportes',
      details: error.message 
    });
  }
});
