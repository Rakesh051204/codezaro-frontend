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
    <aside className="w-56 h-screen bg-white dark:bg-[#1F1F1F] border-r border-gray-200 dark:border-[#3D3D3D] flex flex-col p-4 fixed top-0 left-0 z-50 transition-colors">
      <div className="flex items-center gap-2 mb-8">
        <Logo className="w-8 h-8" />
        <span className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
          CodeZaro
        </span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full text-left px-3 py-2 rounded-md transition flex items-center gap-2 text-sm ${
              location.pathname === item.path
                ? "bg-[#0078D4] text-white"
                : "text-gray-700 dark:text-[#e6e6e6] hover:bg-gray-100 dark:hover:bg-[#2D2D2D]"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-gray-200 dark:border-[#3D3D3D] pt-4 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-700 dark:text-[#e6e6e6] hover:bg-gray-100 dark:hover:bg-[#2D2D2D] transition"
        >
          {isDark ? "Light" : "Dark"}
        </button>
        <button
          onClick={handleUpgrade}
          className="w-full text-left px-3 py-2 rounded-md bg-[#0078D4] hover:bg-[#106EBE] text-sm font-medium text-white transition"
        >
          Upgrade to Pro
        </button>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 rounded-md text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-[#2D2D2D] transition"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;