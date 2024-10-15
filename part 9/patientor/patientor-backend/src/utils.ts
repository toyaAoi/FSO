import { z } from "zod";
import { Gender, NewPatient } from "../types";

export const EntrySchema = z.object({});

export const toNewPatient = (object: unknown): NewPatient => {
  return NewEntrySchema.parse(object);
};

export const NewEntrySchema = z.object({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
  entries: z.array(EntrySchema).optional(),
});
