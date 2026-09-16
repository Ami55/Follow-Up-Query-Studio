import React, { useState } from "react";
import { 
  Bot, 
  Send, 
  Sparkles, 
  RotateCcw, 
  ExternalLink, 
  ArrowRight, 
  Terminal, 
  BookOpen, 
  MessageSquare 
} from "lucide-react";
import { translations } from "../data/translations";
import { SimulationTurn } from "../types";

interface AiSearchSimulatorProps {
  lang: 'en' | 'fa';
  initialQuery?: string;
  topicContext?: string;
}

export const AiSearchSimulator: React.FC<AiSearchSimulatorProps> = ({
  lang,
  initialQuery,
  topicContext,
}) => {
  const t = translations[lang];
  const isRtl = lang === "fa";

  const [inputQuery, setInputQuery] = useState(initialQuery || "");
  const [loading, setLoading] = useState(false);
  const [turns, setTurns] = useState<SimulationTurn[]>([
    {
      id: "turn-welcome",
      role: "assistant",
      query: lang === "fa" ? "شروع گفتگو" : "Initial Greeting",
      content: lang === "fa"
        ? "سلام! من موتور جستجوی هوش مصنوعی چندمرحله‌ای (Conversational AI Search) هستم. یک موضوع یا پرسش اولیه بپرسید تا ببینید چگونه با تکنیک Query Fan-Out پرسش‌های فرعی را در پس‌زمینه جستجو و پاسخ را سنتز می‌کنم."
        : "Hello! I am a Conversational AI Search engine simulator. Ask an initial or follow-up query to watch Query Fan-Out search triggers and multi-turn citation in action.",
      fanOutSearchesTriggered: [
        "Conversational search multi-turn taxonomy",
        "AI Overviews query fan-out behavior",
        "Authoritative source verification 2026"
      ],
      suggestedNextQueries: [
        lang === "fa" ? "بهترین ابزارهای سئو برای بررسی Fan-Out کدامند؟" : "What are the best SEO tools to track Query Fan-Out?",
        lang === "fa" ? "چگونه فرمت جداول مقایسه‌ای شانس استناد در Perplexity را افزایش می‌دهد؟" : "Why do comparison tables increase AI citation rates?",
        lang === "fa" ? "مراحل ۵ گانه سفر محاوره‌ای لوئیزا فرام چیست؟" : "Explain Louisa Frahm's 5 stages of follow-up queries."
      ],
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  ]);

  React.useEffect(() => {
    setTurns((prev) => {
      if (prev.length <= 1) {
        return [
          {
            id: "turn-welcome",
            role: "assistant",
            query: lang === "fa" ? "شروع گفتگو" : "Initial Greeting",
            content: lang === "fa"
              ? "سلام! من موتور جستجوی هوش مصنوعی چندمرحله‌ای (Conversational AI Search) هستم. یک موضوع یا پرسش اولیه بپرسید تا ببینید چگونه با تکنیک Query Fan-Out پرسش‌های فرعی را در پس‌زمینه جستجو و پاسخ را سنتز می‌کنم."
              : "Hello! I am a Conversational AI Search engine simulator. Ask an initial or follow-up query to watch Query Fan-Out search triggers and multi-turn citation in action.",
            fanOutSearchesTriggered: [
              "Conversational search multi-turn taxonomy",
              "AI Overviews query fan-out behavior",
              "Authoritative source verification 2026"
            ],
            suggestedNextQueries: [
              lang === "fa" ? "بهترین ابزارهای سئو برای بررسی Fan-Out کدامند؟" : "What are the best SEO tools to track Query Fan-Out?",
              lang === "fa" ? "چگونه فرمت جداول مقایسه‌ای شانس استناد در Perplexity را افزایش می‌دهد؟" : "Why do comparison tables increase AI citation rates?",
              lang === "fa" ? "مراحل ۵ گانه سفر محاوره‌ای لوئیزا فرام چیست؟" : "Explain Louisa Frahm's 5 stages of follow-up queries."
            ],
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ];
      }
      return prev;
    });
  }, [lang]);

  const handleSendQuery = async (queryToSend?: string) => {
    const q = queryToSend || inputQuery;
    if (!q.trim() || loading) return;

    const userTurn: SimulationTurn = {
      id: `user-${Date.now()}`,
      role: "user",
      query: q,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setTurns((prev) => [...prev, userTurn]);
    setInputQuery("");
    setLoading(true);

    try {
      const res = await fetch("/api/simulate/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          topicContext: topicContext || q,
          previousTurns: turns.slice(-4),
        }),
      });
      const assistantData = await res.json();
      
      const assistantTurn: SimulationTurn = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        query: q,
        content: assistantData.content,
        fanOutSearchesTriggered: assistantData.fanOutSearchesTriggered,
        citedSources: assistantData.citedSources,
        suggestedNextQueries: assistantData.suggestedNextQueries,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };

      setTurns((prev) => [...prev, assistantTurn]);
    } catch (err) {
      console.error("Simulation error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setTurns([]);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
              <Bot className="w-3.5 h-3.5 text-indigo-600" />
              <span>Multi-Turn AI Engine & Fan-Out Emulation</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {t.simTitle}
            </h1>
            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
              {t.simSubtitle}
            </p>
          </div>

          <button
            onClick={handleResetChat}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium bg-slate-100 border border-slate-200 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-600" />
            <span>{t.clearChat}</span>
          </button>
        </div>
      </section>

      {/* Chat Log Window */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-6 min-h-[420px] max-h-[650px] overflow-y-auto space-y-6 shadow-xs">
        {turns.map((turn) => {
          if (turn.role === "user") {
            return (
              <div key={turn.id} className="flex justify-end">
                <div className="max-w-xl rounded-2xl bg-indigo-600 text-white px-4 py-3 shadow-xs font-medium text-sm">
                  {turn.query}
                  <div className="text-[10px] text-indigo-200 text-right mt-1">
                    {turn.timestamp}
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={turn.id} className="flex gap-3 max-w-3xl">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 mt-1">
                <Sparkles className="w-4 h-4 text-indigo-600" />
              </div>

              <div className="space-y-3 flex-1">
                {/* Background Fan-Out Sub-Queries Debugger */}
                {turn.fanOutSearchesTriggered && turn.fanOutSearchesTriggered.length > 0 && (
                  <div className="rounded-xl border border-indigo-100 bg-indigo-50/70 p-3.5 text-xs font-mono">
                    <div className="text-indigo-900 font-sans font-semibold flex items-center gap-1.5 mb-1.5 text-[11px]">
                      <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                      <span>{t.backgroundFanOut}</span>
                    </div>
                    <div className="space-y-1">
                      {turn.fanOutSearchesTriggered.map((subQ, idx) => (
                        <div key={idx} className="text-slate-800 flex items-center gap-2">
                          <span className="text-indigo-600 font-bold">▶</span>
                          <span>{subQ}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Generated Answer */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {turn.content}
                </div>

                {/* Cited Sources */}
                {turn.citedSources && turn.citedSources.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs shadow-xs">
                    <span className="font-semibold text-slate-700 block mb-2 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                      {t.citedSources}
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {turn.citedSources.map((source, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-2"
                        >
                          <div>
                            <div className="font-semibold text-slate-900 text-[11px] truncate">
                              {source.title}
                            </div>
                            <div className="text-[10px] text-indigo-600 font-mono font-medium">
                              {source.domain}
                            </div>
                          </div>
                          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Follow-Ups */}
                {turn.suggestedNextQueries && turn.suggestedNextQueries.length > 0 && (
                  <div className="pt-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5 flex items-center gap-1">
                      <MessageSquare className="w-3 h-3 text-indigo-600" />
                      {t.suggestedFollowUps}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {turn.suggestedNextQueries.map((suggested, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendQuery(suggested)}
                          className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-slate-700 hover:text-indigo-700 transition-all text-left flex items-center gap-1.5 group cursor-pointer font-medium"
                        >
                          <span>{suggested}</span>
                          <ArrowRight className={`w-3 h-3 text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity ${isRtl ? 'rotate-180' : ''}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shrink-0 animate-pulse">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-indigo-600 animate-bounce [animation-delay:0.4s]" />
              <span className="text-xs text-slate-600 ml-1">
                {lang === "fa" ? "در حال اجرای Fan-Out و سنتز پاسخ..." : "Executing query fan-out & synthesizing sources..."}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="relative">
        <input
          id="simulator-query-input"
          type="text"
          value={inputQuery}
          onChange={(e) => setInputQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendQuery()}
          placeholder={t.askAiPlaceholder}
          className={`w-full h-13 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20 shadow-xs transition-all ${isRtl ? 'pr-4 pl-32' : 'pl-4 pr-32'}`}
        />
        <button
          id="simulator-send-btn"
          onClick={() => handleSendQuery()}
          disabled={loading || !inputQuery.trim()}
          className={`absolute inset-y-2 ${isRtl ? 'left-2' : 'right-2'} px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs`}
        >
          <Send className="w-3.5 h-3.5" />
          <span>{t.sendQuery}</span>
        </button>
      </div>
    </div>
  );
};
