import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, RotateCcw, CheckCircle2, Sparkles, TrendingUp, BookOpen, Volume2 } from 'lucide-react';
import { apiPost } from '../lib/api';

// ── Passages the student can choose from ─────────────────────────────────────
const PASSAGES = [
  {
    level: 'Easy',
    color: 'emerald',
    title: 'The Sun and the Seed',
    text: 'A tiny seed is buried deep in the dark soil. Rain falls and the seed begins to grow. The roots push down and a green shoot pushes up. Soon the sun gives it energy to make food.'
  },
  {
    level: 'Medium',
    color: 'teal',
    title: 'Energy in Nature',
    text: 'A machine with moving parts that converts thermal energy into mechanical power is called an engine. In nature, trees capture solar photons to fuel cellular respiration.'
  },
  {
    level: 'Hard',
    color: 'indigo',
    title: 'Science of Sound',
    text: 'Sound travels in longitudinal pressure waves through any elastic medium such as air, water, or metal. The frequency of vibration determines the pitch and the amplitude determines the volume perceived by the listener.'
  }
];

interface EvaluatedWord {
  word: string;
  expectedWord?: string;
  status: 'CORRECT' | 'SUBSTITUTED' | 'OMITTED' | 'MISPRONOUNCED';
  confidence: number;
}

interface SpeechResult {
  success: boolean;
  transcript: string;
  provider: string;
  metrics: {
    wcpm: number;
    pronunciationScore: number;
    accuracyScore: number;
    fluencyScore: number;
    totalWordsSpoken: number;
    durationSeconds: number;
    cefrLevel: 'A1' | 'A2' | 'B1' | 'B2' | 'C1';
  };
  words: EvaluatedWord[];
  articulationStrengths: string[];
  coachingTips: string[];
}

const CEFR_COLOR: Record<string, string> = {
  A1: 'bg-rose-100 text-rose-700 border-rose-200',
  A2: 'bg-orange-100 text-orange-700 border-orange-200',
  B1: 'bg-amber-100 text-amber-700 border-amber-200',
  B2: 'bg-teal-100 text-teal-700 border-teal-200',
  C1: 'bg-indigo-100 text-indigo-700 border-indigo-200'
};

function ScoreArc({ value, label }: { value: number; label: string }) {
  // Simple semicircle progress indicator using SVG
  const radius = 36;
  const circ = Math.PI * radius;
  const filled = (value / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="90" height="52" viewBox="0 0 90 52">
        <path d="M 10 46 A 35 35 0 0 1 80 46" fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" />
        <path
          d="M 10 46 A 35 35 0 0 1 80 46"
          fill="none"
          stroke={value >= 80 ? '#14b8a6' : value >= 60 ? '#6366f1' : '#f59e0b'}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
        />
        <text x="45" y="40" textAnchor="middle" className="text-sm font-extrabold" fill="#0f172a" fontSize="14" fontWeight="800">{value}</text>
      </svg>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">{label}</span>
    </div>
  );
}

export const VoiceActivity: React.FC = () => {
  const [passageIdx, setPassageIdx] = useState(1);
  const [phase, setPhase] = useState<'pick' | 'ready' | 'recording' | 'analyzing' | 'result'>('pick');
  const [elapsed, setElapsed] = useState(0);
  const [result, setResult] = useState<SpeechResult | null>(null);
  const [error, setError] = useState('');

  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);

  const passage = PASSAGES[passageIdx];

  const speakPassage = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(passage.text);
      u.rate = 0.85;
      window.speechSynthesis.speak(u);
    }
  };

  const startRecording = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      recorder.start(200);
      mediaRef.current = recorder;
      startTimeRef.current = Date.now();
      setElapsed(0);
      setPhase('recording');

      timerRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);
    } catch {
      setError('Microphone access denied. Please allow microphone in your browser and try again.');
    }
  };

  const stopRecording = useCallback(() => {
    if (!mediaRef.current) return;
    mediaRef.current.onstop = async () => {
      if (timerRef.current) clearInterval(timerRef.current);
      const duration = (Date.now() - startTimeRef.current) / 1000;
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });

      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const audioBase64 = reader.result as string;
        setPhase('analyzing');
        try {
          const data = await apiPost<SpeechResult>('/api/activity/lsr/evaluate-phonemes', {
            audioBase64,
            referencePassage: passage.text,
            durationSeconds: duration,
            gradeLevel: 'G5'
          });
          setResult(data);
          setPhase('result');
        } catch (err: any) {
          setError(err?.message ?? 'Speech analysis service unavailable — configure WHISPER_API_KEY or GEMINI_API_KEY in .env');
          setPhase('ready');
        }
      };
      reader.readAsDataURL(blob);

      // Stop all mic tracks
      mediaRef.current?.stream?.getTracks().forEach(t => t.stop());
    };
    mediaRef.current.stop();
  }, [passage.text]);

  // Auto-stop after 60 seconds
  useEffect(() => {
    if (phase === 'recording' && elapsed >= 60) stopRecording();
  }, [elapsed, phase, stopRecording]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      mediaRef.current?.stream?.getTracks().forEach(t => t.stop());
    };
  }, []);

  const reset = () => {
    setResult(null);
    setError('');
    setElapsed(0);
    setPhase('ready');
  };

  const mins = Math.floor(elapsed / 60);
  const secs = String(elapsed % 60).padStart(2, '0');

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-50 via-sky-50 to-indigo-50 border border-teal-200/60 rounded-3xl p-6">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold bg-teal-600 text-white px-3 py-1 rounded-full mb-2">
          <Mic className="w-3 h-3" />
          <span>VoiceLab · Oral Reading Fluency</span>
        </div>
        <h1 className="text-xl font-extrabold text-slate-900">Read Aloud Activity</h1>
        <p className="text-xs text-slate-500 mt-0.5">Pick a passage, listen to the model, then record yourself reading it aloud.</p>
      </div>

      {/* Passage picker */}
      {(phase === 'pick' || phase === 'ready') && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <h2 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-teal-500" /> Choose a Passage
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {PASSAGES.map((p, i) => (
              <button
                key={i}
                onClick={() => { setPassageIdx(i); setPhase('ready'); }}
                className={`rounded-2xl border-2 p-3 text-left transition-all ${
                  passageIdx === i && phase !== 'pick'
                    ? `border-${p.color}-400 bg-${p.color}-50`
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <span className={`text-[10px] font-extrabold uppercase tracking-wide text-${p.color}-600`}>{p.level}</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5 leading-tight">{p.title}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Passage + controls */}
      {phase !== 'pick' && phase !== 'result' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-extrabold uppercase tracking-wide text-${passage.color}-600`}>
              {passage.level} · {passage.title}
            </span>
            <button
              onClick={speakPassage}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-teal-700 font-semibold"
            >
              <Volume2 className="w-3.5 h-3.5" /> Listen first
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 font-serif text-sm text-slate-800 leading-relaxed">
            {passage.text}
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">{error}</div>
          )}

          {/* Recording controls */}
          <div className="flex flex-col items-center gap-3 pt-2">
            {phase === 'ready' && (
              <button
                onClick={startRecording}
                className="flex items-center gap-2 px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-sm shadow-sm transition-colors"
              >
                <Mic className="w-4 h-4" />
                Start Recording
              </button>
            )}

            {phase === 'recording' && (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse" />
                  <span className="font-mono font-bold text-rose-600 text-lg">{mins}:{secs}</span>
                  <span className="text-xs text-slate-400">Recording… (max 60s)</span>
                </div>
                <button
                  onClick={stopRecording}
                  className="flex items-center gap-2 px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-bold text-sm shadow-sm transition-colors"
                >
                  <MicOff className="w-4 h-4" />
                  Stop & Analyse
                </button>
              </>
            )}

            {phase === 'analyzing' && (
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-slate-500 font-medium">Analysing your speech…</span>
              </div>
            )}

            {(phase === 'ready' || phase === 'recording') && (
              <button
                onClick={() => setPhase('pick')}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Change passage
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {phase === 'result' && result && (
        <div className="space-y-5 animate-in fade-in">
          {/* Score meters */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-500" /> Your Fluency Report
              </h2>
              <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${CEFR_COLOR[result.metrics.cefrLevel] ?? ''}`}>
                CEFR {result.metrics.cefrLevel}
              </span>
            </div>

            <div className="flex justify-around mb-6">
              <ScoreArc value={result.metrics.pronunciationScore} label="Pronunciation" />
              <div className="flex flex-col items-center gap-1">
                <div className="w-20 h-20 rounded-full border-4 border-teal-500 flex items-center justify-center">
                  <div>
                    <p className="text-xl font-extrabold text-slate-900 text-center leading-none">{result.metrics.wcpm}</p>
                    <p className="text-[9px] font-bold text-slate-500 text-center">WCPM</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Fluency</span>
              </div>
              <ScoreArc value={result.metrics.accuracyScore} label="Accuracy" />
            </div>

            {/* Transcript with word highlights */}
            {result.transcript && (
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Your Transcript:</label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs leading-6 flex flex-wrap gap-1">
                  {result.words.map((w, i) => (
                    <span
                      key={i}
                      className={`px-1 py-0.5 rounded font-medium ${
                        w.status === 'CORRECT' ? 'bg-emerald-50 text-emerald-700' :
                        w.status === 'MISPRONOUNCED' ? 'bg-orange-50 text-orange-700' :
                        w.status === 'OMITTED' ? 'bg-rose-50 text-rose-600 line-through' :
                        'bg-amber-50 text-amber-700'
                      }`}
                      title={w.status}
                    >
                      {w.word}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 text-[10px] font-semibold text-slate-500 flex-wrap">
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 inline-block border border-emerald-200" /> Correct</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-orange-100 inline-block border border-orange-200" /> Mispronounced</span>
                  <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-sm bg-rose-100 inline-block border border-rose-200" /> Omitted</span>
                </div>
              </div>
            )}
          </div>

          {/* Strengths + coaching */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
              <h3 className="text-xs font-extrabold text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Articulation Strengths
              </h3>
              <ul className="space-y-1.5">
                {result.articulationStrengths.map((s, i) => (
                  <li key={i} className="text-xs text-emerald-700 leading-snug flex gap-2">
                    <span className="shrink-0 mt-0.5">•</span>{s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 space-y-2">
              <h3 className="text-xs font-extrabold text-indigo-800 flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5" /> Coaching Tips
              </h3>
              <ul className="space-y-1.5">
                {result.coachingTips.map((t, i) => (
                  <li key={i} className="text-xs text-indigo-700 leading-snug flex gap-2">
                    <span className="shrink-0 mt-0.5">•</span>{t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Provider tag + re-record */}
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono">Provider: {result.provider}</span>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 px-4 py-2 border border-teal-500 text-teal-700 rounded-xl text-xs font-bold hover:bg-teal-50 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Try Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
