import React, { useState } from "react";
import Cookies from "universal-cookie";
import FormContextProvider from "./FormContextProvider";
// import { StreamChat } from "stream-chat";
import Axios from "axios";
import io from "socket.io-client"


function FormState(props) {
  const socket = io.connect("http://localhost:3000", { transports : ['websocket', 'polling', 'flashsocket'] })
  const [isAuth, setIsAuth] = useState(false);
  const [channel, setChannel] = useState(null);
  const [rivalEmail, setRivalEmail] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const cookies = new Cookies();
  
  const handleUserEmail = (event) => {
    setUserEmail(event.target.value)
  }

  const handleRivalEmail = (event) => {
    setRivalEmail(event.target.value)
  }
  
  const handleIsAuth = (val) => {
    setIsAuth(val);
  };


  const LogOut = () => {
    cookies.remove("userEmail");
    cookies.remove("rivalEmail")
    setIsAuth(false);
  };

  const createChannel = async (email) => {
    try {
      console.log("email", email);
      const token = cookies.get("token");

      Axios.post("http://localhost:3001/getUser", { email: email })
        .then((res) => {
          console.log(res.data.users);

          if (res.data.users.length === 0) {
            alert("user not found");
            return;
          }

          return client.channel("messaging", {
            members: [client.userID, res.data.users[0].id],
          });
        })
        .then((newChannel) => {
          newChannel.watch();
          setChannel(newChannel);
          console.log("game started");
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <FormContextProvider.Provider
      value={{ isAuth, handleIsAuth, socket, rivalEmail, handleRivalEmail, userEmail, handleUserEmail, LogOut }}
    >
      {props.children}
    </FormContextProvider.Provider>
  );
}

export default FormState;
