'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './LoginPage.module.css';
import { useState} from 'react';

/** 
 * This is the login page for the application. It is the first page that the user will see when they visit the application.
 * The user will be prompted to enter their university email address. If the email address is not an NC State email, 
 * the user will be prompted to enter an NC State email. If the email address is an NC State email, the user will be 
 * 
 * @author Sanjit Verma
 */
const LoginPage: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const buttonColor = email.trim() ? '#CC0000' : '#848273';
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // This function is called when the user submits the login form. If the email address is not an NC State email, the user will be prompted to enter an NC State email.
  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (email.trim()) {
      if (email.endsWith('@ncsu.edu')) {
        window.location.href = "/shib";
      }
      else {
        setErrorMessage('Please login with your NC State Email');
      }
    }
  };

  // This function is called when the user enters an email address. It updates the email state with the new email address.
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  
  return (
    <div style={{
      position: 'relative',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundImage: 'url("/CAMPUS.copperwolves.0854-scaled.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      width: '100vw',
      margin: 0,
      overflow: 'hidden',
      padding: '90px',
    }}>
      <div className={styles.ncsuImage}></div>
      
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '30px',
        borderRadius: '30px',
        width: '400px',
        height: '370px',
        maxWidth: '80%',
        boxSizing: 'border-box',
        zIndex: '2',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontWeight: 300,
      }}>
        <h3 style={{ paddingTop: '30px', paddingBottom: '10px', color: 'rgba(255, 255, 255, .7)', fontSize: 28 }}>Welcome</h3>
        <p style={{ color: '#999', paddingBottom: '20px' }}>Please enter your university email</p>
        <form onSubmit={handleLoginSubmit}>
          <input
            type="email"
            placeholder="University Email"
            value={email}
            onChange={handleEmailChange}
            style={{
              width: 'calc(100%)',
              marginBottom: '40px',
              padding: '10px',
              borderRadius: '20px',
              border: 'none',
              backgroundColor: 'rgba(255, 255, 255)', 
            }}
          />
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
          <button
            type="submit"
            style={{
              width: '150px',
              padding: '10px',
              backgroundColor: buttonColor,
              color: 'white',
              border: 'none',
              borderRadius: '40px',
              cursor: 'pointer',
              display: 'block',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            Login
          </button>
       
        </form>
      </div>
      <p style={{
        position: 'absolute',
        bottom: '10px', 
        right: '10px', 
        color: 'white', 
        fontSize: '18px', 
        zIndex: '2',
        fontWeight: 400,
        fontFamily: "'Courier New', Monaco, monospace"
      }}>
        Campus Companion V1.0.0
      </p>
    </div>
  );
};

export default LoginPage;
