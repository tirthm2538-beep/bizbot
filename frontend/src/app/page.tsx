import Link from "next/link";
import { 
  Bot, 
  Sparkles, 
  ArrowRight, 
  MessageSquare, 
  Code2, 
  ShieldCheck, 
  Store, 
  CheckCircle, 
  Coffee, 
  Laptop, 
  Scissors
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
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
              className="text-sm font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition"
            >
              Live Demo
            </Link>
            <Link
              href="/train"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition"
            >
              <span>Train Your Bot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="pt-16 pb-20 px-4 sm:px-6 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Embeddable AI Support for Small Businesses
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
            Turn your business info into a <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">24/7 AI Chatbot</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            No complex setup, no hallucinations. Just paste your store hours, pricing, policies, and FAQs. BizBot gives you an embeddable customer assistant in 60 seconds.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/train"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 transition text-base"
            >
              <Store className="w-5 h-5" />
              <span>Train My Business Bot</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/chat/sunnybrew-cafe"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold rounded-xl transition text-base"
            >
              <Coffee className="w-5 h-5 text-amber-600" />
              <span>Try Demo: SunnyBrew Cafe</span>
            </Link>
          </div>

          <div className="mt-8 flex items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Grounded in your data
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Ready to embed
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Powered by Gemini
            </span>
          </div>
        </section>

        {/* 3 Step Process */}
        <section className="py-16 bg-white border-y border-slate-200 px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-center text-xs font-bold uppercase tracking-wider text-indigo-600 mb-2">
              How It Works
            </h2>
            <h3 className="text-center text-2xl sm:text-3xl font-extrabold text-slate-900 mb-12">
              From Raw Text to Live Assistant in 3 Steps
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center mb-4 shadow-sm shadow-indigo-100">
                  1
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Paste Your Knowledge</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Enter your FAQs, opening hours, prices, return policies, or contact details into the business portal.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center mb-4 shadow-sm shadow-indigo-100">
                  2
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Instant AI Training</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  BizBot compiles your context and applies strict guardrails so answers are strictly grounded in your facts.
                </p>
              </div>

              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center mb-4 shadow-sm shadow-indigo-100">
                  3
                </div>
                <h4 className="text-lg font-bold text-slate-900 mb-2">Share or Embed</h4>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Copy the direct chat link for your customers or paste the 1-line iframe widget onto your website.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <p>© 2026 BizBot • AI Customer Support Chatbot Engine</p>
      </footer>
    </div>
  );
}
