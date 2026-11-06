import React, { useState, useEffect } from 'react';
import {
  Mic,
  Volume2,
  Play,
  RotateCcw,
  CheckCircle2,
  Award,
  Sparkles,
  BookOpen,
  Headphones,
  ArrowRight,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';

export const LsrStudentPortal: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeSubTab, setActiveSubTab] = useState<'levelTest' | 'dictionary' | 'report'>('levelTest');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recorded, setRecorded] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const playAudioSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.95;
      u.onstart = () => setIsPlayingAudio(true);
      u.onend = () => setIsPlayingAudio(false);
      u.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(u);
      showToast('Playing VoiceLab narration audio...');
    } else {
      showToast('Audio playback not supported in this browser.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* 1. Scholar Header Badge - Very Light, Luminous & Unique */}
      <div className="bg-gradient-to-r from-teal-50/90 via-sky-50/80 to-indigo-50/90 border border-teal-200/80 text-slate-900 p-6 sm:p-8 rounded-3xl shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold bg-teal-600 text-white px-3 py-1 rounded-full shadow-xs mb-2">
            <span>🚀 Scholar #ACH-89421</span>
            <span>•</span>
            <span>Grade 5 · Innovation Studio A</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Welcome Aarav! Let’s explore your English voice.
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-lg leading-relaxed">
            About 10 minutes · There are no wrong answers. Listen, Speak, Read aloud and explore expressive vocabulary with Achariya VoiceLab AI!
          </p>
        </div>

        <div className="bg-white/90 border border-slate-200/80 p-4 rounded-2xl text-center shrink-0 shadow-xs">
          <div className="text-[10px] text-teal-700 uppercase tracking-wider font-extrabold">READING STAGE</div>
          <div className="text-base font-extrabold text-slate-900 mt-0.5">Confident Reader</div>
          <div className="text-[11px] text-slate-500 italic">Self-paced reading & contextual reasoning</div>
        </div>
      </div>

      {/* 2. Light Sub-Tab Switcher */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('levelTest')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeSubTab === 'levelTest'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>Diagnostic Speech Tasks</span>
        </button>

        <button
          onClick={() => setActiveSubTab('dictionary')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeSubTab === 'dictionary'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Vocabulary Explorer</span>
        </button>

        <button
          onClick={() => setActiveSubTab('report')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeSubTab === 'report'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>CEFR & Fluency Snapshot</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DIAGNOSTIC LEVEL TEST RUNNER                                       */}
      {/* ========================================================================= */}
      {activeSubTab === 'levelTest' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          {/* Step Progress Bar */}
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 pb-2 border-b border-slate-100">
            <span className="text-teal-700">TASK #{activeStep} OF 3</span>
            <div className="flex items-center space-x-1.5">
              {[1, 2, 3].map(step => (
                <button
                  key={step}
                  onClick={() => setActiveStep(step)}
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                    activeStep === step
                      ? 'bg-teal-600 text-white font-bold shadow-xs'
                      : step < activeStep
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {step}
                </button>
              ))}
            </div>
          </div>

          {/* ACTIVITY 1: LISTENING & AUDITORY COMPREHENSION */}
          {activeStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200 uppercase">
                  Auditory Comprehension
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  The Coastal Winds of the Coromandel Coast
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Listen to the audio narration regarding traditional maritime sailing and coastal weather patterns, then answer the question below.
                </p>
              </div>

              {/* Light Audio Player Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => playAudioSpeech("The coastal winds of the Coromandel Coast blow steadily during the retreating northeast monsoon, guiding ancient maritime vessels safely into the historic port of Puducherry.")}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-xs ${
                      isPlayingAudio ? 'bg-rose-600 text-white animate-pulse' : 'bg-teal-600 text-white hover:bg-teal-700'
                    }`}
                  >
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </button>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Achariya VoiceLab Narration (0:48)</p>
                    <p className="text-[11px] text-slate-400">Clear studio pronunciation · 24kHz</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-teal-700 text-xs font-semibold">
                  <Volume2 className="w-4 h-4" />
                  <span>HQ Stereo</span>
                </div>
              </div>

              {/* MCQ Options */}
              <div className="space-y-2 pt-2">
                <p className="text-xs font-bold text-slate-800">
                  Question: What environmental indicator did ancient Coromandel navigators use to forecast impending rainfall?
                </p>

                {[
                  'The flight altitude of coastal dragonflies and sudden wind shifts',
                  'The depth of oceanic trenches',
                  'The color of deep sea volcanic pebbles',
                  'The lunar eclipse phase'
                ].map((opt, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedOption(i)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                      selectedOption === i
                        ? 'bg-teal-50/80 border-teal-500 text-teal-900 font-semibold'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <span>{opt}</span>
                    {selectedOption === i && <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />}
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => { setActiveStep(2); setSelectedOption(null); }}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
                >
                  <span>Next: Speaking Task</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ACTIVITY 2: SPEAKING & ORAL EXPRESSION */}
          {activeStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 uppercase">
                  Oral Expression & Thought Formulation
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  Solar Rainwater Harvesting: Your Idea Pitch
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Imagine your campus is installing an automated clean energy system. Speak into your microphone for 45 seconds explaining how solar power can keep the campus botanical garden green.
                </p>
              </div>

              {/* Visual Prompt Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center space-x-4">
                <div className="w-16 h-16 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 border border-teal-200">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-900">Prompt Clues:</p>
                  <p className="text-slate-500">• Why is solar energy renewable? • How does automated drip irrigation conserve water?</p>
                </div>
              </div>

              {/* Microphone Recorder Simulation */}
              <div className="p-8 rounded-2xl border border-slate-200 bg-slate-50/50 text-center space-y-4">
                <button
                  onClick={() => {
                    if (!isRecording) {
                      setIsRecording(true);
                      setTimeout(() => {
                        setIsRecording(false);
                        setRecorded(true);
                      }, 4000);
                    }
                  }}
                  className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto transition-all shadow-md ${
                    isRecording
                      ? 'bg-rose-600 text-white animate-pulse ring-8 ring-rose-100'
                      : recorded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-teal-600 hover:bg-teal-700 text-white hover:scale-105'
                  }`}
                >
                  <Mic className="w-9 h-9" />
                </button>

                <div>
                  <p className="text-xs font-bold text-slate-800">
                    {isRecording ? 'Listening... Recording in progress' : recorded ? 'Recording Complete ✓' : 'Click to Record Voice'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {isRecording ? 'Speak clearly at normal conversational volume' : recorded ? 'Speech captured: 42 seconds' : 'Max 60 seconds'}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setActiveStep(1)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  ← Previous Task
                </button>

                <button
                  onClick={() => { setActiveStep(3); setRecorded(false); }}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
                >
                  <span>Next: Reading Fluency</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ACTIVITY 3: ORAL READING FLUENCY (ORF & WCPM) */}
          {activeStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <div className="space-y-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase">
                  Oral Reading Fluency (WCPM)
                </span>
                <h3 className="text-base font-extrabold text-slate-900">
                  The Whispering Mangroves of the Coromandel
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Read the passage aloud clearly into your microphone. The AI engine evaluates pronunciation, rhythm, and Words Correct Per Minute (WCPM).
                </p>
              </div>

              {/* Reading Passage Card */}
              <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-sm leading-relaxed text-slate-800 font-serif shadow-inner">
                &ldquo;The mangrove forests along the coast are extraordinary sanctuaries. Their entangled submerged roots protect the shoreline from tidal surges and provide quiet nurseries for young sea life. When the tide gently recedes, mudskippers and fiddler crabs emerge under the warm tropical sunlight.&rdquo;
              </div>

              {/* Fluency Metrics Preview */}
              <div className="grid grid-cols-3 gap-3 text-center text-xs">
                <div className="p-3 bg-teal-50 border border-teal-200 rounded-xl">
                  <span className="text-[10px] text-teal-700 font-bold block">TARGET SPEED</span>
                  <span className="font-extrabold text-teal-900 text-sm">90 - 120 WCPM</span>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-[10px] text-emerald-700 font-bold block">ACCURACY BENCHMARK</span>
                  <span className="font-extrabold text-emerald-900 text-sm">&ge; 95%</span>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <span className="text-[10px] text-indigo-700 font-bold block">CEFR STAGE</span>
                  <span className="font-extrabold text-indigo-900 text-sm">Level B1</span>
                </div>
              </div>

              <div className="pt-4 flex justify-between">
                <button
                  onClick={() => setActiveStep(2)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50"
                >
                  ← Previous Task
                </button>

                <button
                  onClick={() => setActiveSubTab('report')}
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center space-x-1.5"
                >
                  <span>Submit & View Diagnostic</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: VOCABULARY DICTIONARY EXPLORER                                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'dictionary' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Achariya VoiceLab Vocabulary Explorer</h3>
              <p className="text-xs text-slate-500">Grade 5 Lexical Bank with Auditory Pronunciations & Sentences</p>
            </div>
            <span className="text-xs bg-teal-50 text-teal-800 border border-teal-200 font-bold px-3 py-1 rounded-full">
              5 Words Cached
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { word: 'Ecosystem', pos: 'noun', def: 'A biological community of interacting organisms and their physical environment.', sent: 'The mangrove forest forms a vibrant coastal ecosystem.' },
              { word: 'Photosynthesis', pos: 'noun', def: 'The process by which green plants synthesize nutrients using sunlight.', sent: 'Leaves capture solar photons to conduct photosynthesis.' },
              { word: 'Resilience', pos: 'noun', def: 'The capacity to recover quickly from difficulties; toughness.', sent: 'The banyan aerial roots demonstrate remarkable natural resilience.' },
              { word: 'Symbiosis', pos: 'noun', def: 'A mutually beneficial interaction between different biological organisms.', sent: 'Bees and flowering plants live in perfect ecological symbiosis.' }
            ].map((v, i) => (
              <div key={i} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline space-x-2">
                    <span className="font-extrabold text-slate-900 text-sm">{v.word}</span>
                    <span className="text-[10px] text-teal-700 italic font-mono">{v.pos}</span>
                  </div>
                  <button
                    onClick={() => playAudioSpeech(v.word)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 text-teal-700 hover:bg-teal-50 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-600">{v.def}</p>
                <p className="text-[11px] text-slate-500 italic bg-white p-2 rounded-lg border border-slate-200/60">
                  &ldquo;{v.sent}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: CEFR DIAGNOSTIC REPORT CARD                                        */}
      {/* ========================================================================= */}
      {activeSubTab === 'report' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">CEFR Diagnostic Speech Snapshot</h3>
              <p className="text-xs text-slate-500">Evaluated on Nov 6, 2026 · Achariya VoiceLab Neural Acoustic Model</p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold px-3 py-1 rounded-full">
              Proficient (Level B1)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-1">
              <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Reading Rate</span>
              <div className="text-2xl font-black text-teal-900">114 WCPM</div>
              <span className="text-[11px] text-teal-700">Top 10% of Grade 5 benchmark</span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Pronunciation Accuracy</span>
              <div className="text-2xl font-black text-emerald-900">96.2%</div>
              <span className="text-[11px] text-emerald-700">Phonemic precision across vowels & plosives</span>
            </div>
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1">
              <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Expressive Intonation</span>
              <div className="text-2xl font-black text-indigo-900">Exemplary</div>
              <span className="text-[11px] text-indigo-700">Natural cadence at punctuation marks</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
            <span className="font-bold text-slate-900 block">Pedagogical Recommendation:</span>
            <p className="text-slate-600 leading-relaxed">
              Aarav demonstrates strong oral comprehension and confident fluency. Recommended next steps include reading higher complexity expository non-fiction and participating in inter-campus debate clubs.
            </p>
          </div>
        </div>
      )}

      {/* In-app Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
