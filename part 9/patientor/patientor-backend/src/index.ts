import express from "express";
import cors from "cors";
import { getDiagnoses } from "./services/diagnosisService";
import patientService from "./services/patientService";

const app = express();

app.use(cors());

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
