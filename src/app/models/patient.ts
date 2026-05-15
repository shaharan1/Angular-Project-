export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  address: string;
  status: 'Inpatient' | 'Outpatient' | 'Emergency' | 'Discharged';
  admissionDate?: string;
  ward?: string;
  bed?: string;
  doctorName?: string;
  medicalHistory: string[];
}

export interface PatientFilter {
  query?: string;
  status?: string;
  bloodGroup?: string;
}
