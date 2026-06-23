import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getHistory } from "../api";

function History() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getHistory(20, 0);
        setReviews(data);
      } catch (err) {
        setError("Failed to load review history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 p-6 transition-colors">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">
            Review History
          </h1>
          <Link
            to="/review"
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Back to Review
          </Link>
        </div>

        {loading && (
          <p className="text-gray-500 dark:text-slate-400 text-center">
            Loading history...
          </p>
        )}

        {error && (
          <p className="text-red-500 dark:text-red-400 text-center mb-4">
            {error}
          </p>
        )}

        {!loading && !error && reviews.length === 0 && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md text-center text-gray-500 dark:text-slate-400 transition-colors">
            No reviews yet.{" "}
            <Link to="/review" className="text-blue-600 dark:text-blue-400 hover:underline">
              Submit your first one
            </Link>
            .
          </div>
        )}

        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden transition-colors"
            >
              <button
                onClick={() => toggleExpand(review.id)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-slate-700 transition"
              >
                <div>
                  <span className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium px-2 py-1 rounded mr-2">
                    {review.language || "unknown"}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-slate-400">
                    {formatDate(review.created_at)}
                  </span>
                </div>
                <span className="text-gray-400 dark:text-slate-500 text-sm">
                  {expandedId === review.id ? "▲ Hide" : "▼ View"}
                </span>
              </button>

              {expandedId === review.id && (
                <div className="border-t border-gray-200 dark:border-slate-700 p-4 bg-gray-50 dark:bg-slate-900">
                  <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">
                    CODE
                  </p>
                  <pre className="bg-gray-900 dark:bg-black text-green-400 text-xs p-3 rounded mb-3 overflow-x-auto">
                    {review.code}
                  </pre>
                  <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-1">
                    REVIEW
                  </p>
                  <p className="text-sm text-gray-700 dark:text-slate-300 whitespace-pre-wrap">
                    {review.review_result}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default History;