import { Request, Response } from "express"
import * as service from "../services/usersServices"

export const getMyUser = async (req: Request, res: Response) => {
    const response = await service.getMyUserService()
    return res.status(response.statusCode).json(response.body)
}

export const RegisterUser = async (req: Request, res: Response) => {
    const response = await service.RegisterUserService(req.body)
    return res.status(response.statusCode).json(response.body)
}

export const LoginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body
    const response = await service.LoginUserService(email, password)
    return res.status(response.statusCode).json(response.body)
}