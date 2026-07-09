import { Router } from "express";
import { UserController } from "../controllers/user_controller";

const router = Router();

const userController = new UserController();

router.post("/users", userController.create.bind(userController));

router.get("/users", userController.findAll.bind(userController));

export default router;