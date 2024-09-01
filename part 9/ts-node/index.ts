import express from "express";
import calculateBmi from "./utils/bmiCalculator";
import calculateExercises from "./utils/exerciseCalculator";

const app = express();

app.use(express.json());

app.get("/hello", (_req, res) => {
  return res.send("Hello Full Stack!");
});

app.get("/bmi", (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight) || height <= 0 || weight <= 0) {
    return res.status(400).json({ error: "malformatted parameters" });
  }

  const bmi = calculateBmi(height, weight) + " range";

  return res.json({
    weight,
    height,
    bmi,
  });
});

app.post("/exercises", (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {
    daily_exercises,
    target,
  }: { daily_exercises: number[]; target: number } = req.body;

  if (!daily_exercises || !target) {
    return res.status(400).json({ error: "parameters missing" });
  }

  const exercises = daily_exercises.map((e: number) => Number(e));
  const result = calculateExercises(target, exercises);

  return res.json(result);
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
