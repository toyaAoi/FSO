import { useEffect, useState } from "react";
import { create, getAll } from "./service";

export interface DiaryEntry {
  id: number;
  date: string;
  visibility: "great" | "good" | "ok" | "poor";
  weather: "sunny" | "rainy" | "cloudy" | "stormy" | "windy";
  comment?: string;
}

export type NewDiaryEntry = Omit<DiaryEntry, "id">;

function App() {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [newDiaryEntry, setNewDiaryEntry] = useState<NewDiaryEntry>({
    // date: new Date(Date.now()),
    date: "",
    visibility: "great",
    weather: "sunny",
    comment: "",
  });

  useEffect(() => {
    getAll().then((data) => data && setDiaryEntries(data));
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDiaryEntry({
      ...newDiaryEntry,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    create(newDiaryEntry).then(
      (data) => data && setDiaryEntries((prev) => [data, ...prev])
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Add new entry</h2>
        <label>
          Date:{" "}
          <input
            type="date"
            name="date"
            value={newDiaryEntry.date}
            onChange={handleChange}
          />
        </label>
        <br />
        Visibility:{" "}
        {["great", "good", "ok", "poor"].map((visibility) => (
          <label key={visibility}>
            <input
              key={visibility}
              type="radio"
              name="visibility"
              value={visibility}
              checked={newDiaryEntry.visibility === visibility}
              onChange={handleChange}
            />
            {visibility}
          </label>
        ))}
        <br />
        Weather:{" "}
        {["sunny", "rainy", "cloudy", "stormy", "windy"].map((weather) => (
          <label key={weather}>
            <input
              key={weather}
              type="radio"
              name="weather"
              value={weather}
              checked={newDiaryEntry.weather === weather}
              onChange={handleChange}
            />
            {weather}
          </label>
        ))}
        <br />
        <label>
          Comment:{" "}
          <input
            type="text"
            name="comment"
            value={newDiaryEntry.comment}
            onChange={handleChange}
          />
        </label>
        <br />
        <input type="submit" value="Add" />
      </form>

      <div>
        <h2>Diary Entries</h2>
        {diaryEntries.map((entry) => (
          <div key={entry.id}>
            <h3>{entry.date}</h3>
            <p>
              <span>Visibility: {entry.visibility}</span>
              <br />
              <span>Weather: {entry.weather}</span>
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
