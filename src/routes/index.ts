import { Router } from "express"
import authRoutes from "./auth.routes"
import adminRoutes from "./admin.routes"
import userRoutes from "./user.routes"
import especialidadeRoutes from './especialidade.routes';

const routes = Router()

routes.use("/auth", authRoutes)
routes.use("/admin", adminRoutes)
routes.use("/especialidades", especialidadeRoutes)
routes.use("/user", userRoutes)

export default routes