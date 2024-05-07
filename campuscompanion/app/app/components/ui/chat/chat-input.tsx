"use client";
import React from "react";
export interface ChatInputProps {
  /** The current value of the input */
  input?: string;
  /** An input/textarea-ready onChange handler to control the value of the input */
  handleInputChange?: (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) => void;
  /** Form submission handler to automatically reset input and append a user message  */
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  multiModal?: boolean;
}
// This component is responsible for displaying the chat input field and the send button.
export default function ChatInput(props: ChatInputProps) {
  return (
    <>
      <form
        onSubmit={props.handleSubmit}
        className="flex items-start justify-between w-full max-w-12xl p-4 rounded-xl shadow-xl gap-4"
        style={{
          backgroundColor: '#141618', 
        }}
      >
        <input
  autoFocus
  name="message"
  placeholder="Type a message"
  style={{
    width: '100%',
    paddingTop: 20,
    padding: 15,
    borderRadius: '20px',
    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: 'black', 
    color: 'white', 
    height: '50px',
    fontFamily: "'Courier New', 'Monaco', monospace",
  }}
  value={props.input}
  onChange={props.handleInputChange}
/>
        <button
  disabled={props.isLoading}
  type="submit"
  style={{
    padding: '1rem',
    color: 'white',
    backgroundColor: 'black',
    borderRadius: '20px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
    opacity: props.isLoading ? 0.5 : 1,
    cursor: props.isLoading ? 'not-allowed' : 'pointer'
    
  }}
>
<svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="feather feather-send"
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
</button>
      </form>
    </>
  );
}
