import { useState } from "react";
import { Link } from "react-router-dom";
import '../css/LoginOrRegister.css'


function LoginOrRegister() {
  const [count, setCount] = useState(0);

  return (
    <div className="app drop-shadow-2xl bg-slate-50 flex flex-col items-center text-center">
      <p className="text-4xl mb-6 mt-40">async</p>
      <h1 className="text-7.5xl mb-44">tic tac toe</h1>
      <div className="flex flex-col gap-6">
        <Link
        to="/login"
          className={`btn bg-[#2F80ED] block rounded-lg flex items-center justify-center font-bold text-white`}
        >
          Login
        </Link>
        <Link
          to="/register"
          className={`btn bg-[#F2C94C] block rounded-lg flex items-center justify-center font-bold text-white`}
        >
          Register
        </Link>
      </div>
    </div>
  );
}

export default LoginOrRegister;
