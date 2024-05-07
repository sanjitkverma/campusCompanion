import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import * as React from 'react';
import SettingsLayout from '../app/pages/mainSettings/layout';
import { mock } from 'node:test';

// Mock data for authenticated user
const mockUserData = {
  unity_id: 'user123',
  student_id: '123456',
  first_name: 'John',
  last_name: 'Doe',
  academic_standing: 'Senior',
  credits: '120',
  career_type: 'Bachelors',
  minor: 'Computer Science',
  major: 'Computer Science',
  concentration: 'Artificial Intelligence',
  transcript: [],
};
jest.mock('axios', () => ({
    get: jest.fn().mockResolvedValue({ data: mockUserData }),
    put: jest.fn()
  }));
  
  // Mocking Next.js router
  jest.mock('next/router', () => ({
    useRouter: jest.fn()
  }));
  
  // Mocking next/navigation
  jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: jest.fn(),
    }),
    usePathname: () => '/pages/mainSettings'
  }));
describe('SettingsLayout', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    (axios.get as jest.Mock).mockResolvedValue({ data: mockUserData });
  });

  it('renders all options correctly', async () => {
    render(<SettingsLayout><></></SettingsLayout>);
    expect(screen.getByText('Edit Transcript')).toBeInTheDocument();
    expect(screen.getByText('Upload Syllabus')).toBeInTheDocument();
    expect(screen.getByText('Contact Support')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('Academic Standing')).toBeInTheDocument();
    expect(screen.getByText('Credits')).toBeInTheDocument();
    expect(screen.getByText('Career')).toBeInTheDocument();
    expect(screen.getByText('Minor(s)')).toBeInTheDocument();
    expect(screen.getByText('Major(s)')).toBeInTheDocument();
    expect(screen.getByText('Concentration')).toBeInTheDocument();
    expect(screen.getByText('Update Info')).toBeInTheDocument();
  })
  it('renders the correct options', async () => {
    render(<SettingsLayout><></></SettingsLayout>);
    const careerDropdown = screen.getByText('Career');
    expect(careerDropdown).toBeInTheDocument();
    const options = await waitFor(() => screen.findAllByRole('option'));
    expect(options).toHaveLength(17);
  })

  // Add more tests as needed...
  it('fetches and displays user data correctly', async () => {
    render(<SettingsLayout><></></SettingsLayout>);


    await waitFor(() => expect(axios.get).toHaveBeenCalled());

  // Assuming axios.get is the first call you want to inspect
    const mockResult = (axios.get as jest.Mock).mock.results[0].value;
    const resolvedValue = await mockResult;
    console.log(resolvedValue); // This should now log the actual mock data

    // Example assertion (adjust according to your actual UI elements)
    const nameInput = await screen.findByDisplayValue('120');

    // Assertions
    expect(nameInput).toBeInTheDocument();

    const academicStandingInput = await screen.findByDisplayValue('Senior');
    expect(academicStandingInput).toBeInTheDocument();
  });
  it('updates the state when the Credits input field changes', async () => {
    render(<SettingsLayout><></></SettingsLayout>);
    const allInputs = screen.getAllByRole('textbox');
    const creditsInput = allInputs[1]; // Assuming the credits input is the third textbox

    // Simulate user changing the value of the Credits input
    fireEvent.change(creditsInput, { target: { value: '100' } });

    // Optionally, if your component has a submit button or similar, you might want to simulate that click
    // const updateButton = screen.getByRole('button', { name: /Update Info/i });
    // fireEvent.click(updateButton);

    // Assert that the Credits input's value has changed
    // Note: This assumes the input is controlled and updates its displayed value based on state
        // Cast creditsInput to HTMLInputElement to access the value property
    expect((creditsInput as HTMLInputElement).value).toBe('100');
  });

  it('updates the state when the Credits input field changes', async () => {
    render(<SettingsLayout><></></SettingsLayout>);
    const allInputs = screen.getAllByRole('textbox');
    const creditsInput = allInputs[1]; // Assuming the credits input is the third textbox

    // Simulate user changing the value of the Credits input
    fireEvent.change(creditsInput, { target: { value: '100' } });
    const submitButton = screen.getByRole('button', { name: /Update Info/i });
    fireEvent.click(submitButton);
    await waitFor(() => expect(axios.put).toHaveBeenCalledWith(
        "https://localhost/api/api/users/updateCredits",
        { credits: 100 }, // Note the number type for credits
        { headers: { "X-SHIB_UID": "" } } // Including the expected headers
      ));
  });
//   it('displays a success message when the update is successful', async () => {
//     // Mock axios.put to resolve successfully for this test case
//     (axios.put as jest.Mock).mockResolvedValueOnce({ data: mockUserData });
  
//     render(<SettingsLayout><></></SettingsLayout>);
  
//     // Assuming there's a form with an "Update Info" button that triggers the update
//     const updateButton = screen.getByRole('button', { name: 'Update Info' });
//     fireEvent.click(updateButton);
  
//     // Wait for the success message to appear in the DOM
//     await waitFor(() => {
//         expect(screen.getByText('Data updated successfully')).toBeInTheDocument();
//       });
//   });
});

