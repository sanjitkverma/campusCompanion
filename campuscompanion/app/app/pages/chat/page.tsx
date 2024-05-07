'use client';
import React from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ChatSection from '../../components/chat-section';
import ChatHistory from '../../components/chat-history';
import './chatpage.css'; // Ensure you have a corresponding CSS file

/**
 * This is the chat page for the application. It allows users to save and view chat messages.
 * Users can start new chats, save them, and view the saved chats.
 * The chat messages are stored in the database and are fetched when the user visits the chat page.
 * The user can also delete saved chats.
 * @author Sanjit Verma
 */
const ChatPage: React.FC = () => {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const [tempMessages, setTempMessages] = useState([]);
  const [chatKey, setChatKey] = useState(Date.now());
  const [showNameChatPopup, setShowNameChatPopup] = useState(false);
  const [newChatName, setNewChatName] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [lastAddedChatIndex, setLastAddedChatIndex] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [currentChatMessages, setCurrentChatMessages] = useState([]);
  const [showDeleteChatPopup, setShowDeleteChatPopup] = useState(false);
  const [chatToDelete, setChatToDelete] = useState('');

  // Fetch the authentication status when the page loads
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
    } else if (isAuth) {
      fetchChatHistory();
    }
  }, [isAuth, isLoading, router]);

  if (isLoading) {
    return null;
  }

  if (!isAuth) {
    return null;
  }

  // Fetch the chat history
  const fetchChatHistory = async () => {
    setIsChatLoading(true); // Start loading
    try {
      const response = await fetch('/api/api/users/getSavedChats', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (data.savedChats) {
        setChatHistory(data.savedChats);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    } finally {
      setIsChatLoading(false);
    }
  };
  // @ts-ignore

  // This function is called when the user clicks on a chat item in the chat history
  // It fetches the messages for the selected chat
  const handleChatClick = async (chatName) => {
    setCurrentChat(chatName);
    const response = await fetch(`/api/api/users/getChatMessages/${encodeURIComponent(chatName)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (response.ok && data.messages) {
      setCurrentChatMessages(data.messages);
    } else {
      console.error('Failed to fetch messages for chat:', chatName);
    }
  };
  // @ts-ignore
  // This function is called when a new message is added to the temporary messages
  const addMessageToTemp = (message) => {
    // @ts-ignore
    setTempMessages((prevMessages) => [...prevMessages, message]);
  };
  // This function is called when the user clicks the "Start New Chat" button
  const handleStartNewChatClick = () => {
    if (currentChat) {
      // If currently viewing chat history, go back to start new chat
      setCurrentChat(null);
      setCurrentChatMessages([]);
    } else {
      // If not, show the popup to save a new chat
      setShowNameChatPopup(true);
    }
  };

  // This function is called when the user clicks the "Discard" button in the popup
  const handleDiscardChat = () => {
    setTempMessages([]);
    setNewChatName(''); // Reset the chat name for the next input
    setChatKey(Date.now()); // Reset the key to re-render the ChatSection
    setShowNameChatPopup(false);
  };

  // @ts-ignore
  // This function is called when the user confirms the deletion of a chat
  const handleDeleteChatConfirm = async (chatName) => {
    setChatToDelete(chatName);
    try {
      const response = await fetch(`/api/api/users/deleteChat/${encodeURIComponent(chatToDelete)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        // @ts-ignore
        setChatHistory(chatHistory.filter((chat) => chat.chat_name !== chatToDelete));
        if (currentChat === chatToDelete) {
          setCurrentChat(null);
          setCurrentChatMessages([]);
        }
      } else {
        console.error('Failed to delete the chat');
      }
    } catch (error) {
      console.error('Error while deleting chat:', error);
    }
    setShowDeleteChatPopup(false);
    setNewChatName(''); // Reset the chat name for the next input
    setChatKey(Date.now()); // Reset the key to re-render the ChatSection
    setTempMessages([]);
  };
  // @ts-ignore
  // This function is called when the user submits the chat name in the popup
  const handleNameChatSubmit = async (e) => {
    e.preventDefault();
    const chatName = newChatName;
    if (!chatName || tempMessages.length === 0) return;

    await fetch('/api/api/users/saveChat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_name: chatName, messages: tempMessages }),
    });
    // @ts-ignore
    setChatHistory(prevHistory => [...prevHistory, { chat_name: chatName, messages: tempMessages }]);
    // @ts-ignore
    setLastAddedChatIndex(chatHistory.length);

    setShowNameChatPopup(false); // Hide the popup after saving
    setNewChatName(''); // Reset the chat name for the next input
    setChatKey(Date.now()); // Reset the key to re-render the ChatSection
    setTempMessages([]);
  };

  // This function is called when the user clicks the "Settings" button
  // It redirects the user to the settings page
  const handleSettings = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    window.location.href = '/pages/mainSettings';
  };

  return (
    <div className="chat-container">
      <div className="top-bar">
        <h1 className="title">Campus Companion</h1>
        <button className="settings-button" onClick={handleSettings} style={{ fontFamily: "'Courier New', Monaco, monospace" }}>Settings</button>
      </div>
      <aside className="chat-history">
        <ul>
          {isChatLoading ? (
            <div className="loader"></div>
          ) : chatHistory.length > 0 ? (
            chatHistory.map((chat, index) => (
              <li
                key={index}
                // @ts-ignore
                onClick={() => handleChatClick(chat.chat_name)}
                // @ts-ignore
                className={`${index === lastAddedChatIndex ? "new-chat-name" : ""} ${currentChat === chat.chat_name ? "chat-item-selected" : ""}`}
              >
                {index === lastAddedChatIndex
                // @ts-ignore
                  ? chat.chat_name.split('').map((char, charIndex) => (
                    char === ' ' ? (
                      <span
                        key={charIndex}
                        className="chat-name-char"
                        style={{ animationDelay: `${charIndex * 0.1}s`, visibility: 'hidden' }}
                      >
                        &nbsp;
                      </span>
                    ) : (
                      <span
                        key={charIndex}
                        className="chat-name-char"
                        style={{ animationDelay: `${charIndex * 0.1}s` }}
                      >
                        {char}
                      </span>
                    )
                  ))
                  // @ts-ignore
                  : chat.chat_name
                }
                <button
                  className="delete-chat-button"
                  // @ts-ignore
                  onClick={() => { setChatToDelete(chat.chat_name); setShowDeleteChatPopup(true); }}
                  title="Delete chat"
                >
                  ...
                </button>
              </li>
            ))
          ) : (
            <li>No saved chats. Your saved chats will appear here.</li>
          )}
        </ul>

        <div className="new-chat-button-container">
          {showNameChatPopup && (
            <div className="overlay">
              <div className="name-chat-popup">
                <div className="popup-header">
                  <span className="popup-title">Save Chat</span>
                  <button onClick={() => setShowNameChatPopup(false)} className="popup-cancel-button">×</button>
                </div>
                <form onSubmit={handleNameChatSubmit} className="name-chat-form">
                  <input
                    type="text"
                    value={newChatName}
                    onChange={(e) => setNewChatName(e.target.value)}
                    placeholder="Name the chat"
                    autoFocus
                    className="chat-name-input"
                  />
                  <div className="button-group">
                    <button type="button" className="confirm-name-button" onClick={handleDiscardChat}>
                      Discard
                    </button>
                    <button type="submit" className="confirm-name-button">
                      Confirm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
          <button className="new-chat-button" onClick={handleStartNewChatClick}>
            Start New Chat
          </button>
        </div>
      </aside>
      <main className="chat-main">
        {currentChat ? (
          <ChatHistory messages={currentChatMessages} />
        ) : (
          <ChatSection addMessage={addMessageToTemp} key={chatKey} />
        )}
      </main>

      {showDeleteChatPopup && (
        <div className="overlay">
          <div className="name-chat-popup">
            <div className="popup-header">
              <span className="popup-title">Delete Chat</span>
              <button onClick={() => setShowDeleteChatPopup(false)} className="popup-cancel-button">×</button>
            </div>
            <div className="popup-body">This will delete the chat: <strong>{currentChat}</strong></div>
            <div className="button-group">
              <button type="button" className="delete-name-button" onClick={() => setShowDeleteChatPopup(false)}>
                Cancel
              </button>
              <button type="button" className="delete-name-button" onClick={handleDeleteChatConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;

