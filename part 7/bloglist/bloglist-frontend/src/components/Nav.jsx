import PropTypes from "prop-types";
import { Link } from "react-router-dom";

import { logoutUser, useUserDispatch } from "../reducers/userReactReducer";
import { useNotificationDispatch } from "../reducers/notificationReactReducer";

const Nav = ({ user }) => {
  const userDispatch = useUserDispatch();
  const notificationDispatch = useNotificationDispatch();

  const handleLogout = () => {
    logoutUser(userDispatch, notificationDispatch);
  };

  return (
    <nav className="nav">
      <div>
        <Link to="/" className="nav-link mr-4">
          blogs
        </Link>
        <Link to="/users" className="nav-link">
          users
        </Link>{" "}
      </div>
      <div>
        <span>{user} logged in</span>
        <button onClick={handleLogout} className="nav-button ml-4">
          <Link to="/">logout</Link>
        </button>
      </div>
    </nav>
  );
};

Nav.propTypes = {
  user: PropTypes.string,
};

export default Nav;

