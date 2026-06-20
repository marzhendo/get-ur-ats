import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center bg-background text-text">
      <h1 className="text-4xl md:text-6xl font-bold mb-4">
        Build Your <span className="text-accent">ATS-Friendly CV</span>
      </h1>
      <p className="text-muted text-lg md:text-xl max-w-2xl mb-8">
        Generate a professional, ATS-optimized CV in minutes. No complex formatting, no layout shifts. Just fill in your details and download a perfectly formatted PDF.
      </p>
      <Link 
        href="/builder" 
        className="px-8 py-4 bg-accent text-background font-bold rounded-lg hover:bg-opacity-90 transition-opacity"
      >
        Start Building Now
      </Link>
    </main>
  );
}
