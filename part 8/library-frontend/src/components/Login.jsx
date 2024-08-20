import { useMutation } from "@apollo/client";
import PropTypes from "prop-types";
import { LOGIN } from "../queries";
import { useEffect } from "react";

const Login = ({ show, setToken, setPage }) => {
  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error);
    },
    onCompleted: (data) => {
      console.log(data);
    },
  });

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value;
      setToken(token);
      localStorage.setItem("libraryToken", token);
      setPage("books");
    }
  }, [result.data]);

  if (!show) {
    return null;
  }

  const submit = async (event) => {
    event.preventDefault();
    const data = {
      username: event.target.username.value,
      password: event.target.password.value,
    };

    login({ variables: data });
  };

  return (
    <form onSubmit={submit}>
      <label htmlFor="login-username">username:</label>
      <input id="login-username" type="text" name="username" />
      <br />
      <label htmlFor="login-password">password:</label>
      <input id="login-password" type="password" name="password" />
      <br />
      <button type="submit">login</button>
    </form>
  );
};

Login.propTypes = {
  show: PropTypes.bool.isRequired,
  setToken: PropTypes.func.isRequired,
  setPage: PropTypes.func.isRequired,
};

export default Login;
