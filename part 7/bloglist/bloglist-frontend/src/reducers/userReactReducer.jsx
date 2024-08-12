import PropTypes from "prop-types";
import { createContext, useContext, useReducer } from "react";
import blogService from "../services/blogs";
import loginService from "../services/login";
import { createNotification } from "./notificationReactReducer";

const userReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return action.payload;
    case "LOGOUT":
      return null;
    default:
      return state;
  }
};

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, userDispatch] = useReducer(userReducer, null);

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useUserValue = () => useContext(UserContext)[0];
export const useUserDispatch = () => useContext(UserContext)[1];

export const initializeUser = (dispatch) => {
  const loggedInUser = window.localStorage.getItem("blogUser");
  if (loggedInUser) {
    const user = JSON.parse(loggedInUser);
    dispatch({ type: "LOGIN", payload: user });
    blogService.setToken(user.token);
  }
};

export const loginUser = async (
  username,
  password,
  userDispatch,
  notificationDispatch
) => {
  try {
    const user = await loginService.login({ username, password });
    window.localStorage.setItem("blogUser", JSON.stringify(user));
    blogService.setToken(user.token);
    userDispatch({ type: "LOGIN", payload: user });
    notificationDispatch(createNotification("logged in", "success", 5));
  } catch (error) {
    notificationDispatch(
      createNotification("wrong username or password", "error", 5)
    );
  }
};

export const logoutUser = (userDispatch, notificationDispatch) => {
  window.localStorage.removeItem("blogUser");
  blogService.setToken(null);
  userDispatch({ type: "LOGOUT" });
  notificationDispatch(createNotification("logged out", "success", 5));
};

