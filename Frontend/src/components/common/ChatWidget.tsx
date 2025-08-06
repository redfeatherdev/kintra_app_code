// import React, { useState } from 'react';
// import SupportChat from '../../pages/SupportChat/SupportChat';
// import { IoChatbubblesOutline } from 'react-icons/io5';

// const ChatWidget = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const dummyTicketId = 'demo-ticket-id'; // Replace with real ticket ID logic
//   const currentUser = 'Admin'; // Replace with logged-in username/email

//   return (
//     <div className="fixed bottom-6 right-6 z-50">
//       {isOpen && (
//         <div className="w-96 h-[28rem] bg-white shadow-xl rounded-lg border border-gray-300 overflow-hidden">
//           <div className="flex justify-between items-center p-2 bg-blue-600 text-white">
//             <h3 className="text-lg font-semibold">Support Chat</h3>
//             <button onClick={() => setIsOpen(false)} className="text-white font-bold text-xl">&times;</button>
//           </div>
//           <div className="h-full overflow-hidden p-2">
//             <SupportChat ticketId={dummyTicketId} currentUser={currentUser} />
//           </div>
//         </div>
//       )}

//       {!isOpen && (
//         <button
//           onClick={() => setIsOpen(true)}
//           className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
//         >
//           <IoChatbubblesOutline className="text-2xl" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default ChatWidget;
