import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { AppContext } from "../context/AppContext";
import { removeToken } from "../utils/token";
import Logo from "./Logo";
import "./styles/NavBar.css";

function NavBar() {
  const navigate = useNavigate();
  const { setIsLoggedIn, setUserData } = useContext(AppContext);

  function signOut() {
    removeToken();
    setIsLoggedIn(false);
    setUserData({ username: "", email: "" });
    navigate("/login");
  }

  return (
    <div className="navbar">
      <div className="navbar__logo">
        <Logo />
      </div>
      <ul className="navbar__nav">
        <li>
          <NavLink to="/ducks" className="navbar__link">
            Ducks
          </NavLink>
        </li>
        <li>
          <NavLink to="/my-profile" className="navbar__link">
            My Profile
          </NavLink>
        </li>
        <li>
          <button className="navbar__link navbar__button" onClick={signOut}>
            Sign Out
          </button>
        </li>
      </ul>
    </div>
  );
}

export default NavBar;
