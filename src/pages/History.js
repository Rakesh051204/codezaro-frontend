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
    <div className="min-h-screen bg-gray-50 dark:bg-[#1F1F1F] p-6 transition-colors">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
          Review History
        </h1>

        {loading && <p className="text-gray-500 dark:text-gray-400">Loading history...</p>}
        {error && <p className="text-red-600 dark:text-red-400">{error}</p>}

        {!loading && !error && reviews.length === 0 && (
          <div className="bg-white dark:bg-[#2D2D2D] rounded-lg shadow-sm border border-gray-200 dark:border-[#3D3D3D] p-6 text-center text-gray-500 dark:text-gray-400">
            No reviews yet.{" "}
            <Link to="/review" className="text-[#0078D4] hover:underline">
              Submit your first one
            </Link>
            .
          </div>
        )}

        <div className="space-y-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white dark:bg-[#2D2D2D] rounded-lg shadow-sm border border-gray-200 dark:border-[#3D3D3D] overflow-hidden"
            >
              <button
                onClick={() => toggleExpand(review.id)}
                className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-[#3D3D3D] transition"
              >
                <div>
                  <span className="inline-block bg-gray-100 dark:bg-[#3D3D3D] text-gray-700 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded mr-2">
                    {review.language || "unknown"}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(review.created_at)}
                  </span>
                </div>
                <span className="text-gray-400 dark:text-gray-500 text-sm">
                  {expandedId === review.id ? "▲ Hide" : "▼ View"}
                </span>
              </button>

              {expandedId === review.id && (
                <div className="border-t border-gray-200 dark:border-[#3D3D3D] p-4 bg-gray-50 dark:bg-[#1F1F1F]">
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    CODE
                  </p>
                  <pre className="bg-white dark:bg-[#0D0D0D] text-gray-800 dark:text-gray-200 text-xs p-3 rounded overflow-x-auto font-mono border border-gray-200 dark:border-[#3D3D3D]">
                    {review.code}
                  </pre>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-3 mb-1">
                    REVIEW
                  </p>
                  <div className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap font-mono">
                    {review.review_result}
                  </div>
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