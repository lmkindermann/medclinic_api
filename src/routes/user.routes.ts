import { Router } from "express"
import { UserController } from "../controllers/UserController"

const userRoutes = Router()
const userController = new UserController()

userRoutes.get("/me", (req, res) => userController.me(req, res))

export default userRoutes