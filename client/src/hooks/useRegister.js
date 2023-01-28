import { useState, useContext } from "react";
import Axios from "axios";
import Cookies from "universal-cookie";
import FormContextProvider from "../context/FormContextProvider";

export default function useRegister() {
  const {isAuth, handleIsAuth} = useContext(FormContextProvider)
  const cookies = new Cookies();
  const [values, setValues] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });

  const validateAll = () => {
    if (
      values.name === "" ||
      values.username === "" ||
      values.email === "" ||
      values.password === ""
    ) {
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    validateAll();
    Axios.post("http://localhost:3001/signup", values).then((res) => {
      const { token, userId, name, username, email, hashedPass } = res.data;
      cookies.set("token", token, {sameSite: "none", secure: true});
      cookies.set("userId", userId, {sameSite: "none", secure: true});
      cookies.set("name", name, {sameSite: "none", secure: true});
      cookies.set("username", username, {sameSite: "none", secure: true});
      cookies.set("email", email, {sameSite: "none", secure: true});
      cookies.set("hashedPass", hashedPass, {sameSite: "none", secure: true});
      handleIsAuth(true)
    }).catch((error) => {
      console.log(error)
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
      case "name":
        if (value.length === 0) {
          setErrors({
            ...errors,
            name: "This field is required",
          });
        } else {
          // set the error state empty or remove the error for username input
          setErrors({ ...errors, name: "" });
        }
        break;
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
      case "email":
        if (value.length === 0) {
          setErrors({
            ...errors,
            email: "This field is required",
          });
        } else if (
          !new RegExp(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ).test(value)
        ) {
          setErrors({
            ...errors,
            email: "Enter a valid email id",
          });
        } else {
          setErrors({ ...errors, email: "" });
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
            password: "Weak Password",
          });
        } else {
          setErrors({ ...errors, password: "" });
        }
        break;
      default:
        break;
    }
  };

  return [values, errors, handleChange, handleSubmit];
}
