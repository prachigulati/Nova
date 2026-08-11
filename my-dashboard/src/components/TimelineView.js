import React, { useState, useEffect } from 'react';
import { Upload, FileText, Download, Lock } from 'lucide-react';

export default function TimelineView({ timelineFilter, setTimelineFilter }) {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Retrieve user role and name strictly from localStorage using 'currentUser'
  const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userRole = (user.role || '').toLowerCase().trim();
  
  // STRICT CHECK: Only allow if role is explicitly teacher or faculty
  const isTeacher = userRole === 'teacher' || userRole === 'faculty'; 
  const userName = user.name || 'User';

  // Fetch uploaded documents on load
  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/timeline-documents');
      const data = await res.json();
      if (data.documents) {
        setDocuments(data.documents);
      }
    } catch (err) {
      console.error('Failed to fetch timeline documents:', err);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !isTeacher) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('user_role', user.role);
    formData.append('user_name', userName);

    setUploading(true);
    setMessage('');

    try {
      const res = await fetch('http://localhost:8000/api/upload-teacher-document', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Document uploaded successfully!');
        setFile(null);
        fetchDocuments(); // Refresh list
      } else {
        setMessage(data.detail || 'Upload failed.');
      }
    } catch (err) {
      setMessage('Error connecting to server.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Timeline & Circulars</h1>
        <p className="text-sm text-slate-500 mt-1">Official announcements, faculty documents, and campus updates.</p>
      </div>

      {/* Teacher Upload Section - Strictly shown only for teachers/faculty */}
      {isTeacher && (
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
            <Upload className="w-4 h-4 text-indigo-600" />
            Faculty Document Portal
          </h3>
          
          <form onSubmit={handleUpload} className="flex flex-col sm:flex-row items-center gap-4">
            <input 
              type="file" 
              accept=".pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            <button 
              type="submit" 
              disabled={uploading || !file}
              className="w-full sm:w-auto px-6 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-slate-800 transition disabled:opacity-50 whitespace-nowrap"
            >
              {uploading ? 'Uploading...' : 'Upload PDF'}
            </button>
          </form>

          {message && <p className="text-xs font-medium mt-2 text-indigo-600">{message}</p>}
        </div>
      )}

      {/* Main Document Feed */}
      <div className="w-full space-y-4">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-2">Teacher Uploaded Circulars & Files</h2>
        
        {documents.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-gray-100">
            <p className="text-xs text-slate-400">No teacher documents uploaded yet.</p>
          </div>
        ) : (
          documents.map((doc, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{doc.filename}</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Uploaded official institutional document</p>
                </div>
              </div>

              <a 
                href={`http://localhost:8000${doc.url}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-gray-50 hover:bg-[#E0F780] px-4 py-2 rounded-full border border-gray-200/60 transition-all"
              >
                View PDF
                <Download className="w-3.5 h-3.5" />
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}