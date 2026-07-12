import pool from '../config/database';

export const getReactionsByPostId = async (postId: string) => {
  let result = await pool.query('SELECT * FROM reactions WHERE post_id = $1', [postId]);
  
  if (result.rows.length === 0) {
    return { postId, reactions: {}, userReactions: {} };
  }
  
  const reaction = result.rows[0];
  return { 
    postId, 
    reactions: typeof reaction.reactions === 'string' ? JSON.parse(reaction.reactions) : (reaction.reactions || {}),
    userReactions: typeof reaction.user_reactions === 'string' ? JSON.parse(reaction.user_reactions) : (reaction.user_reactions || {})
  };
};

export const createOrUpdateReaction = async (postId: string, emoji: string, action: 'add' | 'remove', userId?: string) => {
  let result = await pool.query('SELECT * FROM reactions WHERE post_id = $1', [postId]);
  
  let postReaction;
  
  if (result.rows.length === 0) {
    const insertResult = await pool.query(
      `INSERT INTO reactions (post_id, reactions, user_reactions)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [postId, JSON.stringify({}), JSON.stringify({})]
    );
    postReaction = insertResult.rows[0];
  } else {
    postReaction = result.rows[0];
  }
  
  const reactions = typeof postReaction.reactions === 'string' 
    ? JSON.parse(postReaction.reactions) 
    : (postReaction.reactions as Record<string, number> || {});
  
  const userReactions = typeof postReaction.user_reactions === 'string'
    ? JSON.parse(postReaction.user_reactions)
    : (postReaction.user_reactions as Record<string, string[]> || {});
  
  if (userId) {
    if (!userReactions[userId]) {
      userReactions[userId] = [];
    }
    
    const userEmojiList = userReactions[userId];
    const hasReacted = userEmojiList.includes(emoji);
    
    if (action === 'add') {
      if (!hasReacted) {
        reactions[emoji] = (reactions[emoji] || 0) + 1;
        userEmojiList.push(emoji);
      }
    } else if (action === 'remove') {
      if (hasReacted) {
        reactions[emoji] = Math.max((reactions[emoji] || 0) - 1, 0);
        userEmojiList.splice(userEmojiList.indexOf(emoji), 1);
      }
    }
  } else {
    if (action === 'add') {
      reactions[emoji] = (reactions[emoji] || 0) + 1;
    } else if (action === 'remove') {
      reactions[emoji] = Math.max((reactions[emoji] || 0) - 1, 0);
    }
  }
  
  const updateResult = await pool.query(
    'UPDATE reactions SET reactions = $1, user_reactions = $2 WHERE post_id = $3 RETURNING *',
    [JSON.stringify(reactions), JSON.stringify(userReactions), postId]
  );
  
  const updated = updateResult.rows[0];
  return { 
    postId, 
    reactions: typeof updated.reactions === 'string' ? JSON.parse(updated.reactions) : updated.reactions,
    userReactions: typeof updated.user_reactions === 'string' ? JSON.parse(updated.user_reactions) : updated.user_reactions
  };
};

export const deleteReactionsByPostId = async (postId: string) => {
  const result = await pool.query('DELETE FROM reactions WHERE post_id = $1 RETURNING *', [postId]);
  
  return result.rowCount > 0;
};
