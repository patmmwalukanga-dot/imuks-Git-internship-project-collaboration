"use client";

import { useEffect, useState } from "react";
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

type StudentForm = Omit<Student, "grade" | "attendance" | "subject">;

const STORAGE_KEY = "students-data";

const defaultFields: StudentForm = {
  id: "",
  name: "",
  studentId: "",
  class: "",
  gender: "Female",
  status: "Active",
};

const normalizeStudent = (student: Partial<Student>): Student => {
  const id = student.id || String(Date.now());
  const numericId = String(id).replace(/\D/g, "") || "0";
  return {
    id,
    name: student.name || "",
    studentId: student.studentId || `STU${1000 + Number(numericId)}`,
    class: student.class || "",
    gender: student.gender || "Female",
    status: student.status || "Active",
    grade: student.grade ?? 0,
    attendance: student.attendance ?? 0,
    subject: student.subject || "",
  };
};

export default function EnrollmentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [editing, setEditing] = useState<string | number | null>(null);
  const [form, setForm] = useState<StudentForm>(defaultFields);

  useEffect(() => {
    queueMicrotask(() => {
      const raw = localStorage.getItem(STORAGE_KEY);
      try {
        const parsed = raw ? JSON.parse(raw) : null;
        if (parsed && Array.isArray(parsed) && parsed.length) {
          setStudents(parsed.map((student: Partial<Student>) => normalizeStudent(student)));
        } else if (window.__MOCK_DATA__?.students) {
          setStudents(window.__MOCK_DATA__.students.map((student) => normalizeStudent(student)));
        }
      } catch {
        if (window.__MOCK_DATA__?.students) {
          setStudents(window.__MOCK_DATA__.students.map((student) => normalizeStudent(student)));
        }
      }
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
  }, [students]);

  const startAdd = () => {
    setEditing(null);
    setForm({ ...defaultFields, id: String(Date.now()) });
  };

  const startEdit = (student: Student) => {
    setEditing(student.id);
    setForm({
      id: student.id,
      name: student.name,
      studentId: student.studentId,
      class: student.class,
      gender: student.gender,
      status: student.status,
    });
  };

  const cancel = () => {
    setEditing(null);
    setForm(defaultFields);
  };

  const save = () => {
    if (!form.name.trim() || !form.studentId.trim() || !form.class.trim()) {
      alert("Name, Student ID and Class are required");
      return;
    }

    const newStudent: Student = normalizeStudent({ ...form });

    setStudents((prev) => {
      const exists = prev.find((student) => String(student.id) === String(form.id));
      if (exists) {
        return prev.map((student) =>
          String(student.id) === String(form.id) ? newStudent : student,
        );
      }
      return [newStudent, ...prev];
    });

    cancel();
  };

  const remove = (id: string | number) => {
    if (!confirm("Delete student?")) return;
    setStudents((prev) => prev.filter((student) => String(student.id) !== String(id)));
  };

  const columns = [
    { key: "name", label: "Name", sortable: true },
    { key: "studentId", label: "Student ID", sortable: true },
    { key: "class", label: "Class", sortable: true },
    { key: "gender", label: "Gender" },
    { key: "status", label: "Status" },
    {
      key: "actions",
      label: "Actions",
      render: (_: unknown, row: Student) => (
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn-icon" onClick={() => startEdit(row)}>
            Edit
          </button>
          <button className="btn-icon" onClick={() => remove(row.id)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  const exportCSV = (rows: Student[]) => {
    if (!rows.length) {
      alert("No rows");
      return;
    }
    const headers = ["name", "studentId", "class", "gender", "status", "grade", "attendance", "subject"].join(",");
    const body = rows
      .map((row) =>
        [row.name, row.studentId, row.class, row.gender, row.status, row.grade ?? "", row.attendance ?? "", row.subject ?? ""].join(","),
      )
      .join("\n");
    const blob = new Blob([`${headers}\n${body}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "students.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fade-up">
      <div style={{ display: "flex", gap: 20, marginBottom: 20, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 320 }}>
          <div className="card">
            <div className="card-title">Student Registration</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
              <input
                placeholder="Full name"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
              />
              <input
                placeholder="Student ID"
                value={form.studentId}
                onChange={(event) => setForm({ ...form, studentId: event.target.value })}
              />
              <input
                placeholder="Class (e.g. Grade 10A)"
                value={form.class}
                onChange={(event) => setForm({ ...form, class: event.target.value })}
              />
              <select
                value={form.gender}
                onChange={(event) => setForm({ ...form, gender: event.target.value })}
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
              <select
                value={form.status}
                onChange={(event) => setForm({ ...form, status: event.target.value })}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button className="btn-primary" onClick={save}>
                {editing ? "Save" : "Add Student"}
              </button>
              <button className="btn-icon" onClick={cancel}>Cancel</button>
            </div>
          </div>
        </div>

        <div style={{ width: 320, minWidth: 280 }}>
          <div className="card">
            <div className="card-title">Quick Actions</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="btn-icon" onClick={startAdd}>
                New Student
              </button>
              <button
                className="btn-icon"
                onClick={() => {
                  setStudents([]);
                  localStorage.removeItem(STORAGE_KEY);
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      <DataTable title="Student Directory" columns={columns} data={students} onExport={exportCSV} />
    </div>
  );
}
