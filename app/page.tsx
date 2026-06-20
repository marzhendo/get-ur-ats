import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      {/* Navbar */}
      <nav className="h-14 border-b border-[#2D2D2D] flex items-center justify-between px-6">
        <div className="font-bold text-lg">ATS CV Builder</div>
        <Link href="/builder" className="text-sm font-medium hover:text-accent transition-colors">
          Start Building →
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold mb-4 leading-tight">
          <span className="block text-text">Build Your CV.</span>
          <span className="block text-accent">ATS-Ready.</span>
        </h1>
        <p className="text-text opacity-50 text-sm max-w-xl mb-10">
          Generate a professional, ATS-optimized CV in minutes. No complex formatting, no layout shifts. Just fill in your details and download a perfectly formatted PDF.
        </p>
        <Link 
          href="/builder" 
          className="px-8 py-4 bg-accent text-background font-bold rounded-lg hover:bg-opacity-90 transition-opacity mb-16"
        >
          Start Building Now
        </Link>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {/* Card 1 */}
          <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-sm p-6 text-left">
            <svg className="w-6 h-6 mb-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <h3 className="font-bold mb-2">ATS-Optimized Format</h3>
            <p className="text-sm text-text opacity-70">Same structure as proven CV templates.</p>
          </div>
          {/* Card 2 */}
          <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-sm p-6 text-left">
            <svg className="w-6 h-6 mb-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
            <h3 className="font-bold mb-2">Live Preview</h3>
            <p className="text-sm text-text opacity-70">See changes in real time.</p>
          </div>
          {/* Card 3 */}
          <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-sm p-6 text-left">
            <svg className="w-6 h-6 mb-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            <h3 className="font-bold mb-2">Export to PDF</h3>
            <p className="text-sm text-text opacity-70">One click, print-ready.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
