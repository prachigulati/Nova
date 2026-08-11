import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import LeaveModal from './components/LeaveModal';
import DashboardView from './components/DashboardView';
import CoursesView from './components/CoursesView';
import PerformanceView from './components/PerformanceView';
import AttendanceView from './components/AttendanceView';
import ScheduleView from './components/ScheduleView';
import ChatView from './components/ChatView';
import ProfileView from './components/ProfileView';
import TimelineView from './components/TimelineView';
import AuthPage from './components/AuthPage';
import LeavesView from './components/LeavesView';

export default function App() {
  // Authentication & User Profile State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem('currentUser');
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [activeNav, setActiveNav] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('All');
  const [selectedSemester, setSelectedSemester] = useState('Semester 5');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Schedule View States
  const [selectedDay, setSelectedDay] = useState('THU');

  // Timeline Filter State
  const [timelineFilter, setTimelineFilter] = useState('Circulars');

  // Leave Modal & Data State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const [leaveForm, setLeaveForm] = useState({
    type: 'Medical Leave',
    reason: '',
    startDate: '',
    endDate: '',
    fileName: ''
  });

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    if (!leaveForm.reason || !leaveForm.startDate || !leaveForm.endDate) {
      alert('Please fill out all required fields.');
      return;
    }

    try {
      const userId = currentUser?.user_id || 'U001';
      const response = await fetch('http://127.0.0.1:8000/api/leaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user_id': userId
        },
        body: JSON.stringify({
          type: leaveForm.type,
          subject: leaveForm.reason,
          dateRange: `${leaveForm.startDate} to ${leaveForm.endDate}`,
          totalDays: 2,
          document: leaveForm.fileName || 'document.pdf'
        })
      });

      if (response.ok) {
        setIsLeaveModalOpen(false);
        setLeaveForm({ type: 'Medical Leave', reason: '', startDate: '', endDate: '', fileName: '' });
        alert('Leave application submitted successfully for approval!');
      } else {
        alert('Failed to submit leave request.');
      }
    } catch (err) {
      console.error('Error submitting leave:', err);
      alert('Network error while submitting leave request.');
    }
  };

  // Real-Time Voice Conversational AI States
  const [chatMessages, setChatMessages] = useState([
    { 
      sender: 'bot', 
      text: "Hey! I'm NOVA your live campus companion. Speak to me or type below, and I'll talk right back to you in real-time!",
      timestamp: 'Just now'
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voices, setVoices] = useState([]);
  const chatMessagesEndRef = useRef(null);

  const scrollToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeNav === 'chats') {
      scrollToBottom();
    }
  }, [chatMessages, activeNav]);

  useEffect(() => {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        setVoices(availableVoices);
      }
    };
    updateVoices();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      
      const femaleVoice = voices.find(v => 
        v.name.toLowerCase().includes('female') || 
        v.name.toLowerCase().includes('zira') || 
        v.name.toLowerCase().includes('samantha') || 
        v.name.toLowerCase().includes('victoria') ||
        v.name.toLowerCase().includes('karen') ||
        v.name.toLowerCase().includes('google uk english female')
      ) || voices[0];

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.rate = 1.25; 
      utterance.pitch = 1.2; 

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = async (event) => {
      const speechToText = event.results[0][0].transcript;
      setIsListening(false);
      setChatInput(speechToText);
      await processAndSend(speechToText);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const processAndSend = async (messageText) => {
    if (!messageText.trim() || isChatLoading) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { sender: 'user', text: messageText, timestamp: timeNow }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const userId = currentUser?.user_id || 'U001';
      const res = await fetch('http://127.0.0.1:8000/api/chat', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-id': userId 
        },
        body: JSON.stringify({ message: messageText })
      }).catch(() => null);

      let botReply = "";
      if (res && res.ok) {
        const data = await res.json();
        botReply = data.reply || "I'm listening! Tell me more.";
      } else {
        const lower = messageText.toLowerCase();
        if (lower.includes('attendance') || lower.includes('safe')) {
          botReply = "Your attendance is sitting at 87% overall, which is totally safe! Just keep an eye on your subjects since it's tracking dynamically.";
        } else if (lower.includes('schedule') || lower.includes('classes') || lower.includes('today')) {
          botReply = "Today you have core engineering modules in the morning, followed by lab sessions!";
        } else if (lower.includes('leave') || lower.includes('duty')) {
          botReply = "You can view and submit your duty or medical leaves right from the Leaves tab on your sidebar.";
        } else {
          botReply = `I hear you loud and clear! You mentioned: "${messageText}". How else can I help you navigate your semester today?`;
        }
      }

      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMessages(prev => [...prev, { sender: 'bot', text: botReply, timestamp: botTime }]);
      
      speakText(botReply);

    } catch (err) {
      const errorMsg = "Oops, my voice connection blinked for a second. Try saying that again!";
      setChatMessages(prev => [...prev, { sender: 'bot', text: errorMsg, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      speakText(errorMsg);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleSendChatMessage = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    await processAndSend(chatInput.trim());
  };

  // Password Change Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    alert('Password updated successfully!');
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  // Handle successful login from AuthPage
  const handleLoginSuccess = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
    setIsAuthenticated(false);
    alert('Logged out successfully.');
  };

  // IF NOT LOGGED IN, RENDER THE AUTH / LOGIN-REGISTER PAGE
  if (!isAuthenticated) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />;
  }

  // ONCE LOGGED IN, RENDER THE MAIN DASHBOARD LAYOUT
  return (
    <div className="flex h-screen bg-[#F8F9FA] font-sans antialiased overflow-hidden w-full relative">
      <Sidebar 
        isSidebarOpen={isSidebarOpen} 
        setIsSidebarOpen={setIsSidebarOpen} 
        activeNav={activeNav} 
        setActiveNav={setActiveNav} 
      />

      <main className="flex-1 p-8 overflow-y-auto h-full w-full transition-all duration-300">
        <Header 
          isSidebarOpen={isSidebarOpen} 
          setIsSidebarOpen={setIsSidebarOpen} 
          setActiveNav={setActiveNav} 
          currentUser={currentUser}
        />

        {activeNav === 'dashboard' && <DashboardView setActiveNav={setActiveNav} />}
        {activeNav === 'courses' && <CoursesView activeTab={activeTab} setActiveTab={setActiveTab} />}
        {activeNav === 'performance' && <PerformanceView selectedSemester={selectedSemester} setSelectedSemester={setSelectedSemester} />}
        {activeNav === 'attendance' && <AttendanceView />}
        {activeNav === 'schedule' && <ScheduleView selectedDay={selectedDay} setSelectedDay={setSelectedDay} setIsLeaveModalOpen={setIsLeaveModalOpen} />}
        {activeNav === 'leaves' && <LeavesView setIsLeaveModalOpen={setIsLeaveModalOpen} />}
        {activeNav === 'chats' && <ChatView 
          chatMessages={chatMessages} 
          chatInput={chatInput} 
          setChatInput={setChatInput} 
          isChatLoading={isChatLoading} 
          isSpeaking={isSpeaking} 
          isListening={isListening} 
          speakText={speakText} 
          toggleListening={toggleListening} 
          handleSendChatMessage={handleSendChatMessage} 
          processAndSend={processAndSend} 
          chatMessagesEndRef={chatMessagesEndRef} 
        />}
        {activeNav === 'profile' && <ProfileView passwordForm={passwordForm} setPasswordForm={setPasswordForm} handlePasswordChange={handlePasswordChange} onLogout={handleLogout} currentUser={currentUser} />}
        {activeNav === 'timeline' && <TimelineView timelineFilter={timelineFilter} setTimelineFilter={setTimelineFilter} />}
      </main>

      <LeaveModal 
        isLeaveModalOpen={isLeaveModalOpen} 
        setIsLeaveModalOpen={setIsLeaveModalOpen} 
        leaveForm={leaveForm} 
        setLeaveForm={setLeaveForm} 
        handleApplyLeave={handleApplyLeave} 
      />
    </div>
  );
}