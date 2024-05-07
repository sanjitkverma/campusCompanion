"use client";

import Image from "next/image";
import { Message } from "./chat-messages";
import React from "react";
// This component is responsible for displaying the avatar of the user or the bot in the chat.
export default function ChatAvatar(message: Message) {
  if (message.role === "user") {
    return (
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center  bg-black text-white">
        <Image
        className="rounded-md"
        src="/graduate.png"
        alt="Student Logo"
        width={24}
        height={24}
        priority
      />
      </div>
    );
  }

  return (
    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center  bg-black text-white">
      <Image
        className="rounded-md"
        src="/wolf-head.png"
        alt="Wolf Logo"
        width={24}
        height={24}
        priority
      />
    </div>
  );
}
