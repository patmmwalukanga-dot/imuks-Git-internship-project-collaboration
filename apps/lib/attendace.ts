export type AttendanceStatus = "present" | "absent" | "late";

export interface Employee {
  id: string;
  name: string;
  position: string;
  shift: string;
  avatar?: string;
}

export interface AttendanceRecord {
  employeeId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  timeLogged?: string; // HH:MM AM/PM
}

export interface DailyRollCall {
  date: string;
  records: AttendanceRecord[];
  submitted: boolean;
}

// --- Default employees ---
export const DEFAULT_EMPLOYEES: Employee[] = [
  { id: "GS-0042", name: "Alex Thompson", position: "Lead Security Officer", shift: "Morning (06:00 - 14:00)" },
  { id: "GS-0089", name: "Sarah Jenkins", position: "Surveillance Tech", shift: "Morning (06:00 - 14:00)" },
  { id: "GS-0123", name: "Marcus Reed", position: "Operations Supervisor", shift: "Morning (06:00 - 14:00)" },
  { id: "GS-0201", name: "Diana Osei", position: "Security Guard", shift: "Morning (06:00 - 14:00)" },
  { id: "GS-0315", name: "James Mwale", position: "CCTV Operator", shift: "Morning (06:00 - 14:00)" },
];

// --- Storage helpers ---
const STORAGE_KEY = "greenshield_attendance";

export function loadAllRecords(): DailyRollCall[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAllRecords(records: DailyRollCall[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

export function getOrCreateRollCall(date: string): DailyRollCall {
  const all = loadAllRecords();
  const existing = all.find((r) => r.date === date);
  if (existing) return existing;

  const fresh: DailyRollCall = {
    date,
    submitted: false,
    records: DEFAULT_EMPLOYEES.map((emp) => ({
      employeeId: emp.id,
      date,
      status: "present",
      timeLogged: undefined,
    })),
  };
  return fresh;
}

export function upsertRollCall(rollCall: DailyRollCall): void {
  const all = loadAllRecords();
  const idx = all.findIndex((r) => r.date === rollCall.date);
  if (idx >= 0) {
    all[idx] = rollCall;
  } else {
    all.unshift(rollCall);
  }
  saveAllRecords(all);
}

export function todayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatDisplayDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

export function now12h(): string {
  return new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export function countByStatus(records: AttendanceRecord[]) {
  return {
    total: records.length,
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    late: records.filter((r) => r.status === "late").length,
  };
}
