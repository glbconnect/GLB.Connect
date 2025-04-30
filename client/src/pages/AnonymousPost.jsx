import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import Header from '../components/layout/Header';
import * as api from '../services/api';

const AnonymousPost = ({ isLoggedIn, onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [guestId] = useState(`Guest${Math.floor(Math.random() * 1000)}`);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Connect to WebSocket server
    const authData = localStorage.getItem('auth');
    if (authData) {
      const { token } = JSON.parse(authData);
      const newSocket = io('http://localhost:5000', {
        auth: { token }
      });

      newSocket.on('connect', () => {
        console.log('Connected to WebSocket server');
        // Join the anonymous chat room
        newSocket.emit('join-room', 'anonymous-chat');
      });

      // Listen for new messages
      newSocket.on('anonymous-message', (message) => {
        console.log('Received new message:', message);
        setMessages(prevMessages => [...prevMessages, message]);
      });

      setSocket(newSocket);

      // Fetch existing messages
      const fetchMessages = async () => {
        try {
          const response = await api.getAnonymousMessages();
          setMessages(response);
        } catch (error) {
          console.error('Error fetching messages:', error);
        }
      };

      fetchMessages();

      return () => {
        newSocket.close();
      };
    }
  }, []);

  // Scroll to bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socket) return;

    const messageData = {
      content: newMessage,
      guestId: guestId,
      timestamp: new Date().toISOString(),
    };

    try {
      // Only save to database - the server will emit to all clients including this one
      await api.sendAnonymousMessage(messageData);
      
      // Clear input field immediately for better UX
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header isLoggedIn={isLoggedIn} onLogout={onLogout} />
      
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 bg-blue-500 text-white flex justify-between items-center">
            <h1 className="text-xl font-bold">Anonymous Posting</h1>
            <div className="text-sm">Posting as: {guestId}</div>
          </div>

          <div className="h-[600px] overflow-y-auto p-4 space-y-4" id="messages-container">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.guestId === guestId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${
                    message.guestId === guestId
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100'
                  }`}
                >
                  <div className="font-semibold mb-1">{message.guestId}</div>
                  <p>{message.content}</p>
                  <div className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-t p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full border px-4 py-2 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white rounded-full p-2 w-12 h-12 flex items-center justify-center hover:bg-blue-600 transition-colors"
                disabled={!newMessage.trim()}
              >
                →
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnonymousPost;