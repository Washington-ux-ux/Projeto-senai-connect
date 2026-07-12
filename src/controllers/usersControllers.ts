import { Request, Response } from "express"
import * as service from "../services/usersServices"

export const getMyUser = async (req: Request, res: Response) => {
    const userMatricula = (req as any).userMatricula
    console.log("getMyUser controller called with userMatricula:", userMatricula);
    const response = await service.getMyUserService(userMatricula)
    return res.status(response.statusCode).json(response.body)
}

export const RegisterUser = async (req: Request, res: Response) => {
    const response = await service.RegisterUserService(req.body)
    return res.status(response.statusCode).json(response.body)
}

export const LoginUser = async (req: Request, res: Response) => {
    console.log("=== LOGIN REQUEST RECEIVED ===")
    console.log("Request body:", req.body)
    console.log("Request headers:", req.headers)
    
    const { matricula, password } = req.body
    console.log("Extracted matricula:", matricula, "password:", password)
    
    const response = await service.LoginUserService(matricula, password)
    console.log("Service response:", response)
    
    return res.status(response.statusCode).json(response.body)
}