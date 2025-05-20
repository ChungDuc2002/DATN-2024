import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { InitRouters } from './routers/index.js';
import cookieParser from 'cookie-parser';
import { sendData } from './utils/data.js';
import { Server } from 'socket.io';
import http from 'http';
import {
  createConversation,
  getConversationByUserId,
  getConversationByParticipants,
  deleteConversation,
} from './controllers/conversationController.js';
import {
  getMessagesByConversationId,
  saveMessage,
} from './controllers/messageController.js';

dotenv.config();

const app = express();

const port = 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors());

//! lấy lại mật khẩu cho email
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

//! upload image use multer
app.use('/uploads', express.static(path.join(path.resolve(), '/uploads'))); // path.resolve() trả về đường dẫn tuyệt đối của thư mục hiện tại

InitRouters(app);

//! socket.io
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});
io.on('connection', (socket) => {
  console.log('New client connected');

  // Nhận ID của cuộc trò chuyện từ client và gửi tất cả tin nhắn đã lưu trong cơ sở dữ liệu khi client kết nối
  socket.on('joinConversation', (conversationId) => {
    getMessagesByConversationId(conversationId)
      .then((messages) => {
        socket.emit('init', messages);
      })
      .catch((error) => {
        console.error('Error getting messages:', error);
      });
  });

  socket.on('message', (data) => {
    console.log('Message received:', data);

    // Lưu tin nhắn vào cơ sở dữ liệu
    saveMessage(data)
      .then((message) => {
        io.emit('message', message); // Broadcast message to all clients
      })
      .catch((error) => {
        console.error('Error saving message:', error);
      });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

//! router for chat

app.post('/conversations', async (req, res) => {
  try {
    const { userId, adminId } = req.body;
    let conversation = await getConversationByParticipants(userId, adminId);
    if (!conversation) {
      conversation = await createConversation([userId, adminId]);
    }
    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create conversation' });
  }
});

app.get('/conversations/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const conversations = await getConversationByUserId(userId);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get conversations' });
  }
});

app.get('/messages/:conversationId', async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    const messages = await getMessagesByConversationId(conversationId);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

app.post('/messages', async (req, res) => {
  try {
    const message = await saveMessage(req.body);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save message' });
  }
});

app.delete('/conversations/:conversationId', async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    await deleteConversation(conversationId);
    res.status(200).json({ message: 'Conversation deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
});

//! connect database
mongoose
  .connect('mongodb://127.0.0.1:27017/DoAnTotNghiep')
  .then(() => {
    console.log('Connect database successfully !');
    sendData();
  })
  .catch((err) => {
    console.log(err);
  });

//! start server
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
