// import React from 'react';
// import { X, Upload, CheckCircle } from 'lucide-react';

// export default function LeaveModal({ isLeaveModalOpen, setIsLeaveModalOpen, leaveForm, setLeaveForm, handleApplyLeave }) {
//   if (!isLeaveModalOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
//         <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
//           <div>
//             <h3 className="text-lg font-bold text-slate-900">Apply for Leave</h3>
//             <p className="text-xs text-slate-500">Submit medical certificates or duty leave proof for attendance credit.</p>
//           </div>
//           <button 
//             onClick={() => setIsLeaveModalOpen(false)}
//             className="p-1.5 rounded-full hover:bg-gray-100 text-slate-400 hover:text-slate-700 transition"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>

//         <form onSubmit={handleApplyLeave} className="space-y-4">
//           <div>
//             <label className="block text-xs font-bold text-slate-700 mb-1">Leave Type</label>
//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 type="button"
//                 onClick={() => setLeaveForm({ ...leaveForm, type: 'Medical Leave' })}
//                 className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition text-center ${
//                   leaveForm.type === 'Medical Leave' 
//                     ? 'bg-blue-50 border-blue-500 text-blue-700' 
//                     : 'bg-gray-50 border-gray-200 text-slate-600'
//                 }`}
//               >
//                 Medical Leave
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setLeaveForm({ ...leaveForm, type: 'Duty Leave' })}
//                 className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition text-center ${
//                   leaveForm.type === 'Duty Leave' 
//                     ? 'bg-purple-50 border-purple-500 text-purple-700' 
//                     : 'bg-gray-50 border-gray-200 text-slate-600'
//                 }`}
//               >
//                 Duty Leave (Events / Contests)
//               </button>
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-slate-700 mb-1">Reason / Event Description</label>
//             <input 
//               type="text" 
//               required
//               placeholder="e.g. Hackathon Participation / Fever Doctor Rest"
//               value={leaveForm.reason}
//               onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
//               className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
//             />
//           </div>

//           <div className="grid grid-cols-2 gap-3">
//             <div>
//               <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
//               <input 
//                 type="date" 
//                 required
//                 value={leaveForm.startDate}
//                 onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
//                 className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
//               />
//             </div>
//             <div>
//               <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
//               <input 
//                 type="date" 
//                 required
//                 value={leaveForm.endDate}
//                 onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
//                 className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-xs font-bold text-slate-700 mb-1">Upload Proof (Medical Cert / Event Pass)</label>
//             <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:bg-gray-50/50 transition cursor-pointer relative">
//               <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
//               <p className="text-xs font-semibold text-slate-600">Click to upload document (PDF/PNG)</p>
//               <p className="text-[10px] text-slate-400 mt-0.5">Max size 5MB</p>
//               <input 
//                 type="file" 
//                 className="hidden" 
//                 onChange={(e) => setLeaveForm({ ...leaveForm, fileName: e.target.files[0]?.name || '' })}
//                 id="leaveDoc"
//               />
//               <label htmlFor="leaveDoc" className="absolute inset-0 cursor-pointer"></label>
//             </div>
//             {leaveForm.fileName && (
//               <p className="text-[11px] font-bold text-emerald-600 mt-1.5 flex items-center gap-1">
//                 <CheckCircle className="w-3.5 h-3.5" /> Attached: {leaveForm.fileName}
//               </p>
//             )}
//           </div>

//           <div className="pt-3 flex items-center justify-end gap-3">
//             <button 
//               type="button" 
//               onClick={() => setIsLeaveModalOpen(false)}
//               className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit" 
//               className="px-5 py-2.5 bg-black hover:bg-slate-800 text-white text-xs font-bold rounded-full transition shadow-sm"
//             >
//               Submit Application
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


import React from 'react';
import { X, Upload, CheckCircle } from 'lucide-react';

export default function LeaveModal({ isLeaveModalOpen, setIsLeaveModalOpen, leaveForm, setLeaveForm }) {
  if (!isLeaveModalOpen) return null;

  const savedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userId = savedUser.user_id || 'U001';

  const handleApplyLeave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:8000/api/leaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user_id': userId
        },
        body: JSON.stringify({
          type: leaveForm.type || 'Medical Leave',
          subject: leaveForm.reason || 'Leave Request',
          dateRange: `${leaveForm.startDate} to ${leaveForm.endDate}`,
          totalDays: 2,
          document: leaveForm.fileName || 'document.pdf'
        })
      });

      if (response.ok) {
        setIsLeaveModalOpen(false);
        setLeaveForm({ type: 'Medical Leave', reason: '', startDate: '', endDate: '', fileName: '' });
        alert('Leave application submitted successfully!');
      } else {
        alert('Failed to submit leave request.');
      }
    } catch (err) {
      console.error('Error submitting leave:', err);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Apply for Leave</h3>
            <p className="text-xs text-slate-500">Submit medical certificates or duty leave proof for attendance credit.</p>
          </div>
          <button 
            onClick={() => setIsLeaveModalOpen(false)}
            className="p-1.5 rounded-full hover:bg-gray-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleApplyLeave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Leave Type</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLeaveForm({ ...leaveForm, type: 'Medical Leave' })}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition text-center cursor-pointer ${
                  leaveForm.type === 'Medical Leave' 
                    ? 'bg-blue-50 border-blue-500 text-blue-700' 
                    : 'bg-gray-50 border-gray-200 text-slate-600'
                }`}
              >
                Medical Leave
              </button>
              <button
                type="button"
                onClick={() => setLeaveForm({ ...leaveForm, type: 'Duty Leave' })}
                className={`py-2.5 px-3 rounded-2xl text-xs font-bold border transition text-center cursor-pointer ${
                  leaveForm.type === 'Duty Leave' 
                    ? 'bg-purple-50 border-purple-500 text-purple-700' 
                    : 'bg-gray-50 border-gray-200 text-slate-600'
                }`}
              >
                Duty Leave (Events / Contests)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reason / Event Description</label>
            <input 
              type="text" 
              required
              placeholder="e.g. Hackathon Participation / Fever Doctor Rest"
              value={leaveForm.reason}
              onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
              <input 
                type="date" 
                required
                value={leaveForm.startDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, startDate: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">End Date</label>
              <input 
                type="date" 
                required
                value={leaveForm.endDate}
                onChange={(e) => setLeaveForm({ ...leaveForm, endDate: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-slate-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Upload Proof (Medical Cert / Event Pass)</label>
            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 text-center hover:bg-gray-50/50 transition cursor-pointer relative">
              <Upload className="w-5 h-5 mx-auto text-slate-400 mb-1" />
              <p className="text-xs font-semibold text-slate-600">Click to upload document (PDF/PNG)</p>
              <input 
                type="file" 
                className="hidden" 
                onChange={(e) => setLeaveForm({ ...leaveForm, fileName: e.target.files[0]?.name || '' })}
                id="leaveDoc"
              />
              <label htmlFor="leaveDoc" className="absolute inset-0 cursor-pointer"></label>
            </div>
            {leaveForm.fileName && (
              <p className="text-[11px] font-bold text-emerald-600 mt-1.5 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Attached: {leaveForm.fileName}
              </p>
            )}
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsLeaveModalOpen(false)}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-5 py-2.5 bg-black hover:bg-slate-800 text-white text-xs font-bold rounded-full transition shadow-sm cursor-pointer"
            >
              Submit Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}