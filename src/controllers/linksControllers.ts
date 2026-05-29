import { Request, Response } from "express"
import * as service from "../services/linksServices"

export const getLinks = async (req: Request, res: Response) => {
    const response = await service.getLinksService()
    return res.status(response.statusCode).json(response.body)
}

export const createLink = async (req: Request, res: Response) => {
    const response = await service.createLinkService(req.body)
    return res.status(response.statusCode).json(response.body)
}
