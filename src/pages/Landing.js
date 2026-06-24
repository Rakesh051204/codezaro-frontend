import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
      <nav className="flex justify-between items-center max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-lg" />
          <span className="text-xl font-display font-bold">CodeZaro</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-indigo-500 transition">
            Log in
          </Link>
          <Link
            to="/register"
            className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20"
          >
            Get Started
          </Link>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-100 dark:border-indigo-800/50 mb-6">
          ⚡ AI-Powered Code Reviews
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] max-w-4xl mx-auto">
          Smarter Code Reviews, <br />
          <span className="gradient-text">Faster Development</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mt-6">
          Let AI catch bugs, suggest improvements, and enforce best practices – so you can focus on building.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
          <Link
            to="/register"
            className="px-8 py-4 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50"
          >
            Start Reviewing Free
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-full font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition"
          >
            Log in →
          </Link>
        </div>
        <div className="mt-16 max-w-3xl mx-auto bg-slate-900 dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-800/50 p-6 text-left font-mono text-sm text-slate-300">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="w-3 h-3 bg-yellow-500 rounded-full" />
            <span className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-slate-500 ml-2">/review</span>
          </div>
          <p className="text-emerald-400"># CodeZaro AI Review</p>
          <p>
            <span className="text-blue-400">def</span>{" "}
            <span className="text-yellow-200">get_user</span>
            <span className="text-slate-300">(username):</span>
          </p>
          <p className="pl-4 text-red-400">query = "SELECT * FROM users WHERE username = '" + username + "'"</p>
          <p className="pl-4 text-slate-400">return db.execute(query)</p>
          <div className="mt-2 border-t border-slate-700/50 pt-2 text-emerald-400 animate-pulse">
            ✓ Vulnerability found: SQL Injection. Suggesting parameterized query...
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-20 grid md:grid-cols-3 gap-8">
        {[
          {
            icon: "🤖",
            title: "AI-Powered Analysis",
            desc: "Groq-powered LLM detects bugs, security holes, and code smells in real-time.",
          },
          {
            icon: "📊",
            title: "Usage & Tier Management",
            desc: "Track your reviews. Free tier for starters, Pro for unlimited power.",
          },
          {
            icon: "🔒",
            title: "Secure & Private",
            desc: "Your code is processed securely. JWT authentication keeps your data safe.",
          },
        ].map((feature) => (
          <div key={feature.title} className="glass p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 border border-white/20 dark:border-slate-800/50">
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-display font-bold mb-2">{feature.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
              {feature.desc}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default Landing;