import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import MessageList from '../components/MessageList';
import MessageBubble from '../components/MessageBubble';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import UserSearch from '../components/UserSearch';
import * as api from '../services/api';
import * as socketService from '../services/socket';
import { PaperClipIcon, MicrophoneIcon, ArrowLeftIcon, Bars3Icon } from '@heroicons/react/24/outline';

const Messages = ({ isLoggedIn, onLogout, currentUser }) => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [activeUserId, setActiveUserId] = useState(userId || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [userTyping, setUserTyping] = useState(null);
  const [socket, setSocket] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false); // For mobile sidebar toggle
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Keep track of active user details
  const [activeUserDetails, setActiveUserDetails] = useState({
    name: 'User',
    email: '',
    isAnonymous: false,
    userId: activeUserId
  });

  // Close sidebar on mobile when conversation is selected
  const handleSelectConversation = (userId, userDetails) => {
    setActiveUserId(userId);
    if (userDetails) setActiveUserDetails(userDetails);
    navigate(`/messages/${userId}`);
    setShowSidebar(false); // Close sidebar on mobile
  };

  // Initialize socket connection
  useEffect(() => {
    if (currentUser?.id) {
      const newSocket = socketService.initializeSocket(currentUser.id);
      setSocket(newSocket);
      
      // Clean up on unmount
      return () => {
        socketService.removeAllListeners();
        socketService.disconnectSocket();
      };
    }
  }, [currentUser?.id]);

  // Setup socket event listeners
  useEffect(() => {
    if (!socket) return;
    
    // Clear previous listeners to prevent duplicate events
    socket.off('receive_message');
    socket.off('user_typing');
    
    // Listen for incoming messages
    socketService.listenForMessages((message) => {
      // Validate message structure
      if (!message || !message.id || !message.senderId || !message.receiverId) {
        console.warn('Invalid message structure received:', message);
        return;
      }
      
      // Only process messages that involve the current user
      if (message.senderId !== currentUser.id && message.receiverId !== currentUser.id) {
        console.warn('Message received for different user, ignoring:', message);
        return;
      }
      
      // If the message is from the active conversation (sender OR receiver must match activeUserId)
      if (
        // Make sure message is part of the current conversation by checking both participants
        ((message.senderId === activeUserId && message.receiverId === currentUser.id) || 
         (message.senderId === currentUser.id && message.receiverId === activeUserId))
      ) {
        // Add message to UI with strict duplicate checking
        setMessages(prev => {
          // Check if this message already exists
          const isDuplicate = prev.some(msg => 
            // Consider it a duplicate if IDs match OR if content and timestamps match
            msg.id === message.id || 
            (msg.content === message.content && 
             msg.senderId === message.senderId &&
             msg.receiverId === message.receiverId &&
             Math.abs(new Date(msg.timestamp) - new Date(message.timestamp)) < 1000) // Within 1 second
          );
          
          // Only add if it's not a duplicate
          if (isDuplicate) {
            return prev;
          }
          
          // Add the new message
          return [...prev, message];
        });
        
        // Mark message as seen since it's in the active conversation
        if (message.senderId !== currentUser.id && !message.seen) {
          api.markMessageAsSeen(message.id);
        }
      }
      
      // Update conversations list without refetching messages
      updateConversationsWithMessage(message);
    });
    
    // Listen for typing events
    socketService.listenForTyping((data) => {
      if (data.senderId === activeUserId) {
        setUserTyping(activeUserId);
        
        // Clear typing indicator after 3 seconds
        if (typingTimeoutRef.current) {
          clearTimeout(typingTimeoutRef.current);
        }
        
        typingTimeoutRef.current = setTimeout(() => {
          setUserTyping(null);
        }, 3000);
      }
    });
    
    // Clean up function
    return () => {
      socket.off('receive_message');
      socket.off('user_typing');
    };
    
  }, [socket, activeUserId, currentUser?.id]);

  // Load conversations when component mounts
  useEffect(() => {
    if (currentUser?.id) {
      fetchConversations();
    }
  }, [currentUser?.id]);

  // Set active user ID from URL params
  useEffect(() => {
    if (!activeUserId && conversations.length > 0) {
      // If no user is selected but we have conversations, select the first one
      setActiveUserId(conversations[0].userId);
      navigate(`/messages/${conversations[0].userId}`);
    } else if (userId && userId !== activeUserId) {
      // If URL param changed, update active user
      setActiveUserId(userId);
    }
  }, [userId, activeUserId, conversations, navigate]);

  // Load messages when active user changes
  useEffect(() => {
    if (activeUserId && currentUser?.id) {
      fetchMessages();
    }
  }, [activeUserId, currentUser?.id]);

  // Scroll to bottom of chat area only (not whole page)
  useEffect(() => {
    if (!isLoading && messages.length > 0 && messagesContainerRef.current) {
      setTimeout(() => {
        const container = messagesContainerRef.current;
        container.scrollTop = container.scrollHeight;
      }, 50);
    }
  }, [isLoading, messages]);

  // Update activeUserDetails when activeUserId or conversations change
  useEffect(() => {
    if (activeUserId) {
      // First, immediately set a placeholder to ensure UI shows something
      setActiveUserDetails(prev => ({
        ...prev,
        userId: activeUserId
      }));
      
      // Then try to find the user in existing conversations
      const userDetails = conversations.find(conv => conv.userId === activeUserId);
      if (userDetails) {
        setActiveUserDetails(userDetails);
      } else {
        // If not found in conversations, fetch user details directly
        api.getUserById(activeUserId)
          .then(userData => {
            if (userData) {
              setActiveUserDetails({
                userId: userData.id,
                name: userData.name,
                email: userData.email,
                isAnonymous: false
              });
            }
          })
          .catch(error => {
            console.error('Failed to fetch user details:', error);
          });
      }
    }
  }, [activeUserId]);

  // Fetch user conversations
  const fetchConversations = async () => {
    if (!currentUser?.id) return;
    try {
      const conversations = await api.getAllConversations();
      setConversations(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations');
    }
  };

  // Fetch messages between current user and active user
  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      // Get chat history
      const chatHistory = await api.getChatHistory(currentUser.id, activeUserId);
      
      // Process messages to add user details for proper display
      const processedMessages = chatHistory.map(msg => {
        // If this is a message received from active user
        if (msg.senderId === activeUserId) {
          return {
            ...msg,
            sender: {
              id: activeUserId,
              name: activeUserDetails?.name || msg.sender?.name || 'User',
              email: activeUserDetails?.email || msg.sender?.email || ''
            }
          };
        }
        // If this is a message sent by current user
        return {
          ...msg,
          sender: {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email
          }
        };
      });
      
      // Instead of directly replacing all messages, merge with existing ones
      // to preserve optimistic updates and avoid duplicates
      setMessages(prevMessages => {
        // Create a map of existing messages for easy lookup
        const existingMessagesMap = new Map();
        prevMessages.forEach(msg => {
          // Use a composite key for better duplicate detection
          if (msg.id && !msg.id.toString().startsWith('temp-')) {
            existingMessagesMap.set(msg.id, msg);
          } else {
            // For temp messages, use a composite key
            const compositeKey = `${msg.senderId}-${msg.receiverId}-${msg.content}-${msg.timestamp}`;
            existingMessagesMap.set(compositeKey, msg);
          }
        });
        
        // Filter out duplicates from processed messages
        const newMessages = [];
        processedMessages.forEach(msg => {
          // Skip if it's already in our existing messages
          if (existingMessagesMap.has(msg.id)) {
            return;
          }
          
          // Check for content-based duplicates (even with different IDs)
          const compositeKey = `${msg.senderId}-${msg.receiverId}-${msg.content}-${msg.timestamp}`;
          if (existingMessagesMap.has(compositeKey)) {
            return;
          }
          
          // Check for nearly identical messages (within 1 second)
          let isDuplicate = false;
          for (const [_, existingMsg] of existingMessagesMap) {
            if (existingMsg.content === msg.content && 
                existingMsg.senderId === msg.senderId &&
                existingMsg.receiverId === msg.receiverId &&
                Math.abs(new Date(existingMsg.timestamp) - new Date(msg.timestamp)) < 1000) {
              isDuplicate = true;
              break;
            }
          }
          
          if (!isDuplicate) {
            newMessages.push(msg);
            // Add to map to avoid duplicates within the new messages
            existingMessagesMap.set(msg.id, msg);
          }
        });
        
        // Combine existing messages (except temp ones) with new ones
        const result = [
          ...prevMessages.filter(msg => !msg.id.toString().startsWith('temp-')),
          ...newMessages
        ];
        
        // Sort by timestamp
        return result.sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });
      
      setIsLoading(false);
      
      // Mark messages as seen
      chatHistory.forEach(msg => {
        if (msg.senderId !== currentUser.id && !msg.seen) {
          api.markMessageAsSeen(msg.id);
        }
      });
      
      // Update conversations list to reflect read messages
      setConversations(prevConversations => 
        prevConversations.map(conv => {
          if (conv.userId === activeUserId) {
            return { ...conv, unreadCount: 0 };
          }
          return conv;
        })
      );
      
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages');
      setIsLoading(false);
    }
  };

  // Before the handleSendMessage function, add a lock flag to prevent multiple submissions
  let sendingMessage = false;
  // Keep track of last sent message to prevent duplicates
  let lastSentMessage = {
    content: '',
    timestamp: 0
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    // Get message content
    const messageContent = newMessage.trim();
    
    // Prevent multiple rapid submissions or empty messages
    if (sendingMessage || !messageContent) return;
    
    // Prevent duplicate sends (double-click or multiple rapid enters)
    const now = Date.now();
    if (lastSentMessage.content === messageContent && 
        now - lastSentMessage.timestamp < 2000) { // 2 seconds
      return;
    }
    
    // Update last sent message
    lastSentMessage = {
      content: messageContent,
      timestamp: now
    };
    
    // Set lock
    sendingMessage = true;
    
    // Save state
    const prevConversations = [...conversations];
    
    // Clear input immediately for better UX
    setNewMessage('');
    
    // Create message data
    const messageData = {
      senderId: currentUser.id,
      receiverId: activeUserId,
      content: messageContent,
      isAnonymous
    };
    
    // Validate message data
    if (!messageData.senderId || !messageData.receiverId || !messageData.content) {
      setError('Invalid message data');
      sendingMessage = false;
      return;
    }
    
    // Ensure senderId matches current user (additional security check)
    if (messageData.senderId !== currentUser.id) {
      setError('Unauthorized: Cannot send messages as another user');
      sendingMessage = false;
      return;
    }
    
    try {
      // Create optimistic message for UI
      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        ...messageData,
        timestamp: new Date().toISOString(),
        seen: false,
        sender: {
          id: currentUser.id,
          name: currentUser.name,
          email: currentUser.email
        }
      };
      
      // Add message to UI
      setMessages(prev => {
        // Check for exact duplicates before adding
        const isDuplicate = prev.some(msg => 
          msg.content === messageContent &&
          msg.senderId === currentUser.id &&
          msg.receiverId === activeUserId &&
          Math.abs(new Date(msg.timestamp) - now) < 2000
        );
        
        if (isDuplicate) {
          return prev;
        }
        
        return [...prev, optimisticMessage];
      });
      
      // Send via socket first for quick updates
      socketService.sendMessage(messageData);

      // Fetch receiver details for sidebar conversation
      api.getUserById(activeUserId).then(receiverData => {
        const receiverName = receiverData?.name || 'User';
        const receiverEmail = receiverData?.email || '';
        // Immediately update conversations list for sidebar with correct user info
        updateConversationsWithMessage({
          ...optimisticMessage,
          receiverName,
          receiverEmail
        });
      });

      // Send via API in background
      api.sendMessage(messageData)
        .then(sentMessage => {
          // Update temp message ID with real one
          setMessages(prev => 
            prev.map(msg => 
              msg.id === optimisticMessage.id ? {...msg, id: sentMessage.id} : msg
            )
          );

          // Refresh conversations from backend
          fetchConversations();

          // Release lock
          sendingMessage = false;
        })
        .catch(error => {
          console.error('Failed to send message via API:', error);
          setError('Message sent but not saved');
          sendingMessage = false;
        });
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
      // Restore previous state on error
      setConversations(prevConversations);
      setNewMessage(messageContent);
      sendingMessage = false;
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Emit typing event if input not empty
    if (e.target.value.trim() && socket && activeUserId) {
      socketService.emitTyping({
        senderId: currentUser.id,
        receiverId: activeUserId
      });
    }
  };

  const handleKeyDown = (e) => {
    // Handle Enter key press for sending message (without clearing conversations)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (newMessage.trim()) {
        handleSendMessage(e);
      }
    }
  };

  // Add this function after fetchConversations
  const updateConversationsWithMessage = (message) => {
    // Check if this message affects our current user
    if (message.senderId !== currentUser.id && message.receiverId !== currentUser.id) {
      return;
    }
    
    // Determine the other party of the conversation
    const otherUserId = message.senderId === currentUser.id ? message.receiverId : message.senderId;
    
    // Skip if the other user is the current user (shouldn't happen with proper data)
    if (otherUserId === currentUser.id) {
      return;
    }
    
    setConversations(prevConversations => {
      // Create a copy of the conversations array
      const updatedConversations = [...prevConversations];
      
      // Find the existing conversation
      const existingIndex = updatedConversations.findIndex(c => c.userId === otherUserId);
      
      if (existingIndex !== -1) {
        // Update existing conversation
        const updatedConversation = {...updatedConversations[existingIndex]};
        
        // Update last message
        updatedConversation.lastMessage = message.content;
        updatedConversation.lastMessageTime = formatMessageTime(new Date(message.timestamp));
        
        // Update unread count if it's a message to the current user and not from current conversation
        if (message.receiverId === currentUser.id && message.senderId !== activeUserId) {
          updatedConversation.unreadCount = (updatedConversation.unreadCount || 0) + 1;
        }
        
        // Replace the old conversation with the updated one
        updatedConversations[existingIndex] = updatedConversation;
      } else {
        // If conversation doesn't exist yet, fetch user details and create a new conversation entry
        // But only do this if we're missing the conversation - not for every message
        if (message.senderId === currentUser.id) {
          // For outgoing message - create a basic entry with available info
          // We'll get full details next time fetchConversations runs
          updatedConversations.push({
            userId: message.receiverId,
            name: message.receiverName || "User",
            email: message.receiverEmail || "",
            lastMessage: message.content,
            lastMessageTime: formatMessageTime(new Date(message.timestamp)),
            unreadCount: 0,
            isAnonymous: message.isAnonymous
          });
        } else {
          // For incoming message from a new conversation
          updatedConversations.push({
            userId: message.senderId,
            name: message.sender?.name || (message.isAnonymous ? "Anonymous" : "User"),
            email: message.sender?.email || "",
            lastMessage: message.content,
            lastMessageTime: formatMessageTime(new Date(message.timestamp)),
            unreadCount: message.senderId !== activeUserId ? 1 : 0,
            isAnonymous: message.isAnonymous
          });
        }
      }
      
      // Filter out any conversations with the current user
      const filteredConversations = updatedConversations.filter(
        conv => conv.userId !== currentUser.id
      );
      
      // Sort to bring active conversations to the top
      return filteredConversations.sort((a, b) => {
        // If one has a lastMessageTime and the other doesn't
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        
        // Sort by most recent message
        return b.lastMessageTime.localeCompare(a.lastMessageTime);
      });
    });
  };
  
  // Add a helper function for message time formatting if it doesn't exist
  const formatMessageTime = (date) => {
    return date.toLocaleDateString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout isLoggedIn={isLoggedIn} onLogout={onLogout}>
      <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-gray-50">
        {/* Mobile Header - Only visible on mobile when chat is active */}
        {activeUserId && (
          <div className="lg:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm">
            <button
              onClick={() => setShowSidebar(true)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bars3Icon className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center flex-1 mx-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-400 text-white text-lg font-bold mr-3 flex-shrink-0 shadow">
                {activeUserDetails.name ? activeUserDetails.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-gray-900 text-lg truncate">
                  {activeUserDetails.isAnonymous ? 'Anonymous' : activeUserDetails.name}
                </h3>
                {activeUserDetails.email && !activeUserDetails.isAnonymous && (
                  <p className="text-sm text-gray-500 truncate">{activeUserDetails.email}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Sidebar - Conversation List */}
        <div className={`
          ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:w-80 xl:w-96 w-full max-w-sm
          h-full lg:h-screen
          bg-white border-r border-gray-200
          flex flex-col overflow-hidden
          fixed lg:relative z-50 lg:z-auto
          transition-transform duration-300 ease-in-out
        `}>
          {/* Sidebar Header */}
          <div className="p-4 lg:p-6 border-b border-gray-200 bg-white flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl lg:text-2xl font-bold text-gray-900">Messages</h2>
              {activeUserId && (
                <button
                  onClick={() => setShowSidebar(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                </button>
              )}
            </div>
            <UserSearch onSelectUser={(userId, userDetails) => {
              handleSelectConversation(userId, userDetails);
            }} />
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length > 0 ? (
              <MessageList
                conversations={conversations}
                activeUserId={activeUserId}
                onSelectConversation={handleSelectConversation}
              />
            ) : (
              <div className="p-6 text-center text-gray-500">
                <div className="mb-4">
                  <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-sm">No conversations yet.</p>
                <p className="text-xs text-gray-400 mt-1">Use the search to find someone to message.</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Overlay - Only visible when sidebar is open on mobile */}
        {showSidebar && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowSidebar(false)}
          />
        )}

        {/* Main Content - Chat Area */}
        <div className={`
          ${activeUserId ? 'flex' : 'hidden lg:flex'}
          flex-col flex-1 h-full lg:h-screen
          bg-gradient-to-br from-blue-50 to-indigo-50
          relative
        `}>
          {activeUserId ? (
            <>
              {/* Desktop Chat Header */}
              <div className="hidden lg:flex border-b border-gray-200 p-4 lg:p-6 items-center bg-white/95 backdrop-blur-sm shadow-sm flex-shrink-0">
                <div className="flex items-center w-full">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-400 text-white text-xl font-bold mr-4 flex-shrink-0 shadow">
                    {activeUserDetails.name ? activeUserDetails.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg truncate">
                      {activeUserDetails.isAnonymous ? 'Anonymous' : activeUserDetails.name}
                    </h3>
                    {activeUserDetails.email && !activeUserDetails.isAnonymous && (
                      <p className="text-sm text-gray-500 truncate">{activeUserDetails.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages Container */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto px-3 py-4 lg:px-6 lg:py-6 bg-transparent relative"
                id="messages-container"
              >
                {isLoading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <p className="text-gray-500">Loading messages...</p>
                    </div>
                  </div>
                ) : error ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-red-500 text-center px-4">{error}</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center px-4">
                      <div className="mb-4">
                        <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-lg font-medium">No messages yet</p>
                      <p className="text-gray-400 text-sm mt-1">Send a message to start the conversation.</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div key={message.id} className="animate-fadeIn">
                        <MessageBubble
                          message={message}
                          isOwn={message.senderId === currentUser.id}
                        />
                      </div>
                    ))}
                    {userTyping === activeUserId && (
                      <div className="flex items-center space-x-2 text-sm text-gray-500 italic mt-2 px-4">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span>{activeUserDetails.isAnonymous ? 'Anonymous' : activeUserDetails.name} is typing...</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-3 lg:p-4 bg-white/95 backdrop-blur-sm border-t border-gray-200 flex-shrink-0">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2 lg:space-x-3">
                  <button 
                    type="button" 
                    className="p-2 lg:p-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-lg transition-colors"
                  >
                    <PaperClipIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                  </button>
                  
                  <div className="flex-1 relative">
                    <Input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="w-full rounded-2xl border border-gray-200 px-4 py-3 lg:px-5 lg:py-3 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-200 bg-white shadow-sm text-sm lg:text-base transition-all resize-none"
                      autoComplete="off"
                    />
                  </div>
                  
                  <button 
                    type="button" 
                    className="p-2 lg:p-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-200 rounded-lg transition-colors"
                  >
                    <MicrophoneIcon className="w-5 h-5 lg:w-6 lg:h-6" />
                  </button>
                  
                  <button
                    type="submit"
                    className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full p-2 lg:p-3 w-10 h-10 lg:w-12 lg:h-12 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-2 focus:ring-blue-200"
                    disabled={!newMessage.trim()}
                    aria-label="Send message"
                  >
                    <svg className="w-4 h-4 lg:w-5 lg:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                    </svg>
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center px-4">
                <div className="mb-6">
                  <svg className="w-20 h-20 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Messages</h3>
                <p className="text-gray-500 mb-4">Select a conversation or search for a user to start messaging</p>
                <button
                  onClick={() => setShowSidebar(true)}
                  className="lg:hidden bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                >
                  View Conversations
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        /* Custom scrollbar for webkit browsers */
        .overflow-y-auto::-webkit-scrollbar {
          width: 6px;
        }
        .overflow-y-auto::-webkit-scrollbar-track {
          background: transparent;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .overflow-y-auto::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
        
        /* Firefox scrollbar */
        .overflow-y-auto {
          scrollbar-width: thin;
          scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
        }
        
        /* Ensure proper height on mobile */
        @media (max-width: 1024px) {
          .h-screen {
            height: 100vh;
            height: 100dvh;
          }
        }
      `}</style>
    </Layout>
  );
};

export default Messages; 