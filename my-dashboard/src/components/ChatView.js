import React, { useState } from 'react';
import { 
  Bot, Radio, Volume2, VolumeX, Mic, MicOff, Smile, Send, Paperclip, FileText, X, User 
} from 'lucide-react';

export default function ChatView({ 
  chatMessages, chatInput, setChatInput, isChatLoading, isSpeaking, isListening, 
  speakText, toggleListening, handleSendChatMessage, processAndSend, chatMessagesEndRef 
}) {
  const [attachedFile, setAttachedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('http://127.0.0.1:8000/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        if (response.ok) {
          setAttachedFile({ name: data.filename, path: data.path });
        } else {
          alert('Failed to upload document.');
        }
      } catch (err) {
        console.error('Error uploading file:', err);
        alert('Network error while uploading file.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() && !attachedFile) return;

    let finalMessage = chatInput;
    if (attachedFile) {
      finalMessage += ` [Attached Document: ${attachedFile.name}]`;
    }

    setAttachedFile(null);
    setChatInput('');
    await processAndSend(finalMessage);
  };

  const handleSpeakText = (text) => {
    if (!voiceEnabled) return; 
    if (typeof speakText === 'function') {
      speakText(text);
    }
  };

  return (
    <div className="w-full h-[calc(100vh-140px)] flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 bg-slate-900 text-white flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 rounded-full bg-[#E0F780] text-slate-900 flex items-center justify-center font-bold shadow-inner">
              <Bot className="w-5 h-5" />
            </div>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse"></span>
          </div>
          <div>
            <h3 className="font-bold text-sm flex items-center gap-2">
              NOVA - Campus Companion 
              {/* Interactive Voice Toggle Button */}
              <button 
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border flex items-center gap-1 transition cursor-pointer ${
                  voiceEnabled 
                    ? 'bg-[#E0F780]/20 text-[#E0F780] border-[#E0F780]/30' 
                    : 'bg-gray-700 text-gray-400 border-gray-600'
                }`}
                title={voiceEnabled ? "Click to disable voice output" : "Click to enable voice output"}
              >
                {voiceEnabled ? <Radio className="w-3 h-3 animate-pulse" /> : <VolumeX className="w-3 h-3" />}
                {voiceEnabled ? "Live Voice Enabled" : "Voice Muted"}
              </button>
            </h3>
            <p className="text-[11px] text-slate-400 font-medium">
              Talk naturally with real-time voice responses.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isSpeaking && voiceEnabled && (
            <span className="text-xs font-bold text-[#E0F780] flex items-center gap-1.5 animate-pulse bg-white/10 px-3 py-1 rounded-full border border-[#E0F780]/20">
              <Volume2 className="w-4 h-4 text-[#E0F780]" /> Speaking...
            </span>
          )}
          {isListening && (
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5 animate-pulse bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20">
              <Mic className="w-4 h-4 animate-bounce text-rose-400" /> Listening to you...
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#F8F9FA]">
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2.5`}>
            {msg.sender === 'bot' && (
              <div className="w-7 h-7 rounded-full bg-slate-900 text-[#E0F780] flex items-center justify-center text-xs font-bold shrink-0 shadow-sm">
                AI
              </div>
            )}

            <div className={`max-w-xl p-4 rounded-3xl text-xs leading-relaxed shadow-sm transition-all ${
              msg.sender === 'user' 
                ? 'bg-black text-white rounded-br-xs' 
                : 'bg-white text-slate-800 border border-gray-200/80 rounded-bl-xs'
            }`}>
              <p className="whitespace-pre-wrap">{msg.text}</p>
              
              <div className={`flex items-center justify-between gap-4 mt-2 pt-2 border-t ${msg.sender === 'user' ? 'border-white/10 text-slate-400' : 'border-gray-100 text-slate-400'} text-[10px]`}>
                <span>{msg.timestamp}</span>
                
                {msg.sender === 'bot' && voiceEnabled && (
                  <button 
                    onClick={() => handleSpeakText(msg.text)} 
                    className="flex items-center gap-1 hover:text-slate-800 transition font-medium bg-gray-50 hover:bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200/60 cursor-pointer"
                    title="Replay voice response"
                  >
                    <Volume2 className="w-3 h-3 text-slate-500" /> Replay Voice
                  </button>
                )}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 bg-gray-200 text-slate-700 rounded-full flex items-center justify-center shrink-0 border border-gray-200/60 shadow-sm" title="User">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isChatLoading && (
          <div className="flex justify-start items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-slate-900 text-[#E0F780] flex items-center justify-center text-xs font-bold shrink-0">
              AI
            </div>
            <div className="bg-white text-slate-500 p-4 rounded-3xl rounded-bl-xs text-xs border border-gray-200/80 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
              <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              <span className="ml-1 font-medium">Generating response...</span>
            </div>
          </div>
        )}
        <div ref={chatMessagesEndRef} />
      </div>

      {/* Quick Prompts Updated to User's Specific Questions */}
      <div className="px-6 py-2 bg-white border-t border-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Smile className="w-3.5 h-3.5" /> Quick Prompts:
        </span>
        {[
          "What is my current CGPA?",
          "What is my attendance in Big Data Analytics?",
          "I want to apply for a medical leave",
          "What is my timetable for today?",
          "When is my next lecture?"
        ].map((prompt, i) => (
          <button
            key={i}
            onClick={() => {
              setChatInput(prompt);
              processAndSend(prompt);
            }}
            className="px-3 py-1.5 bg-gray-50 hover:bg-slate-100 text-slate-700 text-[11px] font-semibold rounded-full border border-gray-200/80 whitespace-nowrap transition cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {attachedFile && (
        <div className="px-6 py-2 bg-slate-50 border-t border-gray-100 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-700 font-semibold">
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Uploaded: {attachedFile.name}</span>
          </div>
          <button onClick={() => setAttachedFile(null)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {isUploading && (
        <div className="px-6 py-1.5 bg-blue-50 text-blue-700 text-[11px] font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span> Uploading document to server...
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="p-4 bg-white border-t border-gray-100 flex items-center gap-3">
        <label className="p-3 rounded-full bg-gray-50 hover:bg-gray-100 text-slate-500 cursor-pointer transition shrink-0" title="Attach prescription PDF">
          <Paperclip className="w-4 h-4" />
          <input type="file" accept=".pdf,.png,.jpg" className="hidden" onChange={handleFileChange} />
        </label>

        <div className="relative flex-1 flex items-center">
          <input 
            type="text" 
            value={chatInput} 
            onChange={(e) => setChatInput(e.target.value)} 
            placeholder={isListening ? "Listening to your voice..." : "Type or attach a prescription document..."} 
            className={`w-full bg-gray-50 border rounded-full pl-5 pr-12 py-3.5 text-xs text-slate-800 focus:outline-none shadow-2xs font-medium transition ${
              isListening ? 'border-rose-500 bg-rose-50/20' : 'border-gray-200 focus:border-slate-400'
            }`}
          />
          
          <button 
            type="button" 
            onClick={toggleListening}
            className={`absolute right-3.5 p-2 rounded-full transition cursor-pointer ${
              isListening ? 'bg-rose-500 text-white animate-pulse shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-gray-200/60'
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
        </div>

        <button 
          type="submit" 
          disabled={isChatLoading || isUploading || (!chatInput.trim() && !attachedFile)} 
          className="p-3.5 bg-black text-white rounded-full hover:bg-slate-800 disabled:opacity-50 transition shadow-sm flex items-center justify-center shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}