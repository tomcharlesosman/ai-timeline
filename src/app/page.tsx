import Timeline from "./components/Timeline";
import Header from "./components/Header";
import EmailSubscription from "./components/EmailSubscription";
import OnThisDay from "./components/OnThisDay";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="mb-8 sm:mb-12">
          <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            AI Timeline
          </h1>
          <p className="text-muted text-base sm:text-lg">
            What happened today in AI. Curated daily.
          </p>
        </div>
        <OnThisDay />
        <EmailSubscription />
        <Timeline />
      </div>
      <footer className="max-w-2xl mx-auto px-4 sm:px-6 py-8 sm:py-12 border-t border-border">
        <p className="text-sm text-muted">
          Automatically updated daily. Sources: OpenAI, Anthropic, Google, arXiv, HN.
        </p>
      </footer>
    </main>
  );
}
