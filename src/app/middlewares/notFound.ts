import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';

export const notFound = (req: Request, res: Response, next: NextFunction) => {
    res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        status: StatusCodes.NOT_FOUND,
        message: "API Not Found!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!"
        }
    })
}