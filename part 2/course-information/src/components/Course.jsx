const Header = ({ course }) => <h2>{course}</h2>;

const Total = ({ sum }) => (
  <p>
    <strong>total of {sum} exercises</strong>
  </p>
);

const Part = ({ part }) => (
  <p>
    {part.name} {part.exercises}
  </p>
);

const Content = ({ parts }) => (
  <>
    {parts.map((part) => (
      <Part key={part.name} part={part} />
    ))}
  </>
);

const Course = ({ course: { name, parts } }) => {
  return (
    <div>
      <div>
        <Header course={name} />
        <Content parts={parts} />
        <Total
          sum={parts.reduce((acc, current) => current.exercises + acc, 0)}
        />
      </div>
    </div>
  );
};

const Curriculum = ({ courses }) => {
  return (
    <>
      <h1>Web development curriculum</h1>
      {courses.map((course) => (
        <Course key={course.name} course={course} />
      ))}
    </>
  );
};

export default Curriculum;
