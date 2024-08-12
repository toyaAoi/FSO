import axios from "axios";
import { createSlice } from "@reduxjs/toolkit";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    addAnecdote(state, action) {
      state.push(action.payload);
    },
    voteAnecdote(state, action) {
      const id = action.payload;
      const anecdote = state.find((a) => a.id === id);
      anecdote.votes += 1;
    },
    setAnecdotes(_, action) {
      return action.payload;
    },
  },
});

export const { addAnecdote, voteAnecdote, setAnecdotes } =
  anecdoteSlice.actions;

export const initializeAnecdotes = () => async (dispatch) => {
  const response = await axios.get("http://localhost:3001/anecdotes");
  dispatch(setAnecdotes(response.data));
};

export default anecdoteSlice.reducer;
