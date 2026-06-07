import * as httphelper from "../utils/http-helper"
import * as repository from "../repository/postsRepository"

export const getPostsService = async () => {
    try {
        const data = await repository.getPosts()
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}

export const getPostsByIdService = async (id: string) => {
    try {
        const data = await repository.getPostsById(id)
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}

export const createPostsService = async (postData: any) => {
    try {
        const data = await repository.createPosts(postData)
        if (data) {
            return await httphelper.created(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}

export const deletePostsService = async (postId: string) => {
    try {
        const data = await repository.deletePosts(postId)
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}

export const emojiPostsService = async (postId: string, emoji: string, action: 'add' | 'remove') => {
    try {
        const data = await repository.emojiPosts(postId, emoji, action)
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}

export const summaryIAPostsService = async (postId: string, summary: string) => {
    try {
        const data = await repository.summaryIAPosts(postId, summary)
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}

export const updatePostsService = async (postId: string, postData: any) => {
    try {
        const data = await repository.updatePosts(postId, postData)
        if (data) {
            return await httphelper.ok(data)
        } else {
            return await httphelper.badRequest()
        }
    } catch (error) {
        return await httphelper.badRequest()
    }
}