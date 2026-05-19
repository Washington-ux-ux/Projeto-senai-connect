import { Request, Response } from "express"
import * as service from "../services/postsServices"

export const getPosts = async (req: Request, res: Response) => {
    const response = await service.getPostsService()
    return res.status(response.statusCode).json(response.body)
}

export const getPostsById = async (req: Request, res: Response) => {
    const { id } = req.params
    const response = await service.getPostsByIdService(Number(id))
    return res.status(response.statusCode).json(response.body)
}

export const createPosts = async (req: Request, res: Response) => {
    const response = await service.createPostsService(req.body)
    return res.status(response.statusCode).json(response.body)
}

export const deletePosts = async (req: Request, res: Response) => {
    const { id } = req.params
    const response = await service.deletePostsService(id as string)
    return res.status(response.statusCode).json(response.body)
}

export const emojiPosts = async (req: Request, res: Response) => {
    const { id } = req.params
    const { emoji, action } = req.body
    const response = await service.emojiPostsService(id as string, emoji, action)
    return res.status(response.statusCode).json(response.body)
}

export const summaryIAPosts = async (req: Request, res: Response) => {
    const { postId, summary } = req.body
    const response = await service.summaryIAPostsService(postId, summary)
    return res.status(response.statusCode).json(response.body)
}