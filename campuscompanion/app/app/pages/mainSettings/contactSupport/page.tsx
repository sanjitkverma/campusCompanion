// @ts-nocheck
'use client';

/**
 * This page is responsible for sending an email to the support team.
 * It allows users to enter a message and send it to the support team.
 * The email is sent using the sendEmail function.
 * The email is sent to the support team email address.
 * The email subject is 'Support Requested from [user email]'.
 * The email content is the message entered by the user.
 * 
 * @author Sanket Nain
 */

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import '../chatpage.css'; // Assuming you have a CSS file for your settings
import localForage from 'localforage';
import { Document, Page } from 'react-pdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';



const SupportPage: React.FC = () => {
   const [content, setContent] = useState('');
   const [showNotification, setShowNotification] = useState(false);
   const [showError, setShowError] = useState(false);
   const [showEmpty, setShowEmpty] = useState(false);
   const [id, setId] = useState('');
   const fromEmail = `${id}@ncsu.edu`;
   const toEmail = 'campuscompanion8@gmail.com';
   const subject = `Support Requested from ${fromEmail}`
   const htmlContent = `<p>${content}</p>`;
   
   // This useEffect hook will run once when the component is mounted
   // It will fetch the user data from the backend and store it in the state
   useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://localhost/api/api/users/current', {
          headers: {
          },
        });
        if (response.data) {
          setId(response.data.unity_id)
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // This function will be called when the form is submitted
  // It will send an email using the sendEmail function
   const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      if(content == 'Enter Message' || !content.trim()) {
        //alert('Enter Message!');
        setContent('');
        setShowEmpty(true);
        setTimeout(() => setShowEmpty(false), 5000);
      } else {
        await sendEmail(toEmail, subject, htmlContent);
        setContent('');
      //alert('Email sent successfully!');
      // Optionally reset the form fields here
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);
      }
    } catch (error) {
      //console.error('Failed to send email:', error);
      //alert('Failed to send email. Please try again.');
      setShowError(true)
      setTimeout(() => setShowError(false), 5000);
    }
  };
    return (
        <div className='syllabi-page'>
            <form onSubmit={handleSubmit}>
            <div className="title-bar">
                <h1 className="profileHeader">Contact Support</h1>
            </div>
            <div className='parent'>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} className="supportTextbox" type='text' placeholder='Enter Message'></textarea>
            </div>
            <div className='buttonContainer'>
            <button type='submit' className="supportButton">Send</button>
            {showNotification && (
                <div className="notification">
                  Email Sent Successfully
                  <div className="timer-bar"></div>
                </div>
              )}
              {showError && (
                <div className="notification">
                  Failed to send email. Please try again.
                  <div className="timer-bar"></div>
                </div>
              )}
              {showEmpty && (
                <div className="notification">
                  Enter Message!
                  <div className="timer-bar"></div>
                </div>
              )}

            </div>
            </form>
        </div>
    );
}
// This function will send an email using the fetch API
// It will send a POST request to the backend with the email details
async function sendEmail(toEmail, subject, htmlContent) {
    // Implementation of sending email
    console.log('Sending email', { toEmail, subject, htmlContent });
    // Here you would replace the console.log with the fetch call to your backend
    try {
        const response = await fetch('https://localhost/api/api/users/email', {  // Adjust the URL/port as necessary
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from_email: toEmail,
            to_emails: toEmail,
            subject: subject,
            html_content: htmlContent,
          }),
        });
    
        if (!response.ok) {
          throw new Error('Failed to send email');
        }
    
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error("Error sending email:", error);
        throw error;
      }
  }

export default SupportPage;