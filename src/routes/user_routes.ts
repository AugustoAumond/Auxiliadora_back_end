import { Router } from "express";
import { UserController } from "../controllers/user_controller";
import { requireAuth } from "../middlewares/auth_middleware";

const router = Router();

const userController = new UserController();

router.post("/users", userController.create.bind(userController));

router.get("/users", requireAuth, userController.findAll.bind(userController));

export default router;
