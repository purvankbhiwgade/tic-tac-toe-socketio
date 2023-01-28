import React, { useContext } from "react";
import FormContextProvider from "../context/FormContextProvider";

export default function NoGames() {
  const { socket } = useContext(FormContextProvider);
  socket.emit('join', {email: 'bhiwgadepurvank@gmail.com'})

  return (
    <div className="card flex flex-col text-left relative h-full">
      <p className="text-2.5xl leading-8 font-bold">Your Games</p>
      <div className="flex flex-col justify-center text-center grow">
        <button onClick={handleNewGame} className="text-5xl font-normal mb-9">No Games Found</button>
        <a
          className={`btn bg-[#F2C94C] block rounded-lg flex items-center justify-center font-bold text-white mt-11`}
        >
          Start a new game
        </a>
      </div>
    </div>
  );
}
