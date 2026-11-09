import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { roleMiddleware } from "../middlewares/roleMiddleware";
import { UsuarioRole } from "../entities/user";

const adminRoutes = Router();
const adminController = new AdminController();

adminRoutes.get(
    "/ping",
    authMiddleware,
    roleMiddleware(UsuarioRole.ADMIN),
    (req, res) => adminController.ping(req, res)
);

export default adminRoutes;
