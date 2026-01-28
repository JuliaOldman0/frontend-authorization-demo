import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";

import { AppContext } from "../context/AppContext";

import * as auth from "../utils/auth";
import { getToken, setToken } from "../utils/token";
import * as api from "../utils/api";

import "./styles/App.css";

function App() {
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleRegistration = ({
    username,
    email,
    password,
    confirmPassword,
  }) => {
    if (password !== confirmPassword) return;

    auth
      .register(username, password, email)
      .then(() => navigate("/login"))
      .catch(console.error);
  };

  const handleLogin = ({ username, password }) => {
    if (!username || !password) return;

    auth
      .authorize(username, password)
      .then((data) => {
        if (data.jwt) {
          setToken(data.jwt);

          // If your API returns { user: {username,email} } this is fine.
          // If it returns a different shape, adjust accordingly.
          setUserData(data.user);

          setIsLoggedIn(true);

          // Redirect back to the page user tried to open
          const redirectPath = location.state?.from?.pathname || "/ducks";
          navigate(redirectPath, { replace: true });
        }
      })
      .catch(console.error);
  };

  // Check localStorage JWT on first load and restore session
  useEffect(() => {
    const jwt = getToken();
    if (!jwt) return;

    api
      .getUserInfo(jwt)
      .then(({ username, email }) => {
        setIsLoggedIn(true);
        setUserData({ username, email });
      })
      .catch(console.error);
  }, []);

  return (
    <AppContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userData,
        setUserData,
      }}
    >
      <Routes>
        <Route
          path="/ducks"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Ducks />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-profile"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <MyProfile userData={userData} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/login"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} anonymous>
              <div className="loginContainer">
                <Login handleLogin={handleLogin} />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/register"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn} anonymous>
              <div className="registerContainer">
                <Register handleRegistration={handleRegistration} />
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            isLoggedIn ?
              <Navigate to="/ducks" replace />
            : <Navigate to="/login" replace />
          }
        />
      </Routes>
    </AppContext.Provider>
  );
}

export default App;
