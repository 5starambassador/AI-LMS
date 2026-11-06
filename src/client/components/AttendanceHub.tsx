import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Filter,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  AlertCircle,
  FileSpreadsheet,
  Save,
  Check,
  Search,
  Send,
  Sparkles,
  Award,
  Phone,
  Mail,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

interface ScholarAttendanceRecord {
  id: string;
  name: string;
  roll: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  arrival: string;
  remarks: string;
  parentPhone: string;
  parentEmail: string;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  attendanceRate: number;
  dailyHistory: Record<number, 'P' | 'A' | 'L' | 'E' | 'H'>;
}

export const AttendanceHub: React.FC = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'monthly' | 'analytics'>('daily');
  const [selectedMonth, setSelectedMonth] = useState<'JUN' | 'JUL' | 'AUG' | 'SEP' | 'OCT' | 'NOV' | 'DEC' | 'JAN' | 'FEB' | 'MAR'>('NOV');
  const [selectedDay, setSelectedDay] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [selectedScholar, setSelectedScholar] = useState<ScholarAttendanceRecord | null>(null);
  const [smsSentToast, setSmsSentToast] = useState<string | null>(null);

  const months = [
    { key: 'JUN', name: 'June 2026', days: 30, workingDays: 22 },
    { key: 'JUL', name: 'July 2026', days: 31, workingDays: 24 },
    { key: 'AUG', name: 'August 2026', days: 31, workingDays: 21 },
    { key: 'SEP', name: 'September 2026', days: 30, workingDays: 23 },
    { key: 'OCT', name: 'October 2026', days: 31, workingDays: 20 },
    { key: 'NOV', name: 'November 2026', days: 30, workingDays: 24 },
    { key: 'DEC', name: 'December 2026', days: 31, workingDays: 22 },
    { key: 'JAN', name: 'January 2027', days: 31, workingDays: 21 },
    { key: 'FEB', name: 'February 2027', days: 28, workingDays: 22 },
    { key: 'MAR', name: 'March 2027', days: 31, workingDays: 25 },
  ];

  const currentMonthConfig = months.find(m => m.key === selectedMonth) || months[5];

  const [scholars, setScholars] = useState<ScholarAttendanceRecord[]>([
    {
      id: '1',
      name: 'Aarav Sundaram',
      roll: 'ACH-05A-01',
      status: 'PRESENT',
      arrival: '08:15 AM',
      remarks: 'On time · Science Prefect',
      parentPhone: '+91 98402 11001',
      parentEmail: 'sundaram.r@achariya.in',
      totalPresent: 23,
      totalAbsent: 1,
      totalLate: 0,
      attendanceRate: 95.8,
      dailyHistory: { 1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'H', 8: 'H', 9: 'P', 10: 'P', 11: 'P', 12: 'P', 13: 'P', 14: 'H', 15: 'H', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'A', 21: 'H', 22: 'H', 23: 'P', 24: 'P', 25: 'P', 26: 'P', 27: 'P', 28: 'H', 29: 'H', 30: 'P' }
    },
    {
      id: '2',
      name: 'Diya Ramanathan',
      roll: 'ACH-05A-02',
      status: 'PRESENT',
      arrival: '08:10 AM',
      remarks: 'On time · Assembly Reader',
      parentPhone: '+91 98402 11002',
      parentEmail: 'ramanathan.k@achariya.in',
      totalPresent: 24,
      totalAbsent: 0,
      totalLate: 0,
      attendanceRate: 100.0,
      dailyHistory: { 1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'H', 8: 'H', 9: 'P', 10: 'P', 11: 'P', 12: 'P', 13: 'P', 14: 'H', 15: 'H', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'P', 21: 'H', 22: 'H', 23: 'P', 24: 'P', 25: 'P', 26: 'P', 27: 'P', 28: 'H', 29: 'H', 30: 'P' }
    },
    {
      id: '3',
      name: 'Kavya Krishnan',
      roll: 'ACH-05A-03',
      status: 'PRESENT',
      arrival: '08:18 AM',
      remarks: 'On time · Library Club',
      parentPhone: '+91 98402 11003',
      parentEmail: 'krishnan.v@achariya.in',
      totalPresent: 22,
      totalAbsent: 2,
      totalLate: 0,
      attendanceRate: 91.6,
      dailyHistory: { 1: 'P', 2: 'P', 3: 'A', 4: 'P', 5: 'P', 6: 'P', 7: 'H', 8: 'H', 9: 'P', 10: 'P', 11: 'P', 12: 'P', 13: 'P', 14: 'H', 15: 'H', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'P', 21: 'H', 22: 'H', 23: 'P', 24: 'P', 25: 'A', 26: 'P', 27: 'P', 28: 'H', 29: 'H', 30: 'P' }
    },
    {
      id: '4',
      name: 'Pranav Nair',
      roll: 'ACH-05A-04',
      status: 'LATE',
      arrival: '08:42 AM',
      remarks: 'Bus delay at OMR Tollgate',
      parentPhone: '+91 98402 11004',
      parentEmail: 'nair.s@achariya.in',
      totalPresent: 18,
      totalAbsent: 2,
      totalLate: 4,
      attendanceRate: 75.0,
      dailyHistory: { 1: 'L', 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'L', 7: 'H', 8: 'H', 9: 'L', 10: 'P', 11: 'P', 12: 'P', 13: 'P', 14: 'H', 15: 'H', 16: 'P', 17: 'A', 18: 'P', 19: 'P', 20: 'P', 21: 'H', 22: 'H', 23: 'L', 24: 'P', 25: 'P', 26: 'A', 27: 'P', 28: 'H', 29: 'H', 30: 'P' }
    },
    {
      id: '5',
      name: 'Meera Balaji',
      roll: 'ACH-05A-05',
      status: 'ABSENT',
      arrival: '-',
      remarks: 'Medical leave letter received',
      parentPhone: '+91 98402 11005',
      parentEmail: 'balaji.t@achariya.in',
      totalPresent: 16,
      totalAbsent: 8,
      totalLate: 0,
      attendanceRate: 66.7,
      dailyHistory: { 1: 'A', 2: 'A', 3: 'A', 4: 'P', 5: 'P', 6: 'A', 7: 'H', 8: 'H', 9: 'P', 10: 'P', 11: 'P', 12: 'A', 13: 'A', 14: 'H', 15: 'H', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'P', 21: 'H', 22: 'H', 23: 'P', 24: 'A', 25: 'A', 26: 'P', 27: 'P', 28: 'H', 29: 'H', 30: 'P' }
    },
    {
      id: '6',
      name: 'Rohan Jayakumar',
      roll: 'ACH-05A-06',
      status: 'PRESENT',
      arrival: '08:20 AM',
      remarks: 'On time · Sports Captain',
      parentPhone: '+91 98402 11006',
      parentEmail: 'jayakumar.m@achariya.in',
      totalPresent: 23,
      totalAbsent: 1,
      totalLate: 0,
      attendanceRate: 95.8,
      dailyHistory: { 1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'H', 8: 'H', 9: 'P', 10: 'P', 11: 'P', 12: 'P', 13: 'P', 14: 'H', 15: 'H', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'P', 21: 'H', 22: 'H', 23: 'P', 24: 'A', 25: 'P', 26: 'P', 27: 'P', 28: 'H', 29: 'H', 30: 'P' }
    },
    {
      id: '7',
      name: 'Ananya Sridhar',
      roll: 'ACH-05A-07',
      status: 'PRESENT',
      arrival: '08:14 AM',
      remarks: 'On time · Choir Member',
      parentPhone: '+91 98402 11007',
      parentEmail: 'sridhar.n@achariya.in',
      totalPresent: 24,
      totalAbsent: 0,
      totalLate: 0,
      attendanceRate: 100.0,
      dailyHistory: { 1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'P', 7: 'H', 8: 'H', 9: 'P', 10: 'P', 11: 'P', 12: 'P', 13: 'P', 14: 'H', 15: 'H', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'P', 21: 'H', 22: 'H', 23: 'P', 24: 'P', 25: 'P', 26: 'P', 27: 'P', 28: 'H', 29: 'H', 30: 'P' }
    },
    {
      id: '8',
      name: 'Karthik Varma',
      roll: 'ACH-05A-08',
      status: 'EXCUSED',
      arrival: '-',
      remarks: 'Inter-Campus Robotics Olympiad',
      parentPhone: '+91 98402 11008',
      parentEmail: 'varma.k@achariya.in',
      totalPresent: 24,
      totalAbsent: 0,
      totalLate: 0,
      attendanceRate: 100.0,
      dailyHistory: { 1: 'P', 2: 'P', 3: 'P', 4: 'P', 5: 'P', 6: 'E', 7: 'H', 8: 'H', 9: 'P', 10: 'P', 11: 'P', 12: 'P', 13: 'P', 14: 'H', 15: 'H', 16: 'P', 17: 'P', 18: 'P', 19: 'P', 20: 'P', 21: 'H', 22: 'H', 23: 'P', 24: 'P', 25: 'P', 26: 'P', 27: 'P', 28: 'H', 29: 'H', 30: 'P' }
    }
  ]);

  const updateStatus = (id: string, newStatus: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => {
    setScholars(prev => prev.map(s => {
      if (s.id !== id) return s;
      const historyCode = newStatus === 'PRESENT' ? 'P' : newStatus === 'ABSENT' ? 'A' : newStatus === 'LATE' ? 'L' : 'E';
      return {
        ...s,
        status: newStatus,
        arrival: newStatus === 'PRESENT' ? '08:15 AM' : newStatus === 'LATE' ? '08:40 AM' : '-',
        dailyHistory: { ...s.dailyHistory, [selectedDay]: historyCode }
      };
    }));
    setIsSaved(false);
  };

  const markAllPresent = () => {
    setScholars(prev => prev.map(s => ({
      ...s,
      status: 'PRESENT' as const,
      arrival: '08:15 AM',
      dailyHistory: { ...s.dailyHistory, [selectedDay]: 'P' }
    })));
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const triggerParentSms = (scholar: ScholarAttendanceRecord) => {
    setSmsSentToast(`SMS sent to ${scholar.parentPhone} (${scholar.name}'s parent): Absence notification delivered.`);
    setTimeout(() => setSmsSentToast(null), 4000);
  };

  const exportCsv = () => {
    const headers = ['Roll No', 'Scholar Name', 'Present Days', 'Absent Days', 'Late Days', 'Attendance Rate (%)'];
    const rows = scholars.map(s => [
      s.roll,
      `"${s.name}"`,
      s.totalPresent,
      s.totalAbsent,
      s.totalLate,
      `${s.attendanceRate}%`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Achariya_Attendance_${selectedMonth}_2026_Grade5A.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredScholars = scholars.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.roll.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = scholars.filter(s => s.status === 'PRESENT').length;
  const lateCount = scholars.filter(s => s.status === 'LATE').length;
  const absentCount = scholars.filter(s => s.status === 'ABSENT').length;
  const excusedCount = scholars.filter(s => s.status === 'EXCUSED').length;
  const attendanceRate = Math.round(((presentCount + lateCount) / scholars.length) * 100);

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header with Month / Day Switcher & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200/60 mb-1.5">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Academic Year 2026-2027 · Grade 5A</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Attendance & Multi-Month Register
          </h1>
          <p className="text-xs text-slate-500">
            Official CBSE statutory roll call, multi-month calendar matrix, and scholar retention tracking.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                viewMode === 'daily' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Daily Roll Call
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                viewMode === 'monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Monthly Matrix
            </button>
            <button
              onClick={() => setViewMode('analytics')}
              className={`px-3.5 py-1.5 rounded-xl transition-all ${
                viewMode === 'analytics' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Retention Telemetry
            </button>
          </div>

          <button
            onClick={exportCsv}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-2xl flex items-center space-x-1.5 transition-colors border border-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CBSE Register</span>
          </button>
        </div>
      </div>

      {/* SMS Sent Notification */}
      {smsSentToast && (
        <div className="p-4 bg-teal-50 border border-teal-200 text-teal-900 rounded-2xl flex items-center justify-between text-xs font-bold shadow-xs animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>{smsSentToast}</span>
          </div>
          <button onClick={() => setSmsSentToast(null)} className="text-teal-700 hover:text-teal-900">✕</button>
        </div>
      )}

      {/* 2. Academic Year Multi-Month Horizontal Selector */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs overflow-x-auto">
        <div className="flex items-center space-x-1.5 min-w-max text-xs font-bold">
          <span className="text-slate-400 text-[11px] px-2 font-mono uppercase">Month:</span>
          {months.map(m => (
            <button
              key={m.key}
              onClick={() => setSelectedMonth(m.key as any)}
              className={`px-3 py-1.5 rounded-xl transition-all ${
                selectedMonth === m.key
                  ? 'bg-teal-600 text-white shadow-xs font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {m.name} ({m.workingDays}d)
            </button>
          ))}
        </div>
      </div>

      {/* 3. Top Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500">Class Attendance</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{attendanceRate}%</div>
          <div className="text-[10px] text-teal-700 font-semibold mt-0.5">CBSE Threshold: 75%</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500">Present Today</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{presentCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Verified in Session</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500">Late Arrivals</div>
          <div className="text-2xl font-black text-amber-500 mt-1">{lateCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Recorded arrival times</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-xs font-bold text-slate-500">Absent Scholars</div>
          <div className="text-2xl font-black text-rose-600 mt-1">{absentCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Medical & Unexcused</div>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs col-span-2 sm:col-span-1">
          <div className="text-xs font-bold text-slate-500">Official Duty</div>
          <div className="text-2xl font-black text-indigo-600 mt-1">{excusedCount}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Robotics & Debates</div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: DAILY ROLL CALL                                                   */}
      {/* ========================================================================= */}
      {viewMode === 'daily' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-bold text-slate-500">Session Date:</span>
              <div className="flex items-center space-x-1 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800">
                <CalendarIcon className="w-3.5 h-3.5 text-teal-600" />
                <span>November {selectedDay}, 2026 (Friday)</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search scholar or roll..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>

              <button
                onClick={markAllPresent}
                className="px-3.5 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Mark All Present</span>
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center space-x-1 shadow-xs"
              >
                {isSaved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'Saved ✓' : 'Commit Register'}</span>
              </button>
            </div>
          </div>

          {/* Roll Call Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Roll No</th>
                  <th className="py-3 px-3">Scholar Name</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Arrival Time</th>
                  <th className="py-3 px-3">Pedagogical Remarks</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredScholars.map(scholar => (
                  <tr key={scholar.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-700">
                      {scholar.roll}
                    </td>
                    <td className="py-3.5 px-3 font-bold text-slate-900 cursor-pointer hover:text-teal-700" onClick={() => setSelectedScholar(scholar)}>
                      {scholar.name}
                    </td>
                    <td className="py-3.5 px-3">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => updateStatus(scholar.id, 'PRESENT')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            scholar.status === 'PRESENT'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                          }`}
                        >
                          P
                        </button>
                        <button
                          onClick={() => updateStatus(scholar.id, 'LATE')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            scholar.status === 'LATE'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-50 hover:text-amber-700'
                          }`}
                        >
                          L
                        </button>
                        <button
                          onClick={() => updateStatus(scholar.id, 'ABSENT')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            scholar.status === 'ABSENT'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-700'
                          }`}
                        >
                          A
                        </button>
                        <button
                          onClick={() => updateStatus(scholar.id, 'EXCUSED')}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                            scholar.status === 'EXCUSED'
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'
                          }`}
                        >
                          E
                        </button>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-slate-500 font-mono">
                      {scholar.arrival}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 max-w-xs truncate">
                      {scholar.remarks}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {scholar.status === 'ABSENT' && (
                        <button
                          onClick={() => triggerParentSms(scholar)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-[10px] font-bold rounded-lg transition-colors flex items-center space-x-1 ml-auto"
                        >
                          <Send className="w-3 h-3" />
                          <span>SMS Parent</span>
                        </button>
                      )}
                      {scholar.status !== 'ABSENT' && (
                        <button
                          onClick={() => setSelectedScholar(scholar)}
                          className="text-slate-400 hover:text-teal-700 font-semibold text-[11px]"
                        >
                          Dossier →
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: MONTHLY ATTENDANCE MATRIX (30-Day Grid)                           */}
      {/* ========================================================================= */}
      {viewMode === 'monthly' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900">
                Monthly Register Matrix: {currentMonthConfig.name}
              </h3>
              <p className="text-xs text-slate-500">Day-by-day continuous register across all enrolled scholars.</p>
            </div>
            <div className="flex items-center space-x-3 text-[11px] font-bold">
              <span className="flex items-center space-x-1 text-emerald-700"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span><span>P: Present</span></span>
              <span className="flex items-center space-x-1 text-amber-700"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span><span>L: Late</span></span>
              <span className="flex items-center space-x-1 text-rose-700"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span><span>A: Absent</span></span>
              <span className="flex items-center space-x-1 text-slate-400"><span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span><span>H: Holiday</span></span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[10px]">
                  <th className="py-2.5 px-3 text-left sticky left-0 bg-slate-50 z-10 w-44">Scholar Name</th>
                  {Array.from({ length: currentMonthConfig.days }, (_, i) => i + 1).map(day => (
                    <th key={day} className={`p-1.5 min-w-[28px] ${day % 7 === 0 || day % 7 === 1 ? 'bg-slate-100 text-slate-400' : ''}`}>
                      {day}
                    </th>
                  ))}
                  <th className="py-2.5 px-3 font-bold text-teal-800">Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scholars.map(scholar => (
                  <tr key={scholar.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 text-left font-bold text-slate-800 sticky left-0 bg-white z-10 border-r border-slate-100">
                      {scholar.name}
                    </td>
                    {Array.from({ length: currentMonthConfig.days }, (_, i) => i + 1).map(day => {
                      const code = scholar.dailyHistory[day] || (day % 7 === 0 || day % 7 === 1 ? 'H' : 'P');
                      return (
                        <td key={day} className="p-1">
                          <span className={`inline-block w-6 h-6 leading-6 rounded-md font-bold text-[10px] ${
                            code === 'P' ? 'bg-emerald-50 text-emerald-700 font-extrabold' :
                            code === 'L' ? 'bg-amber-100 text-amber-800 font-extrabold' :
                            code === 'A' ? 'bg-rose-100 text-rose-800 font-extrabold' :
                            code === 'E' ? 'bg-indigo-100 text-indigo-800 font-extrabold' :
                            'bg-slate-100 text-slate-400'
                          }`}>
                            {code}
                          </span>
                        </td>
                      );
                    })}
                    <td className="py-2.5 px-3 font-bold text-teal-700">
                      {scholar.attendanceRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: RETENTION & EARLY WARNING TELEMETRY                              */}
      {/* ========================================================================= */}
      {viewMode === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center space-x-2 text-rose-700 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4" />
              <span>CBSE Statutory Early-Warning List (&lt; 75% Attendance)</span>
            </div>
            <p className="text-xs text-slate-500">
              Scholars falling below the mandatory CBSE 75% threshold require formal administrative intervention.
            </p>

            <div className="space-y-3">
              {scholars.filter(s => s.attendanceRate < 75).map(s => (
                <div key={s.id} className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-extrabold text-rose-900">{s.name} ({s.roll})</div>
                    <div className="text-rose-700 text-[11px] mt-0.5">
                      Rate: <span className="font-bold">{s.attendanceRate}%</span> · Total Absences: {s.totalAbsent} Days
                    </div>
                  </div>
                  <button
                    onClick={() => triggerParentSms(s)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center space-x-1"
                  >
                    <Send className="w-3 h-3" />
                    <span>Send SMS</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
            <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>100% Perfect Attendance Club</span>
            </div>
            <p className="text-xs text-slate-500">
              Scholars maintaining unblemished attendance records eligible for monthly academic commendation.
            </p>

            <div className="space-y-3">
              {scholars.filter(s => s.attendanceRate === 100).map(s => (
                <div key={s.id} className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="font-extrabold text-emerald-900">{s.name} ({s.roll})</div>
                    <div className="text-emerald-700 text-[11px] mt-0.5">
                      Consecutive Days: <span className="font-bold">{currentMonthConfig.workingDays} Sessions</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold">
                    Gold Star Scholar 🌟
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCHOLAR DOSSIER DRAWER MODAL                                              */}
      {/* ========================================================================= */}
      {selectedScholar && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <div className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Scholar Profile Dossier</div>
                <h3 className="text-lg font-black text-slate-900">{selectedScholar.name}</h3>
                <p className="text-xs text-slate-500">{selectedScholar.roll} · Grade 5 Section A</p>
              </div>
              <button
                onClick={() => setSelectedScholar(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Parent Mobile</span>
                <span className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                  <Phone className="w-3 h-3 text-teal-600" />
                  <span>{selectedScholar.parentPhone}</span>
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[10px]">Parent Email</span>
                <span className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5 truncate">
                  <Mail className="w-3 h-3 text-teal-600" />
                  <span className="truncate">{selectedScholar.parentEmail}</span>
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs space-y-1">
              <span className="font-bold text-teal-900">Attendance Telemetry Summary</span>
              <p className="text-teal-800 leading-relaxed">
                {selectedScholar.name} has attended {selectedScholar.totalPresent} out of 24 sessions in November ({selectedScholar.attendanceRate}%).
                {selectedScholar.attendanceRate >= 75
                  ? ' Compliance with CBSE statutory minimums is fully satisfied.'
                  : ' Warning: Attendance is below 75%. Remediation contact required.'}
              </p>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => { triggerParentSms(selectedScholar); setSelectedScholar(null); }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors"
              >
                Send Parent SMS Alert
              </button>
              <button
                onClick={() => setSelectedScholar(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
