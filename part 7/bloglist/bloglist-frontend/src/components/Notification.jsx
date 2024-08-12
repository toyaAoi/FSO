// import { useSelector } from "react-redux";
import { useEffect } from "react";
import {
  useNotificationDispatch,
  useNotificationValue,
} from "../reducers/notificationReactReducer";

const Notification = () => {
  const notification = useNotificationValue();
  const dispatch = useNotificationDispatch();

  useEffect(() => {
    let timer;
    if (notification) {
      timer = setTimeout(() => {
        dispatch({ type: "CLEAR_NOTIFICATION" });
      }, notification.duration * 1000);
    }

    return () => clearTimeout(timer);
  });

  if (notification === null) {
    return null;
  }

  return (
    <div className={"message " + notification.type}>{notification.content}</div>
  );
};

export default Notification;
