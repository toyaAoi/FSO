import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Input,
  InputLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useEffect, useState } from "react";
import { NewEntry, Patient } from "../types";
import patientService from "../services/patients";

const EntryForm = ({
  patientId,
  setPatient,
}: {
  patientId: string;
  setPatient: React.Dispatch<React.SetStateAction<Patient | undefined>>;
}) => {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: number;
    if (error) {
      timeoutId = setTimeout(() => {
        setError(null);
      }, 5000);
    }
    return () => clearTimeout(timeoutId);
  });

  if (!showForm) {
    return (
      <Button variant="contained" onClick={() => setShowForm(true)}>
        Add entry
      </Button>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const data = new FormData(e.currentTarget as HTMLFormElement);
    const newEntry = {
      type: data.get("type"),
      description: data.get("description"),
      date: data.get("date"),
      specialist: data.get("specialist"),
      healthRating: data.get("healthRating"),
      diagnosisCode: data.get("diagnosisCode"),
    };

    console.log(newEntry, data.get("date"));

    if (
      !newEntry.type ||
      !newEntry.description ||
      !newEntry.date ||
      !newEntry.specialist ||
      !newEntry.healthRating ||
      !newEntry.diagnosisCode
    ) {
      setError("All fields are required");
      return;
    }

    if (isNaN(Number(newEntry.healthRating))) {
      setError("Health rating must be a number");
      return;
    }

    if (
      Number(newEntry.healthRating) < 0 ||
      Number(newEntry.healthRating) > 3
    ) {
      setError("Health rating must be between 0 and 3");
      return;
    }

    patientService
      .addEntry(patientId, newEntry as unknown as NewEntry)
      .then((data) => {
        setPatient(data);
        setShowForm(false);
        // e.target.reset();
      })
      .catch((error) => {
        setError(error.response.data.error[0].message);
      });
  };

  return (
    <div>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            padding: "1rem",
            border: "3px dotted black",
          }}
        >
          <h3>New Health Check Entry</h3>

          <FormControl>
            <FormLabel id="input-type">Type</FormLabel>
            <RadioGroup row name="type">
              <FormControlLabel
                value="Hospital"
                control={<Radio />}
                label="Hospital"
              />
              <FormControlLabel
                value="HealthCheck"
                control={<Radio />}
                label="HealthCheck"
              />
              <FormControlLabel
                value="OccupationalHealthcare"
                control={<Radio />}
                label="OccupationalHealthcare"
              />
            </RadioGroup>
          </FormControl>

          <FormControl>
            <InputLabel htmlFor="input-description">Description</InputLabel>
            <Input id="input-description" name="description" />
          </FormControl>

          <FormControl>
            {/* <InputLabel htmlFor="input-date">Date</InputLabel> */}
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DatePicker name="date" format="YYYY-MM-DD" />
            </LocalizationProvider>
          </FormControl>

          <FormControl>
            <InputLabel htmlFor="input-specialist">Specialist</InputLabel>
            <Input id="input-specialist" name="specialist" />
          </FormControl>

          <FormControl>
            <InputLabel htmlFor="health-rating">Health rating</InputLabel>
            <Input id="health-rating" type="number" name="healthRating" />
          </FormControl>

          <FormControl>
            <InputLabel htmlFor="diagnosis-code">Diagnosis code</InputLabel>
            <Input id="diagnosis-code" name="diagnosisCode" />
          </FormControl>

          <Box
            sx={{ display: "flex", gap: "1rem", justifyContent: "flex-end" }}
          >
            <Button
              variant="contained"
              color="error"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
            <Button variant="contained" type="submit">
              Add
            </Button>
          </Box>
        </Box>
      </form>
    </div>
  );
};

export default EntryForm;
