import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const reactionsFilePath = path.join(__dirname, '../data/reactions.json');

const readReactionsJson = (): any[] => {
  try {
    const data = fs.readFileSync(reactionsFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeReactionsJson = (data: any[]): void => {
  fs.writeFileSync(reactionsFilePath, JSON.stringify(data, null, 2));
};

export const getReactionsByPostId = async (postId: string) => {
  const reactions = readReactionsJson();
  return reactions.find((r: any) => r.postId === postId) || null;
};

export const createOrUpdateReaction = async (postId: string, emoji: string, action: 'add' | 'remove', userId?: string) => {
  const reactions = readReactionsJson();
  let postReaction = reactions.find((r: any) => r.postId === postId);

  if (!postReaction) {
    postReaction = {
      postId,
      reactions: {},
      userReactions: {}
    };
    reactions.push(postReaction);
  }

  if (!postReaction.reactions) {
    postReaction.reactions = {};
  }
  if (!postReaction.userReactions) {
    postReaction.userReactions = {};
  }

  const reactionCounts = postReaction.reactions as Record<string, number>;
  const userReactions = postReaction.userReactions as Record<string, string[]>;

  if (userId) {
    if (!userReactions[userId]) {
      userReactions[userId] = [];
    }

    const userEmojiList = userReactions[userId];
    const hasReacted = userEmojiList.includes(emoji);

    if (action === 'add') {
      if (!hasReacted) {
        reactionCounts[emoji] = (reactionCounts[emoji] || 0) + 1;
        userEmojiList.push(emoji);
      }
    } else if (action === 'remove') {
      if (hasReacted) {
        reactionCounts[emoji] = Math.max((reactionCounts[emoji] || 0) - 1, 0);
        userEmojiList.splice(userEmojiList.indexOf(emoji), 1);
      }
    }
  } else {
    if (action === 'add') {
      reactionCounts[emoji] = (reactionCounts[emoji] || 0) + 1;
    } else if (action === 'remove') {
      reactionCounts[emoji] = Math.max((reactionCounts[emoji] || 0) - 1, 0);
    }
  }

  writeReactionsJson(reactions);
  return postReaction;
};

export const deleteReactionsByPostId = async (postId: string) => {
  const reactions = readReactionsJson();
  const index = reactions.findIndex((r: any) => r.postId === postId);
  
  if (index !== -1) {
    reactions.splice(index, 1);
    writeReactionsJson(reactions);
    return true;
  }
  
  return false;
};
