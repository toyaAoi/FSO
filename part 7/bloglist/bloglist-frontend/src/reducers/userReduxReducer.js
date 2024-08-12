import { createSlice } from "@reduxjs/toolkit";
import blogService from "../services/blogs";
import loginService from "../services/login";
import { createNotification } from "./notificationReactReducer";

const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    removeUser(state, action) {
      return null;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export const initializeUser = () => async (dispatch) => {
  const loggedInUser = window.localStorage.getItem("blogUser");
  if (loggedInUser) {
    const user = JSON.parse(loggedInUser);
    dispatch(setUser(user));
    blogService.setToken(user.token);
  }
};

export const loginUser =
  (username, password, notificationDispatch) => async (dispatch) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem("blogUser", JSON.stringify(user));
      blogService.setToken(user.token);
      dispatch(setUser(user));
      notificationDispatch(createNotification("logged in", "success", 5));
    } catch {
      notificationDispatch(
        createNotification("wrong username or password", "error", 5)
      );
    }
  };

export const logoutUser = (notificationDispatch) => async (dispatch) => {
  window.localStorage.removeItem("blogUser");
  blogService.setToken(null);
  dispatch(removeUser());
  notificationDispatch(createNotification("logged out", "success", 5));
};

export default userSlice.reducer;
