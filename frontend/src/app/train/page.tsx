"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Bot, 
  Sparkles, 
  Copy, 
  Check, 
  ExternalLink, 
  Code2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  RotateCcw,
  Store,
  FileText
} from "lucide-react";

const SAMPLE_CAFE_DATA = {
  name: "SunnyBrew Cafe & Bakery",
  slug: "sunnybrew-cafe",
  info: `SunnyBrew Cafe & Bakery — Business Guide & FAQs

General Information:
- Location: 142 Maplewood Avenue, Downtown
- Phone: (555) 382-7740
- Email: hello@sunnybrewcafe.com
- Wi-Fi: Free high-speed guest Wi-Fi available for paying customers (Network: SunnyBrew-Guest, Password on receipt).
- Seating: Indoor seating for 35 guests, outdoor dog-friendly patio with heat lamps.

Operating Hours:
- Monday to Friday: 6:30 AM – 6:00 PM
- Saturday: 7:30 AM – 7:00 PM
- Sunday: 8:00 AM – 4:00 PM
- Holidays: Closed Thanksgiving & Christmas Day. Open 8:00 AM – 2:00 PM on New Year's Day.

Menu Highlights & Pricing:
- Coffee & Espresso:
  - Drip Coffee (House Blend / Dark Roast): Small $3.00, Medium $3.75, Large $4.25
  - Espresso: Single $2.75, Double $3.50
  - Americano: $3.75
  - Cappuccino / Flat White: $4.50
  - Vanilla Oat Latte: $5.50 (locally roasted beans & Minor Figures oat milk)
  - Seasonal Spiced Chai Latte: $5.25
- Milk Alternatives: Oat, Almond, Soy (+$0.75).
- Food & Bakery:
  - Classic Butter Croissant: $3.95
  - Chocolate Babka Slice: $4.50
  - Blueberry Lemon Scone: $3.75
  - Avocado & Sourdough Toast: $8.50
  - Turkey Pesto Panini: $9.75
  - Vegan Breakfast Burrito: $8.95
- Dietary: Gluten-free blueberry scones baked daily. Kitchen handles wheat flour, not certified celiac-safe.

Policies & Returns:
- Drink Remake Policy: If your drink isn't perfect, tell a barista within 15 minutes for a free remake.
- Merchandise Returns: Unopened coffee beans, mugs, and brewing gear can be returned/exchanged within 14 days with original receipt.
- Food Policy: Prepared warm foods and open pastries cannot be refunded or returned once taken outside.
- Payment Methods: Credit/debit cards, Apple Pay, Google Pay, and Cash accepted.
- Catering: Coffee boxes and pastry platters require 24 hours advance notice.`
};

export default function TrainPage() {
  const [businessName, setBusinessName] = useState("");
  const [businessId, setBusinessId] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [trainedResult, setTrainedResult] = useState<{
    business_id: string;
    business_name: string;
    char_count: number;
  } | null>(null);

  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://bizbot-1-aah6.onrender.com";

  const handleLoadSample = () => {
    setBusinessName(SAMPLE_CAFE_DATA.name);
    setBusinessId(SAMPLE_CAFE_DATA.slug);
    setInfo(SAMPLE_CAFE_DATA.info);
    setError(null);
  };

  const handleClear = () => {
    setBusinessName("");
    setBusinessId("");
    setInfo("");
    setError(null);
    setTrainedResult(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setError("Please provide a business name.");
      return;
    }
    if (!info.trim()) {
      setError("Please provide business information (hours, FAQs, policies, etc.).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${apiBase}/train`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_name: businessName.trim(),
          business_id: businessId.trim() || undefined,
          info: info.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "Failed to train chatbot knowledge base.");
      }

      setTrainedResult({
        business_id: data.business_id,
        business_name: data.business_name,
        char_count: data.char_count,
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred while connecting to the backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Get current origin safely for link sharing
  const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
  const chatUrl = trainedResult ? `${origin}/chat/${trainedResult.business_id}` : "";
  const embedSnippet = trainedResult
    ? `<iframe\n  src="${chatUrl}"\n  width="100%"\n  height="650"\n  style="border:none; border-radius:16px; box-shadow:0 10px 25px rgba(0,0,0,0.1);"\n></iframe>`
    : "";

  const copyToClipboard = (text: string, type: "link" | "embed") => {
    navigator.clipboard.writeText(text);
    if (type === "link") {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } else {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-slate-900">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Bot className="w-5 h-5" />
            </div>
            <span>Biz<span className="text-indigo-600">Bot</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/chat/sunnybrew-cafe"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              Demo Cafe Chat
            </Link>
            <Link
              href="/"
              className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition px-3 py-1.5 rounded-lg hover:bg-slate-50"
            >
              Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-10">
        {/* Page Title */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Business Owner Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Train Your Support AI
          </h1>
          <p className="mt-2 text-slate-600 text-base sm:text-lg max-w-3xl">
            Paste your store hours, pricing, FAQs, and policies. BizBot immediately ingests your knowledge and creates an embeddable 24/7 AI chatbot tailored to your business.
          </p>
        </div>

        {/* Success Card if Trained */}
        {trainedResult && (
          <div className="mb-10 rounded-2xl bg-gradient-to-b from-emerald-50/80 to-white border border-emerald-200 p-6 sm:p-8 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-200">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-slate-900">
                    Your Bot is Ready & Active!
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    ID: {trainedResult.business_id}
                  </span>
                </div>
                <p className="text-slate-600 text-sm mt-1">
                  Knowledge base for <strong>{trainedResult.business_name}</strong> has been successfully compiled ({trainedResult.char_count.toLocaleString()} characters stored).
                </p>

                {/* Direct Link Section */}
                <div className="mt-5 bg-white rounded-xl border border-slate-200 p-4">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Direct Customer Chat URL
                  </label>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={chatUrl}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2 text-sm text-slate-800 font-mono select-all focus:outline-none"
                    />
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => copyToClipboard(chatUrl, "link")}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold rounded-lg transition"
                      >
                        {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        {copiedLink ? "Copied!" : "Copy Link"}
                      </button>
                      <Link
                        href={`/chat/${trainedResult.business_id}`}
                        target="_blank"
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition"
                      >
                        Test Chat <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Embed Snippet Section */}
                <div className="mt-4 bg-white rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Code2 className="w-4 h-4 text-indigo-600" /> Embed Snippet (Paste on your website)
                    </label>
                    <button
                      onClick={() => copyToClipboard(embedSnippet, "embed")}
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                    >
                      {copiedEmbed ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedEmbed ? "Copied!" : "Copy Code"}
                    </button>
                  </div>
                  <pre className="bg-slate-900 text-slate-100 text-xs p-3.5 rounded-lg overflow-x-auto font-mono leading-relaxed">
                    {embedSnippet}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Training Form */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Form Header Action Bar */}
          <div className="border-b border-slate-200 px-6 py-4 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Store className="w-4 h-4 text-indigo-600" /> Business Details & Knowledge
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleLoadSample}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-3 py-1.5 rounded-lg transition"
              >
                <Sparkles className="w-3.5 h-3.5" /> Load Sample Cafe Info
              </button>
              {(businessName || info) && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
            {/* Error Banner */}
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 p-4 flex items-start gap-3 text-red-800 text-sm">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="font-semibold">Training Error</p>
                  <p className="mt-0.5 text-red-700">{error}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Business Name */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  Business Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. SunnyBrew Cafe & Bakery"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition"
                  required
                />
              </div>

              {/* Business Slug / ID */}
              <div>
                <label className="block text-sm font-bold text-slate-800 mb-1.5">
                  Custom ID <span className="text-xs font-normal text-slate-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. sunnybrew-cafe"
                  value={businessId}
                  onChange={(e) => setBusinessId(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition font-mono text-sm"
                />
              </div>
            </div>

            {/* Knowledge Base Textarea */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-bold text-slate-800">
                  Business Info & FAQs <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-slate-500">
                  {info.length.toLocaleString()} characters
                </span>
              </div>
              <p className="text-xs text-slate-500 mb-2">
                Paste your operating hours, menu, services, return & exchange policies, contact info, and common questions.
              </p>
              <textarea
                rows={14}
                placeholder={`Paste anything about your business here:\n- Hours: Mon-Fri 8am-6pm, Sat-Sun 9am-4pm\n- Address: 123 Main St, Springfield\n- Refund policy: Returns allowed within 14 days with receipt\n- Services & Pricing: ...`}
                value={info}
                onChange={(e) => setInfo(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition font-mono text-sm leading-relaxed"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-400" /> Stored locally in JSON format per business.
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold shadow-md shadow-indigo-200 transition cursor-pointer"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    <span>Training My Bot...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Train My Bot</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
