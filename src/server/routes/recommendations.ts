import express from 'express';

const router = express.Router();

router.post('/generate', async (req, res) => {
  const { career, semester } = req.body;

  const prompt = `Genera recomendaciones de libros y videos educativos para un estudiante de ${career} en el semestre ${semester}. 
  Por favor proporciona la respuesta en el siguiente formato JSON:
  {
    "books": [
      {"title": "Título del libro", "link": "enlace de amazon", "description": "descripción breve"}
    ],
    "videos": [
      {"title": "Título del video", "link": "enlace de youtube", "description": "descripción breve"}
    ]
  }`;

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/facebook/opt-350m',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.VITE_HUGGINGFACE_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_length: 1000,
            temperature: 0.7,
            num_return_sequences: 1
          }
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    const generatedText = Array.isArray(result) ? result[0].generated_text : result.generated_text;

    try {
      const recommendations = JSON.parse(generatedText);
      if (recommendations.books && recommendations.videos &&
          Array.isArray(recommendations.books) && Array.isArray(recommendations.videos)) {
        return res.json(recommendations);
      }
      throw new Error("Invalid response format");
    } catch (parseError) {
      console.error("Error parsing response:", parseError);
      return res.json(DEFAULT_RECOMMENDATIONS);
    }
  } catch (error) {
    console.error('Error:', error);
    return res.json(DEFAULT_RECOMMENDATIONS);
  }
});

const DEFAULT_RECOMMENDATIONS = {
  books: [
    {
      title: "Fundamentos de la materia",
      link: "https://www.amazon.com/",
      description: "Libro básico recomendado para el semestre"
    }
  ],
  videos: [
    {
      title: "Introducción al tema",
      link: "https://www.youtube.com/",
      description: "Video introductorio recomendado"
    }
  ]
};

export default router;
