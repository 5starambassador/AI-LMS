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
  Image as ImageIcon,
  ShieldCheck,
  MessageSquare,
  Film
} from 'lucide-react';

export const LsrStudentPortal: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeSubTab, setActiveSubTab] = useState<'levelTest' | 'beforeAfter' | 'activities' | 'dictionary' | 'report'>('levelTest');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recorded, setRecorded] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeVoiceTrack, setActiveVoiceTrack] = useState<'baseline' | 'current' | null>(null);
  const [activeDigitalActivity, setActiveDigitalActivity] = useState<'dubbing' | 'storybook' | 'conversation'>('dubbing');
  const [dubbingRecorded, setDubbingRecorded] = useState(false);
  const [conversationReply, setConversationReply] = useState<string | null>(null);
  const [portfolioAudioSynced, setPortfolioAudioSynced] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [step3Recorded, setStep3Recorded] = useState<boolean>(false);
  const [isStep3Recording, setIsStep3Recording] = useState<boolean>(false);
  const [vocabSentenceDraft, setVocabSentenceDraft] = useState<string>('');
  const [vocabCheckResult, setVocabCheckResult] = useState<{ wordUsed: string; score: string; feedback: string } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const checkVocabSentence = () => {
    const trimmed = vocabSentenceDraft.trim();
    if (trimmed.split(/\s+/).length < 4) {
      showToast('Please write a complete sentence (at least 4 words) using one of the 5 target words.');
      return;
    }
    const targetWords = ['Ecosystem', 'Photosynthesis', 'Resilience', 'Symbiosis', 'Estuary'];
    const matched = targetWords.find(w => trimmed.toLowerCase().includes(w.toLowerCase()));
    if (!matched) {
      setVocabCheckResult({
        wordUsed: 'Target Word Missing',
        score: 'Needs Revision',
        feedback: `Include at least one target word (${targetWords.join(', ')}) in a complete contextual sentence.`
      });
      return;
    }
    setVocabCheckResult({
      wordUsed: matched,
      score: trimmed.length >= 45 ? 'Proficient Contextual Usage' : 'Developing Contextual Usage',
      feedback: `Good use of "${matched}" in context! ${
        trimmed.length >= 45
          ? 'Sentence structure demonstrates clear domain meaning and grammatical fluency.'
          : 'Try expanding the sentence with a scientific or environmental detail to strengthen precision.'
      }`
    });
  };

  const playAudioSpeech = (text: string, rate = 0.95) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = rate;
      u.onstart = () => setIsPlayingAudio(true);
      u.onend = () => {
        setIsPlayingAudio(false);
        setActiveVoiceTrack(null);
      };
      u.onerror = () => {
        setIsPlayingAudio(false);
        setActiveVoiceTrack(null);
      };
      window.speechSynthesis.speak(u);
      showToast('Playing Achariya VoiceLab neural audio (India Cloud)...');
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
          <div className="text-[11px] text-slate-500 italic">Self-paced reading &amp; contextual reasoning</div>
        </div>
      </div>

      {/* 1B. AI English Language Lab Capabilities Telemetry Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-extrabold text-teal-700 uppercase tracking-wider block">125+ Levelled Checks</span>
          <span className="font-bold text-slate-900">L · S · R &amp; Vocabulary</span>
          <p className="text-[11px] text-slate-500 mt-0.5">Adaptive across Grades 1–12</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-extrabold text-sky-700 uppercase tracking-wider block">Achariya Cloud (India)</span>
          <span className="font-bold text-slate-900 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600" /> AI Speech Engine
          </span>
          <p className="text-[11px] text-slate-500 mt-0.5">Zero external audio retention</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-extrabold text-indigo-700 uppercase tracking-wider block">Before &amp; After Evidence</span>
          <span className="font-bold text-slate-900">78 → 114 WCPM (+46%)</span>
          <p className="text-[11px] text-slate-500 mt-0.5">Hearable start-vs-end growth</p>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <span className="text-[10px] font-extrabold text-emerald-700 uppercase tracking-wider block">Early Support Spotter</span>
          <span className="font-bold text-slate-900">No Support Flagged</span>
          <p className="text-[11px] text-slate-500 mt-0.5">Real-time L/S/R diagnostics</p>
        </div>
      </div>

      {/* 2. Light Sub-Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3 text-xs font-bold">
        <button
          onClick={() => setActiveSubTab('levelTest')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeSubTab === 'levelTest'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span>125+ Diagnostic Tasks</span>
        </button>

        <button
          onClick={() => setActiveSubTab('beforeAfter')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeSubTab === 'beforeAfter'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Before &amp; After Voice Evidence</span>
        </button>

        <button
          onClick={() => setActiveSubTab('activities')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-1.5 ${
            activeSubTab === 'activities'
              ? 'bg-teal-600 text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Dubbing, Storybooks &amp; Roleplay</span>
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
          <span>CEFR &amp; Fluency Snapshot</span>
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
                    onClick={() => playAudioSpeech("The coastal winds of the Coromandel Coast blow steadily during the retreating northeast monsoon. Ancient Coromandel navigators observed the low flight altitude of coastal dragonflies and sudden wind shifts to forecast impending rainfall, guiding maritime vessels safely into the historic port of Puducherry.")}
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

                {selectedOption !== null && (
                  <div
                    className={`mt-2 p-3 rounded-xl border text-xs font-semibold flex items-center space-x-2 ${
                      selectedOption === 0
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : 'bg-amber-50 border-amber-200 text-amber-800'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${selectedOption === 0 ? 'text-emerald-600' : 'text-amber-600'}`} />
                    <span>
                      {selectedOption === 0
                        ? 'Correct! Ancient Coromandel navigators tracked the low flight altitude of coastal dragonflies and sudden wind shifts to forecast rainfall.'
                        : 'Hint: Listen closely to the narration to hear which coastal wildlife and weather signs navigators watched before entering Puducherry.'}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setActiveStep(2)}
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
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Grade 5 Levelled Reading Passage</span>
                  <button
                    onClick={() => playAudioSpeech("The mangrove forests along the coast are extraordinary sanctuaries. Their entangled submerged roots protect the shoreline from tidal surges and provide quiet nurseries for young sea life. When the tide gently recedes, mudskippers and fiddler crabs emerge under the warm tropical sunlight.")}
                    className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 border border-teal-200 text-teal-800 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Listen to Model Passage</span>
                  </button>
                </div>
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-sm leading-relaxed text-slate-800 font-serif shadow-inner">
                  &ldquo;The mangrove forests along the coast are extraordinary sanctuaries. Their entangled submerged roots protect the shoreline from tidal surges and provide quiet nurseries for young sea life. When the tide gently recedes, mudskippers and fiddler crabs emerge under the warm tropical sunlight.&rdquo;
                </div>
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

              {/* Interactive Oral Reading Mic Control */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col items-center text-center space-y-3">
                <button
                  onClick={() => {
                    if (!isStep3Recording) {
                      setIsStep3Recording(true);
                      setTimeout(() => {
                        setIsStep3Recording(false);
                        setStep3Recorded(true);
                        showToast('Oral reading sample captured: 112 WCPM · 96.4% Accuracy (Accent-Neutral Evaluated)');
                      }, 1800);
                    }
                  }}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all shadow-xs ${
                    isStep3Recording
                      ? 'bg-rose-600 text-white animate-pulse'
                      : step3Recorded
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-teal-600 text-white hover:bg-teal-700'
                  }`}
                >
                  <Mic className="w-4 h-4" />
                  <span>
                    {isStep3Recording
                      ? 'Capturing Oral Reading...'
                      : step3Recorded
                      ? 'Re-record Oral Reading (112 WCPM ✓)'
                      : 'Record Oral Reading (WCPM)'}
                  </span>
                </button>

                {step3Recorded && (
                  <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold">
                    <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">112 WCPM (Target 90–120)</span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">96.4% Accuracy</span>
                    <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-800 border border-indigo-200">Prosody: Expressive</span>
                    <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-800 border border-sky-200">Indian-English Accent Neutrality Applied</span>
                  </div>
                )}
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
              { word: 'Symbiosis', pos: 'noun', def: 'A mutually beneficial interaction between different biological organisms.', sent: 'Bees and flowering plants live in perfect ecological symbiosis.' },
              { word: 'Estuary', pos: 'noun', def: 'The tidal mouth of a large river, where the freshwater tide meets coastal sea water.', sent: 'Brackish water in the coastal estuary nurtures juvenile mangrove crabs.' }
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

          {/* Interactive Contextual Sentence Construction Lab */}
          <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-teal-700 uppercase tracking-wider">Contextual Vocabulary & Sentence Construction</span>
                <h4 className="text-sm font-extrabold text-slate-900">Build Your Own Academic Sentence</h4>
              </div>
              <button
                onClick={checkVocabSentence}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Check Sentence Usage
              </button>
            </div>
            <input
              type="text"
              value={vocabSentenceDraft}
              onChange={e => setVocabSentenceDraft(e.target.value)}
              placeholder="Write a sentence using Ecosystem, Photosynthesis, Resilience, Symbiosis, or Estuary..."
              className="w-full p-3 rounded-xl border border-teal-200 bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />
            {vocabCheckResult && (
              <div className="p-3.5 rounded-xl bg-white border border-teal-200 text-xs space-y-1">
                <div className="flex items-center justify-between font-bold">
                  <span className="text-teal-800">Word Checked: {vocabCheckResult.wordUsed}</span>
                  <span className="text-emerald-700">{vocabCheckResult.score}</span>
                </div>
                <p className="text-slate-600">{vocabCheckResult.feedback}</p>
              </div>
            )}
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

          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 text-xs flex flex-wrap items-center justify-between gap-2">
            <div>
              <strong className="text-sky-950 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-700" />
                Accent-Neutral Language Evaluation Guarantee
              </strong>
              <p className="text-sky-900 mt-0.5">
                Achariya VoiceLab evaluates clarity, phonemic intelligibility, fluency, vocabulary, sentence structure, and comprehension independently of regional or international accent conformity.
              </p>
            </div>
            <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-white border border-sky-200 text-sky-800 shrink-0">
              No Accent Penalty Policy
            </span>
          </div>

          {/* 8-Dimension English Language Development Profile */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
              8-Dimension Baseline vs. Current Language Development Profile
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                { dim: 'Listening Comprehension', base: '76%', curr: '93%' },
                { dim: 'Speaking Ability', base: '71%', curr: '89%' },
                { dim: 'Reading Fluency', base: '78 WCPM', curr: '114 WCPM' },
                { dim: 'Reading Comprehension', base: '79%', curr: '92%' },
                { dim: 'Vocabulary', base: '74%', curr: '90%' },
                { dim: 'Pronunciation Clarity', base: '82%', curr: '95%' },
                { dim: 'Expression & Pitch', base: '72%', curr: '91%' },
                { dim: 'Language Confidence', base: '70%', curr: '94%' }
              ].map((d, idx) => (
                <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 block">{d.dim}</span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-black text-slate-900">{d.curr}</span>
                    <span className="text-[10px] text-emerald-700 font-bold">from {d.base}</span>
                  </div>
                </div>
              ))}
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

      {/* ========================================================================= */}
      {/* TAB 4: BEFORE & AFTER VOICE EVIDENCE STUDIO                               */}
      {/* ========================================================================= */}
      {activeSubTab === 'beforeAfter' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-0.5 rounded-full">
                Start of Year vs. Structured Learning Evidence
              </span>
              <h3 className="text-base font-extrabold text-slate-900 mt-1">
                Before-and-After Voice Progress · Parents Can Hear the Transformation
              </h3>
            </div>
            <button
              onClick={() => showToast('Before & After Voice Showcase link ready for admissions & PTM share!')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
            >
              Share Evidence with Parents
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            {/* BEFORE: June Baseline */}
            <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-[10px] uppercase">
                  BEFORE · June 2026 Baseline
                </span>
                <span className="font-mono font-bold text-amber-900">78 WCPM · 82.0% Acc</span>
              </div>
              <p className="text-slate-700 italic bg-white p-3 rounded-xl border border-amber-100 leading-relaxed">
                &ldquo;The... coastal winds... of Coromandel... blow steady during monsoon season.&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-amber-800 font-semibold">Hesitant pauses · CEFR A2 Emerging</span>
                <button
                  onClick={() => {
                    setActiveVoiceTrack('baseline');
                    playAudioSpeech('The... coastal winds... of Coromandel... blow steady... during monsoon season.', 0.72);
                  }}
                  className={`px-3.5 py-2 rounded-xl font-bold flex items-center space-x-1.5 ${
                    activeVoiceTrack === 'baseline' && isPlayingAudio
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-amber-600 hover:bg-amber-700 text-white'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Listen to Baseline Recording</span>
                </button>
              </div>
            </div>

            {/* AFTER: November Structured Learning */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-[10px] uppercase">
                  AFTER · November 2026 Current
                </span>
                <span className="font-mono font-bold text-emerald-900">114 WCPM · 96.2% Acc (+46%)</span>
              </div>
              <p className="text-slate-700 italic bg-white p-3 rounded-xl border border-emerald-100 leading-relaxed">
                &ldquo;The coastal winds of the Coromandel Coast blow steadily during the retreating northeast monsoon, guiding maritime vessels safely home.&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-emerald-800 font-semibold">Expressive intonation · CEFR B1 Confident</span>
                <button
                  onClick={() => {
                    setActiveVoiceTrack('current');
                    playAudioSpeech('The coastal winds of the Coromandel Coast blow steadily during the retreating northeast monsoon, guiding maritime vessels safely home.', 0.98);
                  }}
                  className={`px-3.5 py-2 rounded-xl font-bold flex items-center space-x-1.5 ${
                    activeVoiceTrack === 'current' && isPlayingAudio
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Listen to Current Recording</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong className="text-slate-900">5-Checkpoint Longitudinal Voice Samples (Consent &amp; Retention Compliant):</strong>
              <button
                onClick={() => {
                  setPortfolioAudioSynced(true);
                  showToast('All 5 VoiceLab audio samples linked to Aarav Sundaram’s Student E-Portfolio!');
                }}
                className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-colors ${
                  portfolioAudioSynced
                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                    : 'bg-teal-700 hover:bg-teal-800 text-white'
                }`}
              >
                {portfolioAudioSynced ? 'Synced to Student Portfolio ✓' : 'Sync Audio Evidence to Portfolio'}
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {[
                { label: '1. Initial Speaking', date: 'Jun 2026', val: '71% Clarity' },
                { label: '2. Initial Reading', date: 'Jun 2026', val: '78 WCPM' },
                { label: '3. Periodic Sample', date: 'Sep 2026', val: '98 WCPM' },
                { label: '4. Year-End Speaking', date: 'Nov 2026', val: '89% Clarity' },
                { label: '5. Year-End Reading', date: 'Nov 2026', val: '114 WCPM' }
              ].map((s, idx) => (
                <div key={idx} className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-600 block">{s.label}</span>
                  <span className="font-extrabold text-teal-800 block mt-0.5">{s.val}</span>
                  <span className="text-[10px] text-slate-400">{s.date}</span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              Processed on <strong>Achariya Cloud Servers in India</strong> under institutional parent consent, encrypted retention, and authorised portfolio role-access policies.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 5: DIGITAL ACTIVITIES (DUBBING, STORYBOOKS & CONVERSATIONS)           */}
      {/* ========================================================================= */}
      {activeSubTab === 'activities' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Interactive Language Lab Activities · Confident Communicators
              </h3>
              <p className="text-xs text-slate-500">
                Engaging digital formats: Voice Dubbing, Levelled Interactive Storybooks &amp; AI Conversations
              </p>
            </div>
            <div className="flex items-center space-x-1.5 text-xs font-bold">
              {[
                { id: 'dubbing' as const, label: '🎬 Voice Dubbing' },
                { id: 'storybook' as const, label: '📖 Storybooks' },
                { id: 'conversation' as const, label: '💬 Roleplay Conversation' }
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setActiveDigitalActivity(m.id)}
                  className={`px-3 py-1.5 rounded-xl border transition-all ${
                    activeDigitalActivity === m.id
                      ? 'bg-sky-700 text-white border-sky-700 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {activeDigitalActivity === 'dubbing' && (
            <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-sky-300 uppercase tracking-wider">Character Voice Dubbing Studio</span>
                  <h4 className="text-base font-extrabold">Episode 4: Dr. Kalam&apos;s Young Rocket Engineers</h4>
                </div>
                <span className="px-3 py-1 bg-sky-500/20 border border-sky-400/40 rounded-full text-[11px] font-bold text-sky-200">
                  Target: Expressive Pitch &amp; Pacing
                </span>
              </div>
              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2 text-xs">
                <p className="text-slate-400">Dub this character cue inside the 6-second dialogue window:</p>
                <p className="text-base font-serif text-amber-200">
                  &ldquo;When aerodynamics and curiosity work together, every paper glider can teach us how satellites orbit Earth!&rdquo;
                </p>
              </div>
              <div className="flex items-center justify-between text-xs">
                <button
                  onClick={() => playAudioSpeech('When aerodynamics and curiosity work together, every paper glider can teach us how satellites orbit Earth!')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold flex items-center space-x-1.5"
                >
                  <Volume2 className="w-4 h-4 text-sky-300" />
                  <span>Hear Original Actor Timing</span>
                </button>
                <button
                  onClick={() => {
                    setDubbingRecorded(true);
                    showToast('Dubbing sync scored: 96% timing alignment & natural stress!');
                  }}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-xl font-bold flex items-center space-x-1.5"
                >
                  <Mic className="w-4 h-4" />
                  <span>{dubbingRecorded ? 'Dub Sync Score: 96% ✓' : 'Record Character Dub'}</span>
                </button>
              </div>
            </div>
          )}

          {activeDigitalActivity === 'storybook' && (
            <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-4 text-xs">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold text-amber-800 uppercase tracking-wider">Levelled Interactive Storybook · CEFR B1</span>
                  <h4 className="text-base font-extrabold text-slate-900">Chapter 2: The Whispering Banyan of Pondicherry</h4>
                </div>
                <button
                  onClick={() => playAudioSpeech('Beneath the vast canopy of the ancient banyan tree, aerial prop roots descended softly into the moist coastal earth.')}
                  className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold flex items-center space-x-1.5"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Read Aloud with Highlight</span>
                </button>
              </div>
              <p className="text-sm font-serif text-slate-800 bg-white p-5 rounded-2xl border border-amber-100 leading-relaxed">
                &ldquo;Beneath the vast canopy of the ancient banyan tree, aerial prop roots descended softly into the moist coastal earth, transforming one trunk into an entire living cathedral.&rdquo;
              </p>
              <p className="text-slate-600">
                125+ contextual comprehension &amp; vocabulary check prompts adjust dynamically to Aarav&apos;s reading pace.
              </p>
            </div>
          )}

          {activeDigitalActivity === 'conversation' && (
            <div className="p-6 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-4 text-xs">
              <div className="flex items-center space-x-2 text-indigo-900 font-extrabold">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                <span>Interactive AI Conversation · Campus Science Fair Tour Guide</span>
              </div>
              <div className="space-y-2.5">
                <div className="p-3 bg-white rounded-2xl border border-indigo-100 max-w-xl">
                  <span className="text-[10px] font-bold text-indigo-700 uppercase block">Achariya AI Partner</span>
                  <p className="text-slate-800 mt-0.5">&ldquo;Welcome to the Eco-Robotics Pavilion! Can you explain in one spoken sentence why your solar pump saves groundwater?&rdquo;</p>
                </div>
                {conversationReply && (
                  <div className="p-3 bg-indigo-700 text-white rounded-2xl max-w-xl ml-auto">
                    <span className="text-[10px] font-bold text-indigo-200 uppercase block">Your Spoken Response (Scored: 95% Fluency)</span>
                    <p className="mt-0.5">&ldquo;{conversationReply}&rdquo;</p>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const sample = 'Our soil-moisture sensor activates the solar drip pump only when roots need hydration, cutting water waste by forty percent.';
                    setConversationReply(sample);
                    showToast('Conversational turn evaluated on Achariya India Cloud: B1+ Spontaneous Fluency!');
                  }}
                  className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl font-bold flex items-center space-x-1.5"
                >
                  <Mic className="w-4 h-4" />
                  <span>Speak Turn Reply</span>
                </button>
              </div>
            </div>
          )}
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
