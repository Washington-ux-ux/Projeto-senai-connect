import { Request, Response } from "express"
import * as service from "../services/postsServices"
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getPosts = async (req: Request, res: Response) => {
    const response = await service.getPostsService()
    return res.status(response.statusCode).json(response.body)
}

export const getPostsById = async (req: Request, res: Response) => {
    const { id } = req.params
    const response = await service.getPostsByIdService(id as string)
    return res.status(response.statusCode).json(response.body)
}

export const createPosts = async (req: Request, res: Response) => {
    let imageUrl = req.body.imageUrl || 'aviso1.png';

    if (imageUrl.startsWith('data:image')) {
        const base64Data = imageUrl.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;
        const uploadPath = path.join(__dirname, '../../docs/assets/uploads', filename);
        
        fs.writeFileSync(uploadPath, buffer);
        imageUrl = `./assets/uploads/${filename}`;
    }
    
    const postData = { ...req.body, imageUrl };
    const response = await service.createPostsService(postData)
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

export const updatePosts = async (req: Request, res: Response) => {
    const { id } = req.params
    let imageUrl = req.body.imageUrl || 'aviso1.png';

    if (imageUrl.startsWith('data:image')) {
        const base64Data = imageUrl.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const filename = `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.png`;
        const uploadPath = path.join(__dirname, '../../docs/assets/uploads', filename);
        
        fs.writeFileSync(uploadPath, buffer);
        imageUrl = `./assets/uploads/${filename}`;
    } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {

    }
    
    const postData = { ...req.body, imageUrl };
    const response = await service.updatePostsService(id as string, postData)
    return res.status(response.statusCode).json(response.body)
}