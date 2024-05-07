import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SupportPage from '../app/pages/mainSettings/contactSupport/page';
import axios from 'axios';

// Mocking modules
jest.mock('axios');
global.fetch = jest.fn();

beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  
    // Reset fetch to a mocked state before each test
    // Reset fetch to a mocked state before each test
    global.fetch = jest.fn(() =>
        Promise.resolve(new Response(JSON.stringify({ success: true })))
    );
  });

describe('ContactSupport Page', () => {
  it('renders correctly', () => {
    render(<SupportPage />);
    expect(screen.getByPlaceholderText('Enter Message')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
  });

  it('shows notification on successful email send', async () => {
    global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      });
    render(<SupportPage />);
    const input = screen.getByPlaceholderText('Enter Message');
    const sendButton = screen.getByText('Send');

    await userEvent.type(input, 'Test message');
    userEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Email Sent Successfully')).toBeInTheDocument();
    });
  });

  it('shows error notification on email send failure', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Failed to send email'));
    render(<SupportPage />);
    const input = screen.getByPlaceholderText('Enter Message');
    const sendButton = screen.getByText('Send');

    await userEvent.type(input, 'Test message');
    userEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to send email. Please try again.')).toBeInTheDocument();
    });
  });

  it('prevents sending an empty message', async () => {
    render(<SupportPage />);
    const sendButton = screen.getByText('Send');
    userEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Enter Message!')).toBeInTheDocument();
    });
  });
});