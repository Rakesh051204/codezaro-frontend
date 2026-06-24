import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Logo from "../components/Logo";

function Agent() {
  const [task, setTask] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingAction, setPendingAction] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [prStatus, setPrStatus] = useState("idle");
  const [prUrl, setPrUrl] = useState("");
  const [prTitle, setPrTitle] = useState("");
  const [prBody, setPrBody] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = "https://codezaro-backend-7.onrender.com";

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get(`${API_BASE_URL}/agent/sessions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.post(
        `${API_BASE_URL}/agent/sessions`,
        { task, repo_url: repoUrl || null },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newSession = res.data;
      setSessions([newSession, ...sessions]);
      setSelectedSessionId(newSession.session_id);
      setTask("");
      setRepoUrl("");
      setShowCreateForm(false);
      setLoading(false);
    } catch (err) {
      setError("Failed to create session");
      setLoading(false);
    }
  };

  const handleRunAgent = async () => {
    if (!selectedSessionId) {
      setError("Please select or create a session first.");
      return;
    }
    setLoading(true);
    setError("");
    setSteps([]);
    setPendingAction(null);
    setPrStatus("idle");

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`${API_BASE_URL}/agent/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          task: sessions.find((s) => s.id === selectedSessionId)?.task || "",
          session_id: selectedSessionId,
        }),
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
              fetchSessions();
              break;
            }
            if (data.type === "action_proposed") {
              setPendingAction({
                action_id: data.action_id,
                tool: data.tool,
                params: data.params,
              });
            } else if (data.type === "tool_result") {
              setSteps((prev) => {
                const newSteps = [...prev];
                if (newSteps.length > 0) {
                  newSteps[newSteps.length - 1].result = data.result;
                }
                return newSteps;
              });
            } else if (data.type === "action_rejected") {
              setSteps((prev) => {
                const newSteps = [...prev];
                if (newSteps.length > 0) {
                  newSteps[newSteps.length - 1].rejected = true;
                }
                return newSteps;
              });
            } else if (data.decision) {
              setSteps((prev) => [...prev, data.decision]);
            }
          }
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleApprove = async (approved) => {
    if (!pendingAction) return;
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        `${API_BASE_URL}/agent/approve`,
        { action_id: pendingAction.action_id, approved },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPendingAction(null);
    } catch (err) {
      console.error(err);
      setError("Failed to send approval decision.");
    }
  };

  const handleCreatePR = async () => {
    if (!selectedSessionId) {
      setError("No session selected.");
      return;
    }
    setPrStatus("loading");
    setError("");
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.post(
        `${API_BASE_URL}/agent/pr`,
        {
          session_id: selectedSessionId,
          title: prTitle || "CodeZaro agent changes",
          body: prBody || "Automated changes from CodeZaro agent",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPrUrl(res.data.pr_url);
      setPrStatus("success");
    } catch (err) {
      setPrStatus("error");
      setError(err.response?.data?.detail || "Failed to create PR");
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

        {/* Session selector */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 mb-4">
          <div className="flex items-center gap-4 flex-wrap">
            <select
              value={selectedSessionId}
              onChange={(e) => setSelectedSessionId(Number(e.target.value))}
              className="bg-[#0d1117] border border-[#30363d] text-[#e6edf3] rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
            >
              <option value="">Select a session</option>
              {sessions.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.id} – {s.task?.slice(0, 30)} ({s.status})
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="text-[#58a6ff] hover:underline text-sm"
            >
              {showCreateForm ? "Cancel" : "+ New Session"}
            </button>
            <button
              onClick={handleRunAgent}
              disabled={loading || !selectedSessionId}
              className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] rounded-md font-medium transition disabled:opacity-50"
            >
              {loading ? "Running..." : "Run Agent"}
            </button>
          </div>
        </div>

        {/* Create session form */}
        {showCreateForm && (
          <form onSubmit={handleCreateSession} className="bg-[#161b22] border border-[#30363d] rounded-lg p-4 mb-4">
            <div className="mb-2">
              <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Describe the task..."
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
                required
              />
            </div>
            <div className="mb-2">
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="GitHub repo URL (optional)"
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] rounded-md font-medium transition disabled:opacity-50"
            >
              Create Session
            </button>
          </form>
        )}

        {error && <p className="text-[#f85149] text-sm mb-3">{error}</p>}

        {loading && (
          <div className="text-[#8b949e] text-sm animate-pulse mb-3">Agent is thinking...</div>
        )}

        {/* Pending action approval card */}
        {pendingAction && (
          <div className="mb-4 bg-[#161b22] border border-[#f0883e] rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-[#f0883e] font-mono">⚠️</span>
              <div className="flex-1">
                <p className="text-[#e6edf3] text-sm font-semibold">Proposed Action</p>
                <p className="text-[#8b949e] text-sm">
                  <span className="text-[#f0883e]">Tool:</span> {pendingAction.tool}
                </p>
                <p className="text-[#8b949e] text-sm">
                  <span className="text-[#f0883e]">Params:</span> {JSON.stringify(pendingAction.params)}
                </p>
                <div className="mt-3 flex gap-3">
                  <button
                    onClick={() => handleApprove(true)}
                    className="px-4 py-2 bg-[#238636] hover:bg-[#2ea043] rounded-md text-sm font-medium transition"
                  >
                    ✅ Accept
                  </button>
                  <button
                    onClick={() => handleApprove(false)}
                    className="px-4 py-2 bg-[#f85149] hover:bg-[#da3633] rounded-md text-sm font-medium transition"
                  >
                    ❌ Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Steps log */}
        {steps.length > 0 && (
          <div className="space-y-3 mb-6">
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
                    {step.rejected && (
                      <p className="text-[#f85149] text-sm mt-1">⛔ Action rejected by user</p>
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

        {/* PR Creation UI */}
        {selectedSessionId && (
          <div className="border-t border-[#30363d] pt-4 mt-4">
            <div className="flex flex-wrap gap-3 items-end">
              <input
                type="text"
                placeholder="PR title"
                value={prTitle}
                onChange={(e) => setPrTitle(e.target.value)}
                className="flex-1 min-w-[150px] px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
              />
              <input
                type="text"
                placeholder="PR body"
                value={prBody}
                onChange={(e) => setPrBody(e.target.value)}
                className="flex-1 min-w-[150px] px-3 py-2 bg-[#0d1117] border border-[#30363d] rounded-md text-[#e6edf3] placeholder-[#8b949e] focus:outline-none focus:ring-2 focus:ring-[#58a6ff]"
              />
              <button
                onClick={handleCreatePR}
                disabled={prStatus === "loading"}
                className="px-4 py-2 bg-[#1f6feb] hover:bg-[#388bfd] rounded-md font-medium transition disabled:opacity-50"
              >
                {prStatus === "loading" ? "Creating..." : "Create PR"}
              </button>
            </div>
            {prStatus === "success" && prUrl && (
              <p className="text-[#3fb950] text-sm mt-2">
                ✅ PR created: <a href={prUrl} target="_blank" rel="noopener noreferrer" className="text-[#58a6ff] hover:underline">{prUrl}</a>
              </p>
            )}
            {prStatus === "error" && (
              <p className="text-[#f85149] text-sm mt-2">❌ Failed to create PR. Check logs.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Agent;