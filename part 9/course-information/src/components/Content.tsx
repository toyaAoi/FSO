import { CoursePart } from "../App";
import Part from "./Part";

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  console.log(courseParts);

  return (
    <>
      {courseParts.map((part) => (
        <Part key={part.name} part={part} />
      ))}
    </>
  );
};

export default Content;
