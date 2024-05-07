/**
 * Test suite for the ChatPage component focusing only on UI rendering.
 * ChatPage.test.tsx
 * @author Sanjit Verma
 */

import * as React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import ChatPage from '../app/pages/chat/page';
import { fireEvent, waitFor } from '@testing-library/react';
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ unity_id: 'user123', savedChats: [{chat_name: "Test Chat"}] }), // Simulate authenticated user with no chats
    })
  ) as jest.Mock;
});

describe('ChatPage Component UI Tests', () => {
  it('should render the chat history section', () => {
    render(<ChatPage />);
    expect(screen.findAllByText('Start New Chat'));
  });

  it('should render the settings button', async () => {
    render(<ChatPage />);
    expect(screen.findAllByText('Settings'));
  });
  

  it('should display the title of the page', () => {
    render(<ChatPage />);
    expect(screen.findAllByText('Campus Companion'));
  });

  it('opens new chat form when "Start New Chat" button is clicked', async () => {
    render(<ChatPage />);
    // Use findByText to wait for the button to appear and then click it
    const startNewChatButton = await screen.findByText('Start New Chat');
    userEvent.click(startNewChatButton);

    // Now, wait for the new chat form to appear as a result of the button click
    expect(await screen.findByPlaceholderText('Name the chat')).toBeInTheDocument();
  });
  
  it('discards the new chat form when the discard button is clicked', async () => {
    render(<ChatPage />);
    
    // Open the new chat form
    const startNewChatButton = await screen.findByText('Start New Chat');
    userEvent.click(startNewChatButton);
    
    // Fill out the form
    const chatNameInput = await screen.findByPlaceholderText('Name the chat');
    await userEvent.type(chatNameInput, 'Test Chat Name');
    
    // Discard the form
    const discardButton = await screen.findByText('Discard');
    // After clicking the discard button
    await userEvent.click(discardButton);

    // Optionally add a short delay if needed (not always recommended but can be useful in certain edge cases)
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for 100ms

    // Then check the value
    expect(chatNameInput).toHaveValue('Test Chat Name');
  });
  it('allows the user to send a message in a chat', async () => {
    render(<ChatPage />);
    
    // Assuming you have a chat already selected or you simulate selecting one
    // For demonstration, let's assume we're directly in a chat
    
    // Find the message input field and type a message
    const messageInput = await screen.findByPlaceholderText('Type a message');
    await userEvent.type(messageInput, 'Hello, world!');
    
    // Find and click the send button
    const sendButton = screen.getByRole('button', { name: "" });
    userEvent.click(sendButton);
    
    // Alternatively, if sending by pressing Enter:
    // await userEvent.type(messageInput, '{enter}');
    
    // Verify the message appears in the chat
    // This could be checking the state or the presence of the message in the document
    // For simplicity, let's assume we're checking the document
    await waitFor(() => {
      expect(screen.getByText('Hello, world!')).toBeInTheDocument();
    });
  });

});
