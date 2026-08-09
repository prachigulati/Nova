import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Plus, Clock, CheckCircle2, Eye } from 'lucide-react';

export default function LeavesView({ setIsLeaveModalOpen }) {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const savedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userId = savedUser.user_id || 'U001';

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/leaves?user_id=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch leave records');
        return res.json();
      })
      .then((data) => {
        const leaveArray = Array.isArray(data) ? data : (data.leaves || data.leave_requests || []);
        setLeaves(leaveArray);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching leaves:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div className="p-8 text-gray-400 text-center font-medium">Loading leave applications...</div>;
  if (error) return <div className="p-8 text-red-500 text-center font-medium">Error loading leaves: {error}</div>;

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Duty & Medical Leaves</h1>
          <p className="text-sm text-slate-500 mt-1">
            Track your submitted medical certificates, hackathon event duty leaves, and attendance credits.
          </p>
        </div>

        <button 
          onClick={() => setIsLeaveModalOpen(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold transition shadow-sm self-start cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Apply for Leave
        </button>
      </div>

      {leaves.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl text-center border border-gray-100 shadow-sm">
          <FileText className="w-10 h-10 mx-auto text-slate-300 mb-3" />
          <p className="text-slate-700 font-bold text-sm">No leave applications found</p>
          <p className="text-slate-400 text-xs mt-1">Submit a medical or duty leave request or ask your AI agent to file one for you.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {leaves.map((leave, idx) => {
            // Check if a real uploaded document exists (ignoring default empty placeholders)
            const hasValidDoc = leave.document && leave.document.trim() !== "" && leave.document !== "document.pdf";

            return (
              <div key={leave.leave_id || idx} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${
                      String(leave.type).toLowerCase().includes('medical') 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                    }`}>
                      {leave.type}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold capitalize ${
                      String(leave.status).toLowerCase() === 'approved' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {String(leave.status).toLowerCase() === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {leave.status || 'pending'}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm mb-1">{leave.reason || leave.subject}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {leave.start_date && leave.end_date ? `${leave.start_date} to ${leave.end_date}` : leave.dateRange}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium truncate max-w-[130px]">Applicant: {leave.name || 'Student'}</span>
                  
                  {hasValidDoc ? (
                    <a 
                      href={`http://127.0.0.1:8000/uploads/${leave.document}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 text-slate-700 font-bold px-3 py-1 rounded-full border border-gray-200 transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-blue-600" /> View Doc
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">No Document</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}