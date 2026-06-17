import AdminLayout from "../../../components/AdminLayout";
import { useState, useEffect } from "react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "My Admin Panel",
    adminEmail: "admin@example.com",
    notifications: true,
    language: "en",
  });
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(localStorage.getItem("darkMode") === "true");
    const handleDarkModeChange = (e) => setIsDark(e.detail);
    window.addEventListener("darkModeChange", handleDarkModeChange);
    return () => window.removeEventListener("darkModeChange", handleDarkModeChange);
  }, []);

  const handleChange = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  const saveSettings = () => {
    alert("Settings saved!");
  };

  const cardBg = isDark ? "#1a1a1a" : "#fff";
  const cardText = isDark ? "#ffffff" : "#01381e";
  const labelText = isDark ? "#Dee2b1" : "#01381e";
  const inputBg = isDark ? "#000000" : "#fff";
  const pageBg = isDark ? "#000000" : "#Dee2b1";

  return (
    <AdminLayout>
      <div style={{ backgroundColor: pageBg, minHeight: "100%", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ backgroundColor: cardBg, padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", marginBottom: "1.5rem", border: `1px solid ${isDark ? "#1a4d2e" : "#01381e"}` }}>
          <h2 style={{ margin: "0 0 1.5rem 0", color: cardText }}>General Settings</h2>
          
          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: labelText }}>Site Name</label>
            <input
              type="text"
              value={settings.siteName}
              onChange={(e) => handleChange("siteName", e.target.value)}
              style={{ width: "100%", padding: "0.75rem", border: `1px solid ${isDark ? "#1a4d2e" : "#01381e"}`, borderRadius: "6px", fontSize: "0.95rem", backgroundColor: inputBg, color: cardText }}
            />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: labelText }}>Admin Email</label>
            <input
              type="email"
              value={settings.adminEmail}
              onChange={(e) => handleChange("adminEmail", e.target.value)}
              style={{ width: "100%", padding: "0.75rem", border: `1px solid ${isDark ? "#1a4d2e" : "#01381e"}`, borderRadius: "6px", fontSize: "0.95rem", backgroundColor: inputBg, color: cardText }}
            />
          </div>

          <div style={{ marginBottom: "1.25rem" }}>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 500, color: labelText }}>Language</label>
            <select
              value={settings.language}
              onChange={(e) => handleChange("language", e.target.value)}
              style={{ width: "100%", padding: "0.75rem", border: `1px solid ${isDark ? "#1a4d2e" : "#01381e"}`, borderRadius: "6px", fontSize: "0.95rem", backgroundColor: inputBg, color: cardText }}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", color: labelText }}>
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleChange("notifications", e.target.checked)}
              />
              Enable Notifications
            </label>
          </div>

          <button onClick={saveSettings} style={{
            backgroundColor: "#0070f3",
            color: "white",
            padding: "0.75rem 1.5rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: 500,
          }}>
            Save Settings
          </button>
        </div>

        <div style={{ backgroundColor: cardBg, padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: `1px solid ${isDark ? "#1a4d2e" : "#01381e"}` }}>
          <h2 style={{ margin: "0 0 1rem 0", color: cardText }}>Security Settings</h2>
          <div style={{ marginBottom: "1rem" }}>
            <button style={{
              backgroundColor: "#dc3545",
              color: "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              marginRight: "0.75rem",
            }}>
              Change Password
            </button>
            <button style={{
              backgroundColor: "#6c757d",
              color: "white",
              padding: "0.5rem 1rem",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}>
              Enable 2FA
            </button>
          </div>
          <p style={{ color: isDark ? "#94a3b8" : "#666", fontSize: "0.85rem" }}>Last login: Today at 2:30 PM from Chrome on Windows</p>
        </div>
      </div>
    </AdminLayout>
  );
}