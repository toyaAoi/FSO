import { CoursePart } from "../App";

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case "basic":
      return (
        <>
          <p>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
          </p>
        </>
      );

    case "group":
      return (
        <>
          <p>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
            <br />
            <span>Group Project Count: {part.groupProjectCount}</span>
          </p>
        </>
      );

    case "background":
      return (
        <>
          <p>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
            <br />
            <em>{part.description}</em>
            <br />
            <span>Submit to {part.backgroundMaterial}</span>
          </p>
        </>
      );

    case "special":
      return (
        <>
          <p>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
            <br />
            <em>{part.description}</em>
            <br />
            <span>Required skills: {part.requirements.join(", ")}</span>
          </p>
        </>
      );
  }
};

export default Part;
