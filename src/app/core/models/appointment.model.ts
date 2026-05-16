import { Patient } from './patient.model';

export enum AppointmentStatus {
  SCHEDULED = 'Scheduled',
  CONFIRMED = 'Confirmed',
  IN_PROGRESS = 'In Progress',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
  NO_SHOW = 'No Show'
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string; // The user ID of the doctor
  appointmentDate: string | Date;
  timeSlot: string; // e.g., '10:00 AM - 10:30 AM'
  status: AppointmentStatus;
  reasonForVisit: string;
  notes?: string;
  patientName?: string;
  doctorName?: string;
  department?: string;
  
  // Optional expanded patient details for the UI
  patient?: Patient;
}

export interface Vitals {
  height?: number; // cm
  weight?: number; // kg
  bloodPressure?: string; // e.g., '120/80'
  temperature?: number; // F or C
  pulseRate?: number; // bpm
  spO2?: number; // %
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: string; // e.g., '1-0-1'
  duration: string; // e.g., '5 days'
  instructions?: string;
}

export interface Consultation {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  date: string | Date;
  vitals: Vitals;
  symptoms: string[];
  diagnosis: string;
  prescription: PrescriptionItem[];
  labTestsOrdered: string[];
  doctorNotes: string;
  followUpDate?: string | Date;
}
