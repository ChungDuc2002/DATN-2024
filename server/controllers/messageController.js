import message from '../models/message.js';

export async function saveMessage(data) {
  try {
    const newMessage = new message(data);
    return await newMessage.save();
  } catch (err) {
    return resizeBy.status(500).json({ message: err });
  }
}

export async function getMessagesByConversationId(conversationId) {
  try {
    return await message.find({ conversationId }).populate('sender');
  } catch (err) {
    return resizeBy.status(500).json({ message: err });
  }
}
