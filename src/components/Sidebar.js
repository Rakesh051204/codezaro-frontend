import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../ThemeContext";
import Logo from "./Logo";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  const navItems = [
    { path: "/review", label: "Review" },
    { path: "/history", label: "History" },
    { path: "/agent", label: "Agent" },
  ];

  const handleUpgrade = () => {
    alert("Upgrade to Pro");
  };

  return (
    <aside className="w-56 h-screen bg-[#0d1117] text-[#e6edf3] border-r border-[#30363d] flex flex-col p-4 fixed top-0 left-0 z-50">
      <div className="flex items-center gap-2 mb-8">
        <Logo className="w-8 h-8" />
        <span className="text-xl font-bold tracking-tight">CodeZaro</span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full text-left px-3 py-2 rounded transition flex items-center gap-2 text-sm ${
              location.pathname === item.path
                ? "bg-[#161b22] text-[#58a6ff]"
                : "text-[#8b949e] hover:bg-[#161b22] hover:text-[#e6edf3]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-[#30363d] pt-4 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full text-left px-3 py-2 rounded text-sm text-[#8b949e] hover:bg-[#161b22] transition"
        >
          {isDark ? "Light" : "Dark"}
        </button>
        <button
          onClick={handleUpgrade}
          className="w-full text-left px-3 py-2 rounded bg-green-600 hover:bg-green-700 text-sm font-medium text-white"
        >
          Upgrade to Pro
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded text-sm text-[#f85149] hover:bg-[#161b22] transition"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;