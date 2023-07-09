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
import { Amplify, Auth } from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);

function App() {
  const { handleUserEmail, isAuth, handleIsAuth, client } = useContext(FormContextProvider);
  const cookies = new Cookies();
  const token = cookies.get("token");

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const isAuth = await authenticated();
        setIsAuthenticated(isAuth);
      } catch (error) {
        console.log("Error occurred during authentication:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  const authenticated = async () => {
    console.log("authenticating");
    const isAuth = await Auth.currentAuthenticatedUser()
      .then((response) => {
        console.log(response);
        const {attributes} = response;
        handleUserEmail(attributes.email)
        return true;
      })
      .catch((err) => {
        console.log("not authenticated");
        return false;
      });
    console.log("isAuth", isAuth);
    return isAuth;
  };

  // useEffect(() => {
  //   handleIsAuth(authenticated())
  // }, [isAuth])
  // handleIsAuth(authenticated())

  return (
    <div className="app drop-shadow-2xl bg-white flex flex-col items-center text-center px-4 py-3.5 text-[#333333]">
      <Routes>
        <Route
          exact
          path="/auth"
          element={
            isAuthenticated ? (
              <Navigate to="/new" replace />
            ) : (
              <LoginOrRegister />
            )
          }
        />
        <Route
          exact
          path="/register"
          element={
            isAuthenticated ? <Navigate to="/new" replace /> : <CreateAccount />
          }
        />
        <Route
          exact
          path="/login"
          element={
            isAuthenticated ? <Navigate to="/new" replace /> : <LoginPage />
          }
        />
        <Route exact path="/none" element={<NoGames />} />
        <Route
          exact
          path="/new"
          element={
            isAuthenticated ? <NewGame /> : <Navigate to="/auth" replace />
          }
        />
        <Route exact path="/play" element={<Play />} />
        <Route exact path="/" element={<LoginOrRegister />} />
        <Route exact path="/createaccount" element={<CreateAccount />} />
      </Routes>
    </div>
  );
}

export default App;
