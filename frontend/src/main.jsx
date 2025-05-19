import React from 'react';
import ReactDOM from 'react-dom/client';
import ChatBox from './components/ChatBox';
import './components/ChatWindow.module.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ChatBox apiKey={import.meta.env.VITE_OPENAI_API_KEY} />
  </React.StrictMode>
);
