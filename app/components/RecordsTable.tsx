'use client'

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

type Props = {
  records: Record[]
  onEdit: (record: Record) => void
  onDelete: (id: string) => void
  userRole: string
}

export default function RecordsTable({ records, onEdit, onDelete, userRole }: Props) {

  function getStatusStyle(status: string) {
    if (status === 'Active') return 'bg-[#eaf3de] text-[#3b6d11]'
    if (status === 'Pending') return 'bg-[#faeeda] text-[#854f0b]'
    return 'bg-[#f1efe8] text-[#5f5e5a]'
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-12 text-[#7a9070] text-sm">
        No assets found. Click "Add asset" to create one.
      </div>
    )
  }

  return (
    <div className="border border-[#d0dcc8] rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#1a3a2a]">
            <th className="text-left px-4 py-3 text-[#c8d96a] font-medium text-xs">Name</th>
            <th className="text-left px-4 py-3 text-[#c8d96a] font-medium text-xs">Category</th>
            <th className="text-left px-4 py-3 text-[#c8d96a] font-medium text-xs">Status</th>
            <th className="text-left px-4 py-3 text-[#c8d96a] font-medium text-xs">Role</th>
            <th className="text-left px-4 py-3 text-[#c8d96a] font-medium text-xs">Email</th>
            <th className="text-left px-4 py-3 text-[#c8d96a] font-medium text-xs">Created</th>
            {userRole === 'Admin' || userRole === 'Manager' ? (
              <th className="text-left px-4 py-3 text-[#c8d96a] font-medium text-xs">Actions</th>
            ) : null}
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <tr key={record.id} className={index % 2 === 0 ? 'bg-white' : 'bg-[#f9faf7]'}>
              <td className="px-4 py-3 font-medium text-[#1a3a2a]">{record.name}</td>
              <td className="px-4 py-3 text-[#7a9070]">{record.category}</td>
              <td className="px-4 py-3">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusStyle(record.status)}`}>
                  {record.status}
                </span>
              </td>
              <td className="px-4 py-3 text-[#7a9070]">{record.role}</td>
              <td className="px-4 py-3 text-[#7a9070]">{record.email}</td>
              <td className="px-4 py-3 text-[#7a9070]">{record.createdAt}</td>
              {userRole === 'Admin' || userRole === 'Manager' ? (
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(record)}
                      className="border border-[#d0dcc8] rounded-lg px-2 py-1 text-xs text-[#1a3a2a] hover:bg-[#e2edda]"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(record.id)}
                      className="border border-[#d0dcc8] rounded-lg px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}