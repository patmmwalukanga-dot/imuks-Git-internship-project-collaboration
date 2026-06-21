"use client";

import { useEffect, useMemo, useState } from "react";
import DataTable from "./DataTable";

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

const STORAGE_KEY = "students-data";

export default function GradesPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [subject, setSubject] = useState("Mathematics");
  const [grades, setGrades] = useState<Record<string, number>>({});

  useEffect(() => {
    queueMicrotask(() => {
      const raw = localStorage.getItem(STORAGE_KEY);
      try {
        const parsed = raw ? JSON.parse(raw) : null;
        if (parsed && Array.isArray(parsed) && parsed.length) {
          setStudents(parsed);
        } else if (window.__MOCK_DATA__?.students) {
          setStudents(window.__MOCK_DATA__.students);
        }
      } catch {
        if (window.__MOCK_DATA__?.students) {
          setStudents(window.__MOCK_DATA__.students);
        }
      }
    });
  }, []);

  useEffect(() => {
    queueMicrotask(() => {
      setGrades((prev) => {
        const next = { ...prev };
        students.forEach((student) => {
          const id = String(student.id);
          if (next[id] == null) {
            next[id] = student.grade ?? 0;
          }
        });
        return next;
      });
    });
  }, [students]);

  const subjects = useMemo(
    () => [...new Set(students.map((student) => student.subject || subject))],
    [students, subject],
  );

  const saveGrade = (id: string, value: string) => {
    const numeric = Number(value);
    if (Number.isNaN(numeric) || numeric < 0 || numeric > 100) {
      alert("Enter 0-100");
      return;
    }
    setGrades((prev) => ({ ...prev, [id]: numeric }));
  };

  const columns = [
    { key: "name", label: "Student" },
    { key: "class", label: "Class" },
    { key: "subject", label: "Subject" },
    {
      key: "grade",
      label: "Grade",
      render: (_: unknown, row: Student) => {
        const id = String(row.id);
        return (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              style={{ width: 72, padding: 6, borderRadius: 8 }}
              defaultValue={grades[id] ?? row.grade ?? 0}
              onBlur={(event) => saveGrade(id, event.target.value)}
            />
            <div style={{ fontSize: 13, color: "var(--muted,#64748b)" }}>
              {grades[id] ?? row.grade ?? 0}%
            </div>
          </div>
        );
      },
    },
  ];

  const exportCSV = (rows: Student[]) => {
    if (!rows.length) {
      alert("No rows");
      return;
    }

    const body = rows
      .map((row) => {
        const id = String(row.id);
        return `${row.name},${row.class},${row.subject ?? ""},${grades[id] ?? row.grade ?? ""}`;
      })
      .join("\n");

    const blob = new Blob([`Name,Class,Subject,Grade\n${body}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "grades.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const avgGrade = useMemo(() => {
    const values = students.map((student) => grades[String(student.id)] ?? student.grade ?? 0);
    if (!values.length) return 0;
    return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
  }, [grades, students]);

  return (
    <div className="fade-up">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
        <div>
          <div className="card">
            <div className="card-title">Record Grades</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <select value={subject} onChange={(event) => setSubject(event.target.value)}>
                {subjects.map((subjectOption) => (
                  <option key={subjectOption} value={subjectOption}>
                    {subjectOption}
                  </option>
                ))}
              </select>
              <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button className="btn-icon" onClick={() => alert("Bulk upload not implemented")}>Upload</button>
                <button className="btn-primary" onClick={() => exportCSV(students)}>
                  Export Grades
                </button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16 }}>
            <DataTable title="Student Grades" columns={columns} data={students} onExport={exportCSV} />
          </div>
        </div>

        <div>
          <div className="card">
            <div className="card-title">Grade Statistics</div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{avgGrade}%</div>
            <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>Top</div>
                <div>{Math.max(...Object.values(grades).length ? Object.values(grades) : [0])}%</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>Lowest</div>
                <div>{Math.min(...Object.values(grades).length ? Object.values(grades) : [0])}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
