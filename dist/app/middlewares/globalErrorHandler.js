"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const globalErrorHandler = (err, req, res, next) => {
    // Default error response
    const errorResponse = {
        success: false,
        status: http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong!',
        error: {
            name: err.name || 'UnknownError',
            code: err.code || err.statusCode || null,
            meta: err.meta || null,
            err,
        },
    };
    // Determine the error code
    const errorCode = err.code || err.statusCode || null;
    // PostgreSQL & Custom Errors
    switch (errorCode) {
        case 'P2002':
            errorResponse.status = http_status_codes_1.StatusCodes.CONFLICT;
            errorResponse.message = 'A record with this value already exists.';
            break;
        case 'P2025':
            errorResponse.status = http_status_codes_1.StatusCodes.NOT_FOUND;
            errorResponse.message = 'The requested record was not found.';
            break;
        case 'P2003':
            errorResponse.status = http_status_codes_1.StatusCodes.BAD_REQUEST;
            errorResponse.message =
                'Invalid reference in the database. Please check related records.';
            break;
        case 'P5000':
            errorResponse.status = http_status_codes_1.StatusCodes.BAD_REQUEST;
            errorResponse.message =
                'Prisma Client Known Request Error. Prisma not being able to connect to the database.';
            break;
        case 403: // Handle numeric status code
            errorResponse.status = http_status_codes_1.StatusCodes.FORBIDDEN;
            errorResponse.message = 'Invalid or expired token.';
            break;
        case 401: // Handle numeric status code
            errorResponse.status = http_status_codes_1.StatusCodes.UNAUTHORIZED;
            errorResponse.message = 'Unauthorized.';
            break;
        default:
            console.error('Unhandled Error:', err);
            break;
    }
    res.status(errorResponse.status).json(errorResponse);
    console.log(errorResponse);
};
exports.globalErrorHandler = globalErrorHandler;
