'use client';

import { useState } from 'react';
import { RegistrationEntry } from '../types/registration';

interface EntriesListProps {
  entries: RegistrationEntry[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function EntriesList({ entries, onEdit, onDelete, isLoading = false }: EntriesListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEntries = entries.filter(entry =>
    entry.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getBadge = (status: string) => {
    const map: Record<string, string> = {
      active: 'badge badge-active',
      pending: 'badge badge-pending',
      inactive: 'badge badge-inactive'
    };
    return map[status] || map.pending;
  };

  if (entries.length === 0) {
    return (
      <div className="card-white text-center py-16">
        <div className="text-5xl mb-4"></div>
        <h3 className="headline-sm text-[#1A1C1E] mb-2">No Entries Yet</h3>
        <p className="body-sm text-[#464555]">
          Start by registering your first entry using the form above.
        </p>
      </div>
    );
  }

  return (
    <div className="card-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <span className="text-xl"></span>
          <div>
            <h2 className="headline-sm text-[#1A1C1E]">Registered Entries</h2>
            <p className="body-sm text-[#464555]">
              {entries.length} {entries.length === 1 ? 'entry' : 'entries'} found
            </p>
          </div>
        </div>
        
        <div className="relative w-full sm:w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#464555]"> </span>
          <input
            type="text"
            placeholder="Search entries..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-white pl-9"
            disabled={isLoading}
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#E2E8F0]">
              <th className="label-md text-[#464555] text-left py-3 px-4">#</th>
              <th className="label-md text-[#464555] text-left py-3 px-4">Full Name</th>
              <th className="label-md text-[#464555] text-left py-3 px-4">Email</th>
              <th className="label-md text-[#464555] text-left py-3 px-4">Phone</th>
              <th className="label-md text-[#464555] text-left py-3 px-4">Department</th>
              <th className="label-md text-[#464555] text-left py-3 px-4">Position</th>
              <th className="label-md text-[#464555] text-left py-3 px-4">Status</th>
              <th className="label-md text-[#464555] text-left py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((entry, index) => (
              <tr key={entry.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                <td className="body-sm text-[#1A1C1E] font-medium py-3 px-4">
                  {index + 1}
                </td>
                <td className="body-sm text-[#1A1C1E] font-medium py-3 px-4">
                  {entry.firstName} {entry.lastName}
                </td>
                <td className="body-sm text-[#464555] py-3 px-4">
                  {entry.email}
                </td>
                <td className="body-sm text-[#464555] py-3 px-4">
                  {entry.phone}
                </td>
                <td className="body-sm py-3 px-4">
                  <span className="chip text-[#1A1C1E]">
                    {entry.department}
                  </span>
                </td>
                <td className="body-sm text-[#464555] py-3 px-4">
                  {entry.position}
                </td>
                <td className="body-sm py-3 px-4">
                  <span className={getBadge(entry.status)}>
                    {entry.status}
                  </span>
                </td>
                <td className="body-sm py-3 px-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(entry.id)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#EEF2FF] text-[#4F46E5] hover:bg-[#4F46E5] hover:text-white transition-all"
                      disabled={isLoading}
                    >
                    Edit
                    </button>
                    <button
                      onClick={() => onDelete(entry.id)}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[#FEF2F2] text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all"
                      disabled={isLoading}
                    >
                    Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredEntries.length === 0 && searchTerm && (
        <div className="text-center py-8">
          <div className="text-3xl mb-2"></div>
          <p className="body-md text-[#1A1C1E] font-medium">No results found</p>
          <p className="body-sm text-[#464555]">Try adjusting your search terms</p>
        </div>
      )}
    </div>
  );
}