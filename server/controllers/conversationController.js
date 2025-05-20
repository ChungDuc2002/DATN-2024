import conversation from '../models/conversation.js';
import message from '../models/message.js';

export async function createConversation(participants) {
  try {
    const newConversation = new conversation({
      participants,
    });
    const data = await newConversation.save();
    return data;
  } catch (err) {
    return resizeBy.status(500).json({ message: err });
  }
}

export async function getConversationByUserId(userId) {
  try {
    return await conversation
      .find({ participants: userId })
      .populate('participants', 'fullName');
  } catch (err) {
    return resizeBy.status(500).json({ message: err });
  }
}

export async function getConversationByParticipants(userId, adminId) {
  try {
    const conversations = await conversation.findOne({
      participants: { $all: [userId, adminId] },
    });
    return conversations;
  } catch (err) {
    return resizeBy.status(500).json({ message: err });
  }
}

export async function deleteConversation(conversationId) {
  try {
    // Xóa tất cả tin nhắn liên quan đến đoạn chat
    await message.deleteMany({ conversationId });
    // Xóa đoạn chat
    await conversation.findByIdAndDelete(conversationId);
  } catch (err) {
    return resizeBy.status(500).json({ message: err });
  }
}
