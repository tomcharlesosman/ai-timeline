import Timeline from "./components/Timeline";
import Header from "./components/Header";
import EmailSubscription from "./components/EmailSubscription";
import OnThisDay from "./components/OnThisDay";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      {/* Marquee */}
      <div className="marquee border-b border-[#222] py-2">
        <div className="marquee-content">
          GPT-5.3 • CLAUDE 4.5 • GEMINI 3 • DEEPSEEK V3 • KIMI K2.5 • GPT-5.3 • CLAUDE 4.5 • GEMINI 3 • DEEPSEEK V3 • KIMI K2.5 • 
        </div>
      </div>
      
      <Header />
      
      {/* Hero Section */}
      <section className="relative px-4 sm:px-8 py-12 sm:py-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="hero-title">
            AI<br />
            <span className="text-transparent" style={{ WebkitTextStroke: '2px var(--neon-cyan)' }}>TIMELINE</span>
          </h1>
          <p className="mt-8 text-xl sm:text-2xl text-[#888] max-w-xl font-light italic">
            What happened today in AI. <br />
            <span className="text-[#ffff00] not-italic font-mono text-sm tracking-wider">Curated daily. No bullshit.</span>
          </p>
        </div>
        
        {/* Decorative element */}
        <div className="absolute top-20 right-8 w-32 h-32 border border-[#ff00ff] opacity-20 rotate-45 hidden lg:block" />
        <div className="absolute bottom-20 right-32 w-16 h-16 bg-[#ffff00] opacity-10 rotate-12 hidden lg:block" />
      </section>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-8 pb-20">
        <OnThisDay />
        <EmailSubscription />
        <Timeline />
      </div>
      
      {/* Footer */}
      <footer className="border-t border-[#222] px-4 sm:px-8 py-12">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <p className="font-mono text-xs text-[#555] tracking-wider">
            AUTOMATICALLY UPDATED DAILY
          </p>
          <div className="flex gap-6">
            <a href="/data" className="glitch-link font-mono text-xs text-[#888] hover:text-[#ff00ff]">
              [DATA]
            </a>
            <a href="/visual" className="glitch-link font-mono text-xs text-[#888] hover:text-[#ff00ff]">
              [VISUAL]
            </a>
            <a href="/print" target="_blank" className="glitch-link font-mono text-xs text-[#888] hover:text-[#ff00ff]">
              [PRINT]
            </a>
            <a href="https://github.com/tomcharlesosman/ai-timeline" target="_blank" rel="noopener" className="glitch-link font-mono text-xs text-[#888] hover:text-[#ff00ff]">
              [GITHUB]
            </a>
            <a href="/feed.xml" className="glitch-link font-mono text-xs text-[#888] hover:text-[#ff00ff]">
              [RSS]
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
