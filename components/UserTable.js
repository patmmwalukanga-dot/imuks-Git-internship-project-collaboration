import { useState, useMemo, useEffect } from "react";

export default function UserTable({ users, setUsers }) {
  const [selectAll, setSelectAll] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [editingUser, setEditingUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({ username: "", email: "", role: "user" });
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(localStorage.getItem("darkMode") === "true");
    const handleDarkModeChange = (e) => setIsDark(e.detail);
    window.addEventListener("darkModeChange", handleDarkModeChange);
    return () => window.removeEventListener("darkModeChange", handleDarkModeChange);
  }, []);

  useEffect(() => {
    setSelectAll(selectedIds.length === users.length && users.length > 0);
  }, [selectedIds, users]);

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(users.map(u => u.id));
    }
  };

  const handleSelectRow = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = filterRole === "all" || user.role === filterRole;
      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, filterRole]);

  const handleDelete = (idx) => {
    setUsers(users.filter((_, i) => i !== idx));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setNewUser({ ...user });
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? newUser : u));
      setEditingUser(null);
    }
    setShowAddForm(false);
    setNewUser({ username: "", email: "", role: "user" });
  };

  const handleAdd = () => {
    setUsers([...users, { ...newUser, id: Date.now() }]);
    setShowAddForm(false);
    setNewUser({ username: "", email: "", role: "user" });
  };

  const roles = ["admin", "moderator", "user"];
  
  const cardBg = isDark ? "#1a1a1a" : "#fff";
  const cardText = isDark ? "#ffffff" : "#01381e";
  const borderColor = isDark ? "#333333" : "#01381e";
  const inputBg = isDark ? "#000000" : "#fff";

  return (
    <div style={{ backgroundColor: cardBg, padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: isDark ? "1px solid #333333" : "none" }}>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ flex: 1, padding: "0.5rem 1rem", border: `1px solid ${borderColor}`, borderRadius: "6px", fontSize: "0.9rem", backgroundColor: inputBg, color: cardText }}
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          style={{ padding: "0.5rem", border: `1px solid ${borderColor}`, borderRadius: "6px", fontSize: "0.9rem", backgroundColor: inputBg, color: cardText }}
        >
          <option value="all">All Roles</option>
          {roles.map(role => (
            <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
          ))}
        </select>
        <button
          onClick={() => setShowAddForm(true)}
          style={{ backgroundColor: isDark ? "#01381e" : "#01381e", color: "white", padding: "0.5rem 1.25rem", border: "none", borderRadius: "6px", cursor: "pointer" }}
        >
          + Add User
        </button>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
              <tr style={{ backgroundColor: isDark ? "#0a2e1a" : "#e8e9d4", borderBottom: "2px solid #c5c994" }}>
                <th style={{ padding: "0.75rem", textAlign: "left", color: cardText }}>
                  <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                </th>
                <th style={{ padding: "0.75rem", textAlign: "left", color: cardText }}>Username</th>
                <th style={{ padding: "0.75rem", textAlign: "left", color: cardText }}>Email</th>
                <th style={{ padding: "0.75rem", textAlign: "left", color: cardText }}>Role</th>
                <th style={{ padding: "0.75rem", textAlign: "left", color: cardText }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, idx) => (
                <tr key={user.id || idx} style={{ borderBottom: "1px solid #c5c994" }}>
                  <td style={{ padding: "0.75rem" }}>
                    <input type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => handleSelectRow(user.id)} />
                  </td>
                  <td style={{ padding: "0.75rem", fontWeight: 500, color: cardText }}>{user.username}</td>
                  <td style={{ padding: "0.75rem", color: isDark ? "#94a3b8" : "#666" }}>{user.email}</td>
                <td style={{ padding: "0.75rem" }}>
                  <span style={{
                    padding: "0.25rem 0.75rem",
                    borderRadius: "20px",
                    fontSize: "0.8rem",
                    backgroundColor: user.role === "admin" ? (isDark ? "#1a4d2e" : "#c8d9b5") : user.role === "moderator" ? (isDark ? "#2d4a1a" : "#d4e4c5") : (isDark ? "#4a1a2d" : "#e8d4c5"),
                    color: user.role === "admin" ? (isDark ? "#Dee2b1" : "#01381e") : user.role === "moderator" ? (isDark ? "#Dee2b1" : "#01381e") : (isDark ? "#Dee2b1" : "#01381e"),
                  }}>
                    {user.role}
                  </span>
                </td>
                <td style={{ padding: "0.75rem" }}>
                  <button onClick={() => handleEdit(user)} style={{ marginRight: "0.5rem", padding: "0.25rem 0.75rem", backgroundColor: "#ffc107", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(idx)} style={{ padding: "0.25rem 0.75rem", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(showAddForm || editingUser) && (
          <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
            <div style={{ backgroundColor: cardBg, padding: "2rem", borderRadius: "12px", width: "400px", border: `1px solid ${borderColor}` }}>
            <h3 style={{ marginTop: 0, color: cardText }}>{editingUser ? "Edit User" : "Add New User"}</h3>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: cardText }}>Username</label>
              <input
                type="text"
                value={newUser.username}
                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", border: `1px solid ${borderColor}`, borderRadius: "6px", backgroundColor: inputBg, color: cardText }}
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: cardText }}>Email</label>
              <input
                type="email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", border: `1px solid ${borderColor}`, borderRadius: "6px", backgroundColor: inputBg, color: cardText }}
              />
            </div>
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontSize: "0.9rem", color: cardText }}>Role</label>
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                style={{ width: "100%", padding: "0.5rem", border: `1px solid ${borderColor}`, borderRadius: "6px", backgroundColor: inputBg, color: cardText }}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}>
              <button onClick={() => { setShowAddForm(false); setEditingUser(null); }} style={{ padding: "0.5rem 1rem", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={editingUser ? handleSave : handleAdd} style={{ padding: "0.5rem 1rem", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                {editingUser ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}