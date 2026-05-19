import * as httphelper from "../utils/http-helper"
import * as repository from "../repository/academicEventsRepository"

export const getAcademicEventsService = async () => {
    try {
        const data = await repository.getAllAcademicEvents()
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}

export const getAcademicEventByCalendarService = async (date: string) => {
    try {
        const data = await repository.getAcademicEventByDate(date)
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}