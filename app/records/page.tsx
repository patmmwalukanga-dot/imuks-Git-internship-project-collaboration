'use client'

import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import RecordsTable from '../components/RecordsTable'
import RecordModal from '../components/RecordModal'

type Record = {
  id: string
  name: string
  category: string
  description: string
  status: string
  role: string
  email: string
  createdAt: string
}

export default function RecordsPage() {
  const [records, setRecords] = useState<Record[]>([])
  const [filtered, setFiltered] = useState<Record[]>([])
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<Record | null>(null)
  const [userRole, setUserRole] = useState('Admin')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecords()
  }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      records.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.status.toLowerCase().includes(q)
      )
    )
  }, [search, records])

  async function fetchRecords() {
  setLoading(true)
  const res = await fetch('/api/records')
  const data = await res.json()
  const recordsArray = Array.isArray(data) ? data : []
  setRecords(recordsArray)
  setFiltered(recordsArray)
  setLoading(false)
}

  async function handleSave(form: Omit<Record, 'id' | 'createdAt'>) {
    if (editRecord) {
      await fetch('/api/records', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: editRecord.id })
      })
    } else {
      await fetch('/api/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
    }
    setIsModalOpen(false)
    setEditRecord(null)
    fetchRecords()
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this asset?')) return
    await fetch('/api/records', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    })
    fetchRecords()
  }

  function handleEdit(record: Record) {
    setEditRecord(record)
    setIsModalOpen(true)
  }

  const total = records.length
  const active = records.filter(r => r.status === 'Active').length
  const pending = records.filter(r => r.status === 'Pending').length

  return (
    <div className="flex min-h-screen bg-[#f4f7f0]">
      <Sidebar />

      <main className="flex-1 p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-medium text-[#1a3a2a]">Asset records</h1>
            <p className="text-sm text-[#7a9070] mt-1">Manage all system assets</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Role switcher for demo */}
            <select
              className="border border-[#d0dcc8] rounded-lg px-3 py-2 text-sm bg-white text-[#1a3a2a] outline-none"
              value={userRole}
              onChange={e => setUserRole(e.target.value)}
            >
              <option>Admin</option>
              <option>Manager</option>
              <option>Viewer</option>
            </select>
            {(userRole === 'Admin' || userRole === 'Manager') && (
              <button
                onClick={() => { setEditRecord(null); setIsModalOpen(true) }}
                className="bg-[#1a3a2a] text-[#c8d96a] px-4 py-2 rounded-lg text-sm hover:bg-[#1a3a2a]/90"
              >
                + Add asset
              </button>
            )}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-[#d0dcc8] p-4">
            <p className="text-xs text-[#7a9070] mb-1">Total assets</p>
            <p className="text-2xl font-medium text-[#1a3a2a]">{total}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#d0dcc8] p-4">
            <p className="text-xs text-[#7a9070] mb-1">Active</p>
            <p className="text-2xl font-medium text-[#3b6d11]">{active}</p>
          </div>
          <div className="bg-white rounded-xl border border-[#d0dcc8] p-4">
            <p className="text-xs text-[#7a9070] mb-1">Pending</p>
            <p className="text-2xl font-medium text-[#854f0b]">{pending}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            className="w-full border border-[#d0dcc8] rounded-lg px-4 py-2 text-sm bg-white text-[#1a3a2a] outline-none"
            placeholder="Search by name, category or status..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        {loading ? (
          <div className="text-center py-12 text-[#7a9070] text-sm">Loading assets...</div>
        ) : (
          <RecordsTable
            records={filtered}
            onEdit={handleEdit}
            onDelete={handleDelete}
            userRole={userRole}
          />
        )}

      </main>

      {/* Modal */}
      <RecordModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditRecord(null) }}
        onSave={handleSave}
        editRecord={editRecord}
      />
    </div>
  )
}