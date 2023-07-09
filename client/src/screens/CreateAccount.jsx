import React, { useEffect, useState } from "react";
import FormContextProvider from "../context/FormContextProvider";
import backButton from "../assets/public/icons8-back-50.png";
import useRegister from "../hooks/useRegister";
import { Link } from "react-router-dom";
import Alert from "../components/Alert";
import OtpComponent from "./OTPConfirmaton";

export default function CreateAccount() {
  const [
    values,
    errors,
    handleChange,
    handleSubmit,
    alert,
    handleAlert,
    disabled,
    OTPModal
  ] = useRegister();

  useEffect(() => {
    if (alert.message !== "") {
      const timeout = handleAlert();
      console.log("I am effect");
      return () => clearTimeout(timeout); // Clear the timeout if the component unmounts or alert changes
    }
  }, [alert]);

  return (
    <>
      <form className="card flex flex-col text-left relative h-full">
        <Link to="/auth">
          <img src={backButton} className="w-5 pt-2" />
        </Link>
        <p className="text-sm mt-8 mb-2">Create account</p>
        <p className="text-2.5xl font-bold mb-9">
          Let's get to know you better!
        </p>
        <div>
          <div className="flex space-between">
            <label className="text-sm font-bold mb-3.5" htmlFor="name">
              Your Name
              {errors.name !== "" && (
                <span className="text-rose-900 ml-[100px]">{errors.name}</span>
              )}
            </label>
          </div>
          <input
            type="text"
            name="name"
            placeholder="Type your name here"
            onChange={handleChange}
            value={values.name}
            className={`w-full leading-4 p-4 pt-5 bg-[#f4f4f4] rounded-lg text-sm mb-4 pb-4 input ${
              errors.name === "" ? null : "error"
            }`}
          />
        </div>
        <div>
          <div className="flex space-between">
            <label
              className="text-sm font-bold mb-3.5 flex justify-between"
              htmlFor="username"
            >
              Username
              {errors.name !== "" && (
                <span className="text-rose-900 ml-[100px]">{errors.name}</span>
              )}
            </label>
          </div>
          <input
            type="text"
            name="username"
            placeholder="Type your username here"
            onChange={handleChange}
            value={values.username}
            className={`w-full leading-4 p-4 pt-5 bg-[#f4f4f4] rounded-lg text-sm mb-4 input ${
              errors.name === "" ? null : "error"
            }`}
          />
        </div>
        <div>
          <div className="flex space-between">
            <label className="text-sm font-bold mb-3.5" htmlFor="email">
              Email
              {errors.email !== "" && (
                <span className="text-rose-900 ml-[140px]">{errors.email}</span>
              )}
            </label>
          </div>
          <input
            type="email"
            name="email"
            placeholder="Type your email here"
            onChange={handleChange}
            value={values.email}
            className={`w-full leading-4 p-4 pt-5 bg-[#f4f4f4] rounded-lg text-sm mb-4 input ${
              errors.email === "" ? null : "error"
            }`}
          />
        </div>
        <div>
          <div className="flex space-between">
            <label className="text-sm font-bold mb-3.5" htmlFor="phone">
              Password
              {errors.phone !== "" && (
                <span className="text-rose-900 ml-[140px]">
                  {errors.password}
                </span>
              )}
            </label>
          </div>
          <input
            type="password"
            name="password"
            placeholder="Type your password here"
            onChange={handleChange}
            value={values.phone}
            className={`w-full leading-4 p-4 pt-5 bg-[#f4f4f4] rounded-lg text-sm mb-9 input ${
              errors.phone !== "" ? "error" : null
            } remove-margin`}
          />
        </div>
        {alert.message !== "" && (
          <Alert status={alert.status} message={alert.message} />
        )}
        <button
          className={`btn bg-[#F2C94C] rounded-lg flex items-center justify-center font-bold text-white mt-11 absolute bottom-0 disabled:bg-[#E0E0E0]`}
          onClick={handleSubmit}
          type="button"
          disabled={disabled}
        >
          {disabled ? (
            <svg
              className="animate-spin mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 004 20v-2a5.978 5.978 0 014-1.49V17c0 1.657-1.343 3-3 3zm10-3.708A7.962 7.962 0 0020 12h2a9.963 9.963 0 01-2 6.291v-2a7.965 7.965 0 01-5-1.416zm-9-5.584A6.02 6.02 0 018 7v2a3.97 3.97 0 00-2 .563V9c0-1.654 1.346-3 3-3zm8 0c1.654 0 3 1.346 3 3v2a3.97 3.97 0 00-2-.563V9a5.97 5.97 0 01-3 1.708z"
              ></path>
            </svg>
          ) : (
            "Register"
          )}
        </button>
      </form>
  {OTPModal && (
        <OtpComponent username={values.username} email={values.email} />
      )}
    </>
  );
}
