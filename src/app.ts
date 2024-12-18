import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import router from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { notFound } from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';

const app: Application = express();

// cors
// app.use(cors());
// app.use(
//   cors({
//     origin: 'http://localhost:3000',
//     credentials: true, // Allow credentials
//   }),
// );

// Configure CORS options
const corsOptions = {
  origin: ['https://martplex.vercel.app/'], // List allowed origins https://martplex.vercel.app/ http://localhost:3000
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Apply CORS with options
app.use(cors(corsOptions));

// Handle preflight (OPTIONS) requests
app.options('*', cors());

// parser
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// api
app.get('/', (req: Request, res: Response) => {
  res.send({
    message: 'MartPlex server...',
  });
});

app.use('/api/', router);

// middleware
app.use(globalErrorHandler);
app.use(notFound);

export default app;
