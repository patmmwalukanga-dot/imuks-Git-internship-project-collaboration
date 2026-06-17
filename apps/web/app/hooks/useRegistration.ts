'use client';

import { useState, useEffect } from 'react';
// Local type definitions to avoid missing-module errors for '../types/registration'
type RegistrationFormData = {
  email: string;
  phone: string;
  // allow other form fields
  [key: string]: any;
};

type RegistrationEntry = RegistrationFormData & {
  id: string;
  dateRegistered: string;
  status: 'pending' | 'approved' | 'rejected' | string;
};
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';

export function useRegistration() {
  const [entries, setEntries] = useState<RegistrationEntry[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem('registrationEntries');
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries));
      } catch (error) {
        console.error('Failed to load entries:', error);
      }
    }
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('registrationEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (data: RegistrationFormData) => {
    setIsLoading(true);
    try {
      // Check for duplicate email
      if (entries.some(entry => entry.email.toLowerCase() === data.email.toLowerCase())) {
        toast.error('This email is already registered!');
        return false;
      }

      // Check for duplicate phone
      if (entries.some(entry => entry.phone === data.phone)) {
        toast.error('This phone number is already registered!');
        return false;
      }

      const newEntry: RegistrationEntry = {
        ...data,
        id: uuidv4(),
        dateRegistered: new Date().toISOString(),
        status: 'pending'
      };

      setEntries([newEntry, ...entries]);
      toast.success('Registration successful! 🎉');
      return true;
    } catch (error) {
      toast.error('Failed to add entry. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateEntry = (id: string, data: RegistrationFormData) => {
    setIsLoading(true);
    try {
      // Check for duplicate email (excluding current entry)
      const duplicateEmail = entries.some(
        entry => entry.email.toLowerCase() === data.email.toLowerCase() && entry.id !== id
      );
      if (duplicateEmail) {
        toast.error('This email is already registered by another user!');
        return false;
      }

      // Check for duplicate phone (excluding current entry)
      const duplicatePhone = entries.some(
        entry => entry.phone === data.phone && entry.id !== id
      );
      if (duplicatePhone) {
        toast.error('This phone number is already registered by another user!');
        return false;
      }

      setEntries(entries.map(entry =>
        entry.id === id
          ? { ...entry, ...data }
          : entry
      ));
      toast.success('Entry updated successfully! ✅');
      setEditingId(null);
      return true;
    } catch (error) {
      toast.error('Failed to update entry. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      setIsLoading(true);
      try {
        setEntries(entries.filter(entry => entry.id !== id));
        toast.success('Entry deleted successfully! 🗑️');
        if (editingId === id) setEditingId(null);
      } catch (error) {
        toast.error('Failed to delete entry. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const startEditing = (id: string) => {
    setEditingId(id);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const getEntry = (id: string) => {
    return entries.find(entry => entry.id === id);
  };

  return {
    entries,
    editingId,
    isLoading,
    addEntry,
    updateEntry,
    deleteEntry,
    startEditing,
    cancelEditing,
    getEntry
  };
}