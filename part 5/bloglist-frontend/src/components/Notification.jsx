import PropTypes from "prop-types";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  return <div className={"message " + message[1]}>{message[0]}</div>;
};

Notification.defaultProps = {
  message: null,
};

Notification.propTypes = {
  message: PropTypes.oneOfType([PropTypes.array, PropTypes.oneOf([null])]),
};

export default Notification;
