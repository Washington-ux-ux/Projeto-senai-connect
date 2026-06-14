import { Request, Response } from "express"
import { AuthRequest } from "../middlewares/authMiddleware"
import * as service from "../services/reactionsServices"

export const getReactionsByPostId = async (req: Request, res: Response) => {
    const { postId } = req.params
    const response = await service.getReactionsByPostIdService(postId as string)
    return res.status(response.statusCode).json(response.body)
}

export const createOrUpdateReaction = async (req: AuthRequest, res: Response) => {
    const { postId } = req.params
    const { emoji, action } = req.body
    const userId = req.userId
    const response = await service.createOrUpdateReactionService(postId, emoji, action, userId)
    return res.status(response.statusCode).json(response.body)
}

export const deleteReactionsByPostId = async (req: Request, res: Response) => {
    const { postId } = req.params
    const response = await service.deleteReactionsByPostIdService(postId as string)
    return res.status(response.statusCode).json(response.body)
}
