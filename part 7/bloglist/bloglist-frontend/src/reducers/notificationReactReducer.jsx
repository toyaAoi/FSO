import PropTypes from "prop-types";
import { createContext, useContext, useReducer } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.payload;
    case "CLEAR_NOTIFICATION":
      return null;
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    null
  );
  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {children}
    </NotificationContext.Provider>
  );
};

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useNotificationValue = () => {
  const context = useContext(NotificationContext);
  return context[0];
};

export const useNotificationDispatch = () => {
  const context = useContext(NotificationContext);
  return context[1];
};

export const createNotification = (content, type, duration) => {
  return {
    type: "SET_NOTIFICATION",
    payload: { content, type, duration },
  };
};

export default NotificationProvider;
