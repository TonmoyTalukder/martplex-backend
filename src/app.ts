import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import router from './app/routes';
import { globalErrorHandler } from './app/middlewares/globalErrorHandler';
import { notFound } from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';
import { scheduleJobs } from './shared/cron';

const app: Application = express();

// Configure CORS options
const corsOptions = {
  origin: (origin: any, callback: any) => {
    const allowedOrigins = [
      'https://martplex.vercel.app',
      'http://localhost:3000',
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
  ],
};

app.use(cors(corsOptions));

app.use((_req: Request, res: Response, next: NextFunction): void => {
  res.header('Access-Control-Allow-Origin', 'https://martplex.vercel.app');
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, X-Requested-With, Accept',
  );
  if (_req.method === 'OPTIONS') {
    res.status(200).end(); // Respond OK for preflight
    return; // Explicitly return to end the middleware chain
  }
  next();
});

app.options('*', cors());

// parser
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Schedule Cron Jobs
scheduleJobs();

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
