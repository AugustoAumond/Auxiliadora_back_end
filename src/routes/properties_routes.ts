import { Router } from "express";
import { PropertiesController } from "../controllers/properties_controller";

const router = Router();

const propertiesController = new PropertiesController();

router.post("/properties", propertiesController.create.bind(propertiesController));

router.get("/properties", propertiesController.findAll.bind(propertiesController));

export default router;