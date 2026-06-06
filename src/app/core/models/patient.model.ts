export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other'
}

export enum BloodGroup {
  A_POS = 'A+', A_NEG = 'A-',
  B_POS = 'B+', B_NEG = 'B-',
  O_POS = 'O+', O_NEG = 'O-',
  AB_POS = 'AB+', AB_NEG = 'AB-'
}

export enum PatientStatus {
  OPD = 'OPD',
  ADMITTED = 'Admitted',
  DISCHARGED = 'Discharged',
  EMERGENCY = 'Emergency'
}

export interface Patient {
  id: string;
  patientId: string; // e.g., 'PT-2023-0001'
  firstName: string;
  lastName: string;
  dateOfBirth: string | Date;
  gender: Gender;
  bloodGroup: BloodGroup;
  contactNumber: string;
  email?: string;
  address: string;

  // Emergency Contact
  emergencyContactName: string;
  emergencyContactRelation: string;
  emergencyContactNumber: string;

  // Medical Status
  status: PatientStatus;
  allergies: string[];
  chronicDiseases: string[];

  // System Metadata
  registrationDate: Date;
  lastVisitDate?: Date;
}
