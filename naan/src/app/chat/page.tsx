// naan/src/app/chat/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { motion, AnimatePresence } from 'framer-motion';
import styles from './chat.module.css';

// --- Icons ---
const ArrowLeftIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1.2em" width="1.2em">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);
const SendIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1.1em" width="1.1em">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);
const SparkleIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1em" width="1em">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
  </svg>
);

// --- Data ---
const POPULAR_QUESTIONS = [
  "How to reach NIT Trichy?",
  "Hostel admission procedure?",
  "Departments and courses?",
  "Mess menu details?",
];

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  isTyping?: boolean;
}

export default function ChatPage() {
  const router = useRouter(); // Initialize Router
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  
  const bottomRef = useRef<HTMLDivElement>(null);

  // --- Chat Logic ---
  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => scrollToBottom(), [messages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simulate Bot Response
    setTimeout(() => {
      let botResponse = "I am the NIT Trichy Campus Bot. I can help you navigate the campus, find info about hostels, or academic details.";
      
      const lowerText = textToSend.toLowerCase();
      if (lowerText.includes("reach")) {
        botResponse = "NIT Trichy is located on the Trichy-Thanjavur highway (NH 67). It's about 22 km from the Railway Station (TPJ) and 17 km from the Airport.";
      } else if (lowerText.includes("hostel")) {
        botResponse = "Hostel admission starts during physical reporting. First years are allotted Amber, Agate, or Garnet blocks.";
      } else if (lowerText.includes("mess")) {
        botResponse = "Feathers, 1986, and Annapurna are popular choices. The menu changes monthly based on student council recommendations.";
      } else if (lowerText.includes("department")) {
        botResponse = "We have over 10 departments including CSE, ECE, EEE, Mechanical, Civil, and more.";
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: botResponse,
        isTyping: true
      };
      setMessages(prev => [...prev, botMsg]);
    }, 800);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.container}>
      {/* Background Mesh */}
      <div className={styles.backgroundWrapper}>
        <div className={styles.blobBlue}></div>
        <div className={styles.blobIndigo}></div>
        <div className={styles.noiseOverlay}></div>
      </div>

      {/* Main Chat Area */}
      <div className={styles.main}>
        
        {/* Header with Back Button */}
        <div className={styles.header}>
            <div className={styles.headerLeft}>
                <button className={styles.backBtn} onClick={() => router.back()} title="Go Back">
                    <ArrowLeftIcon />
                </button>
                <div className={styles.headerTitle}>
                    <span style={{color: '#4f46e5'}}>●</span> NITT Assistant
                </div>
            </div>

            {messages.length > 0 && (
                <button className={styles.newChatBtn} onClick={() => setMessages([])}>
                    <span style={{marginRight: '6px'}}>+</span> New Chat
                </button>
            )}
        </div>

        <div className={styles.chatScrollArea}>
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={styles.emptyStateContainer}
                    key="empty"
                >
                    <div className={styles.logoWrapper}>
                         <div className={styles.logoText}>N</div>
                    </div>
                    <h1 className={styles.welcomeHeadline}>Hello, Student</h1>
                    <p className={styles.welcomeSub}>How can I help you with NIT Trichy today?</p>
                    
                    {/* MOST POPULAR QUESTIONS GRID */}
                    <div className={styles.suggestionsGrid}>
                        {POPULAR_QUESTIONS.map((q, i) => (
                            <button key={i} className={styles.suggestionCard} onClick={() => handleSend(q)}>
                                <div className={styles.cardIcon}><SparkleIcon /></div>
                                <span className={styles.cardText}>{q}</span>
                            </button>
                        ))}
                    </div>
                </motion.div>
            ) : (
                <div key="chat">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`${styles.messageRow} ${msg.role === 'bot' ? styles.botRow : ''}`}>
                        <div className={`${styles.messageContent} ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'bot' && (
                                <div className={`${styles.avatar} ${styles.botAvatar}`}>AI</div>
                            )}
                            
                            <div className={`${styles.bubble} ${msg.role === 'user' ? styles.userBubble : styles.botBubble}`}>
                                {msg.isTyping ? (
                                    <Typewriter 
                                    text={msg.content} 
                                    onComplete={() => {
                                        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isTyping: false } : m));
                                    }} 
                                    />
                                ) : msg.content}
                            </div>

                            {msg.role === 'user' && (
                                <div className={`${styles.avatar} ${styles.userAvatar}`}>You</div>
                            )}
                        </div>
                        </div>
                    ))}
                    <div ref={bottomRef} style={{ height: '1px' }} />
                </div>
            )}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className={styles.inputContainer}>
          <div className={styles.inputBoxWrapper}>
            <textarea
              className={styles.textarea}
              placeholder="Ask anything..."
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              className={`${styles.sendButton} ${input.trim() ? styles.active : ''}`}
              onClick={() => handleSend()}
            >
              <SendIcon />
            </button>
          </div>
          <div className={styles.disclaimer}>
            AI can make mistakes. Verify important info.
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---
const Typewriter = ({ text, onComplete }: { text: string, onComplete: () => void }) => {
  const [display, setDisplay] = useState('');
  
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setDisplay(text.substring(0, i + 1));
      i++;
      if (i > text.length) {
        clearInterval(interval);
        onComplete();
      }
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {display}
      <span className={styles.cursor}></span>
    </span>
  );
};