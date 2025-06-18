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
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Keep track of active user details
  const [activeUserDetails, setActiveUserDetails] = useState({
    name: 'User',
    email: '',
    isAnonymous: false,
    userId: activeUserId
  });

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

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    
    // Save current conversations state before fetching
    const currentConversationsList = [...conversations];
    
    try {
      // First, get all users for reference
      const allUsers = await api.searchUsers("");
      const userMap = new Map();
      
      // Create map of all users by ID for quick lookup
      allUsers.forEach(user => {
        if (user.id !== currentUser.id) {
          userMap.set(user.id, {
            userId: user.id,
            name: user.name,
            email: user.email,
            lastMessage: "",
            lastMessageTime: "",
            unreadCount: 0,
            isAnonymous: false
          });
        }
      });
      
      // Get chat history for all users (including past conversations)
      // First, get unseen messages to find active conversation partners
      const unseenMessages = await api.getUnseenMessages(currentUser.id);
      
      // If no messages returned, keep the current conversations list
      if (!unseenMessages || unseenMessages.length === 0) {
        return;
      }
      
      // Create conversation map
      const conversationMap = new Map();
      
      // First, add existing conversations to the map to preserve state
      currentConversationsList.forEach(conv => {
        conversationMap.set(conv.userId, {...conv});
      });
      
      // Process all messages to build conversations
      for (const msg of unseenMessages) {
        // Skip messages where both sender and receiver are the current user
        if (msg.senderId === currentUser.id && msg.receiverId === currentUser.id) {
          continue;
        }

        // Get the ID of the other user (not the current user)
        const otherUserId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
        
        // Skip if the other user is the current user (shouldn't happen with proper data)
        if (otherUserId === currentUser.id) {
          continue;
        }
        
        // Get user details from the userMap or from the message
        const userDetails = userMap.get(otherUserId) || {
          userId: otherUserId,
          name: msg.sender?.name || (msg.isAnonymous ? 'Anonymous' : 'User'),
          email: msg.sender?.email || '',
          lastMessage: "",
          lastMessageTime: "",
          unreadCount: 0,
          isAnonymous: msg.isAnonymous && msg.senderId !== currentUser.id
        };
        
        // If this is a new conversation or a newer message
        if (!conversationMap.has(otherUserId) || 
            !conversationMap.get(otherUserId).lastMessageTime ||
            new Date(msg.timestamp) > new Date(conversationMap.get(otherUserId).lastMessageTime)) {
          
          // Update conversation with latest message
          conversationMap.set(otherUserId, {
            ...userDetails,
            lastMessage: msg.content,
            lastMessageTime: msg.timestamp,
            unreadCount: (!msg.seen && msg.senderId !== currentUser.id) 
              ? (conversationMap.get(otherUserId)?.unreadCount || 0) + 1 
              : (conversationMap.get(otherUserId)?.unreadCount || 0),
            isAnonymous: msg.isAnonymous && msg.senderId !== currentUser.id
          });
        } else if (!msg.seen && msg.senderId !== currentUser.id) {
          // Just update unread count for older messages
          const conv = conversationMap.get(otherUserId);
          conv.unreadCount += 1;
        }
      }
      
      // Convert map to array and format dates for display
      const conversationsArray = Array.from(conversationMap.values())
        .filter(conv => {
          // Make sure we have a conversation with messages AND the user is not the current user
          return conv.lastMessage && conv.userId !== currentUser.id;
        })
        .map(conv => ({
          ...conv,
          lastMessageTime: typeof conv.lastMessageTime === 'string' ? 
            conv.lastMessageTime : 
            new Date(conv.lastMessageTime).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit',
              hour12: true
            })
        }));
      
      // Sort by message time (newest first)
      const sortedConversations = conversationsArray.sort((a, b) => {
        if (!a.lastMessageTime) return 1;
        if (!b.lastMessageTime) return -1;
        
        // Handle different time formats
        const aTime = typeof a.lastMessageTime === 'string' && a.lastMessageTime.includes(':') ? 
          a.lastMessageTime : new Date(a.lastMessageTime).toISOString();
        const bTime = typeof b.lastMessageTime === 'string' && b.lastMessageTime.includes(':') ? 
          b.lastMessageTime : new Date(b.lastMessageTime).toISOString();
        
        return aTime < bTime ? 1 : -1;
      });
      
      // Only update state if we have conversations to show
      if (sortedConversations.length > 0) {
        setConversations(sortedConversations);
      } else {
        // If no conversations found from API, keep the current list
        setConversations(currentConversationsList);
      }
      
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations');
      // On error, keep the current conversations list
      setConversations(currentConversationsList);
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
      
      // Send via API in background
      api.sendMessage(messageData)
        .then(sentMessage => {
          // Update temp message ID with real one
          setMessages(prev => 
            prev.map(msg => 
              msg.id === optimisticMessage.id ? {...msg, id: sentMessage.id} : msg
            )
          );
          
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
      <div className="h-[calc(100vh-200px)] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm mt-8">
        <div className="flex h-full">
          {/* Sidebar - Conversation List */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Messages</h2>
              <UserSearch onSelectUser={(userId, userDetails) => {
                // Set active user ID first (will trigger navigation effect)
                setActiveUserId(userId);
                
                // Immediately update user details to avoid flickering
                setActiveUserDetails(userDetails);
                
                // Navigate to the message view
                navigate(`/messages/${userId}`);
              }} />
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {conversations.length > 0 ? (
                <MessageList
                  conversations={conversations}
                  activeUserId={activeUserId}
                  onSelectConversation={(userId, userDetails) => {
                    // Update activeUserId which triggers navigation
                    setActiveUserId(userId);
                    
                    // If userDetails are provided, update activeUserDetails immediately
                    if (userDetails) {
                      setActiveUserDetails(userDetails);
                    }
                    
                    // Update URL
                    navigate(`/messages/${userId}`);
                  }}
                />
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No conversations yet. Use the search to find someone to message.
                </div>
              )}
            </div>
          </div>
          
          {/* Main Content - Chat Area */}
          <div className="flex flex-col w-2/3 relative">
            {activeUserId ? (
              <>
                {/* Chat Header */}
                <div className="border-b border-gray-200 p-4 flex items-center bg-white shadow-sm sticky top-0 z-10">
                  <div className="flex items-center w-full">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white mr-3 flex-shrink-0">
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
                <div className="flex-grow overflow-y-auto p-4 pb-14">
                  {isLoading ? (
                    <div className="flex h-full items-center justify-center">
                      <p>Loading messages...</p>
                    </div>
                  ) : error ? (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-red-500">{error}</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex h-full items-center justify-center">
                      <p className="text-gray-500">No messages yet. Send a message to start the conversation.</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((message) => (
                        <MessageBubble
                          key={message.id}
                          message={message}
                          isOwn={message.senderId === currentUser.id}
                        />
                      ))}
                      {userTyping === activeUserId && (
                        <div className="text-sm text-gray-500 italic mt-2">
                          {activeUserDetails.isAnonymous ? 'Anonymous' : activeUserDetails.name} is typing...
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>
                
                {/* Message Input */}
                <div className="border-t border-gray-200 p-4 bg-white sticky bottom-0 z-10">
                  <form onSubmit={handleSendMessage} className="flex items-center">
                    <div className="mr-2 flex items-center">
                      <input
                        type="checkbox"
                        id="anonymous"
                        checked={isAnonymous}
                        onChange={() => setIsAnonymous(!isAnonymous)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="anonymous" className="ml-1 text-sm text-gray-600">
                        Anonymous
                      </label>
                    </div>
                    
                    <Input
                      type="text"
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      className="flex-grow"
                    />
                    
                    <Button
                      type="submit"
                      className="ml-2"
                      disabled={!newMessage.trim()}
                    >
                      Send
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-gray-500">Select a conversation or search for a user to message</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Messages; 