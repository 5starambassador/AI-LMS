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
  const [selectedCampus, setSelectedCampus] = useState(
    'Achariya World Class Academy (Main Campus · ACH98402PUD2026)'
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

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

  const [blueprintStandards, setBlueprintStandards] = useState([
    {
      id: 'std-1',
      title: 'Grade 5 Mathematics Term 1 Blueprint (Parallel Sets A / B / C)',
      scope: '14 Branches · CBSE Competency Aligned',
      approved: true
    },
    {
      id: 'std-2',
      title: 'Grades 1–8 Experiential Sciences Marking Scheme & Partial Credit Rubric',
      scope: '14 Branches · Learning Academy Validated',
      approved: true
    },
    {
      id: 'std-3',
      title: 'Grades 1–12 VoiceLab Accent-Neutral Speech Assessment Standard',
      scope: '14 Branches · L · S · R & Vocabulary',
      approved: true
    }
  ]);

  const toggleLicense = (key: keyof typeof licenses) => {
    setLicenses(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleStandardApproval = (id: string) => {
    setBlueprintStandards(prev =>
      prev.map(item => (item.id === id ? { ...item, approved: !item.approved } : item))
    );
  };

  const enabledLicenseCount = Object.values(licenses).filter(Boolean).length;

  return (
    <div className="space-y-6 pb-16">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

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
            Global multi-campus provisioning, dynamic feature bitmask licensing, Learning Academy blueprint standardisation, and cross-campus academic intelligence.
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
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-slate-900">Campus Feature Flag License Matrix</h2>
            <p className="text-xs text-slate-500">Target: {selectedCampus}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedCampus}
              onChange={e => setSelectedCampus(e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none"
            >
              <option value="Achariya World Class Academy (Main Campus · ACH98402PUD2026)">Puducherry Central (ACH98402PUD2026)</option>
              <option value="Achariya Techno Campus (Chennai OMR · ACH2026OMR)">Chennai OMR (ACH2026OMR)</option>
              <option value="Achariya International Academy (Bengaluru · ACH2026BLR)">Bengaluru Whitefield (ACH2026BLR)</option>
              <option value="Achariya Heritage Campus (Coimbatore · ACH2026CBE)">Coimbatore (ACH2026CBE)</option>
            </select>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 border border-teal-200 px-3 py-1.5 rounded-full">
              {enabledLicenseCount} of 9 Enterprise Features Entitled
            </span>
            <button
              onClick={() =>
                showToast(
                  `License bitmask (${enabledLicenseCount}/9 features) synced for ${selectedCampus.split(' (')[0]}.`
                )
              }
              className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
            >
              Save &amp; Broadcast Bitmask
            </button>
          </div>
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
            <h2 className="text-base font-extrabold text-slate-900">Cross-Campus Academic Health &amp; Z-Score Heatmap</h2>
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

      {/* 4. Central Learning Academy Standardisation Control Console (MODULE 1.E) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Learning Academy Standardisation Control (Module 1.E)</h2>
            <p className="text-xs text-slate-500">Approve common blueprints, standardise marking schemes, and validate correction-time pilot outcomes</p>
          </div>
          <span className="text-xs bg-amber-50 text-amber-800 border border-amber-200 font-bold px-3 py-1 rounded-full">
            Pilot Validation: 84.6% Reduction vs 90% Target
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Common Learning Gaps Flagged</span>
            <div className="text-lg font-black text-slate-900">Fractions Equivalence · Stomata</div>
            <p className="text-[11px] text-slate-500">Same-day remedial micro-decks pushed across 14 campuses</p>
          </div>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Correction Time Pilot Telemetry</span>
            <div className="text-lg font-black text-emerald-800">84.6% Measured (Target: 90%)</div>
            <p className="text-[11px] text-emerald-700">Audited via AI grading + teacher verification logs</p>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-1">
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Evaluation Consistency</span>
            <div className="text-lg font-black text-indigo-900">98.4% Inter-Campus Agreement</div>
            <p className="text-[11px] text-indigo-700">Standardised marking scheme applied uniformly</p>
          </div>
        </div>

        <div className="space-y-2.5 text-xs">
          {blueprintStandards.map(std => (
            <div
              key={std.id}
              className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="font-bold text-slate-900">{std.title}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">{std.scope}</div>
              </div>
              <button
                onClick={() => {
                  toggleStandardApproval(std.id);
                  showToast(`${std.title.split(' (')[0]} status updated across campuses.`);
                }}
                className={`px-3.5 py-1.5 rounded-xl font-bold text-[11px] border transition-colors shrink-0 ${
                  std.approved
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                }`}
              >
                {std.approved ? '✓ Approved Across 14 Campuses' : 'Pending Learning Academy Sign-off'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
