import { Request, Response } from "express"
import * as service from "../services/postsServices"
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'

dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ndlf6c5q',
  api_key: process.env.CLOUDINARY_API_KEY || '353173624675616',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'FdKUZ3Knmluv28jIo9eM6CCBphc',
})

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
        try {
            const base64Data = imageUrl.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');

            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { 
                        folder: 'senai-connect/posts',
                        resource_type: 'image',
                        transformation: [
                            { width: 800, height: 600, crop: 'limit' },
                            { quality: 'auto' }
                        ]
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                ).end(buffer);
            });
            
            imageUrl = (result as any).secure_url;
        } catch (error) {
            console.error('Erro ao salvar imagem no Cloudinary:', error);
            imageUrl = 'aviso1.png';
        }
    }

    const postData = { 
        ...req.body, 
        imageUrl,
        authorName: req.body.authorName || 'Usuário',
        authorId: req.body.authorId || (req as any).userId || 'unknown'
    };
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
        try {
            const base64Data = imageUrl.split(',')[1];
            const buffer = Buffer.from(base64Data, 'base64');

            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { 
                        folder: 'senai-connect/posts',
                        resource_type: 'image',
                        transformation: [
                            { width: 800, height: 600, crop: 'limit' },
                            { quality: 'auto' }
                        ]
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                ).end(buffer);
            });
            
            imageUrl = (result as any).secure_url;
        } catch (error) {
            console.error('Erro ao salvar imagem no Cloudinary:', error);
            imageUrl = 'aviso1.png';
        }
    } else if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        
    }
    
    const postData = { ...req.body, imageUrl };
    const response = await service.updatePostsService(id as string, postData)
    return res.status(response.statusCode).json(response.body)
}