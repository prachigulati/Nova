// import React from 'react';
// import { Tag, Clock, ArrowRight, Pin, AlertCircle } from 'lucide-react';
// import { circulars, filterTabs } from '../data/mockData';

// export default function TimelineView({ timelineFilter, setTimelineFilter }) {
//   return (
//     <div className="w-full">
//       <div className="mb-6">
//         <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Timeline</h1>
//         <p className="text-sm text-slate-500 mt-1">Official announcements, circulars, and campus updates.</p>
//       </div>

//       <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
//         {filterTabs.map((tab) => {
//           const IconComponent = tab.icon;
//           const isActive = timelineFilter === tab.name;
//           return (
//             <button
//               key={tab.name}
//               onClick={() => setTimelineFilter(tab.name)}
//               className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
//                 isActive 
//                   ? 'bg-black text-white border-black shadow-sm' 
//                   : 'bg-white text-slate-600 border-gray-200 hover:bg-gray-100 hover:text-slate-900'
//               }`}
//             >
//               <IconComponent className="w-3.5 h-3.5" />
//               {tab.name}
//             </button>
//           );
//         })}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
//         <div className="lg:col-span-8 space-y-4">
//           {circulars.map((item) => (
//             <div 
//               key={item.id} 
//               className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100/80 hover:shadow-md transition-all flex flex-col justify-between"
//             >
//               <div>
//                 <div className="flex items-center justify-between mb-3">
//                   <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${item.tagColor}`}>
//                     <Tag className="w-3 h-3" />
//                     {item.tag}
//                   </span>
//                   <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
//                     <Clock className="w-3.5 h-3.5 text-slate-400" />
//                     {item.date}
//                   </span>
//                 </div>

//                 <h2 className="text-lg font-bold text-slate-900 mb-2 hover:text-indigo-600 cursor-pointer transition">
//                   {item.title}
//                 </h2>
//                 <p className="text-sm text-slate-600 leading-relaxed mb-4">
//                   {item.description}
//                 </p>
//               </div>

//               <div className="flex items-center justify-between pt-4 border-t border-gray-100">
//                 <span className="text-xs text-slate-400 font-medium">
//                   Posted by: <strong className="text-slate-700">{item.author}</strong>
//                 </span>

//                 <button className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-900 bg-gray-50 hover:bg-[#E0F780] px-4 py-2 rounded-full border border-gray-200/60 transition-all">
//                   View details
//                   <ArrowRight className="w-3.5 h-3.5" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>

//         <div className="lg:col-span-4 space-y-6">
//           <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
//             <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-4">
//               <Pin className="w-4 h-4 text-amber-500 fill-amber-500" />
//               Pinned Announcement
//             </h3>
//             <div className="bg-[#FEDEBE]/40 p-4 rounded-2xl border border-[#FEDEBE]">
//               <span className="text-[10px] font-bold tracking-wide uppercase text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-md">Urgent</span>
//               <h4 className="font-bold text-slate-900 text-sm mt-2">Spring 2026 Registration Deadline</h4>
//               <p className="text-xs text-slate-600 mt-1 leading-relaxed">Ensure all course add/drop requests are completed by Aug 10.</p>
//             </div>
//           </div>

//           <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
//             <h3 className="font-bold text-slate-900 text-sm mb-4 flex items-center gap-2">
//               <AlertCircle className="w-4 h-4 text-slate-400" />
//               Important Dates
//             </h3>
//             <div className="space-y-3">
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
//                 <div>
//                   <p className="text-xs font-bold text-slate-800">Mid-Semester Exam</p>
//                   <p className="text-[10px] text-slate-400">All Departments</p>
//                 </div>
//                 <span className="text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-gray-200">Aug 15</span>
//               </div>
//               <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
//                 <div>
//                   <p className="text-xs font-bold text-slate-800">Hackathon Submissions</p>
//                   <p className="text-[10px] text-slate-400">Tech Council</p>
//                 </div>
//                 <span className="text-xs font-bold text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-gray-200">Aug 22</span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

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