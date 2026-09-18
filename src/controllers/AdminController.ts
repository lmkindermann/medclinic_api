import { Response} from "express"
import { AuthenticatedRequest } from "../middlewares/authMiddleware";

export class AdminController {
  
  //GET /admin/ping
  async ping(req: AuthenticatedRequest, res: Response): Promise<Response> {
    return res.status(200).json({
      message: 'Usuário administrador identificado. Acesso autorizado!',
    });
  }
}