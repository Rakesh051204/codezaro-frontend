import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory } from "../api";

function History() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Review History</h1>
          <button
            onClick={() => navigate("/review")}
            className="text-sm text-blue-600 hover:underline"
          >
            ← Back to Review
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-gray-500">Loading history...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-gray-500 bg-white p-8 rounded-lg shadow">
            No reviews yet. Submit some code to get started!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Language: {review.language || "unknown"}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(review.created_at)}
                  </span>
                </div>
                <pre className="bg-gray-50 p-2 rounded text-sm overflow-x-auto mb-2">
                  {review.code.length > 200
                    ? review.code.slice(0, 200) + "..."
                    : review.code}
                </pre>
                <div className="text-sm text-gray-700">
                  {review.review_result.length > 300
                    ? review.review_result.slice(0, 300) + "..."
                    : review.review_result}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Model: {review.model_used}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default History;