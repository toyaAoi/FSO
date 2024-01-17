import { useState } from "react";

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const all = good + neutral + bad;

  const handleClickGood = () => {
    setGood((n) => n + 1);
  };
  const handleClickNeutral = () => {
    setNeutral((n) => n + 1);
  };
  const handleClickBad = () => {
    setBad((n) => n + 1);
  };

  return (
    <>
      <h1>give feedback</h1>
      <button onClick={handleClickGood}>good</button>
      <button onClick={handleClickNeutral}>neutral</button>
      <button onClick={handleClickBad}>bad</button>

      <h1>statistics</h1>
      {all === 0 ? (
        <p>No feedback given</p>
      ) : (
        <Statistics good={good} neutral={neutral} bad={bad} all={all} />
      )}
    </>
  );
};

const Statistics = ({ good, neutral, bad, all }) => {
  const average = all !== 0 ? ((good - bad) / all).toFixed(1) : 0;
  const positive = all !== 0 ? ((good / all) * 100).toFixed(1) + " %" : 0;

  return (
    <table>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="average" value={average} />
      <StatisticLine text="positive" value={positive} />
    </table>
  );
};

const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

export default App;
