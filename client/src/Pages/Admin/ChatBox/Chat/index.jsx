import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { DeleteOutlined, MoreOutlined } from '@ant-design/icons';
import './style.scss';

const socket = io('http://localhost:5000');

const ChatPage = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [adminId, setAdminId] = useState('');
  const [isAdmin, setIsAdmin] = useState(true);
  const [selectedConversationId, setSelectedConversationId] = useState(''); // Lưu trữ ID của cuộc trò chuyện được chọn
  const [conversations, setConversations] = useState([]); // Lưu trữ danh sách các cuộc trò chuyện

  const [openAction, setOpenAction] = useState(false);
  useEffect(() => {
    const resName = async () => {
      const token = JSON.parse(localStorage.getItem('authAdmin'));
      if (token) {
        try {
          const result = await axios.get('http://localhost:5000/info', {
            headers: {
              token: `Bearer ${token}`,
            },
          });
          if (result.status === 200 && result.data.isAdmin) {
            setAdminId(result.data._id);
            setIsAdmin(result.data.isAdmin);
            console.log(isAdmin);

            // Lấy danh sách cuộc trò chuyện của admin
            const conversationsResult = await axios.get(
              `http://localhost:5000/conversations/${result.data._id}`
            );
            if (conversationsResult.status === 200) {
              // Loại bỏ các cuộc trò chuyện trùng lặp
              const uniqueConversations = conversationsResult.data.filter(
                (conversation, index, self) =>
                  index === self.findIndex((c) => c._id === conversation._id)
              );
              setConversations(uniqueConversations);
              if (uniqueConversations.length > 0) {
                setSelectedConversationId(uniqueConversations[0]._id); // Chọn cuộc trò chuyện đầu tiên làm ví dụ
              }
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
    };
    resName();
  }, []);

  useEffect(() => {
    console.log('conversations', conversations);
  }, [conversations]);

  useEffect(() => {
    if (selectedConversationId) {
      // Lấy tin nhắn theo ID cuộc trò chuyện được chọn
      const fetchMessages = async () => {
        try {
          const messagesResult = await axios.get(
            `http://localhost:5000/messages/${selectedConversationId}`
          );
          if (messagesResult.status === 200) {
            setMessages(messagesResult.data);
            localStorage.setItem(
              'messages',
              JSON.stringify(messagesResult.data)
            );
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchMessages();
    }
  }, [selectedConversationId]);

  useEffect(() => {
    console.log('conversation', conversations);
  }, [conversations]);

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
    if (message.trim() && selectedConversationId) {
      const newMessage = {
        conversationId: selectedConversationId,
        sender: adminId,
        message: message,
        isAdmin: true,
      };
      console.log('Sending message:', newMessage);
      socket.emit('message', newMessage);
      setMessage('');
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      await axios.delete(
        `http://localhost:5000/conversations/${conversationId}`
      );
      setConversations(
        conversations.filter((conv) => conv._id !== conversationId)
      );
      setSelectedConversationId('');
      setMessages([]);
      localStorage.removeItem('messages');
    } catch (err) {
      console.log(err);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="wrapper-chat">
      <div className="wrapper-chat-sidebar">
        <h1 className="title">chat section</h1>
        <div className="conversation-list">
          {conversations.map((conversation) => (
            <div
              key={conversation._id}
              className={`conversation-item ${
                conversation._id === selectedConversationId ? 'selected' : ''
              }`}
              onClick={() => setSelectedConversationId(conversation._id)}
            >
              {conversation.participants
                .filter((participant) => participant._id !== adminId)
                .map((participant) => participant.fullName)
                .join(', ')}
            </div>
          ))}
        </div>
      </div>
      <div className="wrapper-chat-content">
        <div className="chat-card">
          <div className="chat-header">
            <div className="h2">Chat</div>
            <div className="action">
              <MoreOutlined
                onClick={() => {
                  setOpenAction(!openAction);
                }}
              />
            </div>
          </div>
          {openAction && (
            <div className="action-list">
              <div
                className="action-item"
                onClick={() => {
                  deleteConversation(selectedConversationId);
                }}
              >
                <DeleteOutlined />
                <span>Delete Chat</span>
              </div>
            </div>
          )}
          <div className="chat-body">
            {messages.map((msg, index) => (
              <div key={index} className="message-container">
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
    </div>
  );
};

export default ChatPage;
