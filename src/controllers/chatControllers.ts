import { Request, Response } from "express"
import * as service from "../services/chatServices"

export const getChatRoom = async (req: Request, res: Response) => {
    const response = await service.getChatRoomService()
    return res.status(response.statusCode).json(response.body)
}

export const getMessagesRoom = async (req: Request, res: Response) => {
    const { roomId } = req.params
    const response = await service.getMessagesRoomService(roomId as string)
    return res.status(response.statusCode).json(response.body)
}

