import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import { getDiagnoses } from "./services/diagnosisService";
import patientService from "./services/patientService";
import { NewEntrySchema } from "./utils";
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
  res.send(patientService.getPatientsWoSSN());
});

const newPatientParser = (req: Request, _res: Response, next: NextFunction) => {
  try {
    NewEntrySchema.parse(req.body);
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
