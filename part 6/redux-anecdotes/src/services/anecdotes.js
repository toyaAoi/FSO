import axios from "axios";
import { asObject } from "../reducers/anecdoteReducer";

const baseUrl = "api/anecdotes";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async (content) => {
  const response = await axios.post(baseUrl, asObject(content));
  return response.data;
};

const edit = async (content) => {
  const response = await axios.put(`${baseUrl}/${content.id}`, content);
  return response.data;
};

export default { getAll, createNew, edit };
