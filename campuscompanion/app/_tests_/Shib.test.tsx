import React from 'react';
import { render, waitFor } from '@testing-library/react';
import RedirectPage from '../app/shib/page';
import { useRouter } from 'next/navigation';

// Mock the Next.js router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Helper function to mock router methods
const mockRouterPush = jest.fn();

beforeEach(() => {
  (useRouter as jest.Mock).mockReturnValue({
    push: mockRouterPush,
  });
  global.fetch = jest.fn();
});

afterEach(() => {
  jest.clearAllMocks();
});

test('redirects to chat page if user is authenticated', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    json: async () => ({ unity_id: 'user123' }),
  });

  render(<RedirectPage />);

  await waitFor(() => expect(mockRouterPush).toHaveBeenCalledWith('/pages/chat'));
});

test('does not redirect if user is not authenticated', async () => {
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    json: async () => ({}), // No unity_id in response
  });

  render(<RedirectPage />);

  await waitFor(() => expect(mockRouterPush).not.toHaveBeenCalled());
});