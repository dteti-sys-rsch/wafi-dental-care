// ============================================================================
// ENUMS
// ============================================================================

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

export enum UserRole {
  OWNER = 'OWNER',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
  DOCTOR = 'DOCTOR',
}

// ============================================================================
// BASE MODEL TYPES
// ============================================================================

export interface IBranch {
  _id: string;
  branchName: string;
  branchLocation: string;
}

export interface IUser {
  _id: string;
  username: string;
  password: string;
  branch: string | IBranch;
  role: UserRole;
}

export interface IDiseaseHistory {
  _id: string;
  diseaseName: string;
  diseaseDescription?: string;
  diseaseDiagnosisDate: Date;
}

export interface IMedicalAssessment {
  _id: string;
  patientId: string | IPatient;
  assessmentBy: string | IUser;
  assessmentDate: Date;
  assesementSubjective: string;
  assesementObjective: string;
  assesementDiagnosisAndAction: string;
}

export interface IPatient {
  _id: string;
  patientMedicalRecordNumber: string;
  patientFullName: string;
  patientDOB: Date;
  patientBirthPlace: string;
  patientGender: Gender;
  patientAddress: string;
  patientNIK: number;
  patientWAPhoneNumber: number;
  patientEmail?: string;
  patientDiseaseHistory: (string | IDiseaseHistory)[];
  patientMedicalAssessments: (string | IMedicalAssessment)[];
}