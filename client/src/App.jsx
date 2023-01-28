import { useState, useEffect, useContext } from "react";
import FormContextProvider from "./context/FormContextProvider";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LoginOrRegister from "./screens/LoginOrRegister";
import CreateAccount from "./screens/CreateAccount";
import LoginPage from "./screens/LoginPage";
import NoGames from "./screens/NoGames";
import NewGame from "./screens/NewGame";
import Play from "./screens/Play";
import Cookies from "universal-cookie";


function App() {
  const {isAuth, handleIsAuth, client} = useContext(FormContextProvider)
  
  const cookies = new Cookies();
  const token = cookies.get("token")

  // useEffect(() => {
  //   console.log('using effect')
  //   if(token) {
  //     client.connectUser({
  //       id: cookies.get("userId"),
  //       name: cookies.get("name"),
  //       email: cookies.get("email"),
  //       hashedPass: cookies.get("hashedPass"),
  //       username: cookies.get("username"),
  //     }, token).then((user) => {
  //       console.log(user)
  //       handleIsAuth(true)
  //     })
  //   }
  // }, [])
   



  return (
    <div className="app drop-shadow-2xl bg-white flex flex-col items-center text-center px-4 py-3.5 text-[#333333]">
      <Routes>
        <Route exact path="/auth" element={isAuth ? <Navigate to="/play" replace /> : <LoginOrRegister />} />
        <Route exact path="/register" element={isAuth ? <Navigate to="/play" replace /> : <CreateAccount />} />
        <Route exact path="/login" element={isAuth ? <Navigate to="/play" replace /> : <LoginPage />} />
        <Route exact path="/none" element={<NoGames />} />
        <Route exact path="/new" element={<NewGame />} />
        <Route exact path="/play" element={<Play />} />
      </Routes>
    </div>
  );
}

export default App;
