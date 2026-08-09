// import React from 'react';
// import { 
//   LayoutGrid, Calendar as CalendarIcon, MessageSquare, 
//   PanelLeftClose, BookOpen, BarChart3, Clock, User, CheckSquare
// } from 'lucide-react';

// export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, activeNav, setActiveNav }) {
//   return (
//     <aside 
//       className={`bg-[#F8F9FA] border-r border-gray-200/80 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out h-full overflow-hidden ${
//         isSidebarOpen ? 'w-64 p-6' : 'w-0 p-0 border-none opacity-0'
//       }`}
//     >
//       <div className="w-52">
//         {/* Logo & Close Button */}
//         <div className="flex items-center justify-between mb-10 px-2">
//           <div className="flex items-center gap-2.5">
//             <div className="w-7 h-7 bg-[#A3E635] rounded-full flex items-center justify-center font-bold text-sm text-slate-800">
//               ❖
//             </div>
//             <span className="text-xl font-bold text-slate-900 tracking-tight">elevate</span>
//           </div>
          
//           <button 
//             onClick={() => setIsSidebarOpen(false)} 
//             className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition"
//             title="Collapse sidebar"
//           >
//             <PanelLeftClose className="w-5 h-5" />
//           </button>
//         </div>

//         {/* Navigation Links */}
//         <nav className="space-y-1.5">
//           <button 
//             onClick={() => setActiveNav('dashboard')}
//             className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
//               activeNav === 'dashboard' ? 'bg-[#E0F780] text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-gray-100'
//             }`}
//           >
//             <LayoutGrid className="w-4 h-4 shrink-0" />
//             <span>Dashboard</span>
//           </button>

//           <button 
//             onClick={() => setActiveNav('courses')}
//             className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
//               activeNav === 'courses' ? 'bg-[#E0F780] text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-gray-100'
//             }`}
//           >
//             <BookOpen className="w-4 h-4 shrink-0" />
//             <span>Courses</span>
//           </button>

//           <button 
//             onClick={() => setActiveNav('performance')}
//             className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
//               activeNav === 'performance' ? 'bg-[#E0F780] text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-gray-100'
//             }`}
//           >
//             <BarChart3 className="w-4 h-4 shrink-0" />
//             <span>Performance</span>
//           </button>

//           <button 
//             onClick={() => setActiveNav('schedule')}
//             className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
//               activeNav === 'schedule' ? 'bg-[#E0F780] text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-gray-100'
//             }`}
//           >
//             <CalendarIcon className="w-4 h-4 shrink-0" />
//             <span>Schedule</span>
//           </button>

//             <button 
//             onClick={() => setActiveNav('attendance')}
//             className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
//               activeNav === 'attendance' ? 'bg-[#E0F780] text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-gray-100'
//             }`}
//           >
//             <CheckSquare className="w-4 h-4 shrink-0" />
//             <span>Attendance</span>
//           </button>
          
//           <button 
//             onClick={() => setActiveNav('timeline')}
//             className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
//               activeNav === 'timeline' ? 'bg-[#E0F780] text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-gray-100'
//             }`}
//           >
//             <Clock className="w-4 h-4 shrink-0" />
//             <span>Timeline</span>
//           </button>

//           <button 
//             onClick={() => setActiveNav('profile')}
//             className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
//               activeNav === 'profile' ? 'bg-[#E0F780] text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-gray-100'
//             }`}
//           >
//             <User className="w-4 h-4 shrink-0" />
//             <span>Profile</span>
//           </button>

//           <button 
//             onClick={() => setActiveNav('chats')}
//             className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
//               activeNav === 'chats' ? 'bg-[#E0F780] text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-gray-100'
//             }`}
//           >
//             <div className="flex items-center gap-3">
//               <MessageSquare className="w-4 h-4 shrink-0" />
//               <span>AI Assistant</span>
//             </div>
//             <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Live</span>
//           </button>
//         </nav>
//       </div>

//       <div className="w-52 px-2 text-xs text-slate-400 font-medium">
//         © 2026 Elevate Systems
//       </div>
//     </aside>
//   );
// }



import React from 'react';
import { 
  LayoutGrid, Calendar as CalendarIcon, MessageSquare, 
  PanelLeftClose, BookOpen, BarChart3, Clock, User, CheckSquare, FileText
} from 'lucide-react';

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen, activeNav, setActiveNav }) {
  return (
    <aside 
      className={`bg-[#F8F9FA] border-r border-gray-200/80 flex flex-col justify-between shrink-0 transition-all duration-300 ease-in-out h-full overflow-hidden ${
        isSidebarOpen ? 'w-64 p-6' : 'w-0 p-0 border-none opacity-0'
      }`}
    >
      <div className="w-52">
        {/* Logo & Close Button */}
        <div className="flex items-center justify-between mb-10 px-2">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#A3E635] rounded-full flex items-center justify-center font-bold text-sm text-slate-800">
              ❖
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">elevate</span>
          </div>
          
          <button 
            onClick={() => setIsSidebarOpen(false)} 
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          <button 
            onClick={() => setActiveNav('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
              activeNav === 'dashboard' ? 'bg-[#E0F780] text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-gray-100'
            }`}
          >
            <LayoutGrid className="w-4 h-4 shrink-0" />
            <span>Dashboard</span>
          </button>

          <button 
            onClick={() => setActiveNav('courses')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
              activeNav === 'courses' ? 'bg-[#E0F780] text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-gray-100'
            }`}
          >
            <BookOpen className="w-4 h-4 shrink-0" />
            <span>Courses</span>
          </button>

          <button 
            onClick={() => setActiveNav('performance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
              activeNav === 'performance' ? 'bg-[#E0F780] text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-gray-100'
            }`}
          >
            <BarChart3 className="w-4 h-4 shrink-0" />
            <span>Performance</span>
          </button>

          <button 
            onClick={() => setActiveNav('schedule')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
              activeNav === 'schedule' ? 'bg-[#E0F780] text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-gray-100'
            }`}
          >
            <CalendarIcon className="w-4 h-4 shrink-0" />
            <span>Schedule</span>
          </button>

          <button 
            onClick={() => setActiveNav('attendance')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
              activeNav === 'attendance' ? 'bg-[#E0F780] text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-gray-100'
            }`}
          >
            <CheckSquare className="w-4 h-4 shrink-0" />
            <span>Attendance</span>
          </button>

          <button 
            onClick={() => setActiveNav('leaves')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
              activeNav === 'leaves' ? 'bg-[#E0F780] text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-gray-100'
            }`}
          >
            <FileText className="w-4 h-4 shrink-0" />
            <span>Leaves</span>
          </button>
          
          <button 
            onClick={() => setActiveNav('timeline')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
              activeNav === 'timeline' ? 'bg-[#E0F780] text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-gray-100'
            }`}
          >
            <Clock className="w-4 h-4 shrink-0" />
            <span>Timeline</span>
          </button>

          <button 
            onClick={() => setActiveNav('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
              activeNav === 'profile' ? 'bg-[#E0F780] text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-gray-100'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>Profile</span>
          </button>

          <button 
            onClick={() => setActiveNav('chats')}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-medium text-sm transition-all ${
              activeNav === 'chats' ? 'bg-[#E0F780] text-slate-900 shadow-sm' : 'text-slate-600 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 shrink-0" />
              <span>AI Assistant</span>
            </div>
            <span className="bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full">Live</span>
          </button>
        </nav>
      </div>

      <div className="w-52 px-2 text-xs text-slate-400 font-medium">
        © 2026 Elevate Systems
      </div>
    </aside>
  );
}