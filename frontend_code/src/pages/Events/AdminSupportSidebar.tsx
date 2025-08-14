import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, ArrowLeft, Clock, User, Send, AlertCircle, CheckCircle, XCircle, Filter, Search, MoreVertical, RefreshCw } from 'lucide-react';

interface Ticket {
  ticket_id: string;
  created_by: string;
  created_at: string;
  status: string;
  message_count: number;
  last_message: string;
  last_activity: string;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  sender_type: string;
}

interface AdminSupportSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const AdminSupportSidebar: React.FC<AdminSupportSidebarProps> = ({ isOpen = true, onClose = () => {} }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'tickets' | 'chat'>('tickets');
  const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const API_BASE_URL = 'http://64.225.53.112:5000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const url = filter === 'all' 
        ? `${API_BASE_URL}/api/v1/support/tickets`
        : `${API_BASE_URL}/api/v1/support/tickets?status=${filter}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setTickets(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching tickets:', err);
      setError('Unable to load tickets. Please check your connection and try again.');
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (ticketId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/support/tickets/${ticketId}/messages`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setMessages(Array.isArray(data) ? data : []);
      setError(null);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Failed to load conversation history');
      setMessages([]);
    }
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedTicket || sendingMessage) return;

    try {
      setSendingMessage(true);
      const response = await fetch(`${API_BASE_URL}/api/v1/support/tickets/${selectedTicket}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: 'AdminUser',
          text: replyText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setReplyText('');
      setError(null);
      
      await fetchMessages(selectedTicket);
      await fetchTickets();
    } catch (err) {
      console.error('Error sending reply:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setSendingMessage(false);
    }
  };

  const updateTicketStatus = async (ticketId: string, status: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/support/tickets/${ticketId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setError(null);
      await fetchTickets();
      
      if (selectedTicket === ticketId) {
        await fetchMessages(ticketId);
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update ticket status');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTickets();
    if (selectedTicket) {
      await fetchMessages(selectedTicket);
    }
    setRefreshing(false);
  };

  const handleTicketSelect = (ticketId: string) => {
    setSelectedTicket(ticketId);
    setView('chat');
    fetchMessages(ticketId);
  };

  const handleBackToTickets = () => {
    setView('tickets');
    setSelectedTicket(null);
    setMessages([]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendReply();
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open':
        return {
          icon: <AlertCircle size={14} />,
          color: 'text-emerald-700',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          dot: 'bg-emerald-500'
        };
      case 'closed':
        return {
          icon: <CheckCircle size={14} />,
          color: 'text-slate-600',
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          dot: 'bg-slate-400'
        };
      default:
        return {
          icon: <XCircle size={14} />,
          color: 'text-red-700',
          bg: 'bg-red-50',
          border: 'border-red-200',
          dot: 'bg-red-500'
        };
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
  const confirmed = window.confirm("Are you sure you want to delete this ticket and all messages?");
  if (!confirmed) return;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/support/tickets/${ticketId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete ticket");
    }

    // Refresh list
    setSelectedTicket(null);
    setMessages([]);
    await fetchTickets();
  } catch (err) {
    console.error("Delete error:", err);
    setError("Failed to delete ticket. Try again.");
  }
};


  const filteredTickets = tickets.filter(ticket => {
    const matchesFilter = filter === 'all' || ticket.status === filter;
    const matchesSearch = searchQuery === '' || 
      ticket.created_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.ticket_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.last_message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const selectedTicketData = tickets.find(t => t.ticket_id === selectedTicket);

  useEffect(() => {
    fetchTickets();
    const interval = setInterval(fetchTickets, 30000);
    return () => clearInterval(interval);
  }, [filter]);

  useEffect(() => {
    if (selectedTicket) {
      fetchMessages(selectedTicket);
      const interval = setInterval(() => fetchMessages(selectedTicket), 10000);
      return () => clearInterval(interval);
    }
  }, [selectedTicket]);

  if (!isOpen) return null;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Enhanced Header */}
      <div className="bg-white shadow-sm border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-5">
              {view === 'chat' && (
                <button
                  onClick={handleBackToTickets}
                  className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 group"
                  title="Back to tickets"
                >
                  <ArrowLeft size={20} className="text-slate-600 group-hover:text-slate-900" />
                </button>
              )}
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                  <MessageCircle size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-slate-900 tracking-tight">
                    {view === 'tickets' ? 'Support Center' : `Ticket #${selectedTicket?.slice(-8)}`}
                  </h1>
                  {view === 'tickets' && (
                    <p className="text-sm text-slate-500 font-medium">
                      {filteredTickets.length} of {tickets.length} tickets
                    </p>
                  )}
                  {view === 'chat' && selectedTicketData && (
                    <p className="text-sm text-slate-500">
                      Conversation with {selectedTicketData.created_by}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <button
              onClick={handleRefresh}
              className="p-2.5 hover:bg-slate-100 rounded-xl transition-all duration-200 group"
              title="Refresh"
              disabled={refreshing}
            >
              <RefreshCw size={18} className={`text-slate-600 group-hover:text-slate-900 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6">
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <XCircle size={20} className="text-red-500" />
              <span className="font-medium">{error}</span>
            </div>
            <button 
              onClick={() => setError(null)} 
              className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg font-medium text-slate-700">Loading support tickets...</p>
              <p className="text-sm text-slate-500 mt-2">Please wait while we fetch the latest data</p>
            </div>
          </div>
        ) : view === 'tickets' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60">
            {/* Enhanced Filter and Search Section */}
            <div className="p-6 border-b border-slate-200/60 bg-slate-50/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex space-x-1 bg-slate-100 rounded-xl p-1">
                  {['all', 'open', 'closed'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status as any)}
                      className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                        filter === status
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                      <span className="ml-2 text-xs font-normal opacity-75">
                        ({status === 'all' ? tickets.length : tickets.filter(t => t.status === status).length})
                      </span>
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search tickets, customers, or messages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200 w-80"
                  />
                </div>
              </div>
            </div>

            {/* Enhanced Tickets Grid */}
            <div className="p-6">
              {filteredTickets.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No {filter === 'all' ? '' : filter} tickets found
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    {searchQuery ? 'Try adjusting your search terms or filters.' : 'When customers submit support requests, they\'ll appear here.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredTickets.map((ticket) => {
                    const statusConfig = getStatusConfig(ticket.status);
                    return (
                      <div
                        key={ticket.ticket_id}
                        onClick={() => handleTicketSelect(ticket.ticket_id)}
                        className="group p-6 border border-slate-200 rounded-2xl cursor-pointer hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 bg-white hover:bg-blue-50/30"
                      >
                        <div className="flex justify-between items-start mb-5">
                          <span className="font-mono text-xs font-medium text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
                            #{ticket.ticket_id.slice(-8)}
                          </span>
                          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium border ${statusConfig.bg} ${statusConfig.color} ${statusConfig.border}`}>
                            <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
                            <span className="capitalize">{ticket.status}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 mb-4">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <User size={14} className="text-white" />
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 text-sm">
                              {ticket.created_by}
                            </p>
                            <p className="text-xs text-slate-500">Customer</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-4">
                          <Clock size={14} className="text-slate-400" />
                          <p className="text-xs text-slate-500 font-medium">
                            {new Date(ticket.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })} at {new Date(ticket.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </p>
                        </div>
                        
                        <div className="mb-5">
                          <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
                            {ticket.last_message || 'No messages yet'}
                          </p>
                        </div>
                        
                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                          <span className="text-xs font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
                            {ticket.message_count} message{ticket.message_count !== 1 ? 's' : ''}
                          </span>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTicket(ticket.ticket_id);
                            }}
                            className="text-sm px-4 py-2 rounded-md bg-red-50 text-red-600 border border-red-300 hover:bg-red-100 transition-colors"
                          >
                            Delete
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              updateTicketStatus(ticket.ticket_id, ticket.status === 'open' ? 'closed' : 'open');
                            }}
                            className="text-xs font-medium px-4 py-2 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 group-hover:border-blue-300"
                          >
                            {ticket.status === 'open' ? 'Close' : 'Reopen'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Enhanced Ticket Info Sidebar */}
            {selectedTicketData && (
              <div className="xl:col-span-1">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 sticky top-8">
                  <h3 className="text-lg font-semibold text-slate-900 mb-6">Ticket Details</h3>
                  
                  <div className="space-y-5">
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ticket ID</label>
                      <p className="font-mono text-sm font-medium text-slate-900 mt-1">#{selectedTicketData.ticket_id.slice(-8)}</p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</label>
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <User size={14} className="text-white" />
                        </div>
                        <p className="text-sm font-medium text-slate-900">{selectedTicketData.created_by}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</label>
                      <div className={`inline-flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium border mt-2 ${getStatusConfig(selectedTicketData.status).bg} ${getStatusConfig(selectedTicketData.status).color} ${getStatusConfig(selectedTicketData.status).border}`}>
                        <div className={`w-2 h-2 rounded-full ${getStatusConfig(selectedTicketData.status).dot}`}></div>
                        <span className="capitalize">{selectedTicketData.status}</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Created</label>
                      <p className="text-sm font-medium text-slate-900 mt-1">
                        {new Date(selectedTicketData.created_at).toLocaleDateString('en-US', { 
                          weekday: 'short',
                          month: 'short', 
                          day: 'numeric',
                          year: 'numeric'
                        })}<br />
                        <span className="text-slate-500 font-normal">
                          {new Date(selectedTicketData.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Messages</label>
                      <p className="text-sm font-medium text-slate-900 mt-1">{selectedTicketData.message_count}</p>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <button
                      onClick={() => updateTicketStatus(selectedTicket!, selectedTicketData.status === 'open' ? 'closed' : 'open')}
                      className={`w-full px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        selectedTicketData.status === 'open' 
                          ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200' 
                          : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/25'
                      }`}
                    >
                      {selectedTicketData.status === 'open' ? 'Close Ticket' : 'Reopen Ticket'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Chat Area */}
            <div className="xl:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 h-[700px] flex flex-col overflow-hidden">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-slate-50/30 to-white">
                  {messages.length === 0 ? (
                    <div className="text-center py-20">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <MessageCircle size={32} className="text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">No messages yet</h3>
                      <p className="text-slate-500">Start the conversation by sending a message below.</p>
                    </div>
                  ) : (
                    <>
                      {messages.map((msg, idx) => (
                        <div key={msg.id || idx} className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-2xl px-4 py-3 rounded-2xl shadow-sm ${
                            msg.sender_type === 'admin'
                              ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white'
                              : 'bg-white text-slate-800 border border-slate-200 shadow-md'
                          }`}>
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`font-medium text-sm ${msg.sender_type === 'admin' ? 'text-blue-100' : 'text-slate-600'}`}>
                                {msg.sender}
                              </span>
                              {msg.sender_type === 'admin' && (
                                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-md font-medium">Admin</span>
                              )}
                            </div>
                            <div className="text-sm leading-relaxed">
                              {msg.text}
                            </div>
                            <div className={`text-xs mt-2 ${msg.sender_type === 'admin' ? 'text-blue-200' : 'text-slate-500'}`}>
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Enhanced Reply Input */}
                {selectedTicketData && selectedTicketData.status === 'open' && (
                  <div className="border-t border-slate-200/60 p-6 bg-white">
                    <div className="flex space-x-4">
                      <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your reply..."
                        className="flex-1 resize-none border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all duration-200"
                        rows={3}
                        disabled={sendingMessage}
                      />
                      <button
                        onClick={sendReply}
                        disabled={!replyText.trim() || sendingMessage}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2 shadow-lg shadow-blue-500/25"
                      >
                        {sendingMessage ? (
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <Send size={18} />
                        )}
                        <span className="font-medium">{sendingMessage ? 'Sending...' : 'Send'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 mt-3 font-medium">
                      Press Enter to send • Shift+Enter for new line
                    </p>
                  </div>
                )}

                {/* Enhanced Closed Ticket Notice */}
                {selectedTicketData && selectedTicketData.status === 'closed' && (
                  <div className="border-t border-slate-200/60 p-8 bg-slate-50/50">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={24} className="text-slate-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-2">This ticket is closed</h3>
                      <p className="text-sm text-slate-600 mb-6">No new messages can be sent to this conversation.</p>
                      <button
                        onClick={() => updateTicketStatus(selectedTicket!, 'open')}
                        className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-lg shadow-blue-500/25"
                      >
                        Reopen Ticket
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};




// import React, { useState, useEffect, useRef } from 'react';
// import { MessageCircle, X, ArrowLeft, Clock, User, Send, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// interface Ticket {
//   ticket_id: string;
//   created_by: string;
//   created_at: string;
//   status: string;
//   message_count: number;
//   last_message: string;
//   last_activity: string;
// }

// interface Message {
//   id: string;
//   sender: string;
//   text: string;
//   timestamp: string;
//   sender_type: string;
// }

// interface AdminSupportSidebarProps {
//   isOpen?: boolean;
//   onClose?: () => void;
// }

// export const AdminSupportSidebar: React.FC<AdminSupportSidebarProps> = ({ isOpen = true, onClose = () => {} }) => {
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [replyText, setReplyText] = useState<string>('');
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [view, setView] = useState<'tickets' | 'chat'>('tickets');
//   const [filter, setFilter] = useState<'all' | 'open' | 'closed'>('all');
//   const [sendingMessage, setSendingMessage] = useState<boolean>(false);
  
//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const API_BASE_URL = 'http://64.225.53.112:5000';

//   // Auto-scroll to bottom when new messages arrive
//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Fetch all tickets from backend
//   const fetchTickets = async () => {
//     try {
//       setLoading(true);
//       const url = filter === 'all' 
//         ? `${API_BASE_URL}/api/v1/support/tickets`
//         : `${API_BASE_URL}/api/v1/support/tickets?status=${filter}`;
      
//       const response = await fetch(url);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       setTickets(Array.isArray(data) ? data : []);
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching tickets:', err);
//       setError('Failed to load tickets. Please check your connection.');
//       setTickets([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch messages for selected ticket from backend
//   const fetchMessages = async (ticketId: string) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/v1/support/tickets/${ticketId}/messages`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       const data = await response.json();
//       setMessages(Array.isArray(data) ? data : []);
//       setError(null);
//     } catch (err) {
//       console.error('Error fetching messages:', err);
//       setError('Failed to load messages');
//       setMessages([]);
//     }
//   };

//   // Send admin reply to backend
//   const sendReply = async () => {
//     if (!replyText.trim() || !selectedTicket || sendingMessage) return;

//     try {
//       setSendingMessage(true);
//       const response = await fetch(`${API_BASE_URL}/api/v1/support/tickets/${selectedTicket}/message`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           sender: 'AdminUser',
//           text: replyText.trim(),
//         }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       setReplyText('');
//       setError(null);
      
//       // Refresh messages and tickets after sending
//       await fetchMessages(selectedTicket);
//       await fetchTickets();
//     } catch (err) {
//       console.error('Error sending reply:', err);
//       setError('Failed to send reply. Please try again.');
//     } finally {
//       setSendingMessage(false);
//     }
//   };

//   // Update ticket status via backend
//   const updateTicketStatus = async (ticketId: string, status: string) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/api/v1/support/tickets/${ticketId}/status`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ status }),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       setError(null);
      
//       // Refresh tickets after status update
//       await fetchTickets();
      
//       // If we're viewing this ticket, refresh messages too
//       if (selectedTicket === ticketId) {
//         await fetchMessages(ticketId);
//       }
//     } catch (err) {
//       console.error('Error updating status:', err);
//       setError('Failed to update ticket status');
//     }
//   };

//   const handleTicketSelect = (ticketId: string) => {
//     setSelectedTicket(ticketId);
//     setView('chat');
//     fetchMessages(ticketId);
//   };

//   const handleBackToTickets = () => {
//     setView('tickets');
//     setSelectedTicket(null);
//     setMessages([]);
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendReply();
//     }
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'open':
//         return <AlertCircle size={12} className="text-green-600" />;
//       case 'closed':
//         return <CheckCircle size={12} className="text-gray-600" />;
//       default:
//         return <XCircle size={12} className="text-red-600" />;
//     }
//   };

//   const getStatusStyle = (status: string) => {
//     switch (status) {
//       case 'open':
//         return 'bg-green-100 text-green-800 border-green-200';
//       case 'closed':
//         return 'bg-gray-100 text-gray-800 border-gray-200';
//       default:
//         return 'bg-red-100 text-red-800 border-red-200';
//     }
//   };

//   const filteredTickets = tickets.filter(ticket => {
//     if (filter === 'all') return true;
//     return ticket.status === filter;
//   });

//   const selectedTicketData = tickets.find(t => t.ticket_id === selectedTicket);

//   // Initial fetch and polling for tickets
//   useEffect(() => {
//     fetchTickets();
    
//     // Poll for ticket updates every 30 seconds
//     const interval = setInterval(fetchTickets, 30000);
//     return () => clearInterval(interval);
//   }, [filter]); // Refetch when filter changes

//   // Poll for message updates when viewing a ticket
//   useEffect(() => {
//     if (selectedTicket) {
//       fetchMessages(selectedTicket);
      
//       // Poll for new messages every 10 seconds
//       const interval = setInterval(() => fetchMessages(selectedTicket), 10000);
//       return () => clearInterval(interval);
//     }
//   }, [selectedTicket]);

//   if (!isOpen) return null;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center space-x-4">
//               {view === 'chat' && (
//                 <button
//                   onClick={handleBackToTickets}
//                   className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
//                   title="Back to tickets"
//                 >
//                   <ArrowLeft size={20} />
//                 </button>
//               )}
//               <div className="flex items-center space-x-3">
//                 <div className="p-2 bg-blue-100 rounded-lg">
//                   <MessageCircle size={24} className="text-blue-600" />
//                 </div>
//                 <div>
//                   <h1 className="text-xl font-semibold text-gray-900">
//                     {view === 'tickets' ? 'Support Dashboard' : `Ticket #${selectedTicket?.slice(-8)}`}
//                   </h1>
//                   {view === 'tickets' && (
//                     <p className="text-sm text-gray-500">{filteredTickets.length} tickets</p>
//                   )}
//                   {view === 'chat' && selectedTicketData && (
//                     <p className="text-sm text-gray-500">Conversation with {selectedTicketData.created_by}</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Error Display */}
//       {error && (
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
//           <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-r-lg">
//             <div className="flex justify-between items-center">
//               <span>{error}</span>
//               <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold text-xl">×</button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {loading ? (
//           <div className="flex items-center justify-center h-96">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//               <p className="text-lg text-gray-600">Loading tickets...</p>
//             </div>
//           </div>
//         ) : view === 'tickets' ? (
//           // Tickets List View
//           <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//             {/* Filter Tabs */}
//             <div className="border-b border-gray-200 p-6">
//               <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 max-w-md">
//                 {['all', 'open', 'closed'].map((status) => (
//                   <button
//                     key={status}
//                     onClick={() => setFilter(status as any)}
//                     className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors ${
//                       filter === status
//                         ? 'bg-white text-blue-600 shadow-sm'
//                         : 'text-gray-600 hover:text-gray-900'
//                     }`}
//                   >
//                     {status.charAt(0).toUpperCase() + status.slice(1)}
//                     <span className="ml-2 text-xs">
//                       ({status === 'all' ? tickets.length : tickets.filter(t => t.status === status).length})
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Tickets Grid */}
//             <div className="p-6">
//               {filteredTickets.length === 0 ? (
//                 <div className="text-center py-12">
//                   <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
//                   <h3 className="text-lg font-medium text-gray-900 mb-2">No {filter === 'all' ? '' : filter} tickets found</h3>
//                   <p className="text-gray-500">When users submit support requests, they'll appear here.</p>
//                 </div>
//               ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {filteredTickets.map((ticket) => (
//                     <div
//                       key={ticket.ticket_id}
//                       onClick={() => handleTicketSelect(ticket.ticket_id)}
//                       className="group p-6 border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 hover:shadow-md"
//                     >
//                       <div className="flex justify-between items-start mb-4">
//                         <span className="font-mono text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
//                           #{ticket.ticket_id.slice(-8)}
//                         </span>
//                         <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusStyle(ticket.status)}`}>
//                           {getStatusIcon(ticket.status)}
//                           <span>{ticket.status}</span>
//                         </div>
//                       </div>
                      
//                       <div className="flex items-center space-x-2 mb-3">
//                         <User size={16} className="text-gray-400" />
//                         <p className="text-sm font-medium text-gray-900">
//                           {ticket.created_by}
//                         </p>
//                       </div>
                      
//                       <div className="flex items-center space-x-2 mb-4">
//                         <Clock size={16} className="text-gray-400" />
//                         <p className="text-sm text-gray-500">
//                           {new Date(ticket.created_at).toLocaleDateString()} at {new Date(ticket.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                         </p>
//                       </div>
                      
//                       <p className="text-sm text-gray-600 line-clamp-3 mb-4 leading-relaxed">
//                         {ticket.last_message || 'No messages yet'}
//                       </p>
                      
//                       <div className="flex justify-between items-center">
//                         <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-md">
//                           {ticket.message_count} message{ticket.message_count !== 1 ? 's' : ''}
//                         </span>
//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             updateTicketStatus(ticket.ticket_id, ticket.status === 'open' ? 'closed' : 'open');
//                           }}
//                           className="text-sm px-4 py-2 rounded-md bg-white border border-gray-300 hover:bg-gray-50 transition-colors group-hover:border-blue-300"
//                         >
//                           {ticket.status === 'open' ? 'Close' : 'Reopen'}
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>
//         ) : (
//           // Chat View
//           <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//             {/* Ticket Info Sidebar */}
//             {selectedTicketData && (
//               <div className="lg:col-span-1">
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4">Ticket Details</h3>
                  
//                   <div className="space-y-4">
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Ticket ID</label>
//                       <p className="font-mono text-sm text-gray-900">#{selectedTicketData.ticket_id.slice(-8)}</p>
//                     </div>
                    
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Customer</label>
//                       <p className="text-sm text-gray-900">{selectedTicketData.created_by}</p>
//                     </div>
                    
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Status</label>
//                       <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(selectedTicketData.status)} mt-1`}>
//                         {getStatusIcon(selectedTicketData.status)}
//                         <span>{selectedTicketData.status}</span>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Created</label>
//                       <p className="text-sm text-gray-900">
//                         {new Date(selectedTicketData.created_at).toLocaleDateString()}<br />
//                         {new Date(selectedTicketData.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
//                       </p>
//                     </div>
                    
//                     <div>
//                       <label className="text-sm font-medium text-gray-500">Messages</label>
//                       <p className="text-sm text-gray-900">{selectedTicketData.message_count}</p>
//                     </div>
//                   </div>
                  
//                   <div className="mt-6">
//                     <button
//                       onClick={() => updateTicketStatus(selectedTicket!, selectedTicketData.status === 'open' ? 'closed' : 'open')}
//                       className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
//                         selectedTicketData.status === 'open' 
//                           ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
//                           : 'bg-blue-600 text-white hover:bg-blue-700'
//                       }`}
//                     >
//                       {selectedTicketData.status === 'open' ? 'Close Ticket' : 'Reopen Ticket'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Chat Area */}
//             <div className="lg:col-span-3">
//               <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex flex-col">
//                 {/* Messages */}
//                 <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
//                   {messages.length === 0 ? (
//                     <div className="text-center py-12">
//                       <MessageCircle size={48} className="mx-auto text-gray-400 mb-4" />
//                       <h3 className="text-lg font-medium text-gray-900 mb-2">No messages yet</h3>
//                       <p className="text-gray-500">Start the conversation by sending a message below.</p>
//                     </div>
//                   ) : (
//                     <>
//                       {messages.map((msg, idx) => (
//                         <div key={msg.id || idx} className={`flex ${msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'}`}>
//                           <div className={`max-w-lg px-4 py-3 rounded-lg shadow-sm ${
//                             msg.sender_type === 'admin'
//                               ? 'bg-blue-600 text-white'
//                               : 'bg-white text-gray-800 border border-gray-200'
//                           }`}>
//                             <div className="flex items-center space-x-2 mb-2">
//                               <span className="font-medium text-sm opacity-75">
//                                 {msg.sender}
//                               </span>
//                               {msg.sender_type === 'admin' && (
//                                 <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded">Admin</span>
//                               )}
//                             </div>
//                             <div className="text-sm leading-relaxed">
//                               {msg.text}
//                             </div>
//                             <div className="text-xs mt-2 opacity-60">
//                               {new Date(msg.timestamp).toLocaleTimeString([], {
//                                 hour: '2-digit',
//                                 minute: '2-digit'
//                               })}
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                       <div ref={messagesEndRef} />
//                     </>
//                   )}
//                 </div>

//                 {/* Reply Input */}
//                 {selectedTicketData && selectedTicketData.status === 'open' && (
//                   <div className="border-t border-gray-200 p-6 bg-white">
//                     <div className="flex space-x-3">
//                       <textarea
//                         value={replyText}
//                         onChange={(e) => setReplyText(e.target.value)}
//                         onKeyPress={handleKeyPress}
//                         placeholder="Type your reply..."
//                         className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                         rows={3}
//                         disabled={sendingMessage}
//                       />
//                       <button
//                         onClick={sendReply}
//                         disabled={!replyText.trim() || sendingMessage}
//                         className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
//                       >
//                         {sendingMessage ? (
//                           <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         ) : (
//                           <Send size={18} />
//                         )}
//                         <span>{sendingMessage ? 'Sending...' : 'Send'}</span>
//                       </button>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-2">
//                       Press Enter to send, Shift+Enter for new line
//                     </p>
//                   </div>
//                 )}

//                 {/* Closed Ticket Notice */}
//                 {selectedTicketData && selectedTicketData.status === 'closed' && (
//                   <div className="border-t border-gray-200 p-6 bg-gray-50">
//                     <div className="text-center">
//                       <CheckCircle size={24} className="mx-auto text-gray-400 mb-3" />
//                       <h3 className="text-lg font-medium text-gray-900 mb-2">This ticket is closed</h3>
//                       <p className="text-sm text-gray-600 mb-4">No new messages can be sent to this ticket.</p>
//                       <button
//                         onClick={() => updateTicketStatus(selectedTicket!, 'open')}
//                         className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                       >
//                         Reopen Ticket
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };




