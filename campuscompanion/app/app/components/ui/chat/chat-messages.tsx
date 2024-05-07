"use client";
import React from "react";
import { useEffect, useRef } from "react";
import ChatItem from "./chat-item";

export interface Message {
  id: string;
  content: string;
  role: string;
}

/**
 * This component is responsible for displaying the chat messages.
 */
export default function ChatMessages({
  messages,
  isLoading,
  reload,
  stop,
}: {
  messages: Message[];
  isLoading?: boolean;
  stop?: () => void;
  reload?: () => void;
}) {
  const scrollableChatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollableChatContainerRef.current) {
      scrollableChatContainerRef.current.scrollTop =
        scrollableChatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  return (
    <div className="w-full p-4 bg-white rounded-xl shadow-xl" style={{ height: '83.5vh', backgroundColor: '#141618' }}>
      <div
        className="flex flex-col gap-5 overflow-auto"
        style={{ maxHeight: '100%',  }}
        ref={scrollableChatContainerRef}
      >
        {messages.length === 0 ? (
          <div style={{ color: 'white', textAlign: 'center', paddingTop: '90px', fontSize: '50px', fontFamily: "'Courier New', Monaco, monospace" }}>
          <p>Campus Companion</p>
          <img src="/ncstate-brick-2x1-red-max.png" alt="NC STATE UNIVERSITY" style={{ display: 'block', marginLeft: 'auto', marginRight: 'auto', width: '200px', height: 'auto', marginTop: '40px' }}/>
          <p style={{ fontSize: '20px', color: 'white', paddingTop: '40px', fontFamily: "'Courier New', Monaco, monospace" }}>How can I assist today?</p>
        </div>
          
        ) : (
          messages.map((m: Message) => (
            <ChatItem key={m.id} {...m} />
          ))
        )}
      </div>
    </div>
  );
}
