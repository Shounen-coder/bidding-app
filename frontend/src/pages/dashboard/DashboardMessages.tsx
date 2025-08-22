import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../store';

interface Message {
  id: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  senderAvatar?: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  messageType: 'text' | 'system' | 'support';
}

interface Conversation {
  id: number;
  participantId: number;
  participantName: string;
  participantAvatar?: string;
  participantType: 'user' | 'seller' | 'support' | 'system';
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'active' | 'archived' | 'blocked';
  relatedAuction?: {
    id: number;
    title: string;
    image: string;
  };
}

const DashboardMessages: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'support' | 'archived'>('all');
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data - replace with actual API calls
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      participantId: 2,
      participantName: 'John Seller',
      participantAvatar: '/avatars/user1.jpg',
      participantType: 'seller',
      lastMessage: 'The camera is in excellent condition, no scratches or damage.',
      lastMessageTime: '2024-08-21T10:30:00Z',
      unreadCount: 2,
      status: 'active',
      relatedAuction: {
        id: 101,
        title: 'Vintage Canon Camera',
        image: '/images/camera1.jpg'
      }
    },
    {
      id: 2,
      participantId: 3,
      participantName: 'Support Team',
      participantAvatar: '/avatars/support.jpg',
      participantType: 'support',
      lastMessage: 'We have resolved your payment issue. Please check your account.',
      lastMessageTime: '2024-08-20T14:45:00Z',
      unreadCount: 0,
      status: 'active'
    },
    {
      id: 3,
      participantId: 4,
      participantName: 'AntiquesDealer',
      participantAvatar: '/avatars/user2.jpg',
      participantType: 'seller',
      lastMessage: 'Thank you for your purchase! The item will be shipped tomorrow.',
      lastMessageTime: '2024-08-19T16:20:00Z',
      unreadCount: 0,
      status: 'active',
      relatedAuction: {
        id: 102,
        title: 'Victorian Jewelry Box',
        image: '/images/jewelry1.jpg'
      }
    }
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      conversationId: 1,
      senderId: 2,
      senderName: 'John Seller',
      message: 'Hi! I saw you were interested in the vintage camera. Do you have any questions?',
      timestamp: '2024-08-21T09:00:00Z',
      isRead: true,
      messageType: 'text'
    },
    {
      id: 2,
      conversationId: 1,
      senderId: user?.id || 1,
      senderName: user?.firstName || 'You',
      message: 'Yes, could you tell me more about the condition? Any scratches or damage?',
      timestamp: '2024-08-21T09:15:00Z',
      isRead: true,
      messageType: 'text'
    },
    {
      id: 3,
      conversationId: 1,
      senderId: 2,
      senderName: 'John Seller',
      message: 'The camera is in excellent condition, no scratches or damage. I can provide additional photos if needed.',
      timestamp: '2024-08-21T10:30:00Z',
      isRead: false,
      messageType: 'text'
    },
    {
      id: 4,
      conversationId: 1,
      senderId: 2,
      senderName: 'John Seller',
      message: 'It has been stored in a dry cabinet and rarely used. All functions work perfectly.',
      timestamp: '2024-08-21T10:32:00Z',
      isRead: false,
      messageType: 'text'
    }
  ]);

  const filteredConversations = conversations.filter(conversation => {
    if (activeTab === 'unread') return conversation.unreadCount > 0;
    if (activeTab === 'support') return conversation.participantType === 'support';
    if (activeTab === 'archived') return conversation.status === 'archived';
    return conversation.status === 'active';
  }).filter(conversation => 
    conversation.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConversationData = conversations.find(c => c.id === selectedConversation);
  const conversationMessages = messages.filter(m => m.conversationId === selectedConversation);

  const tabs = [
    { id: 'all', name: 'All', count: conversations.filter(c => c.status === 'active').length },
    { id: 'unread', name: 'Unread', count: conversations.reduce((sum, c) => sum + c.unreadCount, 0) },
    { id: 'support', name: 'Support', count: conversations.filter(c => c.participantType === 'support').length },
    { id: 'archived', name: 'Archived', count: conversations.filter(c => c.status === 'archived').length },
  ];

  useEffect(() => {
    scrollToBottom();
  }, [conversationMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setIsLoading(true);

    const messageData: Message = {
      id: Date.now(),
      conversationId: selectedConversation,
      senderId: user?.id || 1,
      senderName: user?.firstName || 'You',
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      isRead: true,
      messageType: 'text'
    };

    setMessages(prev => [...prev, messageData]);
    
    // Update conversation last message
    setConversations(prev => prev.map(conv => 
      conv.id === selectedConversation 
        ? { ...conv, lastMessage: newMessage.trim(), lastMessageTime: new Date().toISOString() }
        : conv
    ));

    setNewMessage('');
    setIsLoading(false);

    // TODO: Send message to API
  };

  const markAsRead = (conversationId: number) => {
    setMessages(prev => prev.map(msg => 
      msg.conversationId === conversationId ? { ...msg, isRead: true } : msg
    ));
    
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
    ));
  };

  const archiveConversation = (conversationId: number) => {
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId ? { ...conv, status: 'archived' as const } : conv
    ));
    
    if (selectedConversation === conversationId) {
      setSelectedConversation(null);
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // Less than a week
      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getParticipantTypeIcon = (type: string) => {
    switch (type) {
      case 'support':
        return '🎧';
      case 'seller':
        return '💼';
      case 'system':
        return '⚙️';
      default:
        return '👤';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with sellers, buyers, and our support team</p>
        </div>
        
        <button className="bg-[#294c5b] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a48] transition-colors font-medium">
          New Message
        </button>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex">
        {/* Conversations Sidebar */}
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          {/* Search and Tabs */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#294c5b] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.name}
                  {tab.count > 0 && (
                    <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                      activeTab === tab.id ? 'bg-white text-[#294c5b]' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length > 0 ? (
              filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => {
                    setSelectedConversation(conversation.id);
                    if (conversation.unreadCount > 0) {
                      markAsRead(conversation.id);
                    }
                  }}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedConversation === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        {conversation.participantAvatar ? (
                          <img
                            src={conversation.participantAvatar}
                            alt={conversation.participantName}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <span className="text-lg">{getParticipantTypeIcon(conversation.participantType)}</span>
                        )}
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {conversation.unreadCount}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className={`text-sm font-medium truncate ${
                          conversation.unreadCount > 0 ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {conversation.participantName}
                        </h3>
                        <span className="text-xs text-gray-500">{formatTime(conversation.lastMessageTime)}</span>
                      </div>
                      
                      <p className={`text-xs truncate ${
                        conversation.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                      }`}>
                        {conversation.lastMessage}
                      </p>

                      {conversation.relatedAuction && (
                        <div className="mt-2 flex items-center text-xs text-gray-500">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          {conversation.relatedAuction.title}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p>No conversations found</p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {selectedConversationData ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {selectedConversationData.participantAvatar ? (
                        <img
                          src={selectedConversationData.participantAvatar}
                          alt={selectedConversationData.participantName}
                          className="w-8 h-8 rounded-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span>{getParticipantTypeIcon(selectedConversationData.participantType)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{selectedConversationData.participantName}</h3>
                      {selectedConversationData.relatedAuction && (
                        <p className="text-xs text-gray-500">Re: {selectedConversationData.relatedAuction.title}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => archiveConversation(selectedConversationData.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Archive conversation"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8l6 6 6-6" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversationMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.senderId === user?.id
                          ? 'bg-[#294c5b] text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === user?.id ? 'text-gray-200' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#294c5b] focus:border-transparent"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || isLoading}
                    className="bg-[#294c5b] text-white px-6 py-3 rounded-lg hover:bg-[#1e3a48] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                <p className="text-gray-500">Choose a conversation from the sidebar to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardMessages;
