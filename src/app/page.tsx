import Timeline from "./components/Timeline";
import Header from "./components/Header";
import EmailSubscription from "./components/EmailSubscription";
import OnThisDay from "./components/OnThisDay";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Marquee */}
      <div className="marquee">
        <div className="marquee-content">
          GPT-5.3 • Claude 4.5 • Gemini 3.0 • DeepSeek V3 • Kimi K2.5 • GPT-5.3 • Claude 4.5 • Gemini 3.0 • DeepSeek V3 • Kimi K2.5 • 
        </div>
      </div>
      
      {/* Masthead */}
      <header className="masthead">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="text-xs text-[--text-muted] font-semibold tracking-wider">
              {new Date().toLocaleDateString("en-US", { 
                weekday: "long", 
                year: "numeric", 
                month: "long", 
                day: "numeric" 
              })}
            </div>
            <div className="flex items-center gap-4">
              <a href="/data" className="text-xs font-semibold tracking-wider hover:text-[--accent]">DATA</a>
              <a href="/visual" className="text-xs font-semibold tracking-wider hover:text-[--accent]">VISUAL</a>
              <a href="/print" className="text-xs font-semibold tracking-wider hover:text-[--accent]">PRINT</a>
              <a href="/feed.xml" className="text-xs font-semibold tracking-wider hover:text-[--accent]">RSS</a>
            </div>
          </div>
          <h1 className="masthead-title">AI Timeline</h1>
          <p className="text-center text-sm text-[--text-muted] mt-2 pb-4">
            Daily updates from the world of artificial intelligence
          </p>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="border-b border-[--border] py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center">
          <h2 className="headline-display mb-6">
            What Happened<br />Today in AI
          </h2>
          <p className="text-lg text-[--text-secondary] leading-relaxed max-w-xl mx-auto">
            Curated updates on models, research, products, and market moves. 
            No hype. Just signal.
          </p>
        </div>
      </section>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
        <OnThisDay />
        <Timeline />
        <EmailSubscription />
      </div>
      
      {/* Footer */}
      <footer className="border-t border-[--border] mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-[--text-muted]">
              © {new Date().getFullYear()} AI Timeline. Automatically updated daily.
            </p>
            <div className="flex gap-6">
              <a href="https://github.com/tomcharlesosman/ai-timeline" target="_blank" rel="noopener" className="text-xs text-[--text-muted] hover:text-[--text-primary]">
                GitHub
              </a>
              <a href="mailto:tom@tomosman.com" className="text-xs text-[--text-muted] hover:text-[--text-primary]">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
