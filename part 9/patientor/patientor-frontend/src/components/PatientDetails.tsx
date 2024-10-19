import { useParams } from "react-router-dom";
import { Patient } from "../types";
import { useEffect, useState } from "react";
import patientService from "../services/patients";
import Entry from "./Entry";
import EntryForm from "./EntryForm";

const PatientDetails = () => {
  const [patient, setPatient] = useState<Patient>();
  const patientId = useParams().id as string;

  useEffect(() => {
    patientService.getOne(patientId).then(setPatient);
  }, [patientId]);

  if (!patient) {
    return null;
  }

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
      <EntryForm patientId={patientId} setPatient={setPatient} />
      {patient.entries && (
        <>
          <h2>Entries</h2>
          <ul>
            {patient.entries.map((entry) => (
              <Entry key={entry.id} entry={entry} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default PatientDetails;
