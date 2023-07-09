import React, { useContext, useState, useEffect } from "react";
import FormContextProvider from "../context/FormContextProvider";
import backButton from "../assets/public/icons8-back-50.png";
import Axios from "axios";
import Cookies from "universal-cookie";
import Alert from "../components/Alert";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";

export default function NewGame() {
  const navigate = useNavigate();
  const cookies = new Cookies();
  const {
    userEmail,
    handleUserEmail,
    socket,
    rivalEmail,
    handleRivalEmail,
    handleOpponent,
    opponent,
    handleSecondPlayer,
  } = useContext(FormContextProvider);
  const [alert, setAlert] = useState({
    status: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    console.log("userEmail", userEmail);
    console.log("rivalEmail", rivalEmail);
    console.log("opponent", opponent);
  }, [opponent]);

  const validateEmail = () => {
    if (rivalEmail.length === 0) {
      setErrors({
        ...errors,
        email: "This field is required",
      });
    } else if (
      !new RegExp(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      ).test(rivalEmail)
    ) {
      setErrors({
        email: "Enter a valid email id",
      });
    } else {
      setErrors({ email: "" });
    }
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

  useEffect(() => {
    if (alert.message !== "") {
      const timeout = setTimeout(() => {
        console.log("I am handling alert");
        setAlert({ status: "", message: "" });
      }, 3000);
      console.log("I am effect");
      return () => clearTimeout(timeout); // Clear the timeout if the component unmounts or alert changes
    }
  }, [alert]);

  const joinRoom = async () => {
    await Auth.currentAuthenticatedUser()
      .then((user) => {
        const { attributes } = user;
        handleUserEmail(attributes.email);
        setUsername(user.username);
        return user.username;
      })
      .then((name) => {
        socket.emit("join-room", { userEmail, rivalEmail, username: name });
        socket.on("join-confirmation", (data) => {
          console.log(
            "received join-confirmation from the server with the data",
            data
          );
          setAlert({
            status: data.status,
            message: data.message,
          });

          if (data.status) {
            // handleOpponent(data.opponent);
            // redirect("/play");
            setLoading(false);
            handleSecondPlayer(true);
          }
        });
        socket.on("username", (data) => {
          console.log("username", data);
          handleOpponent(data.username);
          console.log("opponent", opponent);
          navigate("/play");
        });
      })
      .catch((err) => console.log(err));
  };

  const { createChannel } = useContext(FormContextProvider);
  return (
    <form className="card flex flex-col text-left relative h-full">
      <img src={backButton} className="w-5 pt-2" />
      <p className="text-sm mt-8 mb-2 font-bold">Start a new game</p>
      <p className="text-2.5xl font-bold mb-9">
        Whom do you want to play with?
      </p>
      {/* <div>
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
      </div> */}
      <div>
        <div className="flex space-between">
          <label className="text-sm font-bold mb-3.5" htmlFor="rivalEmail">
            Email
            {errors.email !== "" && (
              <span className="text-rose-900 ml-[140px]">{errors.email}</span>
            )}
          </label>
        </div>
        <input
          type="email"
          name="rivalEmail"
          placeholder="Type the email of your opponent here"
          onChange={(event) => {
            handleRivalEmail(event.target.value);
          }}
          value={rivalEmail}
          className={`w-full leading-4 p-4 pt-5 bg-[#f4f4f4] rounded-lg text-sm mb-4 input ${
            errors.email === "" ? null : "error"
          }`}
        />
      </div>
      {alert.message !== "" && (
        <Alert status={alert.status} message={alert.message} />
      )}
      <button
        className={`btn bg-[#F2C94C] rounded-lg flex items-center justify-center font-bold text-white mt-11 absolute bottom-0`}
        onClick={(e) => {
          e.preventDefault();
          validateEmail();
          if (errors.email === "") {
            // setDisabled(true);
            joinRoom();
          }
        }}
      >
        {loading ? (
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
          "Join game"
        )}
      </button>
    </form>
  );
}
