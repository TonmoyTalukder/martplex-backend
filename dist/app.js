"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = require("./app/middlewares/globalErrorHandler");
const notFound_1 = require("./app/middlewares/notFound");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cron_1 = require("./shared/cron");
const app = (0, express_1.default)();
// Configure CORS options
const corsOptions = {
    origin: (origin, callback) => {
        const allowedOrigins = [
            'https://martplex.vercel.app',
            'http://localhost:3000',
        ];
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
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
app.use((0, cors_1.default)(corsOptions));
app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://martplex.vercel.app');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    if (_req.method === 'OPTIONS') {
        res.status(200).end(); // Respond OK for preflight
        return; // Explicitly return to end the middleware chain
    }
    next();
});
app.options('*', (0, cors_1.default)());
// parser
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Schedule Cron Jobs
(0, cron_1.scheduleJobs)();
// api
app.get('/', (req, res) => {
    res.send({
        message: 'MartPlex server...',
    });
});
app.use('/api/', routes_1.default);
// middleware
app.use(globalErrorHandler_1.globalErrorHandler);
app.use(notFound_1.notFound);
exports.default = app;
