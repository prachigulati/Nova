import React, { useState, useEffect } from 'react';
import { Download, GraduationCap, CheckCircle2 } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function PerformanceView({ selectedSemester, setSelectedSemester }) {
  const [performanceData, setPerformanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve logged-in user profile from localStorage dynamically
  const savedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userId = savedUser.user_id || 'U001';

  useEffect(() => {
    console.log("Fetching performance record for user_id:", userId);
    fetch(`http://127.0.0.1:8000/api/performance/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setPerformanceData(data);
        const semesters = data?.semesters || {};
        const semKeys = Object.keys(semesters);
        if (semKeys.length > 0 && (!selectedSemester || !semesters[selectedSemester])) {
          setSelectedSemester(semKeys[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching performance record:", err);
        setLoading(false);
      });
  }, [userId]);

  // Function to generate and download official transcript as a real PDF
  const handleDownloadPDF = () => {
    if (!performanceData) return;

    const doc = new jsPDF();
    let yPos = 20;

    // Title Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("OFFICIAL ACADEMIC TRANSCRIPT", 20, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Student Name: ${performanceData.name || savedUser.name || 'Student'}`, 20, yPos);
    yPos += 6;
    doc.text(`User ID: ${userId}`, 20, yPos);
    yPos += 6;
    doc.text(`Cumulative GPA (CGPA): ${performanceData.cgpa} / 10.0`, 20, yPos);
    yPos += 6;
    doc.text(`Total Credits Earned: ${performanceData.totalCredits}`, 20, yPos);
    yPos += 6;
    doc.text(`Academic Standing: ${performanceData.rank}`, 20, yPos);
    
    yPos += 10;
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    yPos += 10;

    // Semesters & Courses
    const semesters = performanceData.semesters || {};
    Object.entries(semesters).forEach(([semName, subjects]) => {
      if (yPos > 260) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text(semName, 20, yPos);
      yPos += 8;

      doc.setFontSize(10);
      doc.setFont("helvetica", "bold");
      doc.text("Code", 20, yPos);
      doc.text("Course Title", 45, yPos);
      doc.text("Cred", 130, yPos);
      doc.text("Grade", 150, yPos);
      doc.text("Status", 175, yPos);
      
      yPos += 6;
      doc.setFont("helvetica", "normal");

      subjects.forEach((sub) => {
        if (yPos > 275) {
          doc.addPage();
          yPos = 20;
        }
        doc.text(sub.code, 20, yPos);
        doc.text(sub.subject.substring(0, 40), 45, yPos);
        doc.text(String(sub.credits), 130, yPos);
        doc.text(sub.grade, 150, yPos);
        doc.text(sub.status, 175, yPos);
        yPos += 6;
      });

      yPos += 8;
    });

    // Save the PDF
    doc.save(`${userId}_Academic_Transcript.pdf`);
  };

  if (loading) return <div className="p-8 text-gray-400 text-center font-medium">Loading academic performance transcript...</div>;

  const semesters = performanceData?.semesters || {};
  const currentSemSubjects = semesters[selectedSemester] || [];

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Academic Performance</h1>
          <p className="text-sm text-slate-500 mt-1">
            Official Student Gradecard & Semester Evaluation Report for <span className="font-semibold text-slate-800">{performanceData?.name || savedUser.name || 'Student'}</span> ({userId}).
          </p>
        </div>

        <button 
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-full text-xs font-bold transition shadow-sm self-start cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download Transcript
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#E0F780] p-5 rounded-3xl border border-black/5">
          <span className="text-xs font-bold text-slate-700">Cumulative GPA (CGPA)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900">{performanceData?.cgpa || '0.0'}</span>
            <span className="text-xs text-slate-600 font-medium">/ 10.0</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Semester GPA (SGPA)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900">{performanceData?.sgpa || '0.0'}</span>
            <span className="text-xs text-slate-400 font-medium">/ 10.0 ({selectedSemester || 'Current'})</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Credits Completed</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900">{performanceData?.totalCredits || 0}</span>
            <span className="text-xs text-slate-400 font-medium">Earned Units</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
          <span className="text-xs font-bold text-slate-500">Academic Standing</span>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-2xl font-extrabold text-slate-900 truncate" title={performanceData?.rank}>{performanceData?.rank || 'Good'}</span>
            <GraduationCap className="w-6 h-6 text-amber-500 shrink-0" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-slate-900 text-base">Gradecard Details</h2>
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-semibold">2026 Academic Year</span>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-2xl border border-gray-200">
            {Object.keys(semesters).map((sem) => (
              <button
                key={sem}
                onClick={() => setSelectedSemester(sem)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  selectedSemester === sem ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {sem}
              </button>
            ))}
          </div>
        </div>

        {currentSemSubjects.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm font-medium">No records found for this semester.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pl-2">Subject Code</th>
                  <th className="pb-3">Course Title</th>
                  <th className="pb-3">Credits</th>
                  <th className="pb-3">Grade</th>
                  <th className="pb-3">Grade Points</th>
                  <th className="pb-3 text-right pr-2">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs font-medium text-slate-700">
                {currentSemSubjects.map((row, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/60 transition">
                    <td className="py-4 pl-2 font-bold text-slate-900">{row.code}</td>
                    <td className="py-4 font-semibold text-slate-800">{row.subject}</td>
                    <td className="py-4 text-slate-500">{row.credits}</td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-extrabold ${
                        String(row.grade).startsWith('A') ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {row.grade}
                      </span>
                    </td>
                    <td className="py-4 font-semibold text-slate-800">{row.points}</td>
                    <td className="py-4 text-right pr-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" /> {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}