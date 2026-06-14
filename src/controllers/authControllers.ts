import { Request, Response } from "express"
import * as service from "../services/authServices"

export const changePassword = async (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body
    const userId = (req as any).userId

    const response = await service.changePasswordService(userId, currentPassword, newPassword)
    return res.status(response.statusCode).json(response.body)
}

export const forgotPassword = async (req: Request, res: Response) => {
    const { email, newPassword } = req.body

    const response = await service.forgotPasswordService(email, newPassword)
    return res.status(response.statusCode).json(response.body)
}
