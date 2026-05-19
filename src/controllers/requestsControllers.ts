import { Request, Response } from "express"
import * as service from "../services/requestsServices"

export const getAllRequests = async (req: Request, res: Response) => {
    const response = await service.getAllRequestsService()
    return res.status(response.statusCode).json(response.body)
}

export const getMyRequests = async (req: Request, res: Response) => {
    const response = await service.getMyRequestsService()
    return res.status(response.statusCode).json(response.body)
}

export const postRequests = async (req: Request, res: Response) => {
    const response = await service.postRequestsService(req.body)
    return res.status(response.statusCode).json(response.body)
}

export const updateRequests = async (req: Request, res: Response) => {
    const { id } = req.params
    const response = await service.updateRequestsService(id as string, req.body)
    return res.status(response.statusCode).json(response.body)
}