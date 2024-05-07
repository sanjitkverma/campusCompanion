"use client";

import React from "react";
import ChatAvatar from "./chat-avatar";
import { Message } from "./chat-messages";

// This component is responsible for displaying the chat messages.
export default function ChatItem(message: Message) {
  const senderName = message.role === 'user' ? 'You' : 'Tuffy';
  // @ts-ignore
  const parseContentForLinks = (content) => {
    const regex = /(\[([^\]]+)\]\((http[s]?:\/\/[^\s]+\b)\))|(http[s]?:\/\/\S+)/g;
    // @ts-ignore
    return content.split(regex).map((part, index) => {
      if (!part) return null;
  
      let match = part.match(/\[([^\]]+)\]\((http[s]?:\/\/[^\s]+)\)/);
      if (match) {
        const text = match[1];
        const url = match[2];
        return <a href={url} key={index} style={{ color: 'blue', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">{text}</a>;
      } else if (part.match(/http[s]?:\/\/\S+/)) {
        return <a href={part} key={index} style={{ color: 'blue', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">{part}</a>;
      } else {
        return <span key={index}>{part}</span>;
      }
      // @ts-ignore
    }).filter(part => part != null); 
  };

  const messageParts = message.content.split('\n').map(part => {
    if (part.trim().startsWith('-')) {
      return { type: 'bullet', content: part.substring(1).trim() };
    } else {
      return { type: 'text', content: part.trim() };
    }
  });

  return (
    <div className="flex items-start gap-4 pt-5">
      <ChatAvatar {...message} />
      <div>
        <p style={{ color: 'rgba(255, 0, 0, 0.9)', fontFamily: 'Lucida Console, Monaco, monospace' }}>{senderName}</p>
        <div style={{ color: 'white' }}>
          {/* Render the message parts */}
          {messageParts.map((part, index) => {
            if (part.type === 'bullet') {
              // Render bullet points
              return <ul key={index}><li>{parseContentForLinks(part.content)}</li></ul>;
            } else {
              // Render text
              return <p key={index}>{parseContentForLinks(part.content)}</p>;
            }
          })}
        </div>
      </div>
    </div>
  );
}
