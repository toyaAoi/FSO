import { useNotificationValue } from "./NotificationContext";

const Notification = () => {
  const notification = useNotificationValue();

  console.log("Notification: ", notification);

  if (!notification) return null;

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  return <div style={style}>{notification}</div>;
};

export default Notification;
