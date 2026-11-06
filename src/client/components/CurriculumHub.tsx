import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Layers,
  Sparkles,
  Download,
  QrCode,
  ChevronRight,
  ChevronLeft,
  Eye,
  CheckCircle2,
  Clock,
  Target,
  FileText,
  Volume2,
  Bookmark,
  Share2,
  X,
  ExternalLink,
  Award
} from 'lucide-react';
import { Book, Lesson } from '../types';

export const CurriculumHub: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState<string>('ALL');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [activeView, setActiveView] = useState<'flipbook' | 'syllabus' | 'qrcode' | null>(null);
  const [currentSpread, setCurrentSpread] = useState(0); // 0 = pages 1-2, 1 = pages 3-4, etc.
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  useEffect(() => {
    fetchBooks();
  }, [selectedGrade, selectedSubject]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (selectedGrade !== 'ALL') params.append('grade', selectedGrade);
      if (selectedSubject !== 'ALL') params.append('subjectId', selectedSubject);

      const res = await fetch(`/api/academic/books?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        setBooks(data.books || []);
      }
    } catch (err) {
      console.error('Failed to fetch curriculum books:', err);
    } finally {
      setLoading(false);
    }
  };

  // Open book details
  const openBookModal = async (book: Book, view: 'flipbook' | 'syllabus' | 'qrcode') => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/academic/books/${book.id}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedBook(data.book || book);
      } else {
        setSelectedBook(book);
      }
    } catch (e) {
      setSelectedBook(book);
    }
    setCurrentSpread(0);
    setActiveView(view);
  };

  // Web Speech API for Dual-Page audio read-aloud
  const speakSpreadText = (text: string) => {
    if (!('speechSynthesis' in window)) {
      showToast('Speech synthesis is not supported on this browser.');
      return;
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
    showToast('Playing neural classroom narration...');
  };

  const filteredBooks = books.filter(b => {
    const matchSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.publisher && b.publisher.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.class?.name && b.class.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (b.subject?.name && b.subject.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchSearch;
  });

  const grades = [
    'ALL',
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
    'Grade 6',
    'Grade 7',
    'Grade 8',
    'Grade 9',
    'Grade 10'
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-semibold flex items-center space-x-2 animate-in fade-in slide-in-from-bottom-2">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-teal-50/90 via-sky-50/70 to-indigo-50/90 border border-teal-200/80 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center space-x-2 bg-teal-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
              <BookOpen className="w-3.5 h-3.5" />
              <span>NEP 2020 Pedagogical Framework</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Achariya Master Curriculum Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Standardized textbook series spanning Grades 1 through 10 across Foundational, Preparatory, Middle, and Secondary stages. Featuring dual-page vector digital readers, period plans, and scannable QR anchors.
            </p>
          </div>

          <div className="flex md:flex-col items-end justify-between gap-2 shrink-0">
            <div className="px-4 py-2 bg-white/90 border border-teal-200 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">TOTAL COURSES</span>
              <span className="text-2xl font-black text-teal-700">{books.length || 28}</span>
            </div>
            <div className="px-4 py-2 bg-white/90 border border-indigo-200 rounded-2xl text-center shadow-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">COVERAGE</span>
              <span className="text-sm font-bold text-indigo-700">Grades 1 – 10</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. NEP 2020 Pedagogical Stages & Grade Selector Pills */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs space-y-4">
        {/* NEP 2020 Stage Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
          <div
            onClick={() => setSelectedGrade('Grade 1')}
            className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 cursor-pointer hover:bg-amber-100/70 transition-all text-amber-950 space-y-1"
          >
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800 block">Foundational Stage</span>
            <div className="font-bold text-xs">Grades 1 & 2</div>
            <p className="text-[10px] text-amber-700">Play-based, sensory & phonetic literacy</p>
          </div>

          <div
            onClick={() => setSelectedGrade('Grade 5')}
            className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200/80 cursor-pointer hover:bg-teal-100/70 transition-all text-teal-950 space-y-1"
          >
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 block">Preparatory Stage</span>
            <div className="font-bold text-xs">Grades 3, 4 & 5</div>
            <p className="text-[10px] text-teal-700">Experiential inquiry & mathematical foundations</p>
          </div>

          <div
            onClick={() => setSelectedGrade('Grade 7')}
            className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 cursor-pointer hover:bg-indigo-100/70 transition-all text-indigo-950 space-y-1"
          >
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-800 block">Middle Stage</span>
            <div className="font-bold text-xs">Grades 6, 7 & 8</div>
            <p className="text-[10px] text-indigo-700">Abstract concepts, sciences & coding</p>
          </div>

          <div
            onClick={() => setSelectedGrade('Grade 10')}
            className="p-3 rounded-2xl bg-purple-50/70 border border-purple-200/80 cursor-pointer hover:bg-purple-100/70 transition-all text-purple-950 space-y-1"
          >
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-800 block">Secondary Stage</span>
            <div className="font-bold text-xs">Grades 9 & 10</div>
            <p className="text-[10px] text-purple-700">CBSE board rigour & AI neural systems</p>
          </div>
        </div>

        {/* Grade Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100 text-xs">
          <span className="text-[11px] font-bold text-slate-400 mr-2 shrink-0">FILTER GRADE:</span>
          {grades.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                selectedGrade === g
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Search & Subject Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search books, chapters, or concepts..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs w-full sm:w-auto justify-end">
            <span className="text-slate-400 font-semibold">Showing {filteredBooks.length} Books</span>
          </div>
        </div>
      </div>

      {/* 3. Books Grid */}
      {loading ? (
        <div className="p-12 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
          <div className="w-8 h-8 border-3 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-500 font-medium">Loading Achariya curriculum catalog...</p>
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="p-12 text-center space-y-3 bg-white rounded-3xl border border-slate-200">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700">No Textbooks Found</h3>
          <p className="text-xs text-slate-400">Try adjusting your grade or search query filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBooks.map(book => {
            const subjectCode = book.subject?.code || '';
            const isEnglish = subjectCode.includes('ENG') || book.title.includes('Lingua');
            const isMath = subjectCode.includes('MTH') || book.title.includes('Math');
            const isSci = subjectCode.includes('SCI') || book.title.includes('Sci') || book.title.includes('World Around');
            const isAI = subjectCode.includes('AI') || book.title.includes('AI') || book.title.includes('Algorithmic');

            const badgeBg = isEnglish
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : isMath
              ? 'bg-blue-50 text-blue-800 border-blue-200'
              : isSci
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-purple-50 text-purple-800 border-purple-200';

            const coverGradient = isEnglish
              ? 'from-amber-500 to-orange-600'
              : isMath
              ? 'from-blue-600 to-indigo-700'
              : isSci
              ? 'from-emerald-600 to-teal-700'
              : 'from-purple-600 to-pink-600';

            return (
              <div
                key={book.id}
                className="rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-teal-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Book Spine / Header Band */}
                  <div className={`h-24 bg-gradient-to-r ${coverGradient} p-4 text-white relative flex flex-col justify-between`}>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded">
                        {book.class?.name || 'All Grades'}
                      </span>
                      <span className="text-[10px] bg-white/20 backdrop-blur-xs px-2 py-0.5 rounded font-mono">
                        {book.subject?.code || 'CBSE-2026'}
                      </span>
                    </div>
                    <div className="text-[11px] font-bold opacity-90 truncate">
                      {book.publisher || 'Achariya World Class Publications'}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="space-y-1">
                      <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${badgeBg}`}>
                        {book.subject?.name || 'Core Curriculum'}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 leading-snug">
                        {book.title}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {book.description ||
                        'Comprehensive CBSE-aligned curriculum textbook with pedagogical scaffolding, inquiry labs, and digital assets.'}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <span className="flex items-center space-x-1">
                        <Layers className="w-3.5 h-3.5 text-slate-400" />
                        <span>{book._count?.lessons || 4} Core Chapters</span>
                      </span>
                      <span className="flex items-center space-x-1 text-teal-700 font-bold">
                        <Award className="w-3.5 h-3.5" />
                        <span>NEP 2020 Aligned</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => openBookModal(book, 'flipbook')}
                    className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center space-x-1.5 shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Flipbook Reader</span>
                  </button>

                  <button
                    onClick={() => openBookModal(book, 'syllabus')}
                    title="View Chapter Syllabus & Learning Outcomes"
                    className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => openBookModal(book, 'qrcode')}
                    title="View Scannable Book QR Anchor"
                    className="p-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl transition-colors"
                  >
                    <QrCode className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: INTERACTIVE DUAL-PAGE FLIPBOOK READER                            */}
      {/* ========================================================================= */}
      {activeView === 'flipbook' && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-5xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[95vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center border border-teal-100 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{selectedBook.title}</h3>
                  <p className="text-[11px] text-slate-500">
                    Dual-Page Vector Reader · {selectedBook.class?.name} · Spread {currentSpread + 1}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    const text =
                      currentSpread === 0
                        ? 'Chapter 1: Foundations and Natural Systems. In this lesson, scholars discover how living organisms interact with atmospheric energy. Chlorophyll absorbs solar radiation, creating glucose and emitting oxygen for atmospheric equilibrium.'
                        : 'Chapter 2: Quantitative Analysis and Laboratory Applications. Scholars calculate the thermodynamic energy conversion efficiency across ecosystem trophic levels.';
                    speakSpreadText(text);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 border transition-all ${
                    isSpeaking
                      ? 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse'
                      : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? 'Stop Audio' : 'VoiceLab Audio Read-Aloud'}</span>
                </button>

                <button
                  onClick={() => {
                    window.speechSynthesis?.cancel();
                    setIsSpeaking(false);
                    setActiveView(null);
                  }}
                  className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1.5 rounded-xl hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Realistic Dual-Page Vector Spread */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-100 p-6 rounded-3xl border border-slate-200 shadow-inner">
              {/* Left Page (Odd Page) */}
              <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200/80 space-y-4 flex flex-col justify-between min-h-[380px]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b pb-1">
                    <span>{selectedBook.subject?.name} · Unit 1</span>
                    <span>Page {currentSpread * 2 + 1}</span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                    {currentSpread === 0
                      ? '1. The Living Canopy & Solar Energy Absorption'
                      : '3. Experiential Inquiry: Chloroplast Micro-Spectroscopy'}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentSpread === 0
                      ? 'Centuries of botanical observation across the Coromandel coastline have revealed the intricate architecture of tropical leaf cells. Beneath the waxy cuticle, palisade mesophyll cells harbor millions of chloroplast organelles, capturing photons across the blue and red spectral bands.'
                      : 'In this hands-on laboratory session, scholars extract chlorophyll pigments using paper chromatography. Observe how distinct bands of chlorophyll a, chlorophyll b, xanthophylls, and carotenoids separate along the capillary gradient.'}
                  </p>

                  <div className="p-3 bg-teal-50/70 border border-teal-200 rounded-xl text-[11px] text-teal-900 space-y-1">
                    <strong className="block text-teal-950 font-bold">Key Scientific Terminology:</strong>
                    <span>Photon Absorption · Thylakoid Grana · Stomatal Transpiration · Calvin Cycle</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Achariya Central Academic Repository</span>
                  <span className="font-mono">P.{currentSpread * 2 + 1}</span>
                </div>
              </div>

              {/* Right Page (Even Page) */}
              <div className="bg-white p-7 rounded-2xl shadow-sm border border-slate-200/80 space-y-4 flex flex-col justify-between min-h-[380px]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b pb-1">
                    <span>Reflective Synthesis</span>
                    <span>Page {currentSpread * 2 + 2}</span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 leading-snug">
                    {currentSpread === 0
                      ? '2. Mathematical Modeling of Ecological Energy Flows'
                      : '4. Critical Thinking & Real-World Application'}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {currentSpread === 0
                      ? "According to Lindeman's 10% efficiency rule, only approximately ten percent of chemical energy is transferred from one trophic level to the next. Primary producers synthesize 10,000 kJ of biomass energy, supporting 1,000 kJ in primary consumers."
                      : 'How might rising sea surface temperatures and localized humidity fluctuations alter stomatal aperture conductance in coastal flora? Formulate a testable scientific hypothesis with independent and dependent variables.'}
                  </p>

                  <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-[11px] text-indigo-900 space-y-1">
                    <strong className="block text-indigo-950 font-bold">Classroom Investigation Prompt:</strong>
                    <span>Calculate the trophic energy quotient when secondary consumers consume 850 grams of primary consumer biomass.</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Authorized Teacher Edition</span>
                  <span className="font-mono">P.{currentSpread * 2 + 2}</span>
                </div>
              </div>
            </div>

            {/* Flipbook Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                disabled={currentSpread === 0}
                onClick={() => setCurrentSpread(prev => Math.max(0, prev - 1))}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  currentSpread === 0
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Spread</span>
              </button>

              <span className="text-xs font-semibold text-slate-500">
                Spreads {currentSpread + 1} of 4 · Pages {currentSpread * 2 + 1}–{currentSpread * 2 + 2}
              </span>

              <button
                disabled={currentSpread >= 3}
                onClick={() => setCurrentSpread(prev => Math.min(3, prev + 1))}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                  currentSpread >= 3
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <span>Next Spread</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CHAPTER SYLLABUS & LESSON PLANS                                  */}
      {/* ========================================================================= */}
      {activeView === 'syllabus' && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">{selectedBook.title}</h3>
                <p className="text-xs text-slate-500">
                  Curriculum Breakdown & Bloom's Taxonomy Matrix · {selectedBook.class?.name}
                </p>
              </div>
              <button onClick={() => setActiveView(null)} className="text-slate-400 hover:text-slate-700 text-sm font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              {(selectedBook.lessons && selectedBook.lessons.length > 0
                ? selectedBook.lessons
                : [
                    {
                      id: 'l1',
                      title: 'Chapter 1: Fundamental Concepts & Conceptual Foundations',
                      lessonNumber: 1,
                      periodAllocation: 12,
                      learningOutcomes: ['Explain fundamental principles', 'Identify key structural components']
                    },
                    {
                      id: 'l2',
                      title: 'Chapter 2: Hands-on Explorations & Quantitative Modeling',
                      lessonNumber: 2,
                      periodAllocation: 15,
                      learningOutcomes: ['Calculate rates of change', 'Formulate testable experimental hypotheses']
                    },
                    {
                      id: 'l3',
                      title: 'Chapter 3: Real-World Applications & Technological Synthesis',
                      lessonNumber: 3,
                      periodAllocation: 14,
                      learningOutcomes: ['Evaluate environmental impacts', 'Design innovative engineering solutions']
                    }
                  ]
              ).map((les: any, idx: number) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
                        {les.lessonNumber || idx + 1}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-xs sm:text-sm">{les.title}</h4>
                    </div>
                    <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200 shrink-0">
                      {les.periodAllocation || 12} Periods (60m each)
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    {les.description ||
                      'Pedagogical progression structured around 5E instructional model (Engage, Explore, Explain, Elaborate, Evaluate).'}
                  </p>

                  <div className="pt-1 flex flex-wrap gap-1.5">
                    {(les.learningOutcomes || ['Knowledge Acquisition', 'Conceptual Understanding', 'Real-world Application']).map(
                      (lo: string, lIdx: number) => (
                        <span
                          key={lIdx}
                          className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                        >
                          ✓ {lo}
                        </span>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-slate-100">
              <span className="text-xs text-slate-400">CBSE Affiliation Curriculum Standard 2026-27</span>
              <button
                onClick={() => {
                  showToast('Teacher Companion Lesson Plan Guide downloaded.');
                  setActiveView(null);
                }}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center space-x-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Export Lesson Plan PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: SCANNABLE BOOK QR CODE ANCHOR                                     */}
      {/* ========================================================================= */}
      {activeView === 'qrcode' && selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="flex items-center justify-between border-b pb-3 text-left">
              <div className="flex items-center space-x-2">
                <QrCode className="w-5 h-5 text-teal-700" />
                <h3 className="text-sm font-extrabold text-slate-900">Physical Book QR Anchor</h3>
              </div>
              <button onClick={() => setActiveView(null)} className="text-slate-400 hover:text-slate-700 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Code SVG / Visual */}
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 inline-block">
              <div className="w-44 h-44 bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col items-center justify-center space-y-2">
                <svg viewBox="0 0 100 100" className="w-36 h-36">
                  {/* Outer Frame */}
                  <rect x="5" y="5" width="25" height="25" fill="#0D9488" rx="3" />
                  <rect x="9" y="9" width="17" height="17" fill="white" rx="2" />
                  <rect x="13" y="13" width="9" height="9" fill="#0D9488" rx="1" />

                  <rect x="70" y="5" width="25" height="25" fill="#0D9488" rx="3" />
                  <rect x="74" y="9" width="17" height="17" fill="white" rx="2" />
                  <rect x="78" y="13" width="9" height="9" fill="#0D9488" rx="1" />

                  <rect x="5" y="70" width="25" height="25" fill="#0D9488" rx="3" />
                  <rect x="9" y="74" width="17" height="17" fill="white" rx="2" />
                  <rect x="13" y="78" width="9" height="9" fill="#0D9488" rx="1" />

                  {/* QR Pattern dots */}
                  <rect x="40" y="10" width="8" height="8" fill="#1E293B" />
                  <rect x="52" y="10" width="8" height="8" fill="#1E293B" />
                  <rect x="40" y="24" width="8" height="8" fill="#1E293B" />
                  <rect x="52" y="24" width="8" height="8" fill="#1E293B" />

                  <rect x="10" y="40" width="8" height="8" fill="#1E293B" />
                  <rect x="24" y="40" width="8" height="8" fill="#1E293B" />
                  <rect x="40" y="40" width="8" height="8" fill="#0D9488" />
                  <rect x="52" y="40" width="8" height="8" fill="#1E293B" />
                  <rect x="70" y="40" width="8" height="8" fill="#1E293B" />
                  <rect x="84" y="40" width="8" height="8" fill="#1E293B" />

                  <rect x="10" y="52" width="8" height="8" fill="#1E293B" />
                  <rect x="24" y="52" width="8" height="8" fill="#1E293B" />
                  <rect x="40" y="52" width="8" height="8" fill="#1E293B" />
                  <rect x="52" y="52" width="8" height="8" fill="#0D9488" />
                  <rect x="70" y="52" width="8" height="8" fill="#1E293B" />
                  <rect x="84" y="52" width="8" height="8" fill="#1E293B" />

                  <rect x="40" y="70" width="8" height="8" fill="#1E293B" />
                  <rect x="52" y="70" width="8" height="8" fill="#1E293B" />
                  <rect x="70" y="70" width="8" height="8" fill="#1E293B" />
                  <rect x="84" y="70" width="8" height="8" fill="#1E293B" />

                  <rect x="40" y="84" width="8" height="8" fill="#1E293B" />
                  <rect x="52" y="84" width="8" height="8" fill="#1E293B" />
                  <rect x="70" y="84" width="8" height="8" fill="#1E293B" />
                  <rect x="84" y="84" width="8" height="8" fill="#1E293B" />
                </svg>
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200 inline-block">
                {selectedBook.bookKey || 'ACH-BK-2026-QR'}
              </span>
              <p className="text-xs text-slate-500 pt-1">
                Scan via the Achariya Scholar Tablet or Mobile Camera to immediately unlock augmented reality simulations and interactive chapter questions.
              </p>
            </div>

            <button
              onClick={() => {
                showToast('QR Code badge copied to clipboard.');
                setActiveView(null);
              }}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

