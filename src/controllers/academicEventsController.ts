import { Request, Response } from "express"
import * as service from "../services/academicEventsServices"

export const getAcademicEvents = async (req: Request, res: Response) => {
    const response = await service.getAcademicEventsService()
    return res.status(response.statusCode).json(response.body)
}

export const getAcademicEventByCalendar = async (req: Request, res: Response) => {
    const { calendar } = req.params
    const response = await service.getAcademicEventByCalendarService(calendar as string)
    return res.status(response.statusCode).json(response.body)
}

export const createAcademicEvent = async (req: Request, res: Response) => {
    const response = await service.createAcademicEventService(req.body)
    return res.status(response.statusCode).json(response.body)
}

export const deleteAcademicEvent = async (req: Request, res: Response) => {
    const { id } = req.params
    const response = await service.deleteAcademicEventService(id as string)
    return res.status(response.statusCode).json(response.body)
}