import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AppError } from "../errors/app_error";

function requiredEnvironment(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} deve ser definido antes de iniciar a aplicação`);
  }
  return value;
}

const jwtSecret =
  process.env.JWT_SECRET ??
  (process.env.NODE_ENV === "production"
    ? requiredEnvironment("JWT_SECRET")
    : "development-only-secret-change-me");

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return next(new AppError("Autenticação obrigatória", 401));
  }

  try {
    const token = authorization.slice("Bearer ".length);
    const payload = jwt.verify(token, jwtSecret);

    if (typeof payload === "string" || !payload.sub) {
      throw new AppError("Token inválido", 401);
    }

    req.auth = payload as JwtPayload & { sub: string };
    return next();
  } catch (error) {
    return next(
      error instanceof AppError
        ? error
        : new AppError("Token inválido ou expirado", 401),
    );
  }
}

export { jwtSecret };
