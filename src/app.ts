import express from "express";
import userRoutes from "./routes/user_routes";
import propertiesRoutes from "./routes/properties_routes";
import rentalPropertiesRoutes from "./routes/rental_proposals_routes";
import { errorMiddleware } from "./errors/error_middleware";
import cors from "cors";

const app = express();

app.use(cors());

app.use(express.json());

app.use(userRoutes);

app.use(propertiesRoutes);

app.use(rentalPropertiesRoutes);

app.use(errorMiddleware);

export default app;

