import * as httphelper from "../utils/http-helper"
import * as repository from "../repository/reactionsRepository"

export const getReactionsByPostIdService = async (postId: string) => {
    try {
        const data = await repository.getReactionsByPostId(postId)
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.ok({ postId, reactions: {}, userReactions: {} })
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}

export const createOrUpdateReactionService = async (postId: string, emoji: string, action: 'add' | 'remove', userId?: string) => {
    try {
        const data = await repository.createOrUpdateReaction(postId, emoji, action, userId)
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}

export const deleteReactionsByPostIdService = async (postId: string) => {
    try {
        const data = await repository.deleteReactionsByPostId(postId)
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}
