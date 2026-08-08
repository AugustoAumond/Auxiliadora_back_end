import express from "express";
import userRoutes from "./routes/user_routes";
import propertiesRoutes from "./routes/properties_routes";
import rentalPropertiesRoutes from "./routes/rental_proposals_routes";
import { errorMiddleware } from "./errors/error_middleware";
import cors from "cors";
import authRoutes from "./routes/auth_routes";

const app = express();
const allowedOrigins = process.env.CORS_ORIGIN?.split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins?.length ? allowedOrigins : false }));

app.use(express.json());

app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.use("/auth", authRoutes);
app.use(userRoutes);

app.use(propertiesRoutes);

app.use(rentalPropertiesRoutes);

app.use(errorMiddleware);

export default app;
