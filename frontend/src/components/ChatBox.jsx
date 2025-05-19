import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatWindow.module.css';
import { fetchChatResponse } from '../utils/openai';

export default function ChatBox({ apiKey, model = 'gpt-3.5-turbo' }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const messagesRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  };

  useEffect(scrollToBottom, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const reply = await fetchChatResponse(apiKey, model, [...messages, userMessage]);

    if (reply) {
      setMessages(prev => [...prev, reply]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>Conversations</h2>
          <button className={styles.newChatBtn}>+ New Chat</button>
        </div>
        <div className={styles.chatList}>
          <div className={`${styles.chatItem} ${styles.active}`}>
            <div className={styles.chatItemTitle}>General Discussion</div>
            <div className={styles.chatItemPreview}>How can I help you today?</div>
          </div>
        </div>
      </div>

      <div className={styles.chatMain}>
        <div className={styles.chatHeader}>
          <h1 className={styles.chatTitle}>General Discussion</h1>
          <p className={styles.chatSubtitle}>Active now</p>
        </div>

        <div className={styles.chatMessages} ref={messagesRef}>
          {messages.map((msg, i) => (
            <div key={i} className={`${styles.message} ${styles[msg.role]}`}>
              <div className={styles.messageContent}>{msg.content}</div>
              <div className={styles.messageTime}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.chatInputContainer}>
          <div className={styles.chatInputWrapper}>
            <textarea
              className={styles.chatInput}
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
            />
            <button
              className={styles.sendButton}
              disabled={!input.trim()}
              onClick={sendMessage}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
