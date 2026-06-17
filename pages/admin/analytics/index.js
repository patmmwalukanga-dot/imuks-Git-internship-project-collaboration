import AdminLayout from "../../../components/AdminLayout";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { useEffect, useState } from "react";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ArcElement);

export default function AnalyticsPage() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsDark(localStorage.getItem("darkMode") === "true");
    const handleDarkModeChange = (e) => setIsDark(e.detail);
    window.addEventListener("darkModeChange", handleDarkModeChange);
    return () => window.removeEventListener("darkModeChange", handleDarkModeChange);
  }, []);

  const visitorData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Visitors",
        data: [65, 59, 80, 81, 56, 55, 72],
        backgroundColor: "rgba(78, 205, 196, 0.6)",
        borderColor: "rgba(78, 205, 196, 1)",
        borderWidth: 2,
      },
    ],
  };

  const revenueData = {
    labels: ["Q1", "Q2", "Q3", "Q4"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [3000, 5400, 2800, 6100],
        backgroundColor: ["#ff6b6b", "#4ecdc4", "#45b7cd", "#1a535c"],
      },
    ],
  };

  const trafficData = {
    labels: ["Direct", "Social", "Referral", "Email", "Other"],
    datasets: [
      {
        data: [35, 25, 20, 12, 8],
        backgroundColor: ["#00d4ff", "#ff6b6b", "#4ecdc4", "#ffd166", "#1a535c"],
      },
    ],
  };

  const metrics = [
    { label: "Total Visits", value: "12,845", change: "+12%" },
    { label: "Bounce Rate", value: "42.3%", change: "-3%" },
    { label: "Avg Session", value: "2m 45s", change: "+8%" },
    { label: "Conversion", value: "3.2%", change: "+2%" },
  ];

  const cardBg = isDark ? "#1a1a1a" : "#fff";
  const cardText = isDark ? "#ffffff" : "#01381e";
  const pageBg = isDark ? "#000000" : "#Dee2b1";

  return (
    <AdminLayout>
      <div style={{ backgroundColor: pageBg, minHeight: "100%" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {metrics.map((m) => (
            <div key={m.label} style={{ backgroundColor: cardBg, padding: "1.25rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: `1px solid ${isDark ? "#1a4d2e" : "#01381e"}` }}>
              <h4 style={{ margin: 0, color: isDark ? "#Dee2b1" : "#01381e", fontSize: "0.85rem" }}>{m.label}</h4>
              <p style={{ fontSize: "1.75rem", fontWeight: "bold", margin: "0.5rem 0", color: cardText }}>{m.value}</p>
              <span style={{ color: "#28a745", fontSize: "0.8rem" }}>{m.change} from last month</span>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ backgroundColor: cardBg, padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: `1px solid ${isDark ? "#1a4d2e" : "#01381e"}` }}>
            <h3 style={{ margin: "0 0 1rem 0", color: cardText }}>Monthly Visitors</h3>
            <Bar data={visitorData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          </div>
          <div style={{ backgroundColor: cardBg, padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: `1px solid ${isDark ? "#1a4d2e" : "#01381e"}` }}>
            <h3 style={{ margin: "0 0 1rem 0", color: cardText }}>Traffic Sources</h3>
            <Pie data={trafficData} options={{ responsive: true, plugins: { legend: { position: "bottom" } } }} />
          </div>
        </div>

        <div style={{ backgroundColor: cardBg, padding: "1.5rem", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", border: `1px solid ${isDark ? "#1a4d2e" : "#01381e"}` }}>
          <h3 style={{ margin: "0 0 1rem 0", color: cardText }}>Quarterly Revenue</h3>
          <Line data={revenueData} options={{ responsive: true, plugins: { legend: { display: false } }, elements: { line: { tension: 0.4 } } }} />
        </div>
      </div>
    </AdminLayout>
  );
}