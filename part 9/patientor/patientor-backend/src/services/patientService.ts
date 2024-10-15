import { v1 as uuid } from "uuid";
import patients from "../../data/patients";
import { NewPatient, NonSensitivePatient, Patient } from "../../types";

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
    return { ...patient, entries: [] };
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

export default {
  getPatients,
  getPatientsNonSensitive,
  getPatient,
  addPatient,
};
