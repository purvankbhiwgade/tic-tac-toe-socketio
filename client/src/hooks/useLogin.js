import { useState, useContext } from "react";
import Cookies from "universal-cookie";
import Axios from "axios";
import FormContextProvider from "../context/FormContextProvider";

export default function useLogin() {
  const {isAuth, handleIsAuth} = useContext(FormContextProvider)
  const cookies = new Cookies();
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({ username: "", password: "" });

  const validateAll = () => {
    if (values.username === "" || values.password === "") {
      return false;
    }
    return true;
  };

  const handleLogin = (event) => {
    event.preventDefault();
    validateAll();
    console.log("Axios request");
    console.log("values", values);
    Axios.post("http://localhost:3001/login", values).then((res) => {
      const { token, userId, name, username, email } = res.data;
      console.log('setting cookies')
      console.log('res.data',res.data)
      cookies.set("token", token, { sameSite: "none", secure: true });
      cookies.set("userId", userId, { sameSite: "none", secure: true });
      cookies.set("name", name, { sameSite: "none", secure: true });
      cookies.set("username", username, { sameSite: "none", secure: true });
      cookies.set("email", email, { sameSite: "none", secure: true });
      handleIsAuth(true);
    });
  };

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log(value);
    validate(event, name, value);
    setValues({
      ...values,
      [name]: value,
    });
  };

  const validate = (event, name, value) => {
    switch (name) {
      case "username":
        if (value.length === 0) {
          setErrors({
            ...errors,
            username: "This field is required",
          });
        } else {
          // set the error state empty or remove the error for username input
          setErrors({ ...errors, username: "" });
        }
        break;
      case "password":
        if (value.length === 0) {
          setErrors({
            ...errors,
            password: "This field is required",
          });
        } else if (value.length < 6) {
          setErrors({
            ...errors,
            password: "incorrect password",
          });
        } else {
          setErrors({ ...errors, password: "" });
        }
        break;
      default:
        break;
    }
  };

  return [values, errors, handleChange, handleLogin];
}
