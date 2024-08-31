const calculateBmi = (height: number, weight: number): string => {
  const heightInMeters = height / 100;
  const bmi = weight / heightInMeters ** 2;

  switch (true) {
    case bmi < 16:
      return "Severe Thinness";
    case bmi < 17:
      return "Moderate Thinness";
    case bmi < 18.5:
      return "Underweight";
    case bmi < 25:
      return "Normal";
    case bmi < 30:
      return "Overweight";
    case bmi < 35:
      return "Obese Class I";
    case bmi < 40:
      return "Obese Class II";
    case bmi >= 40:
      return "Obese Class III";
    default:
      return "Invalid BMI";
  }
};

const height = Number(process.argv[2]);
const weight = Number(process.argv[3]);

console.log(calculateBmi(height, weight));
