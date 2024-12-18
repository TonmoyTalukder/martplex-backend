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
const app = (0, express_1.default)();
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
app.use((0, cors_1.default)(corsOptions));
// Handle preflight (OPTIONS) requests
app.options('*', (0, cors_1.default)());
// parser
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
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
