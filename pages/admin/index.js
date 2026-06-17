import { useEffect, useState } from "react";
import AdminLayout from "../../components/AdminLayout";
import UserTable from "../../components/UserTable";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("users") || "[]";
    const dark = localStorage.getItem("darkMode") === "true";
    setIsDark(dark);
    setUsers(JSON.parse(saved).length ? JSON.parse(saved) : [
      { id: 1, username: "Alice", email: "alice@example.com", role: "admin" },
      { id: 2, username: "Bob", email: "bob@example.com", role: "user" },
      { id: 3, username: "Charlie", email: "charlie@example.com", role: "moderator" },
      { id: 4, username: "Diana", email: "diana@example.com", role: "user" },
      { id: 5, username: "Eve", email: "eve@example.com", role: "admin" },
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

  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === "admin").length,
    moderators: users.filter(u => u.role === "moderator").length,
    users: users.filter(u => u.role === "user").length,
  };

  const chartData = {
    labels: ["Admins", "Moderators", "Users"],
    datasets: [
      {
        label: "User Distribution",
        data: [stats.admins, stats.moderators, stats.users],
        backgroundColor: ["#ff6b6b", "#4ecdc4", "#1a535c"],
        borderColor: ["#ff5252", "#26a69a", "#00796b"],
        borderWidth: 1,
      },
    ],
  };

  const activityData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Active Users",
        data: [12, 19, 15, 22, 28, 20, 18],
        backgroundColor: "rgba(78, 205, 196, 0.6)",
        borderColor: "rgba(78, 205, 196, 1)",
        borderWidth: 1,
      },
    ],
  };

  const cardBg = isDark ? "#1a1a1a" : "#fff";
  const cardText = isDark ? "#ffffff" : "#01381e";
  const labelText = isDark ? "#Dee2b1" : "#01381e";
  const pageBg = isDark ? "#000000" : "#Dee2b1";

  return (
    <AdminLayout>
      <div style={{ backgroundColor: pageBg, minHeight: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          {[
            { label: "Total Users", value: stats.total, change: "↑ 12% from last month" },
            { label: "Admins", value: stats.admins },
            { label: "Moderators", value: stats.moderators },
            { label: "Active Users", value: stats.users },
          ].map((stat, idx) => (
            <div key={stat.label} className="stat-card" style={{ backgroundColor: cardBg, borderColor: isDark ? "#1a4d2e" : "#01381e", textAlign: "center" }}>
              <h3 style={{ margin: "0 0 0.5rem 0", color: labelText, fontSize: "0.9rem" }}>{stat.label}</h3>
              <p style={{ fontSize: "2.5rem", fontWeight: "bold", margin: 0, color: cardText }}>{stat.value}</p>
              {stat.change && <p style={{ color: "#28a745", fontSize: "0.85rem", margin: "0.5rem 0 0 0" }}>{stat.change}</p>}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
          <div className="admin-card">
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem", color: cardText }}>User Distribution</h3>
            <Doughnut data={chartData} options={{ responsive: true, plugins: { legend: { position: "bottom", labels: { color: cardText } } } }} />
          </div>
          <div className="admin-card">
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem", color: cardText }}>Weekly Activity</h3>
            <Bar data={activityData} options={{ responsive: true, plugins: { legend: { display: false } }, scales: { y: { ticks: { color: labelText } }, x: { ticks: { color: labelText } } } }} />
          </div>
        </div>

        <UserTable users={users} setUsers={setUsers} />
      </div>
    </AdminLayout>
  );
}