import PropTypes from "prop-types";
import { useState } from "react";
import { useNotificationDispatch } from "../reducers/notificationReactReducer";
import { loginUser, useUserDispatch } from "../reducers/userReactReducer";

const LoginForm = ({ user }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // const dispatch = useDispatch();
  const userDispatch = useUserDispatch();
  const notificationDispatch = useNotificationDispatch();

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser(username, password, userDispatch, notificationDispatch);
    setUsername("");
    setPassword("");
  };

  if (user) {
    return null;
  }

  return (
    <div className="mx-auto max-w-lg">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md border-2 border-neutral-200 rounded px-8 pt-6 pb-8 mb-4"
      >
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            className="form-input"
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            className="form-input"
          />
        </label>
        <br />
        <button type="submit" className="form-button">
          login
        </button>
      </form>
    </div>
  );
};

LoginForm.propTypes = {
  user: PropTypes.object,
};

export default LoginForm;
