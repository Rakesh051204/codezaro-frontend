import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitReview, getUsage } from "../api";
import { useTheme } from "../ThemeContext";
import axios from "axios";

function Review() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState(null);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const API_BASE_URL = "https://codezaro-backend-7.onrender.com";

  const fetchUsage = async () => {
    try {
      const data = await getUsage();
      setUsage(data);
    } catch (err) {}
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const data = await submitReview(code, language);
      setResult(data);
      fetchUsage();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Session expired. Please log in again.");
      } else if (err.response && err.response.status === 402) {
        setError(
          err.response.data?.detail?.message ||
            "Monthly review limit reached. Upgrade to Pro for more."
        );
      } else {
        setError("Something went wrong submitting your code.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await axios.post(
        `${API_BASE_URL}/payments/create-checkout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = response.data.url;
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  const usagePercent = usage ? (usage.review_count / usage.limit) * 100 : 0;
  const showUsageWarning = usage && usagePercent >= 90;
  const limitReached = usage && usage.review_count >= usage.limit;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#1F1F1F] p-6 transition-colors">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Code Review
        </h1>

        {showUsageWarning && (
          <div
            className={`mb-4 p-4 rounded-lg border ${
              limitReached
                ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30"
                : "border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-950/30"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-800 dark:text-white">
                {limitReached
                  ? "Monthly limit reached"
                  : "Approaching monthly limit"}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
                {usage.tier} plan
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-[#3D3D3D] rounded-full">
              <div
                className={`h-2 rounded-full ${limitReached ? "bg-red-500" : "bg-yellow-500"}`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {usage.review_count} / {usage.limit} reviews used this month
              {limitReached && " — upgrade to Pro for more reviews."}
            </p>
          </div>
        )}

        <div className="bg-white dark:bg-[#2D2D2D] rounded-lg shadow-sm border border-gray-200 dark:border-[#3D3D3D] p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-[#1F1F1F] border border-gray-300 dark:border-[#3D3D3D] rounded-md text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078D4]"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="java">Java</option>
                <option value="c">C</option>
                <option value="cpp">C++</option>
                <option value="csharp">C#</option>
                <option value="go">Go</option>
                <option value="rust">Rust</option>
                <option value="ruby">Ruby</option>
                <option value="php">PHP</option>
                <option value="swift">Swift</option>
                <option value="kotlin">Kotlin</option>
                <option value="scala">Scala</option>
                <option value="dart">Dart</option>
                <option value="elixir">Elixir</option>
                <option value="lua">Lua</option>
                <option value="r">R</option>
                <option value="perl">Perl</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Code
              </label>
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                rows={12}
                className="w-full px-3 py-2 bg-white dark:bg-[#1F1F1F] border border-gray-300 dark:border-[#3D3D3D] rounded-md font-mono text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0078D4] resize-y"
                placeholder="Paste your code here..."
              />
            </div>

            {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading || limitReached}
              className="w-full bg-[#0078D4] hover:bg-[#106EBE] text-white py-2 rounded-md font-medium transition disabled:opacity-50"
            >
              {loading
                ? "Reviewing..."
                : limitReached
                ? "Limit reached"
                : "Submit for Review"}
            </button>
          </form>
        </div>

        {result && (
          <div className="mt-6 bg-white dark:bg-[#2D2D2D] rounded-lg shadow-sm border border-gray-200 dark:border-[#3D3D3D] p-6">
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
              Review Result
            </h2>
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono text-sm">
                {result.review_result}
              </p>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Model: CodeZaro AI
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Review;