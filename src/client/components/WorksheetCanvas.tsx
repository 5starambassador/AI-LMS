import React, { useRef, useState, useEffect } from 'react';
import {
  PenTool,
  Eraser,
  Square,
  Circle,
  Type,
  RotateCcw,
  RotateCw,
  Download,
  Save,
  CheckCircle2,
  Trash2,
  Minus,
  Sparkles,
  Layers,
  Palette,
  Maximize2,
  Minimize2,
  Grid,
  Send,
  ArrowRight,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

export interface WorksheetCanvasProps {
  onAssignAsHomework?: (title: string, subject: string) => void;
}

export const WorksheetCanvas: React.FC<WorksheetCanvasProps> = ({ onAssignAsHomework }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<'pen' | 'highlighter' | 'eraser' | 'line' | 'rect' | 'circle' | 'arrow' | 'text'>('pen');
  const [color, setColor] = useState('#0D9488');
  const [lineWidth, setLineWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [savedSnapshot, setSavedSnapshot] = useState<ImageData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [gridMode, setGridMode] = useState<'blank' | 'graph' | 'ruled' | 'dots'>('graph');
  const [zoomLevel, setZoomLevel] = useState(100);

  // Undo / Redo History Stack
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Template Selection
  const [activeTemplate, setActiveTemplate] = useState<'angles' | 'photosynthesis' | 'fractions' | 'cartesian' | 'blank'>('angles');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignTitle, setAssignTitle] = useState('Grade 5 CPA Angle Classification');
  const [assignSubject, setAssignSubject] = useState('Mathematics');
  const [assignedToast, setAssignedToast] = useState(false);

  // Text Tool State
  const [textInputPos, setTextInputPos] = useState<{ x: number; y: number } | null>(null);
  const [textInputValue, setTextInputValue] = useState('');

  const colors = [
    { label: 'Teal', value: '#0D9488' },
    { label: 'Slate', value: '#1E293B' },
    { label: 'Emerald', value: '#059669' },
    { label: 'Sky', value: '#0284C7' },
    { label: 'Indigo', value: '#4F46E5' },
    { label: 'Purple', value: '#9333EA' },
    { label: 'Rose', value: '#E11D48' },
    { label: 'Amber', value: '#D97706' },
  ];

  useEffect(() => {
    initCanvas();
  }, [activeTemplate, gridMode]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Coordinate resolution
    canvas.width = 1100;
    canvas.height = 680;

    // Draw background
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid Pattern
    drawGrid(ctx);

    // Draw Template
    if (activeTemplate === 'angles') {
      drawAngleTemplate(ctx);
    } else if (activeTemplate === 'photosynthesis') {
      drawPhotosynthesisTemplate(ctx);
    } else if (activeTemplate === 'fractions') {
      drawFractionsTemplate(ctx);
    } else if (activeTemplate === 'cartesian') {
      drawCartesianTemplate(ctx);
    }

    // Save initial state to history
    const initialData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory([initialData]);
    setHistoryIndex(0);
  };

  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    if (gridMode === 'blank') return;

    if (gridMode === 'graph') {
      ctx.strokeStyle = '#F1F5F9';
      ctx.lineWidth = 1;
      for (let x = 0; x < 1100; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 680);
        ctx.stroke();
      }
      for (let y = 0; y < 680; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1100, y);
        ctx.stroke();
      }
    } else if (gridMode === 'ruled') {
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 1;
      for (let y = 60; y < 680; y += 35) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1100, y);
        ctx.stroke();
      }
    } else if (gridMode === 'dots') {
      ctx.fillStyle = '#CBD5E1';
      for (let x = 30; x < 1100; x += 30) {
        for (let y = 30; y < 680; y += 30) {
          ctx.beginPath();
          ctx.arc(x, y, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  };

  const drawAngleTemplate = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Achariya Mathematics: Angle Classification & Measurement Laboratory', 50, 50);

    ctx.fillStyle = '#64748B';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Instructions: Measure angles ∠1, ∠2, and ∠3 with your protractor tool. Classify as Acute, Right, or Obtuse.', 50, 78);

    // Angle 1: Acute
    ctx.strokeStyle = '#1E293B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(100, 260);
    ctx.lineTo(280, 260);
    ctx.lineTo(230, 130);
    ctx.stroke();
    ctx.fillStyle = '#0D9488';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('∠1 = [       ]°', 130, 240);
    ctx.fillText('Type: [                 ]', 100, 300);

    // Angle 2: Right Angle (90°)
    ctx.beginPath();
    ctx.moveTo(420, 260);
    ctx.lineTo(600, 260);
    ctx.lineTo(420, 110);
    ctx.stroke();
    // Square symbol
    ctx.strokeRect(420, 240, 20, 20);
    ctx.fillText('∠2 = 90° (Right)', 430, 240);
    ctx.fillText('Type: [                 ]', 420, 300);

    // Angle 3: Obtuse Angle (135°)
    ctx.beginPath();
    ctx.moveTo(760, 260);
    ctx.lineTo(950, 260);
    ctx.lineTo(680, 150);
    ctx.stroke();
    ctx.fillText('∠3 = [       ]°', 760, 240);
    ctx.fillText('Type: [                 ]', 730, 300);
  };

  const drawPhotosynthesisTemplate = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Achariya Experiential Sciences: Leaf Cross-Section & Photosynthesis Cycle', 50, 50);

    ctx.fillStyle = '#64748B';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Annotate the diagram below: Label the Chloroplast, Stomata, and incoming Solar Photon wavelengths.', 50, 78);

    // Leaf oval outline
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(550, 320, 360, 180, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Central vein
    ctx.beginPath();
    ctx.moveTo(190, 320);
    ctx.lineTo(910, 320);
    ctx.stroke();

    ctx.fillStyle = '#059669';
    ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('☀️ Solar Energy (hν)', 260, 180);
    ctx.fillText('CO₂ Absorption → [          ]', 220, 460);
    ctx.fillText('O₂ Release ← [          ]', 680, 460);
  };

  const drawFractionsTemplate = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Achariya Mathematics: Equivalent Fraction Strips Laboratory', 50, 50);

    ctx.fillStyle = '#64748B';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Shade in equivalent fractions to demonstrate that 1/2 = 2/4 = 4/8 using your highlighter.', 50, 78);

    const startX = 80;
    const width = 940;

    // 1 Whole
    ctx.strokeRect(startX, 130, width, 55);
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('1 Whole (1 / 1)', 500, 165);

    // 1/2 strips
    ctx.strokeRect(startX, 210, width / 2, 55);
    ctx.strokeRect(startX + width / 2, 210, width / 2, 55);
    ctx.fillText('1 / 2', startX + width / 4 - 20, 245);
    ctx.fillText('1 / 2', startX + (3 * width) / 4 - 20, 245);

    // 1/4 strips
    for (let i = 0; i < 4; i++) {
      ctx.strokeRect(startX + (i * width) / 4, 290, width / 4, 55);
      ctx.fillText('1 / 4', startX + (i * width) / 4 + width / 8 - 15, 325);
    }

    // 1/8 strips
    for (let i = 0; i < 8; i++) {
      ctx.strokeRect(startX + (i * width) / 8, 370, width / 8, 55);
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('1/8', startX + (i * width) / 8 + width / 16 - 12, 405);
    }
  };

  const drawCartesianTemplate = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Achariya Mathematics: 4-Quadrant Coordinate Geometry Plane', 50, 50);

    // Center origin at (550, 360)
    const ox = 550;
    const oy = 360;

    // Axes
    ctx.strokeStyle = '#0F172A';
    ctx.lineWidth = 2.5;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(100, oy);
    ctx.lineTo(1000, oy);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(ox, 100);
    ctx.lineTo(ox, 620);
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('X', 1010, oy + 5);
    ctx.fillText('-X', 70, oy + 5);
    ctx.fillText('Y', ox - 5, 90);
    ctx.fillText('-Y', ox - 8, 640);
    ctx.fillText('O (0,0)', ox + 8, oy - 8);

    // Quadrants
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 16px sans-serif';
    ctx.fillText('Quadrant I (+, +)', 750, 200);
    ctx.fillText('Quadrant II (-, +)', 250, 200);
    ctx.fillText('Quadrant III (-, -)', 250, 520);
    ctx.fillText('Quadrant IV (+, -)', 750, 520);
  };

  // Canvas Mouse Interactions
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (tool === 'text') {
      setTextInputPos({ x: e.clientX, y: e.clientY });
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setSavedSnapshot(ctx.getImageData(0, 0, canvas.width, canvas.height));
    setStartX(x);
    setStartY(y);
    setIsDrawing(true);

    if (tool === 'pen' || tool === 'highlighter' || tool === 'eraser') {
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (tool === 'pen') {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'highlighter') {
      ctx.strokeStyle = color + '55'; // 35% opacity
      ctx.lineWidth = lineWidth * 4;
      ctx.lineCap = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'eraser') {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = lineWidth * 5;
      ctx.lineCap = 'round';
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'line') {
      if (savedSnapshot) ctx.putImageData(savedSnapshot, 0, 0);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'rect') {
      if (savedSnapshot) ctx.putImageData(savedSnapshot, 0, 0);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.strokeRect(startX, startY, x - startX, y - startY);
    } else if (tool === 'circle') {
      if (savedSnapshot) ctx.putImageData(savedSnapshot, 0, 0);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
      ctx.beginPath();
      ctx.arc(startX, startY, radius, 0, Math.PI * 2);
      ctx.stroke();
    } else if (tool === 'arrow') {
      if (savedSnapshot) ctx.putImageData(savedSnapshot, 0, 0);
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(x, y);
      ctx.stroke();
      // Arrowhead
      const angle = Math.atan2(y - startY, x - startX);
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 15 * Math.cos(angle - Math.PI / 6), y - 15 * Math.sin(angle - Math.PI / 6));
      ctx.lineTo(x - 15 * Math.cos(angle + Math.PI / 6), y - 15 * Math.sin(angle + Math.PI / 6));
      ctx.closePath();
      ctx.fill();
    }
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save to history
    const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, currentData]);
    setHistoryIndex(newHistory.length);
  };

  // Undo / Redo
  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  // Add typed text onto canvas
  const handlePlaceText = () => {
    if (!textInputPos || !textInputValue.trim()) {
      setTextInputPos(null);
      setTextInputValue('');
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (textInputPos.x - rect.left) * scaleX;
    const y = (textInputPos.y - rect.top) * scaleY;

    ctx.fillStyle = color;
    ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(textInputValue, x, y);

    const currentData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    setHistory(prev => [...prev.slice(0, historyIndex + 1), currentData]);
    setHistoryIndex(prev => prev + 1);

    setTextInputPos(null);
    setTextInputValue('');
  };

  // Export PNG
  const exportImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `Achariya_Worksheet_${activeTemplate}_2026.png`;
    link.href = dataUrl;
    link.click();
  };

  // Handle Assign as Homework
  const handleConfirmAssign = () => {
    if (onAssignAsHomework) {
      onAssignAsHomework(assignTitle, assignSubject);
    }
    setAssignModalOpen(false);
    setAssignedToast(true);
    setTimeout(() => setAssignedToast(false), 4000);
  };

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-900/95 p-4 flex flex-col justify-between overflow-hidden' : 'pb-16'}`}>
      {/* Toast Notification */}
      {assignedToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-2xl flex items-center justify-between text-xs font-bold shadow-md animate-in fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Worksheet successfully published and assigned to Grade 5A Homework Hub!</span>
          </div>
          <button onClick={() => setAssignedToast(false)} className="text-emerald-700 hover:text-emerald-900">✕</button>
        </div>
      )}

      {/* 1. Header Toolbar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-700 border border-teal-200/60 flex items-center justify-center font-bold">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900">Interactive Worksheet Canvas Studio</h1>
            <p className="text-xs text-slate-500">Vector annotations, curriculum templates, and 1-click homework publishing.</p>
          </div>
        </div>

        {/* Template & Fullscreen Controls */}
        <div className="flex items-center space-x-2">
          {/* Template Selector */}
          <select
            value={activeTemplate}
            onChange={e => setActiveTemplate(e.target.value as any)}
            className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
          >
            <option value="angles">📐 CPA Angle Classification</option>
            <option value="photosynthesis">🌿 Leaf Photosynthesis Cycle</option>
            <option value="fractions">📊 Equivalent Fraction Strips</option>
            <option value="cartesian">📈 4-Quadrant Coordinate Grid</option>
            <option value="blank">📄 Clean Blank Canvas</option>
          </select>

          {/* Grid Background Switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            {(['blank', 'graph', 'ruled', 'dots'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => setGridMode(mode)}
                className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                  gridMode === mode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors border border-slate-200"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Canvas'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Drawing Action & Color Toolbar */}
      <div className="bg-white rounded-2xl p-3 border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Tools Palette */}
        <div className="flex items-center space-x-1 font-bold">
          <button
            onClick={() => setTool('pen')}
            className={`p-2 rounded-xl transition-all ${tool === 'pen' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            title="Fine Freehand Pen"
          >
            <PenTool className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('highlighter')}
            className={`p-2 rounded-xl transition-all ${tool === 'highlighter' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            title="Fluorescent Highlighter"
          >
            <Sparkles className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('line')}
            className={`p-2 rounded-xl transition-all ${tool === 'line' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            title="Straight Line"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('arrow')}
            className={`p-2 rounded-xl transition-all ${tool === 'arrow' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            title="Arrow Pointer"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('rect')}
            className={`p-2 rounded-xl transition-all ${tool === 'rect' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            title="Rectangle Tool"
          >
            <Square className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('circle')}
            className={`p-2 rounded-xl transition-all ${tool === 'circle' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            title="Circle / Ellipse"
          >
            <Circle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('text')}
            className={`p-2 rounded-xl transition-all ${tool === 'text' ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            title="Click Canvas to Type Text"
          >
            <Type className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-2 rounded-xl transition-all ${tool === 'eraser' ? 'bg-rose-600 text-white shadow-xs' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'}`}
            title="Precision Eraser"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        {/* Color Palette */}
        <div className="flex items-center space-x-1.5 pl-3 border-l border-slate-200">
          {colors.map(c => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              className={`w-6 h-6 rounded-full transition-transform ${color === c.value ? 'scale-125 ring-2 ring-slate-400 ring-offset-1' : 'hover:scale-110'}`}
              style={{ backgroundColor: c.value }}
              title={c.label}
            />
          ))}
        </div>

        {/* Stroke Width Selector */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
          {[1, 3, 6, 10].map(width => (
            <button
              key={width}
              onClick={() => setLineWidth(width)}
              className={`px-2.5 py-1 rounded-lg transition-all ${lineWidth === width ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
            >
              {width}px
            </button>
          ))}
        </div>

        {/* History & Export */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 rounded-xl transition-colors text-slate-700"
            title="Undo"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 bg-slate-50 hover:bg-slate-100 disabled:opacity-30 rounded-xl transition-colors text-slate-700"
            title="Redo"
          >
            <RotateCw className="w-4 h-4" />
          </button>
          <button
            onClick={initCanvas}
            className="p-2 bg-slate-50 hover:bg-rose-50 hover:text-rose-700 rounded-xl transition-colors text-slate-700"
            title="Clear Canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            onClick={exportImage}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold flex items-center space-x-1 transition-colors border border-slate-200"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PNG</span>
          </button>

          <button
            onClick={() => setAssignModalOpen(true)}
            className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center space-x-1 shadow-xs transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Assign as Homework</span>
          </button>
        </div>
      </div>

      {/* 3. Interactive High-Res Canvas Viewport */}
      <div className={`relative bg-slate-100 rounded-3xl p-4 flex items-center justify-center overflow-auto shadow-inner border border-slate-200/90 ${isFullscreen ? 'flex-1 max-h-[80vh]' : ''}`}>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="bg-white rounded-2xl shadow-lg cursor-crosshair max-w-full h-auto"
        />

        {/* Text Annotation Floating Input Modal */}
        {textInputPos && (
          <div
            className="fixed z-50 bg-white p-3 rounded-2xl shadow-2xl border border-slate-300 flex items-center space-x-2 animate-in fade-in"
            style={{ left: textInputPos.x - 20, top: textInputPos.y - 45 }}
          >
            <input
              type="text"
              autoFocus
              placeholder="Type annotation text..."
              value={textInputValue}
              onChange={e => setTextInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handlePlaceText()}
              className="text-xs p-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-500"
            />
            <button
              onClick={handlePlaceText}
              className="px-2.5 py-1.5 bg-teal-600 text-white text-xs font-bold rounded-lg shadow-xs"
            >
              Add
            </button>
            <button
              onClick={() => { setTextInputPos(null); setTextInputValue(''); }}
              className="text-slate-400 hover:text-slate-600 text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 4. Assign as Homework Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 p-6 space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Send className="w-5 h-5 text-teal-600" />
                <h3 className="text-base font-extrabold text-slate-900">Publish Worksheet to Class</h3>
              </div>
              <button onClick={() => setAssignModalOpen(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Homework Title:</label>
                <input
                  type="text"
                  value={assignTitle}
                  onChange={e => setAssignTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Subject:</label>
                <select
                  value={assignSubject}
                  onChange={e => setAssignSubject(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 font-medium"
                >
                  <option value="Mathematics">Mathematics (CPA Laboratory)</option>
                  <option value="Experiential Sciences">Experiential Sciences</option>
                  <option value="English">English & Oratory Arts</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Classroom:</label>
                <input
                  type="text"
                  disabled
                  value="Grade 5 - Innovation Studio A (28 Scholars)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 font-medium"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setAssignModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssign}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                Publish & Notify Scholars →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
