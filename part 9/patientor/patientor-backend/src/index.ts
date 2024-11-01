import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { getDiagnoses } from "./services/diagnosisService";
import patientService from "./services/patientService";
import { NewPatientSchema, toNewEntry } from "./utils";
import { z } from "zod";
import { NewPatient, Patient } from "../types";

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get("/api/ping", (_req, res) => {
  console.log("somebody pinged here");
  res.send("pong");
});

app.get("/api/diagnoses", (_req, res) => {
  res.send(getDiagnoses());
});

app.get("/api/patients", (_req, res) => {
  res.send(patientService.getPatientsNonSensitive());
});

app.get("/api/patients/:id", (req, res) => {
  const id = req.params.id;
  const patient = patientService.getPatient(id);
  if (patient) {
    res.send(patient);
  } else {
    res.status(404).send({ error: "Patient not found" });
  }
});

app.post("/api/patients/:id/entries", (req, res) => {
  const id = req.params.id;
  const patient = patientService.getPatient(id);

  if (!patient) {
    res.send(404).send({ error: "Patient not found" });
  } else {
    const newEntry = toNewEntry(req.body);
    const updatedPatient = patientService.addEntry(id, newEntry);
    res.json(updatedPatient);
  }
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewPatientSchema.parse(req.body);
  } catch (error: unknown) {
    next(error);
  }
};

const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

app.post(
  "/api/patients",
  newPatientParser,
  (req: Request<unknown, unknown, NewPatient>, res: Response<Patient>) => {
    const addedPatient = patientService.addPatient(req.body);
    res.json(addedPatient);
  }
);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
