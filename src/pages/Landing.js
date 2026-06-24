import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] font-sans">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center border-b border-[#30363d]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-br from-[#58a6ff] to-[#1f6feb] rounded-md" />
          <span className="text-xl font-bold tracking-tight">CodeZaro</span>
        </div>
        <div className="flex items-center gap-5 text-sm">
          <Link to="/login" className="text-[#8b949e] hover:text-white transition">
            Log in
          </Link>
          <Link
            to="/register"
            className="bg-[#238636] hover:bg-[#2ea043] px-4 py-2 rounded-md font-medium transition"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-24 pb-32 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-[#21262d] text-[#58a6ff] text-xs font-mono border border-[#30363d] mb-6">
          // AI-Powered Code Reviews
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Smarter Reviews, <br />
          <span className="bg-gradient-to-r from-[#58a6ff] to-[#1f6feb] bg-clip-text text-transparent">
            Faster Delivery
          </span>
        </h1>
        <p className="text-lg md:text-xl text-[#8b949e] max-w-2xl mx-auto mt-6">
          AI catches bugs, suggests improvements, and enforces best practices – so your team ships with confidence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link
            to="/register"
            className="px-8 py-3.5 bg-[#238636] text-white rounded-md font-medium hover:bg-[#2ea043] transition"
          >
            Start Reviewing Free
          </Link>
          <Link
            to="/login"
            className="px-8 py-3.5 bg-[#21262d] text-white rounded-md font-medium hover:bg-[#30363d] transition border border-[#30363d]"
          >
            Log in →
          </Link>
        </div>

        {/* Terminal-style code preview */}
        <div className="mt-16 max-w-3xl mx-auto bg-[#161b22] rounded-lg border border-[#30363d] p-5 text-left font-mono text-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 bg-[#f85149] rounded-full" />
            <span className="w-3 h-3 bg-[#d29922] rounded-full" />
            <span className="w-3 h-3 bg-[#3fb950] rounded-full" />
            <span className="text-[#8b949e] ml-3 text-xs">/review</span>
          </div>
          <p className="text-[#58a6ff]"># CodeZaro AI Review</p>
          <p>
            <span className="text-[#f0883e]">def</span>{" "}
            <span className="text-[#f2cc60]">get_user</span>
            <span className="text-[#e6edf3]">(username):</span>
          </p>
          <p className="pl-4 text-[#f85149]">
            query = "SELECT * FROM users WHERE username = '" + username + "'"
          </p>
          <p className="pl-4 text-[#8b949e]">return db.execute(query)</p>
          <div className="mt-2 border-t border-[#30363d] pt-2 text-[#3fb950] animate-pulse">
            ✓ Vulnerability found: SQL Injection. Suggesting parameterized query...
          </div>
        </div>
      </section>

      {/* Features – no emojis, clean SVG icons */}
      <section className="max-w-7xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-8">
        {[
          {
            title: "AI-Powered Analysis",
            desc: "Groq‑powered LLM detects bugs, security holes, and code smells in real‑time.",
            icon: (
              <svg className="w-8 h-8 text-[#58a6ff]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            ),
          },
          {
            title: "Usage & Tier Management",
            desc: "Track your reviews. Free tier for starters, Pro for unlimited power.",
            icon: (
              <svg className="w-8 h-8 text-[#58a6ff]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            ),
          },
          {
            title: "Secure & Private",
            desc: "Your code is processed securely. JWT authentication keeps your data safe.",
            icon: (
              <svg className="w-8 h-8 text-[#58a6ff]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            ),
          },
        ].map((feature) => (
          <div
            key={feature.title}
            className="bg-[#161b22] p-6 rounded-lg border border-[#30363d] hover:border-[#58a6ff] transition-colors"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-[#8b949e] text-sm leading-relaxed">{feature.desc}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Landing;