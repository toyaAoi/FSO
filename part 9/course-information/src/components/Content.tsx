interface Part {
  name: string;
  exerciseCount: number;
}

const Content = ({ courseParts }: { courseParts: Part[] }) => {
  console.log(courseParts);

  return (
    <>
      {courseParts.map((part) => (
        <p>
          {part.name} {part.exerciseCount}
        </p>
      ))}
    </>
  );
};

export default Content;
