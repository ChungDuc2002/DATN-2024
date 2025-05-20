import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './style.scss';
import axios from 'axios';

const socket = io('http://localhost:5000');

const ChatBoxPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState('');
  const [conversationId, setConversationId] = useState('');

  useEffect(() => {
    const resNameClient = async () => {
      const token = JSON.parse(localStorage.getItem('auth'));
      if (token) {
        try {
          const result = await axios.get('http://localhost:5000/info', {
            headers: {
              token: `Bearer ${token}`,
            },
          });
          if (result.status === 200) {
            localStorage.setItem('fullName', result.data.fullName);
            setUserId(result.data._id);
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
    resNameClient();
  }, []);

  useEffect(() => {
    const createOrGetConversation = async () => {
      if (userId) {
        try {
          // Kiểm tra hoặc tạo cuộc trò chuyện với admin
          const conversationResult = await axios.post(
            'http://localhost:5000/conversations',
            {
              userId: userId,
              adminId: '667121662a35194d4b61a2d1', // Thay thế 'ADMIN_ID' bằng ID thực tế của admin
            }
          );
          console.log('Conversation result:', conversationResult);

          if (conversationResult.status === 201) {
            setConversationId(conversationResult.data._id);

            // Gửi ID của cuộc trò chuyện khi kết nối
            socket.emit('joinConversation', conversationResult.data._id);

            // Lấy tin nhắn theo ID cuộc trò chuyện
            const messagesResult = await axios.get(
              `http://localhost:5000/messages/${conversationResult.data._id}`
            );
            if (messagesResult.status === 200) {
              setMessages(messagesResult.data);
              localStorage.setItem(
                'messages',
                JSON.stringify(messagesResult.data)
              );
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
    createOrGetConversation();
  }, [userId]);

  useEffect(() => {
    console.log('Conversation ID:', conversationId);
  }, [conversationId]);

  useEffect(() => {
    // Khôi phục tin nhắn từ localStorage khi component được mount
    const storedMessages = JSON.parse(localStorage.getItem('messages'));
    if (storedMessages) {
      setMessages(storedMessages);
    }

    // Nhận tất cả tin nhắn khi client kết nối
    socket.on('init', (messages) => {
      setMessages(messages);
      localStorage.setItem('messages', JSON.stringify(messages));
    });

    // Nhận tin nhắn mới từ server
    socket.on('message', (data) => {
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, data];
        localStorage.setItem('messages', JSON.stringify(updatedMessages));
        return updatedMessages;
      });
    });

    return () => {
      socket.off('init');
      socket.off('message');
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() && conversationId) {
      const newMessage = {
        conversationId,
        sender: userId,
        message: message,
        isAdmin: false,
      };
      console.log('Sending message:', newMessage);
      socket.emit('message', newMessage);
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };
  return (
    <div className="wrapper-chat-box">
      <div className="chat-card">
        <div className="chat-header">
          <div className="h2">Chat</div>
        </div>
        <div className="chat-body">
          {messages.map((msg, index) => (
            <div key={index} className="message-container">
              <p className="name"></p>
              <div
                className={`message ${msg.isAdmin ? 'incoming' : 'outgoing'}`}
              >
                <p className="text-message">{msg.message}</p>
              </div>
              <p className="date">
                {new Date(msg.createdAt).toLocaleString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                })}{' '}
                -{' '}
                {new Date(msg.createdAt).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                })}
              </p>
            </div>
          ))}
        </div>
        <div className="chat-footer">
          <div className="input-place">
            <input
              placeholder="Send a message."
              className="send-input"
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="send" onClick={sendMessage}>
              <svg
                className="send-icon"
                version="1.1"
                id="Capa_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                x="0px"
                y="0px"
                viewBox="0 0 512 512"
                style={{ enableBackground: 'new 0 0 512 512' }}
                xmlSpace="preserve"
              >
                <g>
                  <g>
                    <path
                      fill="#6B6C7B"
                      d="M481.508,210.336L68.414,38.926c-17.403-7.222-37.064-4.045-51.309,8.287C2.86,59.547-3.098,78.551,1.558,96.808 L38.327,241h180.026c8.284,0,15.001,6.716,15.001,15.001c0,8.284-6.716,15.001-15.001,15.001H38.327L1.558,415.193 c-4.656,18.258,1.301,37.262,15.547,49.595c14.274,12.357,33.937,15.495,51.31,8.287l413.094-171.409 C500.317,293.862,512,276.364,512,256.001C512,235.638,500.317,218.139,481.508,210.336z"
                    ></path>
                  </g>
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBoxPage;
