import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Review from "./pages/Review";
import History from "./pages/History";
import Landing from "./pages/Landing";
import Agent from "./pages/Agent";
import Sidebar from "./components/Sidebar";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("access_token");
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/review"
            element={
              <PrivateRoute>
                <div className="flex min-h-screen">
                  <Sidebar />
                  <div className="ml-56 flex-1 p-6">
                    <Review />
                  </div>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/history"
            element={
              <PrivateRoute>
                <div className="flex min-h-screen">
                  <Sidebar />
                  <div className="ml-56 flex-1 p-6">
                    <History />
                  </div>
                </div>
              </PrivateRoute>
            }
          />
          <Route
            path="/agent"
            element={
              <PrivateRoute>
                <div className="flex min-h-screen">
                  <Sidebar />
                  <div className="ml-56 flex-1 p-6">
                    <Agent />
                  </div>
                </div>
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;