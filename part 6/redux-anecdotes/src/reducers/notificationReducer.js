import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    setNotification(_, action) {
      return action.payload;
    },
  },
});
export const { setNotification } = notificationSlice.actions;

export const createNotification = (content, duration) => {
  return (dispatch) => {
    dispatch(setNotification(content));

    setTimeout(() => {
      dispatch(setNotification(null));
    }, duration);
  };
};

export default notificationSlice.reducer;
