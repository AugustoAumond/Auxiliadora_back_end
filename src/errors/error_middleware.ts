import { Request, Response, NextFunction } from "express";
import { AppError } from "./app_error";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";

export function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      status: 400,
      message: "Erro de validação",
      errors: error.issues.map((issue) => ({
        field: issue.path[0],
        message: issue.message,
      })),
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const status = error.code === "P2002" || error.code === "P2034" ? 409 : 400;
    return res.status(status).json({
      status,
      message:
        "Não foi possível concluir a operação devido a um conflito de dados",
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: error.statusCode,
      message: error.message,
    });
  }

  console.error(error);

  return res.status(500).json({
    status: 500,
    message: "Erro interno do servidor",
  });
}
