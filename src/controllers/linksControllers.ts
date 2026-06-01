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

export const updateLink = async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const response = await service.updateLinkService(id, req.body)
    return res.status(response.statusCode).json(response.body)
}

export const deleteLink = async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
    const response = await service.deleteLinkService(id)
    return res.status(response.statusCode).json(response.body)
}
