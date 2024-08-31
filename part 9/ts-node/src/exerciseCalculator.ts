interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (
  target: number,
  exerciseHours: number[]
): Result => {
  const periodLength = exerciseHours.length;
  const trainingDays = exerciseHours.filter((hours) => hours > 0).length;
  const average =
    exerciseHours.reduce((sum, hours) => sum + hours, 0) / periodLength;
  const success = average >= target;
  let rating: number;
  let ratingDescription: string;

  if (average < target * 0.8) {
    rating = 1;
    ratingDescription = "You could do better";
  } else if (average < target) {
    rating = 2;
    ratingDescription = "Not too bad but could be better";
  } else {
    rating = 3;
    ratingDescription = "You are doing great!";
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

const target = Number(process.argv[2]);
const exerciseHours = process.argv.slice(3).map((e) => Number(e));

console.log(calculateExercises(target, exerciseHours));
