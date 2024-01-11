import React from 'react';
import '../../App.css';
const LandingPage = () => {
  return (
    <div className="customFont" style={{
      position: 'relative',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundImage: 'url("/CAMPUS.copperwolves.0854-scaled.jpg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    }}>
      <h2 style={{ 
        color: 'red', 
        zIndex: '2', 
        marginBottom: '24px', 
        fontSize: '35px' 
      }}>
        CAMPUS COMPANION
      </h2>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: '30px',
        borderRadius: '20px',
        width: '300px',
        maxWidth: '90%', 
        boxSizing: 'fill-box', 
        zIndex: '2',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h3 style={{paddingBottom: '.005px', color: '#fff' }}>Welcome</h3>
        <p style={{ color: '#999' }}>Please login with your school's credentials</p>
        <form>
          <input
            type="email"
            placeholder="university email"
            style={{
              width: 'calc(100% - 20px)', 
              marginBottom: '10px',
              padding: '10px',
              borderRadius: '20px',
              border: 'none'
            }}
          />
          <input
            type="password"
            placeholder="password"
            style={{
              width: 'calc(100% - 20px)',
              marginBottom: '10px',
              padding: '10px',
              borderRadius: '20px',
              border: 'none'
            }}
          />
          <button
            type="submit"
            style={{
              width: 'calc(100% - 20px)', 
              padding: '10px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </form>
        <a href="/forgot-password" style={{ color: '#999', display: 'block', textAlign: 'center', marginTop: '10px' }}>Forgot Password</a>
        <a href="/sign-up" style={{ color: '#999', display: 'block', textAlign: 'center', marginTop: '10px' }}>Sign Up</a>
      </div>
    </div>
  );
};

export default LandingPage;
