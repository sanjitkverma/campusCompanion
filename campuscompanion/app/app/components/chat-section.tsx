"use client";

import { useChat } from "ai/react";
import { useMemo } from "react";
import { insertDataIntoMessages } from "./transform";
import { ChatInput, ChatMessages } from "./ui/chat";
import styles from './ChatSection.module.css';
import { useEffect, useRef } from 'react';
import React from "react";
// @ts-ignore
// This component is responsible for displaying the chat section.
export default function ChatSection({addMessage}) {

  const {
    messages,
    input,
    isLoading,
    handleSubmit: handleChatSubmit,
    handleInputChange,
    reload,
    stop,
    data,
  } = useChat({
    api: process.env.NEXT_PUBLIC_CHAT_API,
    headers: {
      "Content-Type": "application/json", // using JSON because of vercel/ai 2.2.26
    },
    onFinish: (message) => {
      addMessage({
        sender_id: message.role === 'user' ? 'user' : 'assistant',
        message: message.content,
        timestamp: message.createdAt,
      });
    },
  });
  
  const transformedMessages = useMemo(() => {
    return insertDataIntoMessages(messages, data);
  }, [messages, data]);
  // @ts-ignore
  const customHandleSubmit = (e) => {
    e.preventDefault();
    const message = {
      sender_id: 'user',
      message: input,
      timestamp: new Date().toISOString(),
    };

    addMessage(message); 

   
    handleChatSubmit(e);
  };
  
  
  return (
    <div className={styles.chatContainer}>
      <ChatMessages
        messages={transformedMessages}
        isLoading={isLoading}
        reload={reload}
        stop={stop}
      />
      <ChatInput
        input={input}
        handleSubmit={customHandleSubmit}
        handleInputChange={handleInputChange}
        isLoading={isLoading}
        multiModal={process.env.NEXT_PUBLIC_MODEL === "gpt-4-vision-preview"}
      />
    </div>
  );
}
