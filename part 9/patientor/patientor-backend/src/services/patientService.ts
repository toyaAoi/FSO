import { v1 as uuid } from "uuid";
import patients from "../../data/patients";
import { NewPatient, Patient } from "../../types";

const getPatients = (): Patient[] => {
  return patients;
};

const getPatientsWoSSN = () => {
  return patients.map((patient) => {
    return { ...patient, ssn: undefined };
  });
};

const addPatient = (patient: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    ...patient,
  };
  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  getPatientsWoSSN,
  addPatient,
};
