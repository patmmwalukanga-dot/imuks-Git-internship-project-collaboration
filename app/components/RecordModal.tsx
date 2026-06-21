'use client'

import { useState, useEffect } from 'react'

type Record = {
  id?: string
  name: string
  category: string
  description: string
  status: string
  role: string
  email: string
}

type Props = {
  isOpen: boolean
  onClose: () => void
  onSave: (record: Record) => void
  editRecord?: Record | null
}

export default function RecordModal({ isOpen, onClose, onSave, editRecord }: Props) {
  const [form, setForm] = useState<Record>({
    name: '', category: 'Security', description: '',
    status: 'Active', role: 'Viewer', email: ''
  })
  const [errors, setErrors] = useState<Partial<Record>>({})

  useEffect(() => {
    if (editRecord) {
      setForm(editRecord)
    } else {
      setForm({ name: '', category: 'Security', description: '', status: 'Active', role: 'Viewer', email: '' })
    }
    setErrors({})
  }, [editRecord, isOpen])

  function validate() {
    const newErrors: Partial<Record> = {}
    if (!form.name.trim()) newErrors.name = 'Asset name is required'
    if (!form.email.trim()) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Enter a valid email address'
    if (!form.description.trim()) newErrors.description = 'Description is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit() {
    if (validate()) onSave(form)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl border border-[#d0dcc8] p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-medium text-[#1a3a2a]">
            {editRecord ? 'Edit asset' : 'Add new asset'}
          </h2>
          <button onClick={onClose} className="text-[#7a9070] hover:text-[#1a3a2a] text-xl">✕</button>
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs text-[#7a9070] block mb-1">Asset name *</label>
            <input
              className={`w-full border rounded-lg px-3 py-2 text-sm bg-[#f4f7f0] text-[#1a3a2a] outline-none ${errors.name ? 'border-red-500' : 'border-[#d0dcc8]'}`}
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Asset #1004"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-xs text-[#7a9070] block mb-1">Category *</label>
            <select
              className="w-full border border-[#d0dcc8] rounded-lg px-3 py-2 text-sm bg-[#f4f7f0] text-[#1a3a2a] outline-none"
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              <option>Security</option>
              <option>Compliance</option>
              <option>Operations</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="text-xs text-[#7a9070] block mb-1">Description *</label>
          <textarea
            className={`w-full border rounded-lg px-3 py-2 text-sm bg-[#f4f7f0] text-[#1a3a2a] outline-none resize-none ${errors.description ? 'border-red-500' : 'border-[#d0dcc8]'}`}
            rows={2}
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Brief description..."
          />
          {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="text-xs text-[#7a9070] block mb-1">Status *</label>
            <select
              className="w-full border border-[#d0dcc8] rounded-lg px-3 py-2 text-sm bg-[#f4f7f0] text-[#1a3a2a] outline-none"
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option>Active</option>
              <option>Pending</option>
              <option>Inactive</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#7a9070] block mb-1">Assigned role</label>
            <select
              className="w-full border border-[#d0dcc8] rounded-lg px-3 py-2 text-sm bg-[#f4f7f0] text-[#1a3a2a] outline-none"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
            >
              <option>Admin</option>
              <option>Manager</option>
              <option>Viewer</option>
            </select>
          </div>
        </div>
        <div className="mb-5">
          <label className="text-xs text-[#7a9070] block mb-1">Email *</label>
          <input
            className={`w-full border rounded-lg px-3 py-2 text-sm bg-[#f4f7f0] text-[#1a3a2a] outline-none ${errors.email ? 'border-red-500' : 'border-[#d0dcc8]'}`}
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="email@greenshield.com"
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="border border-[#d0dcc8] rounded-lg px-4 py-2 text-sm text-[#7a9070] hover:bg-[#f4f7f0]">
            Cancel
          </button>
          <button onClick={handleSubmit} className="bg-[#1a3a2a] text-[#c8d96a] rounded-lg px-4 py-2 text-sm hover:bg-[#1a3a2a]/90">
            Save asset
          </button>
        </div>
      </div>
    </div>
  )
}