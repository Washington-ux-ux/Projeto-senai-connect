import fs from 'fs';
import path from 'path';

const postsFilePath = path.join(__dirname, '../data/posts.json');

const readPostsJson = (): any[] => {
    const data = fs.readFileSync(postsFilePath, 'utf-8');
    return JSON.parse(data);
};

const writePostsJson = (data: any[]): void => {
    fs.writeFileSync(postsFilePath, JSON.stringify(data, null, 2));
};

export const getPosts = async () => {
    return readPostsJson();
}

export const getPostsById = async (id: number) => {
    const posts = await getPosts()
    return posts.find((post: any) => post.id === String(id))
}

export const createPosts = async (postData: any) => {
    const posts = readPostsJson();
    const newPost = {
        id: `p${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: postData.title,
        summary: postData.summary || '',
        category: postData.category,
        visibility: Array.isArray(postData.visibility) ? postData.visibility : [postData.visibility || 'ALL'],
        author: {
            name: postData.authorName,
            id: postData.authorId
        },
        reactions: {
            like: 0,
            claps: 0
        },
        attachmentUrl: postData.attachmentUrl || '',
        imageUrl: postData.imageUrl || 'aviso1.png',
        eventDate: postData.eventDate || new Date().toISOString().split('T')[0],
        location: postData.location || 'SENAI Areias',
        createdAt: new Date().toISOString()
    }
    posts.push(newPost);
    writePostsJson(posts);
    return newPost
}

export const deletePosts = async (postId: string) => {
    const posts = readPostsJson();
    const index = posts.findIndex((post: any) => post.id === postId)
    if (index === -1) {
        throw new Error('Post not found')
    }
    const deletedPost = posts.splice(index, 1);
    writePostsJson(posts);
    return deletedPost[0]
}

export const emojiPosts = async (postId: string, emoji: string, action: 'add' | 'remove') => {
    const posts = readPostsJson();
    const post = posts.find((p: any) => p.id === postId)
    if (!post) {
        throw new Error('Post not found')
    }
    
    const reactions = post.reactions as Record<string, number>
    if (action === 'add') {
        reactions[emoji] = (reactions[emoji] || 0) + 1
    } else if (action === 'remove') {
        reactions[emoji] = Math.max((reactions[emoji] || 0) - 1, 0)
    }
    
    writePostsJson(posts);
    return post
}

export const summaryIAPosts = async (postId: string, summary: string) => {
    const posts = readPostsJson();
    const post = posts.find((p: any) => p.id === postId)
    if (!post) {
        throw new Error('Post not found')
    }
    post.summary = summary
    writePostsJson(posts);
    return post
}