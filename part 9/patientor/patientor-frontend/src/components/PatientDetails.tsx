import { useParams } from "react-router-dom";
import { Patient } from "../types";
import { useEffect, useState } from "react";
import patientService from "../services/patients";

const PatientDetails = () => {
  const [patient, setPatient] = useState<Patient>();
  const patientId = useParams().id as string;

  useEffect(() => {
    patientService.getOne(patientId).then(setPatient);
  }, [patientId]);

  if (!patient) {
    return null;
  }

  console.log(patient);

  return (
    <div>
      <h1>
        {patient.name} {patient.gender === "male" ? "♂️" : "♀️"}
      </h1>
      <p>
        SSN: {patient.ssn}
        <br />
        Occupation: {patient.occupation}
      </p>
    </div>
  );
};

export default PatientDetails;
