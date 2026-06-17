import AdminLayout from "../../../components/AdminLayout";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("users") || "[]";
    const dark = localStorage.getItem("darkMode") === "true";
    setIsDark(dark);
    setUsers(JSON.parse(saved).length ? JSON.parse(saved) : [
      { id: 1, username: "Alice", email: "alice@example.com", role: "admin", status: "active" },
      { id: 2, username: "Bob", email: "bob@example.com", role: "user", status: "active" },
      { id: 3, username: "Charlie", email: "charlie@example.com", role: "moderator", status: "inactive" },
      { id: 4, username: "Diana", email: "diana@example.com", role: "user", status: "active" },
      { id: 5, username: "Eve", email: "eve@example.com", role: "admin", status: "active" },
      { id: 6, username: "Frank", email: "FRANK@EXAMPLE.COM", role: "user", status: "inactive" },
      { id: 7, username: "Grace", email: "grace@Example.com", role: "moderator", status: "active" },
      { id: 8, username: "Henry", email: "henry@example.com", role: "user", status: "active" },
    ]);
  }, []);

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    const handleDarkModeChange = (e) => setIsDark(e.detail);
    window.addEventListener("darkModeChange", handleDarkModeChange);
    return () => window.removeEventListener("darkModeChange", handleDarkModeChange);
  }, []);

  const cardBg = isDark ? "#1a1a1a" : "#fff";
  const cardText = isDark ? "#ffffff" : "#01381e";
  const pageBg = isDark ? "#000000" : "#Dee2b1";
  const borderColor = isDark ? "#333333" : "#01381e";

  return (
    <AdminLayout>
      <div style={{ backgroundColor: pageBg, minHeight: "100%" }}>
        <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h2 style={{ margin: 0, fontSize: "1.75rem", color: cardText, fontWeight: 600 }}>User Management</h2>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.9rem", color: isDark ? "#Dee2b1" : "#01381e", opacity: 0.8 }}>Manage registered users and their roles</p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
            <span style={{ fontSize: "0.85rem", color: cardText, backgroundColor: isDark ? "#333" : "#e8e9d4", padding: "0.5rem 1rem", borderRadius: "20px" }}>
              {users.length} Total Users
            </span>
          </div>
        </div>

        <div className="admin-card" style={{ backgroundColor: cardBg, padding: 0, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: isDark ? "#2a2a2a" : "#f5f6f0", borderBottom: `2px solid ${borderColor}` }}>
                <th style={{ padding: "0.75rem", textAlign: "left", color: cardText }}>ID</th>
                <th style={{ padding: "0.75rem", textAlign: "left", color: cardText }}>Username</th>
                <th style={{ padding: "0.75rem", textAlign: "left", color: cardText }}>Email</th>
                <th style={{ padding: "0.75rem", textAlign: "left", color: cardText }}>Role</th>
                <th style={{ padding: "0.75rem", textAlign: "left", color: cardText }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="admin-table-row" style={{ borderBottom: `1px solid ${borderColor}` }}>
                  <td style={{ padding: "1rem 1.5rem", color: cardText, fontSize: "0.85rem" }}>{user.id}</td>
                  <td style={{ padding: "1rem 1.5rem", fontWeight: 600, color: cardText, fontSize: "0.95rem" }}>{user.username}</td>
                  <td style={{ padding: "1rem 1.5rem", color: isDark ? "#Dee2b1" : "#01381e", fontSize: "0.9rem", fontFamily: "monospace" }}>{user.email}</td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span className="badge badge-role" style={{
                      padding: "0.35rem 0.85rem",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      backgroundColor: isDark ? "#2a2a2a" : "#e8e9d4",
                      color: isDark ? "#ffffff" : "#01381e",
                      border: `1px solid ${borderColor}`,
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.5rem" }}>
                    <span className="badge" style={{
                      padding: "0.35rem 0.85rem",
                      borderRadius: "20px",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      backgroundColor: user.status === "active" ? (isDark ? "rgba(40, 167, 69, 0.2)" : "rgba(40, 167, 69, 0.1)") : (isDark ? "rgba(220, 53, 69, 0.2)" : "rgba(220, 53, 69, 0.1)"),
                      color: user.status === "active" ? (isDark ? "#5cdb8b" : "#155724") : (isDark ? "#ff8a98" : "#721c24"),
                      border: `1px solid ${user.status === "active" ? (isDark ? "#1a4d2e" : "#c3e6cb") : (isDark ? "#4a1a1a" : "#f5c6cb")}`,
                    }}>
                      ● {user.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}