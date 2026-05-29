import * as httphelper from "../utils/http-helper"
import * as repository from "../repository/linksRepository"

export const getLinksService = async () => {
    try {
        const data = await repository.getLinks()
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}

export const createLinkService = async (linkData: any) => {
    try {
        const data = await repository.createLink(linkData)
        if (data) {
            return await httphelper.created(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}
