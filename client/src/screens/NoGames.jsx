import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FormContextProvider from "../context/FormContextProvider";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

export default function NoGames() {
  const navigate = useNavigate();
  const {
    socket,
    handleOpponent,
    userEmail,
    rivalEmail,
    opponent,
    handleRivalEmail,
  } = useContext(FormContextProvider);
  const [alert, setAlert] = useState({
    status: "",
    message: "",
  });
  const [waiting, setWaiting] = useState(false);
  const [username, setUsername] = useState("Player");

  useEffect(() => {
    console.log("userEmail", userEmail);
    console.log("rivalEmail", rivalEmail);
    console.log("opponent", opponent);
  }, [opponent]);
  // socket.off("join-confirmation")

  // useEffect(() => {
  //   if (waiting === false) socket.off("join-confirmation");
  // }, [waiting]);

  // socket.emit("join", { email: "bhiwgadepurvank@gmail.com" });

  const createRoom = async () => {
    await Auth.currentAuthenticatedUser()
      .then((response) => {
        const { attributes } = response;
        setUsername(response.username);
        console.log("response attributes", attributes.email);
        console.log("response attributes.username", attributes.username);
        console.log("response username", response.username, username);

        // creates a room
        socket.emit("create-game", { userEmail: attributes.email });

        // confirmation for creating the room and keep the creator on bystand for the next player to join
        socket.on("create-confirmation", (payload) => {
          console.log("received create-confirmation", payload);
          setWaiting(true);
        });

        // confirmation that the second player has joined
        socket.on("join-confirmation", (payload) => {
          console.log("join-confirmation", payload);
          handleOpponent(payload.opponent);
          handleRivalEmail(payload.email);
          setWaiting(false);
          console.log("username event emitted with data: ", {
            username: response.username,
            roomname: attributes.email,
          });
          socket.emit("username", {
            username: response.username,
            roomname: attributes.email,
          });
          navigate("/play");
        });
      })
      .catch((err) => console.log("create room error", err));
  };


  // setInterval(() => {
  //   if (socket.connected) {
  //     console.log("Socket is connected to the server.");
  //     const roomId = socket.rooms;
  //     console.log("Room ID:", roomId);
  //     console.log("Socket ID:", socket.id);
  //     // Perform actions when socket is connected to the server and the room.
  //   } else {
  //     console.log("Socket is not connected to the server.");
  //     // Handle the case when the socket is not connected to the server or the room.
  //   }

  // }, 10000);
  return (
    <div className="card flex flex-col text-left relative h-full">
      <p className="text-2.5xl leading-8 font-bold">Your Games</p>
      <div className="flex flex-col justify-center text-center grow">
        <h3 className="text-5xl font-normal mb-9">No Games Found</h3>
        {waiting && (
          <p className="mt-11">Waiting for the other player to join...</p>
        )}

        <button
          onClick={createRoom}
          disabled={waiting}
          className={`btn bg-[#F2C94C] rounded-lg flex items-center justify-center font-bold text-white mt-3 disabled:bg-[#E0E0E0]`}
        >
          {waiting ? (
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
            "Start a new game"
          )}
        </button>
      </div>
    </div>
  );
}
