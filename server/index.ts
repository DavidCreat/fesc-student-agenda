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

// Load environment variables
dotenv.config();

const app = express();
const DEFAULT_PORT = 5000;
let PORT = parseInt(process.env.VITE_PORT || DEFAULT_PORT.toString(), 10);
const MONGODB_URI = process.env.VITE_MONGODB_URI;
const JWT_SECRET = process.env.VITE_JWT_SECRET || 'your-secret-key' as string;

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

// Middleware to verify JWT token
const verifyToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
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
