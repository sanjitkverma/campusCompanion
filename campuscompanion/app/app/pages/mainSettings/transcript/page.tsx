// @ts-nocheck
'use client';
import { useRouter } from 'next/navigation';
import '../chatpage.css';
import SettingsLayout from '../layout';
import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';


/**
 * This page is responsible for displaying the user's transcript.
 * It allows users to view their transcript, add semesters, and add courses to each semester.
 * The transcript data is stored in the user's profile.
 * The user can add semesters and courses to their transcript.
 * The user can also delete semesters and courses from their transcript.
 * The user can view their transcript with the courses they have added.
 * 
 * @author Sarvesh Soma
 */
const TranscriptPage: React.FC = () => {
  const isInitialRender = useRef(true);
  const [userData, setUserData] = useState({
    unity_id: '',
    student_id: '',
    first_name: '',
    last_name: '',
    academic_standing: '',
    credits: '',
    career_type: '',
    minor: '',
    major: '',
    concentration: '',
    transcript: [],
    syllabi: [],
  });
  const [semesters, setSemesters] = useState([]);
  const [showAddSemester, setShowAddSemester] = useState(false);
  const [courseList, setCourseList] = useState([]);
  const [newSemester, setNewSemester] = useState({ type: '', year: '', courses: [] });
  const [newCourses, setNewCourses] = useState({});
  const [newCourse, setNewCourse] = useState({ code: '', number: '', name: '', grade: '', credits: '' });
  const [openDropdowns, setOpenDropdowns] = useState({});
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [notificationError, setNotificationError] = useState(false);
  const validSemesterTypes = ['fall', 'spring', 'summer i', 'summer ii'];

  // Function to toggle the dropdown for a specific semester
  const toggleDropdown = (index) => {
    const element = document.getElementById(`dropdown-content-${index}`);
    if (element) {
      element.style.display = element.style.display === 'block' ? 'none' : 'block';
    }
    const isOpen = !!openDropdowns[index];
    setOpenDropdowns({
      ...openDropdowns,
      [index]: !isOpen,
    });
  };

  // Function to add a semester
  const addSemester = async () => {
    const currentYear = new Date().getFullYear();
    const year = parseInt(newSemester.year);

    if (!/^\d{4}$/.test(newSemester.year)) {
      setNotificationMessage('Year must be a 4 digit number');
      setNotificationError(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    if (year <= 0 || year.toString().startsWith('0') || year < 1887) {
      setNotificationMessage('Year must occur after 1887');
      setNotificationError(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    if (year > currentYear) {
      setNotificationMessage('Year cannot be in the future');
      setNotificationError(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    if (newSemester.type === '') {
      setNotificationMessage('Semester Type cannot be empty');
      setNotificationError(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    
    if (!validSemesterTypes.includes(newSemester.type.toLowerCase())) {
      setNotificationMessage('Must be Summer I, Summer II, Fall, or Spring');
      setNotificationError(true);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 3000);
      return;
    }

    setSemesters(prevSemesters => [...prevSemesters, newSemester]);
    setShowAddSemester(false);
    setNewSemester({ type: '', year: '', courses: [] });
    setNotificationMessage('Semester added successfully');
    setNotificationError(false);
    setShowNotification(true);
    
  };

  // Function to add a course to a semester
  const addCourse = async (semesterIndex: number) => {
    const updatedSemesters = [...semesters];
    const courseToAdd = newCourses[semesterIndex];

    if (!courseToAdd) return;

    // Validate curriculum code
    if (!/^[A-Za-z]{3,4}$/.test(courseToAdd.code)) {
        setNotificationMessage('Curriculum code must be a 3-4 letter code');
        setNotificationError(true);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        return;
    }

    // Validate course code
    if (!/^\d{3}$/.test(courseToAdd.number)) {
        setNotificationMessage('Course code must be a 3 digit number.');
        setNotificationError(true);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        return;
    }

    // Validate course name
    if (!/^[A-Za-z\s]+$/.test(courseToAdd.name)) {
        setNotificationMessage('Course name should only contain letters.');
        setNotificationError(true);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        return;
    }

    // Validate grade
    const validGrades = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'D-', 'F'];
    if (!validGrades.includes(courseToAdd.grade.toUpperCase())) {
        setNotificationMessage('Grade must be a valid letter grade (e.g., A, A-, B+)');
        setNotificationError(true);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        return;
    }

    // Validate credits
    const credits = parseInt(courseToAdd.credits);
    if (!credits || credits < 1 || credits > 6) {
        setNotificationMessage('Credits must be a positive number between 1 and 6');
        setNotificationError(true);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 3000);
        return;
    }

    // Add course if all validations pass
    updatedSemesters[semesterIndex].courses.push(courseToAdd);
    setSemesters(updatedSemesters);
    setNewCourses({
        ...newCourses,
        [semesterIndex]: { code: '', number: '', name: '', grade: '', credits: '' }
    });
    setNotificationMessage('Course added successfully.');
    setNotificationError(false);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
};

  // Function to delete a course
  const deleteCourse = (semesterIndex, courseIndex) => {
    const updatedSemesters = [...semesters];
    updatedSemesters[semesterIndex].courses.splice(courseIndex, 1);
    setSemesters(updatedSemesters);
    updateTranscript(updatedSemesters);
  };

  // Function to delete a semester
  const deleteSemester = (semesterIndex) => {
    const updatedSemesters = [...semesters];
    updatedSemesters.splice(semesterIndex, 1);
    setSemesters(updatedSemesters);
    updateTranscript(updatedSemesters);
  };

  // Function to update the transcript
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
    } else {
      console.log("Effect running, semesters.length:", semesters.length);
      if (semesters.length > 0) {
        updateTranscript(semesters);
      }
    }
  }, [semesters]);

  // Function to fetch the user data
  useEffect(() => {
    if (userData.transcript.length > 0) {
      setSemesters(userData.transcript);
    }
  }, [userData.transcript]);

  // Function to update the transcript
  const updateTranscript = async (semesters) => {
    console.log("semesters", semesters);
    try {
      const response = await axios.put(
        'https://localhost/api/api/users/updateTranscript',
        { transcript: semesters },
        {
          headers: {
            'X-SHIB_UID': userData.unity_id,
          },
        }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error('Error updating trasncript:', error);

    };
  }
  // Function to fetch the user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://localhost/api/api/users/current', {
          headers: {
          },
        });
        if (response.data) {
          console.log(response.data);
          setUserData(response.data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className='transcript-page'>
      <div className="title-bar">
        <h1 className="profileHeader">Transcript</h1>
      </div>
      <div>
        {showNotification && (
          <div className={`notification ${notificationError ? 'error-notification' : 'success-notification'}`}>
            {notificationMessage}
            <div className="timer-bar"></div>
          </div>
        )}
        <div className='buttonContainer'>
          <button className="grayButton" onClick={() => setShowAddSemester(true)} style={{ marginBottom: '10px' }}>Add Semester</button>
        </div>

        {semesters.map((semester, index) => (
          <div key={index}>
            <button className='semester-title' onClick={() => toggleDropdown(index)}>
              <span className="button-text">{semester.type} {semester.year}</span>
              <div className="icons-container">
                <span className={`caret ${openDropdowns[index] ? 'up' : ''}`}>▼</span>
                <span className="trash-can" onClick={(e) => { e.stopPropagation(); deleteSemester(index); }}>🗑️</span>
              </div>
            </button>

            <div id={`dropdown-content-${index}`} className="dropdown-content">
              {semester.courses?.map((course, courseIndex) => (
                <div key={courseIndex} className="course-info">
                  <span className="course-code-number">{`${course.code} ${course.number}`}</span>
                  <span className="course-name">{course.name}</span>
                  <span className="course-grade">Grade: {course.grade}</span>
                  <span className="course-credits">Credits: {course.credits}</span>
                  <div className="icons-container">
                    <span className="trash-can" onClick={() => deleteCourse(index, courseIndex)}>🗑️</span>
                  </div>
                </div>
              ))}
              <div className="course-info">
                <input type="text" placeholder="Curriculum" value={newCourses[index]?.code || ''} onChange={(e) => setNewCourses({ ...newCourses, [index]: { ...newCourses[index], code: e.target.value } })} />
                <input type="number" placeholder="Course Code" value={newCourses[index]?.number || ''} onChange={(e) => setNewCourses({ ...newCourses, [index]: { ...newCourses[index], number: e.target.value } })} />
                <input type="text" placeholder="Course Name" value={newCourses[index]?.name || ''} onChange={(e) => setNewCourses({ ...newCourses, [index]: { ...newCourses[index], name: e.target.value } })} />
                <input type="text" placeholder="Grade" value={newCourses[index]?.grade || ''} onChange={(e) => setNewCourses({ ...newCourses, [index]: { ...newCourses[index], grade: e.target.value } })} />
                <input type="number" placeholder="Credits" value={newCourses[index]?.credits || ''} onChange={(e) => setNewCourses({ ...newCourses, [index]: { ...newCourses[index], credits: e.target.value } })} />
                <button onClick={() => addCourse(index)}>+</button>
              </div>
            </div>

          </div>
        ))}


        {showAddSemester && (
          <div className="add-semester-form">
            <input className='field-input' type="text" placeholder="Semester Type" value={newSemester.type} onChange={(e) => setNewSemester({ ...newSemester, type: e.target.value })} />
            <input className='field-input' type="number" placeholder="Year" value={newSemester.year} onChange={(e) => setNewSemester({ ...newSemester, year: e.target.value })} />
            <button className='submit-button' onClick={addSemester}>Save Semester</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TranscriptPage;

