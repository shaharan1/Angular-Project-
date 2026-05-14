/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 
  | 'SUPER_ADMIN'
  | 'HOSPITAL_ADMIN'
  | 'DOCTOR'
  | 'NURSE'
  | 'RECEPTIONIST'
  | 'LAB_TECHNICIAN'
  | 'PHARMACIST'
  | 'ACCOUNTANT'
  | 'HR_MANAGER'
  | 'PATIENT';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  phoneNumber?: string;
  department?: string;
  specialization?: string;
  createdAt: number;
}

export interface Patient {
  id: string;
  patientId: string; // Auto-generated human-readable ID
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  insuranceDetails?: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
  };
  status: 'Inpatient' | 'Outpatient' | 'Emergency' | 'Discharged';
  createdAt: number;
  lastVisit?: number;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'Consultation' | 'Follow-up' | 'Emergency' | 'Surgery' | 'Telemedicine';
  status: 'Scheduled' | 'Confirmed' | 'In-progress' | 'Completed' | 'Cancelled';
  reason: string;
  notes?: string;
  createdAt: number;
}

export interface EHRRecord {
  id: string;
  patientId: string;
  doctorId: string;
  visitDate: number;
  diagnosis: string[];
  vitals: {
    bloodPressure: string;
    temperature: number;
    pulse: number;
    respiratoryRate: number;
    oxygenSaturation: number;
  };
  notes: string;
  prescriptions: Array<{
    medicine: string;
    dosage: string;
    frequency: string;
    duration: string;
  }>;
  labResults?: Array<{
    testName: string;
    result: string;
    status: 'Pending' | 'Ready';
  }>;
}
