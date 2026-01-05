import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import * as api from '../services/api';
import { HiOutlineUserCircle, HiOutlinePaperAirplane } from 'react-icons/hi';
import { FaMask } from 'react-icons/fa6';

const AnonymousPost = ({ isLoggedIn, onLogout, currentUser }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [guestId] = useState(`Guest${Math.floor(Math.random() * 1000)}`);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const [error, setError] = useState('');
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportReason, setReportReason] = useState('abuse');

  const PROFANE_WORDS = [
    "fuck","shit","bitch","asshole","bastard","dick","cunt","slut","whore",
    "fag","faggot","nigger","chink","spic","kike",
    "rape","rapist","cum","suck my","kill yourself","kys"
  ];

  const hasAbusiveContent = (text) => {
    if (!text) return false;
    const normalized = text.toLowerCase();
    return PROFANE_WORDS.some(w => normalized.includes(w));
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Connect to WebSocket server
    const authData = localStorage.getItem('auth');
    if (authData) {
      const { token } = JSON.parse(authData);
      const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
      const newSocket = io(socketUrl, {
        auth: { token }
      });

      newSocket.on('connect', () => {
        newSocket.emit('join-room', 'anonymous-chat');
      });

      newSocket.on('anonymous-message', (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
      });

      setSocket(newSocket);

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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setError('');
    if (!newMessage.trim() || !socket) return;
    if (newMessage.length > 300) {
      setError('Message too long (max 300 characters)');
      return;
    }
    if (hasAbusiveContent(newMessage)) {
      setError('Inappropriate language is not allowed');
      return;
    }
    if (isCoolingDown) {
      setError('Please wait before sending another message');
      return;
    }

    const messageData = {
      content: newMessage,
      guestId: guestId,
      timestamp: new Date().toISOString(),
    };

    try {
      await api.sendAnonymousMessage(messageData);
      setNewMessage('');
      setIsCoolingDown(true);
      setTimeout(() => setIsCoolingDown(false), 3000);
    } catch (error) {
      const msg = error.response?.data?.message || 'Error sending message';
      setError(msg);
    }
  };

  const openReport = (message) => {
    setReportTarget(message);
    setReportReason('abuse');
  };

  const submitReport = async () => {
    if (!reportTarget) return;
    try {
      await api.reportAnonymousMessage(reportTarget.id, {
        reason: reportReason,
        reportedGuestId: reportTarget.guestId
      });
      setReportTarget(null);
    } catch (error) {
      setReportTarget(null);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 px-2 sm:px-4 md:px-8 pt-20 pb-2 md:pb-4 overflow-hidden relative z-10 flex items-center justify-center">
      <div className="max-w-3xl w-full h-[85vh] flex flex-col">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden flex flex-col h-full border border-blue-100 relative z-20">
          {/* Chat Header */}
          <div className="p-3 md:p-4 bg-blue-500 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-0 flex-shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-2xl"><FaMask /></span>
              <h1 className="text-2xl font-extrabold tracking-tight drop-shadow">Anonymous Posting</h1>
            </div>
            <div className="bg-white/20 px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2 shadow">
              <HiOutlineUserCircle className="text-lg" />
              <span>Posting as:</span>
              <span className="font-bold">{guestId}</span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-4" id="messages-container">
            {messages.map((message, index) => {
              const isOwn = message.guestId === guestId;
              return (
                <div
                  key={index}
                  className={`flex items-end gap-2 ${isOwn ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                >
                  {!isOwn && (
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center shadow">
                        <FaMask className="text-blue-500 text-xl" />
                      </div>
                    </div>
                  )}
                  <div
                    className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-md relative transition-all duration-200 ${
                      isOwn
                        ? 'bg-gradient-to-br from-blue-500 to-blue-400 text-white rounded-br-none'
                        : 'bg-white border border-blue-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <div className={`font-semibold text-xs mb-1 ${isOwn ? 'text-blue-100' : 'text-blue-500'}`}>{message.guestId}</div>
                    <p className="break-words leading-relaxed text-base">{message.content}</p>
                    <div className="text-[10px] mt-2 opacity-60 text-right select-none">
                      {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    {!isOwn && (
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          className="text-xs text-red-600 hover:text-red-700 underline"
                          onClick={() => openReport(message)}
                        >
                          Report
                        </button>
                        {message.flagged && (
                          <span className="text-[10px] text-red-500 bg-red-100 px-2 py-0.5 rounded-full">Flagged</span>
                        )}
                      </div>
                    )}
                  </div>
                  {isOwn && (
                    <div className="flex-shrink-0">
                      <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center shadow">
                        <FaMask className="text-white text-xl" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-3 md:p-4 flex-shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2 flex-col sm:flex-row items-stretch sm:items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your anonymous message..."
                className="flex-1 rounded-full border border-blue-200 px-5 py-3 focus:outline-none focus:border-blue-400 bg-white/90 shadow-sm text-base transition-all"
                autoComplete="off"
              />
              <button
                type="submit"
                className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full p-3 w-12 h-12 flex items-center justify-center shadow-lg hover:scale-105 hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!newMessage.trim() || isCoolingDown}
                aria-label="Send"
              >
                <HiOutlinePaperAirplane className="text-2xl rotate-45" />
              </button>
            </form>
            {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
          </div>
        </div>
      </div>
      {reportTarget && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-30">
          <div className="bg-white rounded-xl shadow-xl p-4 w-80">
            <div className="font-semibold mb-2">Report Message</div>
            <div className="text-sm mb-3 text-gray-600">Reason</div>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 text-sm"
            >
              <option value="abuse">Abuse</option>
              <option value="harassment">Harassment</option>
              <option value="spam">Spam</option>
            </select>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-3 py-1 text-sm rounded-md border" onClick={() => setReportTarget(null)}>Cancel</button>
              <button className="px-3 py-1 text-sm rounded-md bg-red-600 text-white" onClick={submitReport}>Report</button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s;
        }
        /* Custom scrollbar for all browsers */
        #messages-container::-webkit-scrollbar {
          width: 8px;
          background: #e0e7ff;
          border-radius: 8px;
        }
        #messages-container::-webkit-scrollbar-thumb {
          background: #60a5fa;
          border-radius: 8px;
        }
        #messages-container:hover::-webkit-scrollbar-thumb {
          background: #2563eb;
        }
        #messages-container {
          scrollbar-width: thin;
          scrollbar-color: #60a5fa #e0e7ff;
        }
      `}</style>
    </div>
  );
};

export default AnonymousPost;
