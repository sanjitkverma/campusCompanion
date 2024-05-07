// @ts-nocheck
'use client';
import React, { useState, useEffect } from 'react';
import './chatpage.css';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation'
import axios from 'axios';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

/**
 * This component is responsible for the layout of the settings page.
 * It displays the settings options on the left side of the page and the content on the right side.
 * The settings options include Student Info, Edit Transcript, Upload Syllabus, and Contact Support.
 * The content is displayed based on the selected option.
 * The user can navigate to different settings options using the settings menu.
 * The user can also logout from the settings page.
 * The user can update their student information, including academic standing, credits, career, minor, major, and concentration.
 * 
 * @author Sanjit Verma 
 * @author Sanket Nain
 */
const SettingsLayout = ({ children }: SettingsLayoutProps) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
  });
  const [standing, setStanding] = useState('');
  const [career, setCareer] = useState('');
  const [concentration, setConcentration] = useState('');
  const [minor, setMinor] = useState('');
  const [major, setMajor] = useState('');
  const [credits, setCredits] = useState('');
  const [showError, setShowError] = useState(false);

  const [showNotification, setShowNotification] = useState(false);

  // Fetch the authentication status when the component mounts
  useEffect(() => {
    const fetchAuthStatus = async () => {
      try {
        const response = await fetch("/api/api/users/login");
        const data = await response.json();
        setIsAuth(!!data.unity_id);
      } catch (error) {
        console.error("Error fetching authentication status:", error);
      } finally {
        setIsLoading(false); 
      }
    };

    fetchAuthStatus();
  }, []);

  // Redirect to the login page if the user is not authenticated
  useEffect(() => {
    if (!isAuth && !isLoading) {
      router.push('/pages/auth'); 
    }
  }, [isAuth, isLoading, router]);

  // Fetch the user data when the component mounts
  useEffect(() => {
    setStanding(userData.academic_standing);
    setCareer(userData.career_type);
    setConcentration(userData.concentration);
    setMinor(userData.minor);
    setMajor(userData.major);
    setCredits(userData.credits);
  }, [userData]);

  // Handle the change in credits
  const handleCreditsChange = (e) => {
    const newCredits = e.target.value;
    setCredits(newCredits);
    setUserData({ ...userData, credits: newCredits });
  };

  // Update the credits in the database
  const updateCredits = async () => {
    try {
      const response = await axios.put(
        'https://localhost/api/api/users/updateCredits',
        { credits: parseInt(credits, 10) },
        {
          headers: {
            'X-SHIB_UID': userData.unity_id,
          },
        }
      );
      console.log(response.data.message);
      // Show the notification
      setShowNotification(true);
      // Hide the notification after 5 seconds
      setTimeout(() => setShowNotification(false), 5000);
    } catch (error) {
      console.error('Error updating credits:', error);
    }
  };

  // Update the academic standing in the database
  const updateAcademicStanding = async () => {
    try {
      const response = await axios.put(
        'https://localhost/api/api/users/updateAcademicStanding',
        { academic_standing: standing },
        {
          headers: {
            'X-SHIB_UID': userData.unity_id,
          },
        }
      );
      console.log(response.data.message);
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } catch (error) {
      console.error('Error updating academic standing:', error);
    }
  };

  // Update the career in the database
  const updateCareer = async () => {
    try {
      const response = await axios.put(
        'https://localhost/api/api/users/updateCareer',
        { career_type: career },
        {
          headers: {
            'X-SHIB_UID': userData.unity_id,
          },
        }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error('Error updating career:', error);
    }
  };
  // Update the minor in the database
  const updateMinor = async () => {
    try {
      const response = await axios.put(
        'https://localhost/api/api/users/updateMinor',
        { minor: minor },
        {
          headers: {
            'X-SHIB_UID': userData.unity_id,
          },
        }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error('Error updating minor:', error);
    }
  };

  // Update the major in the database
  const updateMajor = async () => {
    try {
      const response = await axios.put(
        'https://localhost/api/api/users/updateMajor',
        { major: major },
        {
          headers: {
            'X-SHIB_UID': userData.unity_id,
          },
        }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error('Error updating major:', error);
    }
  };

  // Update the concentration in the database
  const updateConcentration = async () => {
    try {
      const response = await axios.put(
        'https://localhost/api/api/users/updateConcentration',
        { concentration: concentration },
        {
          headers: {
            'X-SHIB_UID': userData.unity_id,
          },
        }
      );
      console.log(response.data.message);
    } catch (error) {
      console.error('Error updating concentration:', error);
    }
  };

  // Handle the update of student information
  const handleUpdateInfo = async () => {
    const parsedCredits = parseInt(credits, 10);
    if (isNaN(parsedCredits) || parsedCredits < 0) {
      setShowError(true);
      setTimeout(() => setShowError(false), 5000); 
      return;
    }
  
    try {
      await updateCredits(); // Update credits
      await updateAcademicStanding(); // Update academic standing
      await updateCareer(); // Update career
      await updateMinor(); // Update minor
      await updateMajor(); // Update major
      await updateConcentration(); // Update concentration
  
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
    } catch (error) {
      console.error('Error updating user information:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };
  // Handle the settings button click
  const pathname = usePathname();
  const handleSettings = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.location.href = '/pages/chat';
  };
  // Handle the logout button click
  const handleLogout = async () => {
    window.location.href = '/pages/auth';
  };
  // Handle the transcript button click
  const handleTranscript = () => {
    window.location.href = '/pages/mainSettings/transcript';
  }

  // Handle the profile button click
  const handleProfile = () => {
    window.location.href = '/pages/mainSettings';
  }
  // Handle the syllabus button click
  const handleSyllabus = () => {
    window.location.href = '/pages/mainSettings/syllabi';
  }
  // Handle the support button click
  const handleSupport = () => {
    window.location.href = '/pages/mainSettings/contactSupport'
  }

  // Fetch the user data when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://localhost/api/api/users/current', {
          headers: {
          },
        });
        if (response.data) {
          setUserData(response.data);
          setStanding(response.data.academic_standing || '');
          setMinor(response.data.minor || '');
          setMajor(response.data.major || '');
          setConcentration(response.data.concentration || '');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="chat-container">
      <div className="top-bar">
        <h1 className="title">Campus Companion</h1>
      </div>
      <aside className="chat-history">
        <ul>
          <li onClick={handleProfile}>Student Info</li>
          <li onClick={handleTranscript}>Edit Transcript</li>
          <li onClick={handleSyllabus}>Upload Syllabus</li>
          <li onClick={handleSupport}>Contact Support</li>
        </ul>
        <div>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
          <button className="exit-settings-button" onClick={handleSettings}> Exit Settings </button>
        </div>
      </aside>
      <main className="content-area">
        {pathname === '/pages/mainSettings' && (
          <div>
            <h1 className="profileHeader">Student Info</h1>
            <br></br>
            <ul className='list'>
              <li className="miniHeader">Name</li>
              <input
                defaultValue={`${userData.first_name} ${userData.last_name}`}
                className="textbox"
                type="text"
                disabled
              ></input>

              <li className="miniHeader">Academic Standing</li>
              <select value={standing} onChange={(e) => setStanding(e.target.value)}>
                <option value="">Select</option>
                <option value="Freshman">Freshman</option>
                <option value="Sophomore">Sophomore</option>
                <option value="Junior">Junior</option>
                <option value="Senior">Senior</option>
              </select>

              <li className="miniHeader">Credits</li><input
                className="textbox"
                value={credits}
                type='text'
                onChange={handleCreditsChange}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.target.blur();
                    updateCredits(parseInt(credits, 10)); 
                  }
                }}

              ></input>

              <li className="miniHeader">Career</li>
              <select value={career} onChange={(e) => setCareer(e.target.value)}>
                <option value="">Select</option>
                <option value="Bachelors">Bachelors</option>
                <option value="Masters">Masters</option>
                <option value="Ph.D.">Ph.D.</option>
              </select>

              <li className="miniHeader">Email</li><input className="textbox" defaultValue={`${userData.unity_id}@ncsu.edu`} type='text' disabled></input>
              <li className="miniHeader">Minor(s)</li>
              <select value={minor} onChange={(e) => setMinor(e.target.value)}>
                <option value="">Select</option>
                <option value="Computer Science">Computer Science</option>
              </select>

              <li className="miniHeader">Major(s)</li>
              <select value={major} onChange={(e) => setMajor(e.target.value)}>
                <option value="">Select</option>
                <option value="Computer Science">Computer Science</option>
              </select>

              <li className="miniHeader">Concentration</li>
              <select value={concentration} onChange={(e) => setConcentration(e.target.value)}>
                <option value="">Select</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Game Development">Game Development</option>
                <option value="CyberSecurity">CyberSecurity</option>
              </select>
            </ul>
            <br></br>
            <br></br>
            <div className='buttonContainer'>
              <button className="grayButton" onClick={handleUpdateInfo}>Update Info</button>
              {showNotification && (
                <div className="notification">
                  Data updated successfully
                  <div className="timer-bar"></div>
                </div>
              )}
              {showError && (
                <div className="notification">
                  Invalid credits
                  <div className="timer-bar"></div>
                </div>
              )}
            </div>
          </div>

        )}
        {children}
      </main>
    </div>
  );
};

export default SettingsLayout;
