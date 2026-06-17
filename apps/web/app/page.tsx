'use client';

import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { RegistrationForm } from './components/RegistrationForm';
import { EntriesList } from './components/EntriesList';
import { useRegistration } from './hooks/useRegistration';
import { RegistrationFormData } from './types/registration';

export default function Home() {
  const {
    entries,
    editingId,
    isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
    startEditing,
    cancelEditing,
    getEntry
  } = useRegistration();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (data: RegistrationFormData) => {
    if (editingId) {
      return updateEntry(editingId, data);
    } else {
      return addEntry(data);
    }
  };

  const handleEdit = (id: string) => {
    startEditing(id);
    document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancel = () => {
    cancelEditing();
  };

  const editingEntry = editingId ? getEntry(editingId) : null;

  if (!mounted) return null;

  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3500,
          style: {
            background: '#ffffff',
            color: '#FFFFFF',
            borderRadius: '12px',
            padding: '14px 20px',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }}
      />

      {/* Header - Minimal White */}
      <header className="bg-white border-b border-[#E2E8F0] sticky top-0 z-50">
        <div className="container-modern py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl"></span>
              <div>
                <h1 className="headline-lg text-[#1A1C1E]">
                  Registration System
                </h1>
                <p className="body-sm text-[#464555]">
                  Manage your registered entries
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-[#F3F3F6] px-4 py-2 rounded-full">
                <span className="body-sm font-medium text-[#1A1C1E]">
                  {entries.length} entries
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-modern py-10 space-y-10">
        {/* Registration Form - Dark Green Card */}
        <section id="registration-form" className="animate-slide-up">
          <RegistrationForm
            initialData={editingEntry}
            onSubmit={handleSubmit}
            onCancel={editingId ? handleCancel : undefined}
            isLoading={isLoading}
          />
        </section>

        {/* Entries List - White Card */}
        <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <EntriesList
            entries={entries}
            onEdit={handleEdit}
            onDelete={deleteEntry}
            isLoading={isLoading}
          />
        </section>
      </main>

     
    </>
  );
}