import React from 'react'
import { Link } from 'react-router-dom';
import backButton from "../assets/public/icons8-back-50.png"
import useLogin from '../hooks/useLogin';

export default function LoginPage() {
  const [values, errors, handleChange, handleLogin] = useLogin();
  return (
    <form className="card flex flex-col text-left relative h-full">
        <Link to="/auth"><img src={backButton} className="w-5 pt-2"/></Link>
      <p className='text-sm mt-8 mb-2'>Login</p>
      <p className="text-2.5xl font-bold mb-9">
        Please enter your details!
      </p>
      <div>
        <div className="flex space-between">
          <label className="text-sm font-bold mb-3.5" htmlFor="username">Username</label>
          {errors.username !== "" && (
            <span className="text-red">{errors.username}</span>
          )}
        </div>
        <input
          type="text"
          name="username"
          placeholder="Type your username here"
          onChange={handleChange}
          value={values.username}
          className={`w-full leading-4 p-4 pt-5 bg-[#f4f4f4] rounded-lg text-sm mb-4 input ${errors.username === "" ? null : "error"}`}
        />
      </div>
      <div>
        <div className="flex space-between">
          <label className="text-sm font-bold mb-3.5" htmlFor="password">Password</label>
          {errors.password !== "" && (
            <span className="text-red">{errors.password}</span>
          )}
        </div>
        <input
          type="text"
          name="password"
          placeholder="Type your password here"
          onChange={handleChange}
          value={values.password}
          className={`w-full leading-4 p-4 pt-5 bg-[#f4f4f4] rounded-lg text-sm mb-9 input ${errors.password !== "" ? "error" : null} remove-margin`}
        />
      </div>
      <button
          className={`btn bg-[#F2C94C] block rounded-lg flex items-center justify-center font-bold text-white mt-11 absolute bottom-0`}
          onClick={handleLogin}
        >
          <Link to="/register" className='cursor-pointer'>Register</Link>
        </button>
    </form>
  )
}
