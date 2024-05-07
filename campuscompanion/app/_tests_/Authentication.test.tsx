/**
 * Test suite for the LoginPage component in a Next.js environment.
 * LoginPage.test.tsx
 * @author Sanjit Verma
 */

import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../app/pages/auth/page';

/**
 * Mock the useRouter hook from 'next/navigation' to avoid actual navigation
 */
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    events: {
      on: jest.fn(),
      off: jest.fn()
    },
    beforePopState: jest.fn(),
    prefetch: jest.fn()
  })
}));

describe('LoginPage Component', () => {
  it('renders the email input', () => {
    render(<LoginPage />);
    expect(screen.getByPlaceholderText('University Email')).toBeInTheDocument();
  });

  // Tests if the login button is rendered with the correct initial styling.
  it('renders the login button with initial color', () => {
    render(<LoginPage />);
    const loginButton = screen.getByRole('button');
    expect(loginButton).toHaveStyle('background-color: #848273');
  });

  it('displays error message on invalid email submission', () => {
    render(<LoginPage />);
    fireEvent.change(screen.getByPlaceholderText('University Email'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('Please login with your NC State Email')).toBeInTheDocument();
  });
});