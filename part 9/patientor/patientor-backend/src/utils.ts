import { z } from "zod";
import { Gender, NewEntry, NewPatient } from "../types";

const BaseEntrySchema = z.object({
  id: z.string(),
  description: z.string(),
  date: z.string().date(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

export const HospitalEntrySchema = z.object({
  ...BaseEntrySchema.shape,
  type: z.literal("Hospital"),
  discharge: z
    .object({
      date: z.string().date(),
      criteria: z.string(),
    })
    .optional(),
});

export const HealthCheckEntrySchema = z.object({
  ...BaseEntrySchema.shape,
  type: z.literal("HealthCheck"),
  healthCheckRating: z.number(),
});

export const OccupationalHealthcareEntrySchema = z.object({
  ...BaseEntrySchema.shape,
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: z
    .object({
      startDate: z.string().date(),
      endDate: z.string().date(),
    })
    .optional(),
});

export const EntrySchema = z.union([
  HospitalEntrySchema,
  HealthCheckEntrySchema,
  OccupationalHealthcareEntrySchema,
]);

export const NewEntrySchema = z.union([
  HospitalEntrySchema.omit({ id: true }),
  HealthCheckEntrySchema.omit({ id: true }),
  OccupationalHealthcareEntrySchema.omit({ id: true }),
]);

export const NewPatientSchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
  entries: z.array(EntrySchema).optional(),
});

export const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

export const toNewEntry = (object: unknown): NewEntry => {
  return NewEntrySchema.parse(object);
};
