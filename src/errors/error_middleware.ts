import { Request, Response, NextFunction } from "express";
import { AppError } from "./app_error";
import { ZodError } from "zod";


export function errorMiddleware(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) {


    if (error instanceof ZodError) {
        return res.status(400).json({
            status: 400,
            message: "Erro de validação",
            errors: error.issues.map(issue => ({
                field: issue.path[0],
                message: issue.message
            }))
        });
    }


    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: error.statusCode,
            message: error.message
        });
    }


    console.error(error);


    return res.status(500).json({
        status: 500,
        message: "Erro interno do servidor"
    });
}