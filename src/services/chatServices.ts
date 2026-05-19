import * as httphelper from "../utils/http-helper"
import * as repository from "../repository/chatRepository"

export const getChatRoomService = async () => {
    try {
        const data = await repository.getChatRoom()
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}

export const getMessagesRoomService = async (roomId: string) => {
    try {
        const data = await repository.getMessagesRoom(roomId)
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}