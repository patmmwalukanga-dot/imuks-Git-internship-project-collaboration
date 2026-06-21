"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  Calendar,
  Download,
  Moon,
  RefreshCw,
  Sun,
  TrendingUp,
  Users,
} from "lucide-react";
import EnrollmentPage from "@/components/EnrollmentPage";
import GradesPage from "@/components/GradesPage";
import AttendancePage from "@/components/AttendancePage";
import ReportsPage from "@/components/ReportsPage";

type Student = {
  id: string | number;
  name: string;
  studentId: string;
  class: string;
  gender: string;
  status: string;
  grade?: number;
  attendance?: number;
  subject?: string;
};

type DashboardData = {
  school: string;
  term: string;
  lastUpdated: string;
  students: Student[];
  attendanceHistory: { month: string; rate: number; target: number }[];
  gradeDistribution: { range: string; count: number; label: string }[];
};

declare global {
  interface Window {
    __MOCK_DATA__?: DashboardData;
  }
}

const GITHUB_DATA_URL = null;

const MOCK_DATA: DashboardData = {
  school: "Lusaka Academy",
  term: "Term 2 — 2026",
  lastUpdated: new Date().toISOString(),
  students: [
    { id: 1, name: "Amara Phiri", studentId: "STU1001", class: "Grade 10A", gender: "Female", status: "Active", grade: 87, attendance: 95, subject: "Mathematics" },
    { id: 2, name: "Chanda Mwale", studentId: "STU1002", class: "Grade 10A", gender: "Male", status: "Active", grade: 72, attendance: 80, subject: "Mathematics" },
    { id: 3, name: "David Tembo", studentId: "STU1003", class: "Grade 10B", gender: "Male", status: "Active", grade: 91, attendance: 98, subject: "Science" },
    { id: 4, name: "Esther Banda", studentId: "STU1004", class: "Grade 10B", gender: "Female", status: "Active", grade: 65, attendance: 70, subject: "Science" },
    { id: 5, name: "Felix Lungu", studentId: "STU1005", class: "Grade 11A", gender: "Male", status: "Active", grade: 78, attendance: 88, subject: "English" },
    { id: 6, name: "Grace Zulu", studentId: "STU1006", class: "Grade 11A", gender: "Female", status: "Active", grade: 94, attendance: 97, subject: "English" },
    { id: 7, name: "Henry Mutale", studentId: "STU1007", class: "Grade 11B", gender: "Male", status: "Inactive", grade: 55, attendance: 60, subject: "History" },
    { id: 8, name: "Irene Moonga", studentId: "STU1008", class: "Grade 11B", gender: "Female", status: "Active", grade: 83, attendance: 92, subject: "History" },
    { id: 9, name: "James Kabwe", studentId: "STU1009", class: "Grade 12A", gender: "Male", status: "Active", grade: 90, attendance: 96, subject: "Physics" },
    { id: 10, name: "Kunda Nkonde", studentId: "STU1010", class: "Grade 12A", gender: "Female", status: "Active", grade: 76, attendance: 84, subject: "Physics" },
    { id: 11, name: "Liya Musonda", studentId: "STU1011", class: "Grade 12B", gender: "Female", status: "Active", grade: 88, attendance: 91, subject: "Chemistry" },
    { id: 12, name: "Moses Siame", studentId: "STU1012", class: "Grade 12B", gender: "Male", status: "Inactive", grade: 62, attendance: 75, subject: "Chemistry" },
  ],
  attendanceHistory: [
    { month: "Jan", rate: 92, target: 90 },
    { month: "Feb", rate: 88, target: 90 },
    { month: "Mar", rate: 94, target: 90 },
    { month: "Apr", rate: 90, target: 90 },
    { month: "May", rate: 87, target: 90 },
    { month: "Jun", rate: 93, target: 90 },
  ],
  gradeDistribution: [
    { range: "90-100", count: 3, label: "Distinction" },
    { range: "80-89", count: 4, label: "Merit" },
    { range: "70-79", count: 3, label: "Credit" },
    { range: "60-69", count: 2, label: "Pass" },
    { range: "0-59", count: 0, label: "Fail" },
  ],
};

const lightTheme = {
  bg: "#f8fafc",
  surface: "#ffffff",
  surfaceHi: "#f1f5f9",
  border: "#e2e8f0",
  text: "#0f172a",
  muted: "#64748b",
  sidebar: "#155e4d",
  sidebarText: "#ffffff",
  accent: "#10b981",
  accentHi: "#059669",
  amber: "#f59e0b",
  rose: "#ef4444",
  emerald: "#10b981",
  sky: "#0ea5e9",
  chart: ["#10b981", "#0ea5e9", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"],
};

const darkTheme = {
  bg: "#0f172a",
  surface: "#1e293b",
  surfaceHi: "#334155",
  border: "#475569",
  text: "#f1f5f9",
  muted: "#94a3b8",
  sidebar: "#1a3a34",
  sidebarText: "#f1f5f9",
  accent: "#10b981",
  accentHi: "#34d399",
  amber: "#fbbf24",
  rose: "#f87171",
  emerald: "#10b981",
  sky: "#38bdf8",
  chart: ["#10b981", "#38bdf8", "#fbbf24", "#f87171", "#a78bfa", "#f472b6"],
};

const avg = (arr: number[]) => (arr.length ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0);

const gradeInfo = (s: number, theme: typeof lightTheme) => {
  if (s >= 90) return { letter: "A", color: theme.emerald, label: "Distinction" };
  if (s >= 80) return { letter: "B", color: theme.accent, label: "Merit" };
  if (s >= 70) return { letter: "C", color: theme.sky, label: "Credit" };
  if (s >= 60) return { letter: "D", color: theme.amber, label: "Pass" };
  return { letter: "F", color: theme.rose, label: "Fail" };
};

const groupBy = <T extends Record<string, unknown>>(arr: T[], key: keyof T) =>
  arr.reduce((acc, item) => {
    const groupKey = String(item[key] ?? "");
    (acc[groupKey] = acc[groupKey] || []).push(item);
    return acc;
  }, {} as Record<string, T[]>);

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleString("en-ZM", { dateStyle: "medium", timeStyle: "short" });

type TooltipPayload = {
  color?: string;
  name?: string | number;
  value?: string | number;
};

const createGlobalStyles = (theme: typeof lightTheme) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');

  *, *::before, *::after { 
    box-sizing: border-box; 
    margin: 0; 
    padding: 0;
    transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
  }

  html, body, #__next {
    height: 100%;
  }

  html {
    scroll-behavior: smooth;
  }

  body {
    font-family: 'Inter', sans-serif;
    background: ${theme.bg};
    color: ${theme.text};
    font-size: 14px;
    line-height: 1.5;
  }

  button,
  input,
  select,
  textarea {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  .layout { display: flex; height: 100vh; overflow: hidden; }

  .sidebar {
    width: 260px; min-width: 260px;
    background: ${theme.sidebar};
    border-right: 1px solid ${theme.accent}33;
    display: flex; flex-direction: column;
    overflow-y: auto;
    z-index: 10;
  }

  .sidebar-logo {
    padding: 24px;
    border-bottom: 1px solid ${theme.accent}33;
  }

  .sidebar-logo-mark {
    width: 40px; height: 40px; border-radius: 12px;
    background: ${theme.accent};
    display: flex; align-items: center; justify-content: center;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 20px; font-weight: 800; color: #fff;
    margin-bottom: 14px;
    box-shadow: 0 4px 12px ${theme.accent}40;
  }

  .sidebar-school {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 16px; font-weight: 700;
    color: ${theme.sidebarText};
  }

  .sidebar-term {
    font-size: 12px;
    color: ${theme.sidebarText}88;
    margin-top: 4px;
  }

  .sidebar-section { padding: 20px 12px 8px; }
  .sidebar-section-label {
    font-size: 11px; font-weight: 700;
    color: ${theme.sidebarText}77;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    padding: 0 12px; margin-bottom: 8px;
  }

  .nav-btn {
    display: flex; align-items: center; gap: 12px;
    width: 100%; padding: 11px 12px;
    border-radius: 10px; border: none;
    background: transparent;
    color: ${theme.sidebarText}99;
    font-family: 'Inter', sans-serif;
    font-size: 14px; font-weight: 500;
    cursor: pointer; text-align: left;
    margin-bottom: 4px;
  }

  .nav-btn:hover {
    background: ${theme.accent}33;
    color: ${theme.sidebarText};
  }

  .nav-btn.active {
    background: ${theme.accent}22;
    color: ${theme.sidebarText};
    font-weight: 600;
  }

  .nav-icon {
    width: 36px; height: 36px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .sidebar-footer {
    margin-top: auto;
    padding: 16px 12px;
    border-top: 1px solid ${theme.accent}33;
  }

  .status-pill {
    display: flex; align-items: center; gap: 10px;
    padding: 12px;
    border-radius: 10px;
    background: ${theme.accent}22;
    font-size: 12px;
    color: ${theme.sidebarText};
  }

  .status-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: ${theme.accent};
    box-shadow: 0 0 8px ${theme.accent};
    flex-shrink: 0;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .topbar {
    height: 70px; min-height: 70px;
    padding: 0 32px;
    border-bottom: 1px solid ${theme.border};
    display: flex; align-items: center; justify-content: space-between;
    background: ${theme.surface};
  }

  .topbar-left { display: flex; flex-direction: column; justify-content: center; }
  .topbar-title {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 20px; font-weight: 700;
    color: ${theme.text};
  }
  .topbar-sub { font-size: 12px; color: ${theme.muted}; margin-top: 2px; }
  .topbar-actions { display: flex; align-items: center; gap: 12px; }

  .btn-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: ${theme.surfaceHi};
    border: 1px solid ${theme.border};
    color: ${theme.text};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.15s;
  }

  .btn-icon:hover {
    background: ${theme.accent};
    color: #fff;
    border-color: ${theme.accent};
  }

  .btn-primary {
    display: flex; align-items: center; gap: 8px;
    padding: 10px 18px; border-radius: 10px;
    background: ${theme.accent}; border: none;
    color: #fff; font-family: 'Inter', sans-serif;
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: all 0.15s;
    box-shadow: 0 4px 12px ${theme.accent}40;
  }

  .btn-primary:hover { background: ${theme.accentHi}; }

  .content { flex: 1; overflow-y: auto; padding: 32px; }

  .card {
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    border-radius: 16px;
    padding: 24px;
    transition: all 0.2s;
  }

  .card:hover { border-color: ${theme.accent}55; }

  .card-title {
    font-size: 12px; font-weight: 700;
    color: ${theme.muted};
    letter-spacing: 0.06em;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  .table-wrap { overflow-x: auto; }

  .table-wrap table { width: 100%; border-collapse: collapse; }
  .table-wrap th,
  .table-wrap td { padding: 10px 12px; }
  .table-wrap thead th { text-align: left; font-size: 12px; color: ${theme.muted}; text-transform: uppercase; letter-spacing: 0.05em; }
  .table-wrap tbody tr { border-top: 1px solid ${theme.border}; }

  .fade-up { animation: fadeUp 0.35s ease forwards; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
    margin-bottom: 24px;
  }

  @media (max-width: 1100px) {
    .stat-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 640px) {
    .stat-grid { grid-template-columns: 1fr; }
  }

  .stat-card {
    position: relative;
    background: ${theme.surface};
    border: 1px solid ${theme.border};
    border-radius: 16px;
    padding: 20px;
    overflow: hidden;
  }

  .stat-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    color: ${theme.text};
    margin-bottom: 14px;
  }

  .stat-label {
    font-size: 12px; font-weight: 600;
    color: ${theme.muted};
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .stat-value {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 28px; font-weight: 800;
    color: ${theme.text};
    margin-bottom: 4px;
  }

  .stat-sub {
    font-size: 12px;
    color: ${theme.muted};
    margin-bottom: 10px;
  }

  .trend-badge {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; font-weight: 700;
  }

  .chart-grid-3 {
    display: grid;
    grid-template-columns: 1.4fr 1fr;
    gap: 20px;
    margin-bottom: 24px;
  }

  @media (max-width: 900px) {
    .chart-grid-3 { grid-template-columns: 1fr; }
  }

  .alert {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 16px 18px;
    border-radius: 12px;
    border: 1px solid;
    margin-bottom: 24px;
  }

  .recharts-tooltip-wrapper .recharts-default-tooltip {
    background: ${theme.surface} !important;
    border: 1px solid ${theme.border} !important;
    border-radius: 10px !important;
    font-size: 12px !important;
    color: ${theme.text} !important;
    box-shadow: 0 4px 12px ${theme.bg}44 !important;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const CustomTooltip = ({ active, payload, label, unit = "", theme }: { active?: boolean; payload?: TooltipPayload[]; label?: string; unit?: string; theme: typeof lightTheme }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: theme.surface, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px 14px", fontFamily: "'Inter', sans-serif" }}>
      <p style={{ fontSize: 11, color: theme.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ fontSize: 13, fontWeight: 600, color: p.color || theme.text }}>
          {p.name}: {p.value}{unit}
        </p>
      ))}
    </div>
  );
};

const StatCard = ({ label, value, sub, icon, accentColor, trend, theme }: { label: string; value: string | number; sub: string; icon: React.ReactNode; accentColor: string; trend?: number; theme: typeof lightTheme }) => (
  <div className="stat-card">
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: accentColor }} />
    <div className="stat-icon" style={{ background: `${accentColor}18` }}>
      {icon}
    </div>
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    <div className="stat-sub">{sub}</div>
    {trend !== undefined && (
      <div className="trend-badge" style={{ color: trend >= 0 ? theme.emerald : theme.rose }}>
        <span>{trend >= 0 ? "↑" : "↓"} {Math.abs(trend)}%</span>
        <span style={{ color: theme.muted, fontWeight: 500 }}>vs last term</span>
      </div>
    )}
  </div>
);

const OverviewPage = ({ data, theme }: { data: DashboardData; theme: typeof lightTheme }) => {
  const { students, attendanceHistory } = data;
  const avgGrade = avg(students.map((s) => s.grade ?? 0));
  const avgAtt = avg(students.map((s) => s.attendance ?? 0));
  const classes = [...new Set(students.map((s) => s.class))].length;
  const atRisk = students.filter((s) => (s.attendance ?? 0) < 75);
  const byClass = Object.entries(groupBy(students, "class")).map(([cls, list]) => ({
    name: cls,
    grade: avg(list.map((s) => s.grade ?? 0)),
    attendance: avg(list.map((s) => s.attendance ?? 0)),
  }));
  const subjectData = Object.entries(groupBy(students, "subject")).map(([sub, list]) => ({
    name: sub,
    value: avg(list.map((s) => s.grade ?? 0)),
  }));

  return (
    <div className="fade-up">
      <div className="stat-grid">
        <StatCard
          label="Total Students"
          value={students.length}
          sub={`${classes} active classes`}
          icon={<Users size={24} color={theme.accent} />}
          accentColor={theme.accent}
          trend={4}
          theme={theme}
        />
        <StatCard
          label="Average Grade"
          value={`${avgGrade}%`}
          sub={`School-wide · ${gradeInfo(avgGrade, theme).label}`}
          icon={<TrendingUp size={24} color={theme.emerald} />}
          accentColor={theme.emerald}
          trend={2}
          theme={theme}
        />
        <StatCard
          label="Avg Attendance"
          value={`${avgAtt}%`}
          sub="Current term rate"
          icon={<Calendar size={24} color={theme.sky} />}
          accentColor={theme.sky}
          trend={-1}
          theme={theme}
        />
        <StatCard
          label="At-Risk Students"
          value={atRisk.length}
          sub="Below 75% attendance"
          icon={<AlertTriangle size={24} color={theme.rose} />}
          accentColor={theme.rose}
          theme={theme}
        />
      </div>

      {atRisk.length > 0 && (
        <div className="alert" style={{ background: `${theme.rose}10`, borderColor: `${theme.rose}44`, color: theme.rose }}>
          <div style={{ marginTop: 2 }}><AlertTriangle size={20} /></div>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 3 }}>{atRisk.length} student{atRisk.length > 1 ? "s" : ""} require attention</div>
            <div style={{ fontSize: 13, opacity: 0.9 }}>
              {atRisk.map((s) => s.name).join(", ")} — below 75% attendance threshold
            </div>
          </div>
        </div>
      )}

      <div className="chart-grid-3">
        <div className="card">
          <div className="card-title">Grade &amp; Attendance by Class</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={byClass} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: theme.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: theme.muted, fontSize: 11 }} axisLine={false} tickLine={false} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip unit="%" theme={theme} />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: theme.muted, paddingTop: 16 }} />
              <Bar dataKey="grade" name="Grade" fill={theme.accent} radius={[6, 6, 0, 0]} />
              <Bar dataKey="attendance" name="Attendance" fill={theme.sky} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">Grade Distribution</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={subjectData} cx="50%" cy="50%" innerRadius={60} outerRadius={95} paddingAngle={3} dataKey="value" label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`} labelLine={false}>
                {subjectData.map((_, index) => (
                  <Cell key={index} fill={theme.chart[index % theme.chart.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip unit="%" theme={theme} />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: theme.muted, paddingTop: 16 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Attendance Trend — Monthly</div>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={attendanceHistory} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <defs>
              <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.sky} stopOpacity={0.25} />
                <stop offset="95%" stopColor={theme.sky} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={theme.accent} stopOpacity={0.1} />
                <stop offset="95%" stopColor={theme.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.border} vertical={false} />
            <XAxis dataKey="month" tick={{ fill: theme.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis domain={[70, 100]} tick={{ fill: theme.muted, fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip unit="%" theme={theme} />} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: theme.muted, paddingTop: 16 }} />
            <Area type="monotone" dataKey="rate" name="Attendance" stroke={theme.sky} strokeWidth={2.5} fill="url(#attGrad)" dot={{ r: 4, fill: theme.sky, strokeWidth: 0 }} activeDot={{ r: 6 }} />
            <Area type="monotone" dataKey="target" name="Target" stroke={theme.accent} strokeWidth={1.5} fill="url(#targetGrad)" strokeDasharray="5 4" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const PAGES = [
  { id: "overview", label: "Overview" },
  { id: "enrollment", label: "Enrollment" },
  { id: "grades", label: "Grades" },
  { id: "attendance", label: "Attendance" },
  { id: "reports", label: "Reports" },
];

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState("overview");

  // Always start with the light theme on both server and first client render
  // so the SSR-ed HTML and the client's first paint match exactly. The real
  // preference (localStorage / OS setting) is only read after mount, inside
  // useEffect below — by then hydration is already done, so flipping the
  // theme here can't trigger a hydration mismatch.
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme-preference");
    const shouldBeDark = saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(shouldBeDark);
  }, []);

  const theme = isDark ? darkTheme : lightTheme;

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    localStorage.setItem("theme-preference", next ? "dark" : "light");
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (GITHUB_DATA_URL) {
        const res = await fetch(GITHUB_DATA_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = (await res.json()) as DashboardData;
        setData(json);
        window.__MOCK_DATA__ = json;
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
        setData(MOCK_DATA);
        window.__MOCK_DATA__ = MOCK_DATA;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(loadData);
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, [loadData]);

  const currentPage = PAGES.find((item) => item.id === page);

  const exportCSV = (rows: Record<string, unknown>[], filename: string) => {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]).join(",");
    const body = rows.map((row) => Object.values(row).join(",")).join("\n");
    const blob = new Blob([`${headers}\n${body}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style>{createGlobalStyles(theme)}</style>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="sidebar-logo-mark">LA</div>
            <div className="sidebar-school">{data?.school ?? "Student Tracker"}</div>
            <div className="sidebar-term">{data?.term ?? "Loading…"}</div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-label">Navigation</div>
            {PAGES.map((item) => (
              <button
                key={item.id}
                className={`nav-btn ${page === item.id ? "active" : ""}`}
                onClick={() => setPage(item.id)}
              >
                <div className="nav-icon">
                  {item.id === "overview" && "◈"}
                  {item.id === "enrollment" && "◉"}
                  {item.id === "grades" && "◆"}
                  {item.id === "attendance" && "◇"}
                  {item.id === "reports" && "▤"}
                </div>
                {item.label}
              </button>
            ))}
          </div>

          <div className="sidebar-footer">
            <div className="status-pill">
              <div className="status-dot" />
              <div>
                <div style={{ fontSize: 12, color: theme.sidebarText, fontWeight: 500 }}>Live Data</div>
                <div style={{ fontSize: 10, marginTop: 1, opacity: 0.8 }}>Refreshes every 60s</div>
              </div>
            </div>
          </div>
        </aside>

        <div className="main">
          <div className="topbar">
            <div className="topbar-left">
              <div className="topbar-title">{currentPage?.label}</div>
              <div className="topbar-sub">{data?.lastUpdated ? `Updated ${fmtDate(data.lastUpdated)}` : "Loading data…"}</div>
            </div>
            <div className="topbar-actions">
              <button className="btn-icon" onClick={toggleTheme} title={isDark ? "Light mode" : "Dark mode"}>
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button className="btn-icon" onClick={loadData} title="Refresh data">
                <RefreshCw size={20} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
              </button>
              <button className="btn-primary" onClick={() => exportCSV(data?.students ?? [], "students-export.csv")}> 
                <Download size={16} />
                Export All
              </button>
            </div>
          </div>

          <div className="content">
            {loading && !data ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 16, color: theme.muted }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderWidth: 3,
                    borderStyle: "solid",
                    borderRightColor: theme.border,
                    borderBottomColor: theme.border,
                    borderLeftColor: theme.border,
                    borderTopColor: theme.accent,
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <div style={{ fontSize: 14 }}>Loading dashboard…</div>
              </div>
            ) : error ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: 12 }}>
                <div style={{ fontSize: 32 }}>⚠️</div>
                <div style={{ color: theme.rose, fontWeight: 600 }}>Failed to load data</div>
                <div style={{ fontSize: 12, color: theme.muted }}>{error}</div>
                <button className="btn-primary" onClick={loadData}>Try Again</button>
              </div>
            ) : (
              <>
                {page === "overview" && data && <OverviewPage data={data} theme={theme} />}
                {page === "enrollment" && <EnrollmentPage />}
                {page === "grades" && <GradesPage />}
                {page === "attendance" && <AttendancePage />}
                {page === "reports" && <ReportsPage theme={theme} />}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}