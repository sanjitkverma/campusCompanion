'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const RedirectPage: React.FC = () => {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const fetchAuthStatus = async () => {
            const response = await fetch("/api/api/users/login");
            const data = await response.json();
            // Set isAuth based on whether unity_id exists
            setIsAuth(!!data.unity_id); // Converts truthy/falsy value to boolean
        };

        fetchAuthStatus();
    }, []); // Empty dependency array means this runs once on component mount
    
    useEffect(() => {
        if (isAuth) {
            // User is authenticated, redirect to chat page
            router.push('/pages/chat');
        } else {
            console.log('User is not authenticated');
        }
    }, [isAuth, router]);
  
    return (
     <div>
         <h1></h1>
     </div>
    );
  };
  
  export default RedirectPage;
  