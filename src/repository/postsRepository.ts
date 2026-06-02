import postsJson from '../data/posts.json'

export const getPosts = async () => {
    return postsJson
}

export const getPostsById = async (id: number) => {
    const posts = await getPosts()
    return posts.find((post: any) => post.id === String(id))
}

export const createPosts = async (postData: any) => {
    const newPost = {
        id: `p${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: postData.title,
        content: postData.content,
        summary: postData.summary || '',
        category: postData.category,
        visibility: postData.visibility || 'ALL',
        author: {
            name: postData.authorName,
            id: postData.authorId
        },
        reactions: {
            like: 0,
            claps: 0
        },
        attachmentUrl: postData.attachmentUrl || '',
        createdAt: new Date().toISOString()
    }
    postsJson.push(newPost)
    return newPost
}

export const deletePosts = async (postId: string) => {
    const index = postsJson.findIndex((post: any) => post.id === postId)
    if (index === -1) {
        throw new Error('Post not found')
    }
    const deletedPost = postsJson.splice(index, 1)
    return deletedPost[0]
}

export const emojiPosts = async (postId: string, emoji: string, action: 'add' | 'remove') => {
    const post = postsJson.find((p: any) => p.id === postId)
    if (!post) {
        throw new Error('Post not found')
    }
    
    const reactions = post.reactions as Record<string, number>
    if (action === 'add') {
        reactions[emoji] = (reactions[emoji] || 0) + 1
    } else if (action === 'remove') {
        reactions[emoji] = Math.max((reactions[emoji] || 0) - 1, 0)
    }
    
    return post
}

export const summaryIAPosts = async (postId: string, summary: string) => {
    const post = postsJson.find((p: any) => p.id === postId)
    if (!post) {
        throw new Error('Post not found')
    }
    post.summary = summary
    return post
}