export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export interface Entry {
  id: string;
  date: string;
  type: "Hospital" | "HealthCheck" | "OccupationalHealthcare";
  specialist: string;
  healthCheckRating?: 0 | 1 | 2 | 3;
  diagnoseCodes?: {
    code: string;
    description: string;
  }[];
  description: string;
  discharge?: {
    date: string;
    criteria: string;
  };
}

export interface NewEntry
  extends Omit<Entry, "id" | "description" | "discharge"> {
  diagnosisCodes?: string[];
}

export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries?: Entry[];
}

export type PatientFormValues = Omit<Patient, "id" | "entries">;
