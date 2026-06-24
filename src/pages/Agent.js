import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../components/Logo";

function Agent() {
  const [task, setTask] = useState("");
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentStep, setCurrentStep] = useState(null);
  const navigate = useNavigate();

  const API_BASE_URL = "https://codezaro-backend-7.onrender.com"; // or localhost:8000

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    setLoading(true);
    setError("");
    setSteps([]);
    setCurrentStep(null);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/agent/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ task }),
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = JSON.parse(line.substring(6));
            if (data.done) {
              setLoading(false);
              break;
            }
            if (data.decision) {
              setSteps((prev) => [...prev, data.decision]);
              setCurrentStep(data.decision);
            }
            if (data.tool_result) {
              // Optionally append tool result to the last step
              setSteps((prev) => {
                const newSteps = [...prev];
                if (newSteps.length > 0) {
                  newSteps[newSteps.length - 1].result = data.tool_result;
                }
                return newSteps;
              });
            }
          }
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3] p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Logo className="w-7 h-7" />
            <h1 className="text-2xl font-bold font-display">CodeZaro Agent</h1>
          </div>
          <button
            onClick={() => navigate("/review")}
            className="text-sm text-[#58a6ff] hover:underline"
          >
            ← Back to Review
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder='Describe a coding task... (e.g., "Create a Python file that prints hello")'
              className="flex-1 px-4 py-3 rounded-lg bg-[#161b22] border border-[#30363d] text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !task.trim()}
              className="px-6 py-3 bg-[#238636] hover:bg-[#2ea043] rounded-lg font-medium transition disabled:opacity-50"
            >
              {loading ? "Running..." : "Run Agent"}
            </button>
          </div>
          {error && <p className="mt-2 text-[#f85149] text-sm">{error}</p>}
        </form>

        {loading && (
          <div className="text-[#8b949e] text-sm animate-pulse">Agent is thinking...</div>
        )}

        {steps.length > 0 && (
          <div className="mt-4 space-y-3">
            <h2 className="text-lg font-semibold text-[#e6edf3]">Agent Steps</h2>
            {steps.map((step, idx) => (
              <div key={idx} className="bg-[#161b22] border border-[#30363d] rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <span className="text-[#58a6ff] font-mono text-sm">#{idx + 1}</span>
                  <div className="flex-1">
                    <p className="text-[#8b949e] text-sm">
                      <span className="text-[#e6edf3]">Thought:</span> {step.thought || "—"}
                    </p>
                    {step.action && (
                      <p className="text-[#f0883e] text-sm mt-1">
                        <span className="text-[#e6edf3]">Action:</span> {step.action}
                        {step.action_input && (
                          <span className="text-[#8b949e] ml-2">
                            {JSON.stringify(step.action_input)}
                          </span>
                        )}
                      </p>
                    )}
                    {step.result && (
                      <p className="text-[#3fb950] text-sm mt-1">
                        <span className="text-[#e6edf3]">Result:</span> {step.result}
                      </p>
                    )}
                    {step.stop && (
                      <p className="text-[#3fb950] text-sm mt-1">✅ Task complete</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Agent;