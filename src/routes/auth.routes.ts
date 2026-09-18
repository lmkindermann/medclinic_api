import { Router } from "express"
import { AuthController } from "../controllers/AuthController"

const authRoutes = Router()
const authController = new AuthController()

authRoutes.post("/register/user", (req, res) => authController.registrarUsuario(req, res))
authRoutes.post("/login", (req, res) => authController.login(req, res))

export default authRoutes