import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/app_error";
import { jwtSecret } from "../middlewares/auth_middleware";
import { UserRepository } from "../repositories/user_repository";

interface LoginDTO {
  email: string;
  password: string;
}

export class AuthService {
  private readonly users = new UserRepository();

  async login({ email, password }: LoginDTO) {
    const user = await this.users.findByEmail(email);
    const isBcryptHash = user?.password.startsWith("$2") ?? false;
    const isValid =
      user && isBcryptHash
        ? await bcrypt.compare(password, user.password)
        : user &&
          crypto.createHash("md5").update(password).digest("hex") ===
            user.password;

    if (!isValid || !user) {
      throw new AppError("Email ou senha inválidos", 401);
    }

    if (!isBcryptHash) {
      await this.users.updatePassword(user.id, await bcrypt.hash(password, 12));
    }

    const token = jwt.sign({ email: user.email }, jwtSecret, {
      subject: user.id,
      expiresIn: "8h",
    });

    return {
      token,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }
}
