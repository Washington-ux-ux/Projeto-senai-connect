import chatRoom from '../data/chat.json';

export const getChatRoom = async () => {
    return chatRoom;
}

export const getMessagesRoom = async (roomId: string) => {
    const room = (chatRoom as any[]).find((room: any) => room.id === roomId);
    if (!room) {
        throw new Error('Room not found');
    }
    return room.messages;
}



