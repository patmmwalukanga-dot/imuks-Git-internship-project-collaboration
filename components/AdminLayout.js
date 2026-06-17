import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved === "true") setIsDark(true);
    const handleDarkModeChange = (e) => setIsDark(e.detail);
    window.addEventListener("darkModeChange", handleDarkModeChange);
    return () => window.removeEventListener("darkModeChange", handleDarkModeChange);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", isDark.toString());
    window.dispatchEvent(new CustomEvent("darkModeChange", { detail: isDark }));
  }, [isDark]);

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth");
    if (auth === "true") setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      setIsAuthenticated(true);
      localStorage.setItem("adminAuth", "true");
      setLoginError("");
    } else {
      setLoginError("Invalid password");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminAuth");
    router.push("/admin/login");
  };

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Users", path: "/admin/users", icon: "👥" },
    { name: "Analytics", path: "/admin/analytics", icon: "📈" },
    { name: "Settings", path: "/admin/settings", icon: "⚙️" },
  ];

  const darkColors = {
    bg: "#000000",
    nav: "#000000",
    navText: "#Dee2b1",
    header: "#000000",
    text: "#ffffff",
    card: "#1a1a1a",
    border: "#333333",
  };

  const lightColors = {
    bg: "#Dee2b1",
    nav: "#01381e",
    navText: "#Dee2b1",
    header: "#01381e",
    text: "#01381e",
    card: "#ffffff",
    border: "#01381e",
  };

  const colors = isDark ? darkColors : lightColors;
  const inputBg = isDark ? "#000000" : "#fff";

  if (router.pathname === "/admin/login") {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: colors.bg }}>
        <div style={{ backgroundColor: colors.card, padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "400px", border: `1px solid ${colors.border}` }}>
          <h2 style={{ margin: "0 0 1.5rem 0", color: colors.text, textAlign: "center" }}>Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: colors.text }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: "100%", padding: "0.75rem", border: `1px solid ${colors.border}`, borderRadius: "6px", backgroundColor: inputBg, color: colors.text }}
              />
              {loginError && <p style={{ color: "#dc3545", fontSize: "0.85rem", marginTop: "0.5rem" }}>{loginError}</p>}
            </div>
            <button type="submit" style={{ width: "100%", padding: "0.75rem", backgroundColor: colors.header, color: colors.navText, border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "1rem", fontWeight: 500 }}>
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: colors.bg, transition: "background-color 0.3s" }}>
      <nav style={{
        width: "240px",
        backgroundColor: colors.nav,
        padding: "1.5rem 1rem",
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${colors.border}`,
        transition: "background-color 0.3s",
      }}>
        <div style={{ marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ color: isDark ? colors.text : "#Dee2b1", fontSize: "1.5rem", margin: 0 }}>Admin Panel</h2>
          <button
            onClick={() => setIsDark(!isDark)}
            style={{
              background: "none",
              border: "none",
              fontSize: "1.5rem",
              cursor: "pointer",
              padding: "0.25rem",
            }}
            title="Toggle dark mode"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              fontSize: "1rem",
              cursor: "pointer",
              padding: "0.5rem 1rem",
              color: colors.navText,
            }}
            title="Logout"
          >
            Logout
          </button>
        </div>
        {navItems.map((item) => (
          <Link key={item.path} href={item.path} style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1rem",
            borderRadius: "8px",
            marginBottom: "0.5rem",
            textDecoration: "none",
            color: router.pathname === item.path ? (isDark ? colors.text : "#Dee2b1") : colors.navText,
            backgroundColor: router.pathname === item.path ? (isDark ? "rgba(222, 226, 177, 0.1)" : "rgba(222, 226, 177, 0.1)") : "transparent",
            className: "nav-link",
          }}>
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header style={{
          backgroundColor: colors.header,
          padding: "1rem 2rem",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          transition: "background-color 0.3s",
          borderBottom: `1px solid ${colors.border}`,
        }}>
          <div>
            <h1 style={{ fontSize: "1.25rem", color: isDark ? "#ffffff" : "#Dee2b1", margin: 0, fontWeight: 600 }}>{navItems.find(i => i.path === router.pathname)?.name || "Admin"}</h1>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.8rem", color: isDark ? "#Dee2b1" : "#Dee2b1", opacity: 0.8 }}>{currentTime}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: 0, color: isDark ? "#ffffff" : "#Dee2b1", fontSize: "0.9rem", fontWeight: 500 }}>Welcome back, Admin</p>
              <p style={{ margin: 0, color: isDark ? "#Dee2b1" : "#Dee2b1", fontSize: "0.75rem", opacity: 0.7 }}>Super Admin</p>
            </div>
            <div style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              backgroundColor: isDark ? "#01381e" : "#Dee2b1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: isDark ? "#Dee2b1" : "#01381e",
              fontSize: "1.1rem",
              fontWeight: "bold",
              border: `2px solid ${isDark ? "#Dee2b1" : "#01381e"}`,
            }}>
              A
            </div>
          </div>
        </header>
        <main style={{ padding: "2rem", flex: 1, backgroundColor: colors.bg }}>{children}</main>
      </div>
    </div>
  );
}