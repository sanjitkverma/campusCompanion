// @ts-nocheck
import React from 'react';
import ChatAvatar from './ui/chat/chat-avatar'; 
import styles from './ChatSection.module.css';

// @ts-ignore
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-US');
};
// @ts-ignore
//This component is responsible for displaying the chat history and the messages.
const ChatHistory = ({ messages }) => {
  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-xl" style={{ height: '90.5vh', backgroundColor: '#141618', overflowY: 'auto' }}>
      {messages.map((msg, index) => (
        <div key={index} className="flex items-start gap-4 pt-5">
          <ChatAvatar role={msg.sender_id} /> 
          <div>
            <p style={{ color: 'rgba(255, 0, 0, 0.9)', fontFamily: 'Lucida Console, Monaco, monospace' }}>
              {msg.sender_id === 'user' ? 'You' : 'Tuffy'}
              <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '0.8rem', fontFamily: 'Lucida Console, Monaco, monospace', paddingLeft: 10, opacity: 0.3  }}>
                {formatDate(msg.timestamp)}
              </span>
            </p>
            <p style={{ color: 'white' }} className="break-words">
              {msg.message}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};


export default ChatHistory;
