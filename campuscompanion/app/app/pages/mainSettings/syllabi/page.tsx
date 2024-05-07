'use client';
import axios from 'axios';

/**
 * SyllabiPage Component
 * 
 * This component is responsible for displaying, adding, viewing, and deleting syllabi.
 * It allows users to upload PDF files of their syllabi, view them in a new tab, and delete them from the list.
 * The uploaded syllabi are also stored locally using IndexedDB through localForage for persistence.
 * @author Arul Sharma
 */

import React, { useState, useRef, useEffect } from 'react';
import '../chatpage.css'; 
import localForage from 'localforage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faTrash } from '@fortawesome/free-solid-svg-icons';

const SyllabiPage: React.FC = () => {
    const [userData, setUserData] = useState({
        unity_id: '',
        syllabi: [],
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchUserData();
    }, []);

    // Fetch user data from the API
    const fetchUserData = async () => {
        console.log("Fetching user data...");
        try {
            const response = await axios.get('https://localhost/api/api/users/current', {
                headers: {
                },
            });
            if (response.data) {
                console.log("Before update:", userData);
                setUserData(response.data);
                console.log("After update:", userData);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    // Function to add a syllabus
    const handleAddSyllabus = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    // Function to handle file change
    const handleFileChange = async (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append('name', file.name);
            formData.append('file', file);

            try {
                const response = await axios.post('https://localhost/api/api/users/addSyllabus', formData, {
                    headers: {
                        'X-SHIB_UID': userData.unity_id,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                if (response.status === 200) {
                    await fetchUserData(); 
                }
            } catch (error) {
                console.error('Error uploading syllabus:', error);
            }
        }
    };
    // Function to delete a syllabus
    const handleDeleteSyllabus = async (syllabusName: string) => {
        try {
            await axios.delete(`https://localhost/api/api/users/deleteSyllabus/${syllabusName}`, {
                headers: {
                    'X-SHIB_UID': userData.unity_id,
                },
            });
            fetchUserData(); 
        } catch (error) {
            console.error('Error deleting syllabus:', error);
        }
    };

    // Function to view a PDF
    const viewPdf = (base64Content: string) => {
        if (typeof base64Content !== 'string') {
            console.error('Invalid base64Content type:', typeof base64Content);
            return; 
        }
        const base64Data = base64Content.split(';base64,').pop();
    
        const normalizedBase64Data = base64Data.replace(/-/g, '+').replace(/_/g, '/');
    
        try {
            const byteCharacters = atob(normalizedBase64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const file = new Blob([byteArray], { type: 'application/pdf' });
    
            const fileURL = URL.createObjectURL(file);
            window.open(fileURL, '_blank');
        } catch (error) {
            console.error('Error decoding base64 string:', error);
        }
    };

    return (
        <div className='syllabi-page'>
            <div className="title-bar">
                <h1 className="profileHeader">Syllabi</h1>
            </div>
            <div className="syllabi-list">
        {userData.syllabi.map((syllabus, index) => (
            <div key={index} className="syllabus-item">
                <span>{syllabus.name}</span>
                <div>
                    <button onClick={() => {
                        console.log(typeof syllabus.content, syllabus.content); // Log the type and content
                        viewPdf(syllabus.content); // Assuming 'content' is the base64 string
                    }} style={{ marginRight: '10px' }} data-testid={`view-pdf-${syllabus.name}`}>
                        <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button onClick={() => handleDeleteSyllabus(syllabus.name)} data-testid={`delete-pdf-${syllabus.name}`}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                </div>
            </div>
        ))}
    </div>
            <div className='buttonContainer'>
                <button onClick={handleAddSyllabus} className="grayButton">Upload Syllabus</button>
                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".pdf"
                    onChange={handleFileChange}
                    data-testid="file-input"
                />
            </div>
        </div>
    );
}

export default SyllabiPage;