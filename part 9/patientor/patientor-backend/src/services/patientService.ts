import patients from "../../data/patients";
import { Patient } from "../../types";

const getPatients = (): Patient[] => {
  return patients;
};

const getPatientsWoSSN = () => {
  return patients.map((patient) => {
    return { ...patient, ssn: undefined };
  });
};

export default {
  getPatients,
  getPatientsWoSSN,
};
