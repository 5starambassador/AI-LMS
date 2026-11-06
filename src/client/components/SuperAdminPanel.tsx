import React, { useState } from 'react';
import {
  Shield,
  Building2,
  Key,
  Sliders,
  Check,
  PlusCircle,
  BarChart2,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

export const SuperAdminPanel: React.FC = () => {
  const [licenses, setLicenses] = useState({
    basic: true,
    questionBank: true,
    hpcLicense: true,
    autoGrade: true,
    primeLicense: true,
    aiTools: true,
    score: true,
    compass: true,
    voice: true
  });

  const toggleLicense = (key: keyof typeof licenses) => {
    setLicenses(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Luminous Light Header Banner */}
      <div className="bg-gradient-to-r from-teal-50/90 via-sky-50/80 to-indigo-50/90 border border-teal-200/80 text-slate-900 p-6 sm:p-8 rounded-3xl shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold bg-teal-600 text-white px-3 py-1 rounded-full shadow-xs mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Super Admin: Dr. V. Rajakumaran (Founder President)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Achariya World Class Educational Trust
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl leading-relaxed">
            Global multi-campus provisioning, dynamic feature bitmask licensing, and normalized cross-campus academic intelligence.
          </p>
        </div>

        <div className="bg-white/90 border border-slate-200/80 p-4 rounded-2xl text-center shrink-0 shadow-xs">
          <div className="text-[10px] text-teal-700 uppercase tracking-wider font-extrabold">ACTIVE CAMPUSES</div>
          <div className="text-2xl font-black text-slate-900 mt-0.5">14 Branches</div>
          <div className="text-[11px] text-slate-500 font-medium">South India Cluster</div>
        </div>
      </div>

      {/* 2. Campus License Matrix Controller */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Campus Feature Flag License Matrix</h2>
            <p className="text-xs text-slate-500">Target: Achariya World Class Academy (Main Campus · ACH98402PUD2026)</p>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1 rounded-full">
            All 9 Enterprise Features Entitled
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { key: 'basic', label: 'Basic LMS Core', desc: 'Digital books, lessons, and class rosters' },
            { key: 'questionBank', label: 'Question Bank', desc: 'Standardized assessment items' },
            { key: 'hpcLicense', label: 'HPC Progress Card', desc: 'NEP 2020 5-domain observation suite' },
            { key: 'autoGrade', label: 'Autograde OCR', desc: 'Handwriting transcription and auto-marking' },
            { key: 'primeLicense', label: 'Prime Interactive', desc: 'Rich simulations & multimedia buckets' },
            { key: 'aiTools', label: 'AI Tools Suite', desc: 'Master flag enabling AI sub-services' },
            { key: 'score', label: 'SCORE Assessment', desc: 'Exam Builder, Batch PDF QR & Grader' },
            { key: 'compass', label: 'Compass Analytics', desc: 'Learning gap telemetry and heatmaps' },
            { key: 'voice', label: 'Voice / LSR Suite', desc: 'Listening, Speaking & Reading Speech AI' }
          ].map(feature => (
            <div
              key={feature.key}
              onClick={() => toggleLicense(feature.key as keyof typeof licenses)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                licenses[feature.key as keyof typeof licenses]
                  ? 'bg-teal-50/60 border-teal-300 text-slate-900 shadow-xs'
                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs">{feature.label}</span>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center text-white ${
                    licenses[feature.key as keyof typeof licenses] ? 'bg-teal-600' : 'bg-slate-300'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Multi-Campus Comparative BI Intelligence */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Cross-Campus Academic Health & Z-Score Heatmap</h2>
            <p className="text-xs text-slate-500">Benchmark across regional clusters for Term 1</p>
          </div>
          <span className="text-xs bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold px-3 py-1 rounded-full">
            Normalized Gaussian Z-Score Model
          </span>
        </div>

        <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 text-xs">
          {[
            { name: 'Achariya World Class Academy (Puducherry Central)', score: '92.4%', zScore: '+1.42 σ', status: 'Exemplary', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
            { name: 'Achariya Techno Campus (Chennai OMR)', score: '89.1%', zScore: '+0.88 σ', status: 'Proficient', badge: 'bg-teal-100 text-teal-800 border-teal-200' },
            { name: 'Achariya International Academy (Bengaluru Whitefield)', score: '88.5%', zScore: '+0.76 σ', status: 'Proficient', badge: 'bg-teal-100 text-teal-800 border-teal-200' },
            { name: 'Achariya Heritage Campus (Coimbatore)', score: '84.2%', zScore: '+0.12 σ', status: 'Average', badge: 'bg-amber-100 text-amber-800 border-amber-200' }
          ].map((camp, idx) => (
            <div key={idx} className="p-4 bg-white hover:bg-slate-50 transition-colors flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900">{camp.name}</span>
                <p className="text-[11px] text-slate-400">CBSE Affiliated · Grade 1 to 12</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className="font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded-md">{camp.zScore}</span>
                <span className="font-extrabold text-slate-900">{camp.score}</span>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${camp.badge}`}>
                  {camp.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
