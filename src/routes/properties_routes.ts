import { Router } from "express";
import { PropertiesController } from "../controllers/properties_controller";
import { requireAuth } from "../middlewares/auth_middleware";

const router = Router();

const propertiesController = new PropertiesController();

router.post(
  "/properties",
  requireAuth,
  propertiesController.create.bind(propertiesController),
);

router.get(
  "/properties",
  propertiesController.findAll.bind(propertiesController),
);

export default router;
