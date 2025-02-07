import express from 'express';
import cors from 'cors';
import { serverConfig } from '../config/server-config';
import routes from './routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use('/api', routes);

const PORT = serverConfig.port;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
