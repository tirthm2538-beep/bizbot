"use client";

import { useState, useEffect, useRef, Suspense, use } from "react";
import Link from "next/link";
import { 
  Bot, 
  Send, 
  User, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles, 
  Store
} from "lucide-react";

interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

function cleanMessageText(text: string): string {
  if (!text) return "";
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    // Fix unexpected line breaks inside times/numbers (e.g. "8:0\n0 AM" -> "8:00 AM")
    .replace(/(\d+:\d*)\s*\n\s*(\d+)/g, "$1$2")
    .replace(/(\d+)\s*\n\s*(AM|PM|am|pm)/g, "$1 $2")
    .replace(/([0-9])\s*\n\s*([0-9])/g, "$1$2")
    // Clean trailing spaces before newlines
    .replace(/[ \t]+\n/g, "\n")
    // Collapse excessive consecutive line breaks
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function renderMessageContent(text: string) {
  const cleaned = cleanMessageText(text);
  // Parse markdown bold **text** so it renders cleanly as strong elements
  const parts = cleaned.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return (
        <strong key={i} className="font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

function ChatContent({ businessId }: { businessId: string }) {
  const [businessName, setBusinessName] = useState<string>("Support Assistant");
  const [businessLoading, setBusinessLoading] = useState<boolean>(true);
  const [businessNotFound, setBusinessNotFound] = useState<boolean>(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [, setChatError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const apiBase = (process.env.NEXT_PUBLIC_API_URL || "https://bizbot-1-aah6.onrender.com").replace(/\/+$/, "");

  // Fetch business metadata
  useEffect(() => {
    if (!businessId) return;

    async function fetchBusiness() {
      setBusinessLoading(true);
      setBusinessNotFound(false);
      try {
        const res = await fetch(`${apiBase}/business/${businessId}`);
        if (res.status === 404) {
          setBusinessNotFound(true);
          return;
        }
        if (!res.ok) {
          const fallback = businessId.replace(/-/g, " ");
          setBusinessName(fallback);
          setMessages([
            {
              id: "welcome",
              sender: "bot",
              text: `Hi there! 👋 I am the AI customer support assistant for **${fallback}**. How can I help you today?`,
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            },
          ]);
          return;
        }
        const data = await res.json();
        const resolvedName = data.business_name || businessId.replace(/-/g, " ");
        setBusinessName(resolvedName);

        setMessages([
          {
            id: "welcome",
            sender: "bot",
            text: `Hi there! 👋 I am the AI customer support assistant for **${resolvedName}**. How can I help you today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } catch {
        const fallback = businessId.replace(/-/g, " ");
        setBusinessName(fallback);
        setMessages([
          {
            id: "welcome",
            sender: "bot",
            text: `Hi there! 👋 I am the AI customer support assistant for **${fallback}**. How can I help you today?`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      } finally {
        setBusinessLoading(false);
      }
    }

    fetchBusiness();
  }, [businessId, apiBase]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isSending || businessNotFound) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsSending(true);
    setChatError(null);

    try {
      const res = await fetch(`${apiBase}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_id: businessId,
          question: text,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          setBusinessNotFound(true);
        }
        throw new Error(data.detail || "Unable to retrieve response from AI support.");
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: cleanMessageText(data.answer || "I could not locate an answer."),
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : "Network error. Please try again.";
      setChatError(errMsg);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          text: `⚠️ **Error:** ${errMsg}`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "What are your hours?",
    "Can you share your menu & pricing?",
    "What is your return or remake policy?",
    "Where are you located?",
  ];

  if (businessNotFound) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-8 shadow-sm text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Business Not Found</h1>
          <p className="text-slate-600 text-sm mb-6 leading-relaxed">
            No chatbot knowledge base found for ID: <code className="font-mono bg-slate-100 px-2 py-0.5 rounded text-indigo-700 font-semibold">{businessId}</code>.
            Please make sure this business has been trained first.
          </p>
          <div className="flex flex-col gap-2.5">
            <Link
              href="/train"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-sm"
            >
              <Store className="w-4 h-4" /> Go to Train Bot Portal
            </Link>
            <Link
              href="/chat/sunnybrew-cafe"
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition text-sm"
            >
              Open Sample Cafe Chat
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6">
      {/* Outer Card / Widget Container */}
      <div className="w-full max-w-2xl h-screen sm:h-[90vh] bg-white sm:rounded-3xl shadow-xl border-0 sm:border border-slate-200/80 flex flex-col overflow-hidden">
        
        {/* Chat Widget Header */}
        <header className="px-5 py-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Link
              href="/train"
              title="Return to Business Portal"
              className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold shadow-sm shadow-indigo-100">
                <Bot className="w-5 h-5" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-emerald-400/20" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight line-clamp-1">
                {businessLoading ? "Loading business..." : businessName}
              </h2>
              <p className="text-xs text-emerald-600 font-medium flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Online • AI Customer Support
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/train"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg border border-indigo-200 transition hidden sm:inline-flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Train Bot
            </Link>
          </div>
        </header>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gradient-to-b from-slate-50/60 to-white">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "bot" && (
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mb-1 border border-indigo-200">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-all ${
                  msg.sender === "user"
                    ? "bg-indigo-600 text-white rounded-br-xs"
                    : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-xs"
                }`}
              >
                <div
                  className="whitespace-pre-wrap break-words [overflow-wrap:break-word] [word-break:normal]"
                  style={{ wordBreak: "normal", overflowWrap: "break-word", whiteSpace: "pre-wrap" }}
                >
                  {renderMessageContent(msg.text)}
                </div>
                <div
                  className={`text-[10px] mt-1.5 text-right ${
                    msg.sender === "user" ? "text-indigo-200" : "text-slate-400"
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>

              {msg.sender === "user" && (
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mb-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isSending && (
            <div className="flex items-end gap-2.5 justify-start">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 mb-1 border border-indigo-200">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-xs px-4 py-3 shadow-sm flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length <= 2 && (
          <div className="px-4 py-2 border-t border-slate-100 bg-white overflow-x-auto flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
              Suggestions:
            </span>
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                disabled={isSending}
                className="shrink-0 text-xs bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Chat Input Bar */}
        <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              placeholder={`Ask a question about ${businessName}...`}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSending || businessNotFound}
              className="flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition disabled:bg-slate-50"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isSending || businessNotFound}
              className="w-11 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white flex items-center justify-center shrink-0 transition shadow-sm cursor-pointer disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[11px] text-center text-slate-400 mt-2">
            Powered by BizBot • Answers generated exclusively from official business information.
          </p>
        </div>

      </div>
    </div>
  );
}

function ChatContentWrapper({
  params,
}: {
  params: Promise<{ business_id: string }>;
}) {
  const resolvedParams = use(params);
  const businessId = resolvedParams?.business_id ? decodeURIComponent(resolvedParams.business_id) : "";
  return <ChatContent businessId={businessId} />;
}

export default function CustomerChatPage({
  params,
}: {
  params: Promise<{ business_id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <svg className="animate-spin h-5 w-5 text-indigo-600" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Loading chat widget...</span>
          </div>
        </div>
      }
    >
      <ChatContentWrapper params={params} />
    </Suspense>
  );
}
