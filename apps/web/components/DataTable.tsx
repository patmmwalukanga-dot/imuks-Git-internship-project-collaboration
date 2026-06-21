"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";

type DataTableColumn<Row> = {
  key: keyof Row | string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, row: Row) => ReactNode;
};

type DataTableProps<Row extends Record<string, unknown>> = {
  title: string;
  columns: DataTableColumn<Row>[];
  data?: Row[];
  onExport?: (rows: Row[]) => void;
};

export default function DataTable<Row extends Record<string, unknown>>({
  title,
  columns,
  data = [],
  onExport,
}: DataTableProps<Row>) {
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) =>
      Object.values(row).some((value) =>
        String(value).toLowerCase().includes(q),
      ),
    );
  }, [data, filter]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    return [...filtered].sort((a, b) => {
      const va = (a as Record<string, unknown>)[sortKey];
      const vb = (b as Record<string, unknown>)[sortKey];

      if (typeof va === "number" && typeof vb === "number") {
        return sortAsc ? va - vb : vb - va;
      }

      return sortAsc
        ? String(va ?? "").localeCompare(String(vb ?? ""))
        : String(vb ?? "").localeCompare(String(va ?? ""));
    });
  }, [filtered, sortAsc, sortKey]);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
      return;
    }
    setSortKey(key);
    setSortAsc(true);
  };

  return (
    <div className="card">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <div>
          <div className="card-title">{title}</div>
          <div style={{ fontSize: 12, color: "var(--muted, #64748b)" }}>
            {sorted.length} of {data.length} records
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            aria-label="Search"
            placeholder="Search…"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            style={{
              padding: 8,
              borderRadius: 8,
              border: "1px solid var(--border, #e2e8f0)",
            }}
          />
          {onExport && (
            <button className="btn-primary" onClick={() => onExport(sorted)}>
              ↓ Export
            </button>
          )}
        </div>
      </div>

      <div className="table-wrap" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  style={{
                    textAlign: "left",
                    padding: "10px 8px",
                    cursor: column.sortable ? "pointer" : "default",
                  }}
                  onClick={() => column.sortable && toggleSort(String(column.key))}
                >
                  {column.label}
                  {sortKey === String(column.key)
                    ? sortAsc
                      ? " ▲"
                      : " ▼"
                    : column.sortable
                    ? " ⇅"
                    : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  style={{
                    padding: 32,
                    textAlign: "center",
                    color: "var(--muted, #64748b)",
                  }}
                >
                  No matching records
                </td>
              </tr>
            ) : (
              sorted.map((row, rowIndex) => (
                <tr
                  key={String((row as Record<string, unknown>).id ?? rowIndex)}
                  style={{ borderTop: "1px solid var(--border, #e2e8f0)" }}
                >
                  {columns.map((column) => {
                    const value = (row as Record<string, unknown>)[String(column.key)];
                    return (
                      <td
                        key={`${String(column.key)}-${rowIndex}`}
                        style={{ padding: "10px 8px", verticalAlign: "middle" }}
                      >
                        {column.render ? column.render(value, row) : String(value ?? "")}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
