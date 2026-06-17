export interface RegistrationEntry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  dateRegistered: string;
  status: 'active' | 'pending' | 'inactive';
}

export type RegistrationFormData = Omit<RegistrationEntry, 'id' | 'dateRegistered'>;

export interface ValidationErrors {
  [key: string]: string;
}