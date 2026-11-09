import { Router } from "express"
import authRoutes from "./auth.routes"
import adminRoutes from "./admin.routes"
import userRoutes from "./user.routes"
import especialidadeRoutes from './especialidade.routes';
import medicoRoutes from './medico.routes';
import pacienteRoutes from './paciente.routes';
import consultaRoutes from './consulta.routes';
import relatorioRoutes from './relatorio.routes';

const routes = Router()

routes.use("/auth", authRoutes)
routes.use("/admin", adminRoutes)
routes.use("/medicos", medicoRoutes)
routes.use("/especialidades", especialidadeRoutes)
routes.use("/user", userRoutes)
routes.use('/pacientes', pacienteRoutes);
routes.use('/consultas', consultaRoutes);
routes.use('/relatorios', relatorioRoutes);

export default routes