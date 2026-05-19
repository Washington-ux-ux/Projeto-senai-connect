import * as httphelper from "../utils/http-helper"
import * as repository from "../repository/requestsRepository"

export const getAllRequestsService = async () => {
    try {
        const data = await repository.getAllRequests()
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}

export const getMyRequestsService = async () => {
    try {
        const data = await repository.getMyRequests()
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}

export const postRequestsService = async (requestData: any) => {
    try {
        const data = await repository.postRequests(requestData)
        if (data) {
            return await httphelper.created(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}

export const updateRequestsService = async (requestId: string, updateData: any) => {
    try {
        const data = await repository.updateRequests(requestId, updateData)
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}