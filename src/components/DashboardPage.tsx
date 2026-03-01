import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ShieldCheck, AlertCircle, CheckCircle2, Info, ArrowRight, Loader2, Sparkles, BarChart3, History, ExternalLink, User, Trash2 } from "lucide-react";
import { analyzeTitle, VerificationResult, PRGIError } from "../services/geminiService";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<{ code?: string, message: string } | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);

  const fetchHistory = async () => {
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (data.history) setHistory(data.history);
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const deleteHistoryItem = async (id: number) => {
    try {
      const res = await fetch(`/api/history/${id}`, { method: "DELETE" });
      if (res.ok) {
        setHistory(prev => prev.filter(item => item.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete history item:", err);
    }
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          fetchHistory();
        }
      })
      .catch(() => setUser(null));
  }, []);

  const validateTitle = (val: string) => {
    if (!val.trim()) {
      return "Title cannot be empty.";
    }
    if (val.trim().length < 3) {
      return "Title must be at least 3 characters long.";
    }
    if (val.trim().length > 100) {
      return "Title must be less than 100 characters.";
    }
    // Basic formatting: Allow letters, numbers, spaces, and common punctuation like hyphens or ampersands
    const formatRegex = /^[a-zA-Z0-9\s&\-'.]+$/;
    if (!formatRegex.test(val.trim())) {
      return "Title contains invalid characters. Use only letters, numbers, spaces, and basic punctuation (&, -, ', .).";
    }
    return null;
  };

  const handleAnalyze = async () => {
    const vError = validateTitle(title);
    if (vError) {
      setValidationError(vError);
      return;
    }
    
    setValidationError(null);
    setIsAnalyzing(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new PRGIError(data.code || "UNKNOWN_ERROR", data.message || "Analysis failed");
      }

      setResult(data);
      
      // Save to history if logged in
      if (user) {
        fetch("/api/history", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            verdict: data.verdict,
            probability: data.probability
          })
        }).then(() => fetchHistory());
      }
    } catch (err: any) {
      console.error("Analysis Error:", err);
      if (err instanceof PRGIError) {
        setError({ code: err.code, message: err.message });
      } else {
        setError({ message: err.message || "An unexpected error occurred. Please try again." });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 80) return "text-emerald-500";
    if (prob >= 50) return "text-amber-500";
    return "text-red-500";
  };

  const getProbabilityBg = (prob: number) => {
    if (prob >= 80) return "bg-emerald-500";
    if (prob >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 py-8 md:py-12 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {user ? t("dashboard.welcome", { name: user.name.split(' ')[0] }) : t("dashboard.title")}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            {user ? t("dashboard.continueAnalysis") : t("dashboard.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-primary/10 rounded-xl border border-primary/20">
          <ShieldCheck className="text-primary size-5" />
          <span className="text-sm font-bold text-primary">{t("dashboard.systemOnline")}</span>
        </div>
      </div>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-8 md:p-10 shadow-xl border-slate-200 dark:border-slate-700"
      >
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{t("dashboard.label")}</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="text-slate-400 group-focus-within:text-primary transition-colors size-5" />
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                placeholder={t("dashboard.placeholder")}
                className="w-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-2xl py-5 pl-14 pr-40 text-lg font-medium outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all dark:text-white"
              />
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-primary hover:bg-primary/90 disabled:bg-slate-300 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-primary/20"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    {t("dashboard.analyzing")}
                  </>
                ) : (
                  <>
                    <Sparkles className="size-5" />
                    {t("dashboard.verifyBtn")}
                  </>
                )}
              </button>
            </div>
            {validationError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm font-bold text-red-500 mt-2 flex items-center gap-1.5"
              >
                <AlertCircle className="size-4" />
                {validationError}
              </motion.p>
            )}
            <p className="text-xs text-slate-400 dark:text-slate-500 ml-1">
              Tip: Avoid generic terms like "News", "Daily", or "Weekly" for better results.
            </p>
          </div>
        </div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl flex items-start gap-3 text-red-600 dark:text-red-400"
        >
          <AlertCircle className="size-5 mt-0.5 flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <span className="font-bold text-sm uppercase tracking-wider opacity-70">
              {error.code ? `Error Code: ${error.code}` : "Verification Error"}
            </span>
            <span className="font-medium">{error.message}</span>
          </div>
        </motion.div>
      )}

      {/* Results Section */}
      <AnimatePresence mode="wait">
        {result && !isAnalyzing && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Main Score Card */}
            <div className="lg:col-span-2 flex flex-col gap-8">
              <div className="glass-card rounded-3xl p-8 shadow-lg border-slate-200 dark:border-slate-700">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Analysis Result</h2>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-slate-500">Proposed Title:</span>
                      <span className="text-sm font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-md">"{title}"</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className={`text-5xl font-black ${getProbabilityColor(result.probability)}`}>
                      {result.probability}%
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Approval Probability</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Unique Words Score</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">{result.uniqueWordsScore}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.uniqueWordsScore}%` }}
                        className="bg-primary h-3 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Distinctive Syntax</span>
                      <span className="text-sm font-black text-slate-900 dark:text-white">{result.distinctiveSyntaxScore}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.distinctiveSyntaxScore}%` }}
                        className="bg-cyan-500 h-3 rounded-full"
                      ></motion.div>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border flex items-start gap-4 ${
                  result.probability >= 80 ? 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:border-emerald-800/30' :
                  result.probability >= 50 ? 'bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-800/30' :
                  'bg-red-50 border-red-100 dark:bg-red-900/10 dark:border-red-800/30'
                }`}>
                  <div className={`p-2 rounded-lg ${
                    result.probability >= 80 ? 'bg-emerald-500' :
                    result.probability >= 50 ? 'bg-amber-500' :
                    'bg-red-500'
                  } text-white`}>
                    {result.probability >= 80 ? <CheckCircle2 className="size-6" /> : <AlertCircle className="size-6" />}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className={`font-bold ${getProbabilityColor(result.probability)}`}>Verdict: {result.verdict}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {result.probability >= 80 
                        ? "Your title has a high chance of approval. It follows all PRGI guidelines and shows significant uniqueness."
                        : result.probability >= 50
                        ? "Your title is moderately unique but may face challenges during manual review. Consider the suggestions below."
                        : "Your title is highly likely to be rejected. It conflicts with existing titles or violates specific PRGI rules."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Compliance Checklist */}
              <div className="glass-card rounded-3xl p-8 shadow-lg border-slate-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <ShieldCheck className="text-primary size-6" />
                  Compliance Checklist
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { label: "Disallowed Words", issues: result.complianceChecklist?.disallowedWords || [] },
                    { label: "Prefix/Suffix Rules", issues: result.complianceChecklist?.prefixSuffix || [] },
                    { label: "Phonetic Similarity", issues: result.complianceChecklist?.phoneticMatches || [] },
                    { label: "Semantic Uniqueness", issues: result.complianceChecklist?.semanticSimilarity || [] },
                  ].map((check, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                      {(check.issues?.length || 0) === 0 ? (
                        <CheckCircle2 className="text-emerald-500 size-5 mt-0.5 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="text-red-500 size-5 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold text-slate-900 dark:text-white">{check.label}</span>
                        {(check.issues?.length || 0) === 0 ? (
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Passed</span>
                        ) : (
                          <ul className="text-xs text-red-600 dark:text-red-400 list-disc list-inside font-medium">
                            {check.issues.map((issue, iIdx) => (
                              <li key={iIdx}>{issue}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Results */}
            <div className="flex flex-col gap-8">
              {/* Similar Titles */}
              <div className="glass-card rounded-3xl p-6 shadow-lg border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <History className="text-primary size-5" />
                  Similar Titles Found
                </h3>
                <div className="flex flex-col gap-3">
                  {(result.similarTitles || []).length > 0 ? (
                    result.similarTitles.map((match, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-primary/30 transition-all group">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{match.title}</span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            match.matchPercentage >= 80 ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {match.matchPercentage}% MATCH
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 leading-relaxed">{match.reason}</p>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <span>Est. {match.year}</span>
                          <span>{match.location}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <div className="size-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 className="text-emerald-500 size-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">No direct matches</p>
                      <p className="text-xs text-slate-500">Master database search complete.</p>
                    </div>
                  )}
                </div>
                {(result.similarTitles || []).length > 0 && (
                  <button className="w-full mt-4 py-3 text-xs font-bold text-primary hover:bg-primary/5 rounded-xl transition-all flex items-center justify-center gap-2">
                    View Full Database Report <ExternalLink className="size-3" />
                  </button>
                )}
              </div>

              {/* Smart Suggestions - Moved to sidebar bottom or kept here if needed */}
              <div className="glass-card rounded-3xl p-6 shadow-lg border-slate-200 dark:border-slate-700 bg-primary/5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Sparkles className="text-primary size-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Quick Tips</h3>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Titles with unique nouns and specific geographic identifiers have a 40% higher approval rate.
                </p>
                <div className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                  <div className="size-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Info className="text-amber-500 size-4" />
                  </div>
                  <p className="text-[10px] text-slate-500 leading-tight">
                    Analysis is based on current PRGI regulatory frameworks.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Suggestions Section - New Prominent Section */}
      <AnimatePresence>
        {result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-8"
          >
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                <Sparkles className="text-amber-500 size-7" />
                AI-Generated Alternatives
              </h2>
              <p className="text-slate-500 font-medium">Unique title suggestions based on your search and PRGI availability</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(result.suggestions || []).map((suggest, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => {
                    setTitle(suggest.title);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="glass-card p-8 rounded-[2rem] border-2 border-primary/5 hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800 shadow-lg"
                >
                  <div className="absolute top-0 right-0 p-4">
                    <div className="flex items-center gap-1 bg-emerald-100 dark:bg-emerald-900/30 px-3 py-1 rounded-full">
                      <BarChart3 className="text-emerald-500 size-3" />
                      <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{suggest.probability}%</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-4">
                    <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <Sparkles className="size-6" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                        {suggest.title}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        {suggest.reason}
                      </p>
                    </div>
                    <div className="pt-4 flex items-center text-xs font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      Use this title <ArrowRight className="size-3 ml-1" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Section */}
      {user && history.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6 mt-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
              <History className="text-primary size-7" />
              Verification History
            </h2>
            <span className="text-sm font-bold text-slate-400">{history.length} Recent Checks</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1 relative group/title">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Title</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-1">
                      {item.title}
                    </h3>
                    {/* Tooltip */}
                    <div className="absolute bottom-full left-0 mb-2 hidden group-hover/title:block z-50">
                      <div className="bg-slate-900 text-white text-xs py-2 px-3 rounded-lg shadow-xl whitespace-normal max-w-[250px] break-words border border-slate-700">
                        {item.title}
                        <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    item.probability >= 80 ? 'bg-emerald-100 text-emerald-700' :
                    item.probability >= 50 ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.probability}% Match
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`size-2 rounded-full ${getProbabilityBg(item.probability)}`} />
                      <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.verdict}</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteHistoryItem(item.id);
                      }}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                      title="Delete from history"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {new Date(item.created_at).toLocaleDateString(undefined, { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                    <button 
                      onClick={() => {
                        setTitle(item.title);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="text-[10px] font-black text-primary hover:underline flex items-center gap-1"
                    >
                      Re-verify <ArrowRight className="size-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Initial State / Empty State */}
      {!result && !isAnalyzing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <div className="size-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <Search className="text-slate-300 size-12" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Ready to verify?</h2>
          <p className="text-slate-500 max-w-md">
            Enter a proposed title above to start the multi-layered NLP analysis against the PRGI master database.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 w-full max-w-3xl">
            {[
              { icon: <ShieldCheck className="text-primary" />, label: "Compliance Check", desc: "PRGI Rule Validation" },
              { icon: <BarChart3 className="text-cyan-500" />, label: "Similarity Score", desc: "NLP-based Matching" },
              { icon: <Sparkles className="text-amber-500" />, label: "AI Suggestions", desc: "Unique Alternatives" },
            ].map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/50 flex flex-col items-center gap-2">
                <div className="size-10 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-1">
                  {item.icon}
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{item.label}</span>
                <span className="text-xs text-slate-500">{item.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Loading State Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-white/80 dark:bg-background-dark/80 backdrop-blur-md flex flex-col items-center justify-center gap-8"
          >
            <div className="relative">
              <div className="size-32 rounded-full border-4 border-primary/10 border-t-primary animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="text-primary size-12 animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Analyzing Title...</h2>
              <div className="flex flex-col gap-1">
                <p className="text-slate-500 font-medium flex items-center gap-2">
                  <span className="size-1.5 bg-primary rounded-full animate-ping"></span>
                  Checking phonetic similarity across 160k+ records
                </p>
                <p className="text-slate-400 text-sm">Evaluating semantic compliance with PRGI guidelines</p>
              </div>
            </div>
            <div className="w-64 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-full bg-primary"
              ></motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
