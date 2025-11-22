import React, { useState, useCallback } from 'react';
import { translateAndAnalyze } from './services/geminiService';
import { Language, TranslationResponse } from './types';
import { SUPPORTED_LANGUAGES } from './constants';
import SegmentDisplay from './components/SegmentDisplay';
import { Spinner } from './components/Spinner';
import { 
  ArrowRightIcon, 
  LanguageIcon, 
  SparklesIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

const App: React.FC = () => {
  // State
  const [inputText, setInputText] = useState('');
  const [sourceLang, setSourceLang] = useState<Language>(Language.ENGLISH);
  const [targetLangs, setTargetLangs] = useState<Language[]>([Language.ITALIAN]);
  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hoveredMatchId, setHoveredMatchId] = useState<number | null>(null);

  // Handlers
  const handleTargetLangToggle = (lang: Language) => {
    setTargetLangs(prev => {
      if (prev.includes(lang)) {
        return prev.filter(l => l !== lang);
      } else {
        return [...prev, lang];
      }
    });
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    if (targetLangs.length === 0) {
      setError("Please select at least one target language.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await translateAndAnalyze(inputText, sourceLang, targetLangs);
      setResult(data);
    } catch (err) {
      setError("Failed to translate. Please try again or check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const availableTargets = SUPPORTED_LANGUAGES.filter(l => l !== sourceLang);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-brand-500/30">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-brand-500/10 rounded-lg">
              <LanguageIcon className="w-6 h-6 text-brand-500" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-400 to-indigo-400">
              LinguaSync
            </h1>
          </div>
          <div className="text-xs font-medium text-slate-500 border border-slate-800 rounded-full px-3 py-1">
            Powered by Gemini 2.5
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        
        {/* Controls Section */}
        <section className="space-y-6 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source Language */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Translate From</label>
              <div className="relative">
                <select 
                  value={sourceLang}
                  onChange={(e) => {
                    const newSource = e.target.value as Language;
                    setSourceLang(newSource);
                    // Remove new source from targets if present
                    setTargetLangs(prev => prev.filter(l => l !== newSource));
                  }}
                  className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none appearance-none transition-all"
                >
                  {SUPPORTED_LANGUAGES.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <ArrowRightIcon className="w-4 h-4 text-slate-500 rotate-90 md:rotate-0" />
                </div>
              </div>
            </div>

            {/* Target Languages */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-400 uppercase tracking-wider">Translate To</label>
              <div className="flex flex-wrap gap-2">
                {availableTargets.map(lang => {
                  const isSelected = targetLangs.includes(lang);
                  return (
                    <button
                      key={lang}
                      onClick={() => handleTargetLangToggle(lang)}
                      className={`
                        px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200
                        ${isSelected 
                          ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-900/20' 
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-200'}
                      `}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Text Input */}
          <div className="relative group">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text here to analyze syntax differences..."
              className="w-full h-32 bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-lg text-slate-200 placeholder-slate-500 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none resize-none transition-all"
            />
            <div className="absolute bottom-4 right-4">
               <button
                onClick={handleTranslate}
                disabled={isLoading || !inputText.trim()}
                className={`
                  flex items-center space-x-2 px-6 py-2 rounded-full font-bold shadow-lg transition-all transform
                  ${isLoading || !inputText.trim() 
                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                    : 'bg-brand-500 hover:bg-brand-400 text-white hover:scale-105 active:scale-95 shadow-brand-500/20'}
                `}
              >
                {isLoading ? (
                  <span>Translating...</span>
                ) : (
                  <>
                    <SparklesIcon className="w-5 h-5" />
                    <span>Analyze & Translate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 p-4 rounded-lg border border-red-900/50">
              <ExclamationCircleIcon className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </section>

        {/* Results Section */}
        {isLoading && <Spinner />}
        
        {result && !isLoading && (
          <section className="space-y-8 fade-in pb-20">
            
            {/* Source Breakout */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-500"></span>
                Original Text ({sourceLang})
              </h3>
              <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 leading-relaxed shadow-inner">
                {result.sourceSegments.map((seg, idx) => (
                  <SegmentDisplay 
                    key={`src-${idx}`} 
                    segment={seg} 
                    hoveredMatchId={hoveredMatchId} 
                    onHover={setHoveredMatchId} 
                  />
                ))}
              </div>
            </div>

            {/* Translations Grid */}
            <div className="grid grid-cols-1 gap-8">
              {result.translations.map((trans, tIdx) => (
                <div key={trans.language} className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    {trans.language} Translation
                  </h3>
                  <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-colors shadow-lg">
                    <div className="leading-relaxed">
                      {trans.segments.map((seg, sIdx) => (
                        <SegmentDisplay 
                          key={`trans-${tIdx}-${sIdx}`} 
                          segment={seg} 
                          hoveredMatchId={hoveredMatchId} 
                          onHover={setHoveredMatchId} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center text-sm text-slate-600">
              <p>Hover over any colored word to identify its counterpart in other languages.</p>
            </div>

          </section>
        )}
      </main>
    </div>
  );
};

export default App;
