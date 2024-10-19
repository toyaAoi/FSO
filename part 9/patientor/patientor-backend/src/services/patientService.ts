import { v1 as uuid } from "uuid";
import patients from "../../data/patients";
import {
  NewEntry,
  NewPatient,
  NonSensitivePatient,
  Patient,
} from "../../types";

const getPatients = (): Patient[] => {
  return patients;
};

const getPatientsNonSensitive = (): NonSensitivePatient[] => {
  return patients.map((patient) => {
    return { ...patient, ssn: undefined, entries: [] };
  });
};

const getPatient = (id: string): Patient | void => {
  const patient = patients.find((patient) => patient.id === id);
  if (patient) {
    return { ...patient, entries: patient.entries ? patient.entries : [] };
  }
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient,
    entries: [],
  };
  patients.push(newPatient);
  return newPatient;
};

const addEntry = (patientId: string, entry: NewEntry): Patient => {
  const newEntry = {
    id: uuid(),
    ...entry,
  };

  const patientIndex = patients.findIndex(
    (patient) => patient.id === patientId
  );

  if (patients[patientIndex].entries === undefined) {
    patients[patientIndex].entries = [newEntry];
  } else {
    patients[patientIndex].entries.push(newEntry);
  }

  return patients[patientIndex];
};

export default {
  getPatients,
  getPatientsNonSensitive,
  getPatient,
  addPatient,
  addEntry,
};
