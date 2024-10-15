import axios from "axios";
import { DiaryEntry, NewDiaryEntry } from "./App";

const URL = "http://localhost:3000/api/diaries";

export const getAll = async (): Promise<DiaryEntry[] | null> => {
  try {
    const response = await axios.get(URL);

    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const create = async (
  data: NewDiaryEntry
): Promise<DiaryEntry | null> => {
  try {
    const response = await axios.post(URL, data);
    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
