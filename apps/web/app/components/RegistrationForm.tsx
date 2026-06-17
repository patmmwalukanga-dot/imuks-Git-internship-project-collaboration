'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RegistrationFormData } from '../types/registration';

const registrationSchema = z.object({
  firstName: z.string()
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name must be less than 50 characters')
    .regex(/^[A-Za-z\s]+$/, 'First name can only contain letters'),
  
  lastName: z.string()
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name must be less than 50 characters')
    .regex(/^[A-Za-z\s]+$/, 'Last name can only contain letters'),
  
  email: z.string()
    .email('Please enter a valid email address'),
  
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[0-9+\-\s()]+$/, 'Please enter a valid phone number'),
  
  department: z.string()
    .min(2, 'Department must be at least 2 characters'),
  
  position: z.string()
    .min(2, 'Position must be at least 2 characters'),
});

type FormData = RegistrationFormData;

interface RegistrationFormProps {
  initialData?: FormData | null;
  onSubmit: (data: FormData) => Promise<boolean>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function RegistrationForm({ initialData, onSubmit, onCancel, isLoading = false }: RegistrationFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<FormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      position: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        setValue(key as keyof FormData, initialData[key as keyof FormData]);
      });
    } else {
      reset();
    }
  }, [initialData, setValue, reset]);

  const onFormSubmit = async (data: FormData) => {
    const success = await onSubmit(data);
    if (success) {
      reset();
    }
  };

  return (
    <div className="card-dark">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{initialData ? '' : ''}</span>
          <h2 className="headline-md text-white">
            {initialData ? 'Edit Registration' : 'Register New Entry'}
          </h2>
        </div>
        <p className="body-sm text-white opacity-70">
          {initialData 
            ? 'Update the entry details below' 
            : 'Complete the form below to add a new entity to the mission-critical registry database.'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="space-y-1.5">
            <label className="label-md text-white opacity-70">
              First Name
            </label>
            <input
              type="text"
              placeholder="Enter first name"
              {...register('firstName')}
              className="input-dark"
              disabled={isLoading}
            />
            {errors.firstName && (
              <p className="text-sm text-[#FCA5A5] flex items-center gap-1 mt-1">
                <span></span> {errors.firstName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <label className="label-md text-white opacity-70">
              Last Name
            </label>
            <input
              type="text"
              placeholder="Enter last name"
              {...register('lastName')}
              className="input-dark"
              disabled={isLoading}
            />
            {errors.lastName && (
              <p className="text-sm text-[#FCA5A5] flex items-center gap-1 mt-1">
                <span></span> {errors.lastName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="label-md text-white opacity-70">
              Email Address
            </label>
            <input
              type="email"
              placeholder="Enter email address"
              {...register('email')}
              className="input-dark"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-[#FCA5A5] flex items-center gap-1 mt-1">
                <span></span> {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="label-md text-white opacity-70">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="Enter phone number"
              {...register('phone')}
              className="input-dark"
              disabled={isLoading}
            />
            {errors.phone && (
              <p className="text-sm text-[#FCA5A5] flex items-center gap-1 mt-1">
                <span></span> {errors.phone.message}
              </p>
            )}
          </div>

          {/* Department */}
          <div className="space-y-1.5">
            <label className="label-md text-white opacity-70">
              Department
            </label>
            <select
              {...register('department')}
              className="select-dark"
              disabled={isLoading}
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Human Resources">HR</option>
              <option value="Finance">Finance</option>
              <option value="IT">IT</option>
              <option value="Operations">Operations</option>
            </select>
            {errors.department && (
              <p className="text-sm text-[#FCA5A5] flex items-center gap-1 mt-1">
                <span></span> {errors.department.message}
              </p>
            )}
          </div>

          {/* Position */}
          <div className="space-y-1.5">
            <label className="label-md text-white opacity-70">
              Position
            </label>
            <input
              type="text"
              placeholder="Enter position"
              {...register('position')}
              className="input-dark"
              disabled={isLoading}
            />
            {errors.position && (
              <p className="text-sm text-[#FCA5A5] flex items-center gap-1 mt-1">
                <span></span> {errors.position.message}
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? (
              <>{initialData ? 'Updating...' : 'Registering...'}</>
            ) : (
              <>{initialData ? 'Update Entry' : 'Register'}</>
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="btn-secondary-dark"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}