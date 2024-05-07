// SyllabiPage.test.tsx
import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SyllabiPage from '../app/pages/mainSettings/syllabi/page'; // Adjust the import path according to your project structure
import localForage from 'localforage';
// __mocks__/next/router.ts




// Mock localForage
import axios from 'axios';
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;


// Helper function to mock a file for input
const mockFile = (name: string, size: number, type: string) => {
  const file = new File([new ArrayBuffer(size)], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

// Mock URL.createObjectURL to return a dummy URL for our Blob
global.URL.createObjectURL = jest.fn(() => 'http://dummyurl.com/dummy.pdf');

beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();

  global.open = jest.fn();

  // Mocking fetchUserData axios call
  mockedAxios.get.mockResolvedValue({
    data: {
      unity_id: 'user123',
      syllabi: [{ name: 'test.pdf', content: 'base64pdfcontent' }],
    },
  });

  // Mocking handleAddSyllabus axios post call
  mockedAxios.post.mockResolvedValue({ status: 200 });

  // Mocking handleDeleteSyllabus axios delete call
  mockedAxios.delete.mockResolvedValue({ status: 200 });
});

test('allows a user to upload a syllabus', async () => {
    render(<SyllabiPage />);
    const file = mockFile('test.pdf', 1024, 'application/pdf');

    const uploadButton = screen.getByRole('button', { name: /Upload Syllabus/i });
    fireEvent.click(uploadButton);
  
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });
  
    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledWith(expect.any(String), expect.any(FormData), expect.any(Object)));
  });
  test('allows a user to view a PDF', async () => {
    render(<SyllabiPage />);
    const file = mockFile('test.pdf', 1024, 'application/pdf');

    const uploadButton = screen.getByRole('button', { name: /Upload Syllabus/i });
    fireEvent.click(uploadButton);
  
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => screen.getByText('test.pdf'));
    // Assuming the component renders after uploading a file
    const viewButton = screen.getByTestId('view-pdf-test.pdf');
    fireEvent.click(viewButton);
  
    await waitFor(() => expect(global.open).toHaveBeenCalledWith(expect.any(String), '_blank'));
    
  });
  test('allows a user to delete a syllabus', async () => {
    render(<SyllabiPage />);
    const file = mockFile('test.pdf', 1024, 'application/pdf');

    const uploadButton = screen.getByRole('button', { name: /Upload Syllabus/i });
    fireEvent.click(uploadButton);
  
    const fileInput = screen.getByTestId('file-input');
    fireEvent.change(fileInput, { target: { files: [file] } });
    await waitFor(() => screen.getByText('test.pdf'));
    // Assuming the component renders after uploading a file
    const deleteButton = screen.getByTestId('delete-pdf-test.pdf');
    fireEvent.click(deleteButton);
  
     // Assuming you show a message when no syllabi are present
     await waitFor(() => expect(mockedAxios.delete).toHaveBeenCalledWith(expect.stringContaining('test.pdf'), expect.any(Object)));
  });