import React, { useEffect, useState, useRef } from 'react';
import { MessageCircle, X, Send, Minimize2, User, Headphones } from 'lucide-react';

interface SupportChatProps {
  currentUser: string;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  timestamp: string;
  sender_type: string;
}

interface Ticket {
  ticket_id: string;
  status: string;
}

const SupportChatWidget: React.FC<SupportChatProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState('');
  const [hasActiveTicket, setHasActiveTicket] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = 'http://64.225.53.112:5000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchOrCreateTicket = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/support/user/${currentUser}/tickets`);
      const tickets = await res.json();
      let ticket = tickets?.[0];

      if (!ticket) {
        const createRes = await fetch(`${API_BASE_URL}/api/v1/support/tickets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: currentUser }),
        });
        const createData = await createRes.json();
        ticket = { ticket_id: createData.ticket_id };
      }

      setTicketId(ticket.ticket_id);
      setHasActiveTicket(true);
      await fetchMessages(ticket.ticket_id);
    } catch (err) {
      console.error(err);
      setError('Failed to load chat');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (tId = ticketId) => {
    if (!tId) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/support/tickets/${tId}/messages`);
      const data = await res.json();
      setMessages(data);
      if (!isOpen) {
        const newMsgs = data.filter((msg: Message) => msg.sender_type === 'admin');
        setUnreadCount((prev) => prev + newMsgs.length);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!isOpen || !hasActiveTicket || !ticketId) return;
    const interval = setInterval(() => fetchMessages(), 3000);
    return () => clearInterval(interval);
  }, [isOpen, hasActiveTicket, ticketId]);

  const sendMessage = async () => {
    if (!text.trim() || !ticketId || !currentUser) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/support/tickets/${ticketId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sender: currentUser, text }),
      });
      setText('');
      await fetchMessages();
    } catch (err) {
      console.error(err);
      setError('Failed to send message');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const openChat = () => {
    setIsOpen(true);
    setUnreadCount(0);
    if (!hasActiveTicket) fetchOrCreateTicket();
  };

  const closeChat = () => {
    setIsOpen(false);
    setIsMinimized(false);
  };

  const toggleMinimize = () => setIsMinimized((prev) => !prev);

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={openChat}
          className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 p-4 rounded-full text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 relative"
        >
          <MessageCircle size={24} className="transition-transform group-hover:scale-110" />
          {unreadCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full min-w-6 h-6 flex items-center justify-center font-semibold animate-pulse">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        ref={chatContainerRef}
        className={`bg-white rounded-xl shadow-2xl border border-gray-200 transition-all duration-300 ${isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
          } flex flex-col overflow-hidden`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Headphones size={16} />
            </div>
            <div>
              <h4 className="font-semibold text-sm">Support Chat</h4>
              <div className="flex items-center gap-1">
                <div className={`w-2 h-2 rounded-full ${hasActiveTicket ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                <p className="text-xs opacity-90">
                  {hasActiveTicket ? 'Connected' : 'Connecting...'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={toggleMinimize}
              className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
            >
              <Minimize2 size={16} />
            </button>
            <button
              onClick={closeChat}
              className="p-1.5 hover:bg-white/20 rounded-md transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-sm">Loading messages...</span>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
                  <MessageCircle size={48} className="mb-3 opacity-50" />
                  <p className="text-sm font-medium mb-1">Welcome to Support!</p>
                  <p className="text-xs">How can we help you today?</p>
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender_type === 'admin' ? 'justify-start' : 'justify-end'}`}>
                    <div className={`flex items-start gap-2 max-w-[85%] ${msg.sender_type === 'admin' ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${msg.sender_type === 'admin'
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                        }`}>
                        {msg.sender_type === 'admin' ? <Headphones size={14} /> : <User size={14} />}
                      </div>
                      <div className={`p-3 rounded-xl text-sm leading-relaxed ${msg.sender_type === 'admin'
                        ? 'bg-white border border-gray-200 text-gray-800 rounded-tl-md'
                        : 'bg-blue-600 text-white rounded-tr-md'
                        }`}>
                        <p className="mb-1">{msg.text}</p>
                        <span className={`text-xs opacity-70 ${msg.sender_type === 'admin' ? 'text-gray-500' : 'text-blue-100'
                          }`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Error Message */}
            {error && (
              <div className="px-4 py-2 bg-red-50 border-t border-red-200">
                <p className="text-red-600 text-xs">{error}</p>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    rows={1}
                    placeholder="Type your message..."
                    style={{ minHeight: '40px', maxHeight: '120px' }}
                  />
                </div>
                <button
                  onClick={sendMessage}
                  disabled={!text.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white p-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center"
                >
                  <Send size={16} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Press Enter to send, Shift+Enter for new line</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SupportChatWidget;







// import React, { useEffect, useState, useRef } from 'react';
// import { MessageCircle, X, Send, Minimize2, Maximize2 } from 'lucide-react';

// interface SupportChatProps {
//   currentUser: string;
// }

// interface Message {
//   id: string;
//   sender: string;
//   text: string;
//   timestamp: string;
//   sender_type: string;
// }

// interface Ticket {
//   ticket_id: string;
//   status: string;
// }

// const SupportChatWidget: React.FC<SupportChatProps> = ({ currentUser }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isMinimized, setIsMinimized] = useState(false);
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [text, setText] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [ticketId, setTicketId] = useState('');
//   const [hasActiveTicket, setHasActiveTicket] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const messagesEndRef = useRef<HTMLDivElement>(null);
//   const chatContainerRef = useRef<HTMLDivElement>(null);

//   const API_BASE_URL = 'http://64.225.53.112:5000';

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const fetchOrCreateTicket = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/v1/support/user/${currentUser}/tickets`);
//       const tickets = await res.json();
//       let ticket = tickets?.[0];

//       if (!ticket) {
//         const createRes = await fetch(`${API_BASE_URL}/api/v1/support/tickets`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ user_id: currentUser }),
//         });
//         const createData = await createRes.json();
//         ticket = { ticket_id: createData.ticket_id };
//       }

//       setTicketId(ticket.ticket_id);
//       setHasActiveTicket(true);
//       await fetchMessages(ticket.ticket_id);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to load chat');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchMessages = async (tId = ticketId) => {
//     if (!tId) return;
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/v1/support/tickets/${tId}/messages`);
//       const data = await res.json();
//       setMessages(data);
//       if (!isOpen) {
//         const newMsgs = data.filter((msg: Message) => msg.sender_type === 'admin');
//         setUnreadCount((prev) => prev + newMsgs.length);
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     if (!isOpen || !hasActiveTicket || !ticketId) return;
//     const interval = setInterval(() => fetchMessages(), 3000);
//     return () => clearInterval(interval);
//   }, [isOpen, hasActiveTicket, ticketId]);

//   const sendMessage = async () => {
//     if (!text.trim() || !ticketId || !currentUser) return;
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/v1/support/tickets/${ticketId}/message`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ sender: currentUser, text }),
//       });
//       setText('');
//       await fetchMessages();
//     } catch (err) {
//       console.error(err);
//       setError('Failed to send message');
//     }
//   };

//   const handleKeyPress = (e: React.KeyboardEvent) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const openChat = () => {
//     setIsOpen(true);
//     setUnreadCount(0);
//     if (!hasActiveTicket) fetchOrCreateTicket();
//   };

//   const closeChat = () => {
//     setIsOpen(false);
//     setIsMinimized(false);
//   };

//   const toggleMinimize = () => setIsMinimized((prev) => !prev);

//   if (!isOpen) {
//     return (
//       <div className="fixed bottom-6 right-6 z-50">
//         <button onClick={openChat} className="bg-blue-600 p-4 rounded-full text-white relative">
//           <MessageCircle size={24} />
//           {unreadCount > 0 && (
//             <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2">
//               {unreadCount > 9 ? '9+' : unreadCount}
//             </span>
//           )}
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed bottom-6 right-6 z-50">
//       <div
//         ref={chatContainerRef}
//         className={`bg-white rounded-lg shadow-lg w-80 h-96 flex flex-col border ${isMinimized ? 'h-14' : 'h-96'}`}
//       >
//         <div className="bg-blue-600 text-white p-3 flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <MessageCircle size={20} />
//             <div>
//               <h4 className="font-semibold text-sm">Support Chat</h4>
//               <p className="text-xs">{hasActiveTicket ? 'Connected' : 'Connecting...'}</p>
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <button onClick={toggleMinimize}><Minimize2 size={16} /></button>
//             <button onClick={closeChat}><X size={16} /></button>
//           </div>
//         </div>
//         {!isMinimized && (
//           <>
//             <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
//               {loading ? (
//                 <p className="text-center text-gray-500">Loading...</p>
//               ) : messages.length === 0 ? (
//                 <p className="text-center text-gray-400">No messages yet. Start the conversation.</p>
//               ) : (
//                 messages.map((msg, i) => (
//                   <div key={i} className={`flex ${msg.sender_type === 'admin' ? 'justify-start' : 'justify-end'}`}>
//                     <div className={`p-2 rounded-md max-w-[70%] text-sm ${msg.sender_type === 'admin' ? 'bg-gray-200' : 'bg-blue-600 text-white'}`}>
//                       <p>{msg.text}</p>
//                       <span className="text-xs block mt-1 text-gray-600">{new Date(msg.timestamp).toLocaleTimeString()}</span>
//                     </div>
//                   </div>
//                 ))
//               )}
//               <div ref={messagesEndRef} />
//             </div>
//             <div className="p-2 border-t bg-white flex items-center gap-2">
//               <textarea
//                 value={text}
//                 onChange={(e) => setText(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 className="flex-1 border rounded-md px-2 py-1 text-sm"
//                 rows={1}
//                 placeholder="Type a message..."
//               />
//               <button onClick={sendMessage} className="bg-blue-600 text-white p-2 rounded">
//                 <Send size={16} />
//               </button>
//             </div>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default SupportChatWidget;


