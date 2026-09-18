import { Router } from "express"
import { authRoutes } from "./auth.routes"
import { adminRoutes } from "./admin.routes"
import { userRoutes } from "./user.routes"

const routes = Router()

routes.use("/auth", authRoutes)
routes.use("/admin", adminRoutes)
routes.use("/user", userRoutes)

export { routes }