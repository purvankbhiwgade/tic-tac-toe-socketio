import React, { useContext } from "react";
import FormContextProvider from "../context/FormContextProvider";
import backButton from "../assets/public/icons8-back-50.png";
import useRegister from "../hooks/useRegister";
import { Link } from "react-router-dom";

export default function CreateAccount() {
  const [values, errors, handleChange, handleSubmit] = useRegister();
  return (
    <form className="card flex flex-col text-left relative h-full">
      <Link to="/auth"><img src={backButton}  className="w-5 pt-2" /></Link>
      <p className="text-sm mt-8 mb-2">Create account</p>
      <p className="text-2.5xl font-bold mb-9">Let's get to know you better!</p>
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
          <label className="text-sm font-bold mb-3.5 flex justify-between" htmlFor="username">
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
            <span className="text-rose-900 ml-[140px]">{errors.password}</span>
          )}
          </label>
        </div>
        <input
          type="text"
          name="password"
          placeholder="Type your password here"
          onChange={handleChange}
          value={values.phone}
          className={`w-full leading-4 p-4 pt-5 bg-[#f4f4f4] rounded-lg text-sm mb-9 input ${
            errors.phone !== "" ? "error" : null
          } remove-margin`}
        />
      </div>
      <button
        className={`btn bg-[#F2C94C] block rounded-lg flex items-center justify-center font-bold text-white mt-11 absolute bottom-0`}
        onClick={handleSubmit}
        type="button"
      >
        Register
      </button>
    </form>
  );
}
