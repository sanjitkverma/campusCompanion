// At the top of your test file
jest.mock('axios');
import axios from 'axios';
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import TranscriptPage from '../app/pages/mainSettings/transcript/page';


beforeEach(() => {
    (axios.get as jest.Mock).mockResolvedValue({
        data: {
          transcript: [
            { courses:[], type: 'Fall', year: 2023 },
            { courses:[], type: 'Spring', year: 2024 },
          ],
        },
      });
      
      (axios.put as jest.Mock).mockResolvedValue({ data: { message: 'Transcript updated' } });
  });

  test('allows a user to add a semester', async () => {
    render(<TranscriptPage />);
  
    // Click the "Add Semester" button
    fireEvent.click(screen.getByText('Add Semester'));
  
    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText('Semester Type'), { target: { value: 'Fall' } });
    fireEvent.change(screen.getByPlaceholderText('Year'), { target: { value: '2023' } });
  
    // Submit the form
    fireEvent.click(screen.getByText('Save Semester'));
  
    // Wait for the semester to be added
    await waitFor(() => {
      expect(screen.getByText('Fall 2023')).toBeInTheDocument();
    });
  });
  test('allows a user to add a course to a semester', async () => {
    // Assuming the component initially renders with at least one semester
    render(<TranscriptPage />);

    const mockResult = (axios.get as jest.Mock).mock.results[0].value;
    const resolvedValue = await mockResult;
    console.log(resolvedValue);
    
    // Expand the semester dropdown to show courses
    fireEvent.click(await screen.findByText('Fall 2023')); // Adjust based on your initial data
    const curriculumInputs = screen.getAllByPlaceholderText('Curriculum');

    fireEvent.change(curriculumInputs[0], { target: { value: 'CSC' } });

    const courseCodeInputs = screen.getAllByPlaceholderText('Course Code');


    fireEvent.change(courseCodeInputs[0], { target: { value: '101' } });

    const courseNameInputs = screen.getAllByPlaceholderText('Course Name');


    fireEvent.change(courseNameInputs[0], { target: { value: 'SWE' } });

    const courseGradeInputs = screen.getAllByPlaceholderText('Grade');

    fireEvent.change(courseGradeInputs[0], { target: { value: 'A' } });

    const courseCreditsInputs = screen.getAllByPlaceholderText('Credits');

    fireEvent.change(courseCreditsInputs[0], { target: { value: '3' } });
  
    // Add more fields as necessary
  
    // Click the "+" button to add the course
    const plusIcons = screen.getAllByText('+');
    fireEvent.click(plusIcons[0]);
  
    // Wait for the course to be added
    await waitFor(() => {
      expect(screen.getByText('CSC 101')).toBeInTheDocument();
    });
  });
  test('allows a user to delete a course from a semester', async () => {
    // Assuming the component initially renders with at least one semester and one course
    render(<TranscriptPage />);
  
    // Expand the semester dropdown to show courses
    fireEvent.click(await screen.findByText('Fall 2023')); // Adjust based on your initial data
  
    // Click the delete button for the course
    fireEvent.click(screen.getAllByText('🗑️')[0]); // Adjust selector as needed
  
    // Wait for the course to be removed
    await waitFor(() => {
      expect(screen.queryByText('CSC 101')).not.toBeInTheDocument();
    });
  });