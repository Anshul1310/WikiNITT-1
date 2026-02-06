// naan/src/app/chat/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './chat.module.css';

// --- Icons ---
const SendIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1.1em" width="1.1em">
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);
const PlusIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1em" width="1em">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const QuestionIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" height="1em" width="1em">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
    <line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);
const MenuIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" height="1.4em" width="1.4em">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);
const CloseIcon = () => (
  <svg stroke="currentColor" fill="none" strokeWidth="2.5" viewBox="0 0 24 24" height="1.4em" width="1.4em">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

// --- Data ---
const FAQ_LIST = [
  "How to reach NIT Trichy?",
  "Hostel admission info?",
  "Departments list?",
  "Academic calendar?",
  "Mess menu?",
  "Sports facilities?",
];

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  isTyping?: boolean;
}

export default function ChatPage() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const bottomRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // --- Mobile Sidebar Toggle ---
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // --- Custom Cursor Logic ---
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const addHover = () => cursor.classList.add(styles.cursorHover);
    const removeHover = () => cursor.classList.remove(styles.cursorHover);

    // Check for touch device
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouch) {
      window.addEventListener('mousemove', moveCursor);
      const interactiveElements = document.querySelectorAll('button, a, textarea, .clickable');
      interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', removeHover);
      });
    }

    return () => {
      if (!isTouch) {
        window.removeEventListener('mousemove', moveCursor);
        const interactiveElements = document.querySelectorAll('button, a, textarea, .clickable');
        interactiveElements.forEach(el => {
          el.removeEventListener('mouseenter', addHover);
          el.removeEventListener('mouseleave', removeHover);
        });
      }
    };
  }, [messages, isSidebarOpen]); 

  // --- Chat Logic ---
  const scrollToBottom = () => bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  useEffect(() => scrollToBottom(), [messages]);

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input;
    if (!textToSend.trim()) return;

    closeSidebar(); 

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    setTimeout(() => {
      let botResponse = "I am the NIT Trichy Campus Bot. I can help you navigate the campus, find info about hostels, or academic details.";
      
      const lowerText = textToSend.toLowerCase();
      if (lowerText.includes("reach")) {
        botResponse = "NIT Trichy is located on the Trichy-Thanjavur highway (NH 67). It's about 22 km from the Railway Station (TPJ) and 17 km from the Airport.";
      } else if (lowerText.includes("hostel")) {
        botResponse = "Hostel admission starts during physical reporting. First years are allotted Amber, Agate, or Garnet blocks.";
      } else if (lowerText.includes("mess")) {
        botResponse = "Feathers, 1986, and Annapurna are popular choices. The menu changes monthly based on student council recommendations.";
      } else if (lowerText.includes("sports")) {
        botResponse = "We have a swimming pool, cricket stadium, football ground, and an indoor sports center (Barn).";
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: botResponse,
        isTyping: true
      };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className={styles.container}>
      {/* Background */}
      <div className={styles.backgroundWrapper}>
        <div className={styles.backgroundImage}></div>
        <div className={styles.backgroundOverlay}></div>
      </div>

      {/* Custom Cursor */}
      <div ref={cursorRef} className={styles.customCursor}></div>

      {/* Mobile Overlay */}
      <div 
        className={`${styles.mobileOverlay} ${isSidebarOpen ? styles.open : ''}`} 
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <button className={`${styles.newChatBtn} clickable`} onClick={() => { setMessages([]); closeSidebar(); }} style={{ marginBottom: 0, flex: 1 }}>
            <PlusIcon />
            <span>New Chat</span>
            </button>
            
            <button 
                onClick={closeSidebar} 
                className="clickable"
                style={{ background: 'transparent', border: 'none', color: '#888', marginLeft: '10px', display: 'flex', cursor: 'pointer', padding: '0.5rem' }}
            >
                <CloseIcon />
            </button>
        </div>
        
        <div className={styles.sectionTitle}>Frequently Asked</div>
        
        <div className={styles.questionList}>
          {FAQ_LIST.map((question, idx) => (
            <button 
              key={idx} 
              className={`${styles.questionItem} clickable`}
              onClick={() => handleSend(question)}
            >
              <QuestionIcon />
              <span>{question}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={styles.main}>
        {/* Mobile Header */}
        <div className={styles.mobileHeader}>
            <button className={`${styles.menuBtn} clickable`} onClick={toggleSidebar}>
                <MenuIcon />
            </button>
            <span style={{ fontWeight: 600, fontSize: '0.95rem', letterSpacing: '0.5px' }}>NITT Chat</span>
            <div style={{ width: '32px' }}></div>
        </div>

        <div className={styles.chatScrollArea}>
          {messages.length === 0 && (
            <div className={styles.emptyState}>
              <div className={styles.nittLogo}>
                <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: 'white' }}>NITT</span>
              </div>
              <h2 className={styles.welcomeTitle}>NITT Assistant</h2>
              <p style={{ color: '#aaa', marginTop: '0.2rem', fontSize: '0.85rem' }}>
                Your guide to campus life, admissions, and more.
              </p>
            </div>
          )}
          
          {messages.map((msg) => (
            <div key={msg.id} className={`${styles.messageRow} ${msg.role === 'bot' ? styles.botRow : ''}`}>
              <div className={styles.messageContent}>
                <div className={`${styles.avatar} ${msg.role === 'bot' ? styles.botAvatar : styles.userAvatar}`}>
                  {msg.role === 'bot' ? "AI" : "You"}
                </div>
                <div className={styles.text}>
                  {msg.isTyping ? (
                    <Typewriter 
                      text={msg.content} 
                      onComplete={() => {
                        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isTyping: false } : m));
                      }} 
                    />
                  ) : msg.content}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} style={{ height: '1px' }} />
        </div>

        {/* Input */}
        <div className={styles.inputContainer}>
          <div className={styles.inputBoxWrapper}>
            <textarea
              className={`${styles.textarea} clickable`}
              placeholder="Ask a question..."
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              className={`${styles.sendButton} clickable ${input.trim() ? styles.active : ''}`}
              onClick={() => handleSend()}
            >
              <SendIcon />
            </button>
          </div>
          <div className={styles.disclaimer}>
            Bot generated info. Verify with administration.
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
    }, 12);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span>
      {display}
      <span className={styles.cursor}></span>
    </span>
  );
};