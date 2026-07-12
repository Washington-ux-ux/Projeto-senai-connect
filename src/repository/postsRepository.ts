import pool from '../config/database';

export const getPosts = async () => {
  const result = await pool.query('SELECT * FROM posts ORDER BY "createdat" DESC');
  return result.rows;
}

export const getPostsById = async (id: string) => {
  const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
  return result.rows[0];
}

export const createPosts = async (postData: any) => {
  const reactions = JSON.stringify(postData.reactions || { like: 0, claps: 0 });
  const result = await pool.query(
    `INSERT INTO posts (id, title, summary, category, visibility, "author_name", "author_id", reactions, "attachmenturl", "imageurl", "eventdate", location, "createdat")
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
     RETURNING *`,
    [
      postData.id,
      postData.title,
      postData.summary || '',
      postData.category,
      Array.isArray(postData.visibility) ? postData.visibility : [postData.visibility || 'ALL'],
      postData.authorName,
      postData.authorId,
      reactions,
      postData.attachmentUrl || '',
      postData.imageUrl || 'aviso1.png',
      postData.eventDate || new Date().toISOString().split('T')[0],
      postData.location || 'SENAI Areias',
      new Date().toISOString()
    ]
  );
  
  return result.rows[0];
}

export const deletePosts = async (postId: string) => {
  const result = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [postId]);
  
  if (result.rows.length === 0) {
    throw new Error('Post not found');
  }
  
  return result.rows[0];
}

export const emojiPosts = async (postId: string, emoji: string, action: 'add' | 'remove') => {
  const result = await pool.query('SELECT reactions FROM posts WHERE id = $1', [postId]);
  
  if (result.rows.length === 0) {
    throw new Error('Post not found');
  }
  
  const reactions = result.rows[0].reactions as Record<string, number> || {};
  
  if (action === 'add') {
    reactions[emoji] = (reactions[emoji] || 0) + 1;
  } else if (action === 'remove') {
    reactions[emoji] = Math.max((reactions[emoji] || 0) - 1, 0);
  }
  
  const updateResult = await pool.query(
    'UPDATE posts SET reactions = $1 WHERE id = $2 RETURNING *',
    [JSON.stringify(reactions), postId]
  );
  
  return updateResult.rows[0];
}

export const summaryIAPosts = async (postId: string, summary: string) => {
  const result = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
  
  if (result.rows.length === 0) {
    throw new Error('Post not found');
  }
  
  const updateResult = await pool.query(
    'UPDATE posts SET summary = $1 WHERE id = $2 RETURNING *',
    [summary, postId]
  );
  
  return updateResult.rows[0];
}

export const updatePosts = async (postId: string, postData: any) => {
  const result = await pool.query('SELECT * FROM posts WHERE id = $1', [postId]);
  
  if (result.rows.length === 0) {
    throw new Error('Post not found');
  }
  
  const updateResult = await pool.query(
    `UPDATE posts SET title = $1, summary = $2, category = $3, visibility = $4, imageurl = $5, eventdate = $6, location = $7
     WHERE id = $8 RETURNING *`,
    [
      postData.title,
      postData.summary,
      postData.category,
      Array.isArray(postData.visibility) ? postData.visibility : [postData.visibility || 'ALL'],
      postData.imageUrl,
      postData.eventDate,
      postData.location,
      postId
    ]
  );
  
  return updateResult.rows[0];
}