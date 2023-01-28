import React, {useContext, useState} from 'react'
import FormContextProvider from "../context/FormContextProvider";
import backButton from "../assets/public/icons8-back-50.png"
import Axios from "axios"
import Cookies from 'universal-cookie';

export default function NewGame() {
  const cookies = new Cookies();
  const {socket, userEmail, handleUserEmail, rivalEmail, handleRivalEmail} = useContext(FormContextProvider)

  const createRoom = () => {
    cookies.set('userEmail', userEmail, {sameSite: 'none', secure: true})
    cookies.set('rivalEmail', rivalEmail, {sameSite: 'none', secure: true})
    console.log(cookies.get('userEmail'))
    socket.emit('join', {userEmail: cookies.get('userEmail')})
  }
  
  const { createChannel } = useContext(FormContextProvider);
  return (
    <form className="card flex flex-col text-left relative h-full">
        <img src={backButton} className="w-5 pt-2"/>
      <p className='text-sm mt-8 mb-2 font-bold'>Start a new game</p>
      <p className="text-2.5xl font-bold mb-9">
        Whom do you want to play with?
      </p>
      <div>
        <div className="flex space-between">
          <label className="text-sm font-bold mb-3.5" htmlFor="userEmail">Your Email</label>
        </div>
        <input
          type="email"
          name="userEmail"
          placeholder="Type your email here"
          onChange={handleUserEmail}
          value={userEmail}
          className={`w-full leading-4 p-4 pt-5 bg-[#f4f4f4] rounded-lg text-sm mb-4 input `}
        />
      </div>
      <div>
        <div className="flex space-between">
          <label className="text-sm font-bold mb-3.5" htmlFor="rivalEmail">Email</label>
        </div>
        <input
          type="email"
          name="rivalEmail"
          placeholder="Type the email of your opponent here"
          onChange={handleRivalEmail}
          value={rivalEmail}
          className={`w-full leading-4 p-4 pt-5 bg-[#f4f4f4] rounded-lg text-sm mb-4 input `}
        />
      </div>
      <button
          className={`btn bg-[#F2C94C] block rounded-lg flex items-center justify-center font-bold text-white mt-11 absolute bottom-0`}
          onClick={(e) => {
            e.preventDefault()
            createRoom(userEmail)
          }}
        >
          Register
        </button>
    </form>
  )
}
