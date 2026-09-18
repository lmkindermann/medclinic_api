import { Router } from "express"
import { AdminController } from "../controllers/AdminController"

const adminRoutes = Router()
const adminController = new AdminController()

adminRoutes.get("/ping", (req, res) => adminController.ping(req, res))

export { adminRoutes }