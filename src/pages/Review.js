import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { submitReview, getUsage } from "../api";
import { useTheme } from "../ThemeContext";
import axios from "axios"; // <-- added

function Review() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState(null);
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  // You can replace this with the actual backend URL if needed
  const API_BASE_URL = "https://codezaro-backend-7.onrender.com";

  const fetchUsage = async () => {
    try {
      const data = await getUsage();
      setUsage(data);
    } catch (err) {
      // Silently ignore – usage display is non-critical
    }
  };

  useEffect(() => {
    fetchUsage();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

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
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6 transition-colors">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
            CodeZaro Review
          </h1>
          <div className="space-x-4 flex items-center">
            <button
              onClick={toggleTheme}
              className="text-sm text-gray-500 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
              title="Toggle theme"
            >
              {isDark ? "☀️ Light" : "🌙 Dark"}
            </button>
            <button
              onClick={() => navigate("/history")}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              History
            </button>
            <button
              onClick={handleUpgrade}
              className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
            >
              Upgrade to Pro
            </button>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 dark:text-slate-300 hover:text-red-500"
            >
              Log out
            </button>
          </div>
        </div>

        {showUsageWarning && (
          <div
            className={`mb-4 p-4 rounded-lg border ${
              limitReached
                ? "bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-800"
                : "bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-800"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span
                className={`text-sm font-medium ${
                  limitReached
                    ? "text-red-700 dark:text-red-300"
                    : "text-yellow-700 dark:text-yellow-300"
                }`}
              >
                {limitReached
                  ? "Monthly limit reached"
                  : "Approaching monthly limit"}
              </span>
              <span className="text-xs text-gray-500 dark:text-slate-400 uppercase">
                {usage.tier} plan
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full ${
                  limitReached ? "bg-red-500" : "bg-yellow-500"
                }`}
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-slate-400">
              {usage.review_count} / {usage.limit} reviews used this month
              {limitReached && " — upgrade to Pro for more reviews."}
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md mb-6 transition-colors"
        >
          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-md mb-4"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>

          <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-1">
            Code
          </label>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            rows={10}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 rounded-md mb-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste your code here..."
          />

          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm mb-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || limitReached}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading
              ? "Reviewing..."
              : limitReached
              ? "Limit reached"
              : "Submit for Review"}
          </button>
        </form>

        {result && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md transition-colors">
            <h2 className="font-semibold text-gray-800 dark:text-slate-100 mb-2">
              Review Result
            </h2>
            <p className="text-gray-700 dark:text-slate-300 whitespace-pre-wrap mb-2">
              {result.review_result}
            </p>
            <p className="text-xs text-gray-400 dark:text-slate-500">
              Model: CodeZaro AI
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Review;