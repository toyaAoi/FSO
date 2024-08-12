import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: null,
  reducers: {
    addNotification(state, action) {
      return action.payload;
    },
    clearNotification(state, action) {
      return null;
    },
  },
});

export const { addNotification, clearNotification } = notificationSlice.actions;

export const createNotification = (notification, type, duration) => {
  return (dispatch) => {
    dispatch(addNotification({ content: notification, type }));
    setTimeout(() => {
      dispatch(clearNotification());
    }, duration * 1000);
  };
};

export default notificationSlice.reducer;
