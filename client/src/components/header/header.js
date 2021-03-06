import React from "react";
import Logo from "../assets/images/teeny_logo.png";
//import Modal from "../Modal/modal";
import ModalContainer from "../Modal/modalContainer";
import NewSearchLink from "../NewSearch";
import Logout from "../Logout";
import { Link } from "react-router-dom";
import "./header.css";
import Account from "../Account";

function Header() {
  return (
    <div>
      <nav>
        <div className="nav-wrapper">
          <Link to="/" className="brand-logo">
            <img
              src={Logo}
              className="responsive-img"
              alt="A tiny blue suitcase with a sock and heart boxers bursting out represents the logo of travelRush"
              style={{ maxWidth: "150px" }}
            />
          </Link>
          <Link to="/" className="brand-logo center">
            travelRush
          </Link>

          <ul className="right hide-on-med-and-down">
            <li>
              <Link to="/">
                <NewSearchLink />
              </Link>
            </li>
            <li>
              <Link to="/myaccount">
                <Account />
              </Link>
            </li>

            <li>
              <Link to="">
                <ModalContainer />
              </Link>
            </li>
            <li>
              <Link to="/">
                <Logout />
              </Link>
            </li>

            {/* <li><a href="#!">LOGIN</a></li> */}
          </ul>
        </div>
      </nav>
    </div>
  );
}

export default Header;
//index.js:1437 Warning: Invalid value for prop `href` on <a> tag. Either remove it from the element, or pass a string or number value to keep it in the DOM. For details, see https://fb.me/react-attribute-behavior
// in a (at header.js:14)
// in li (at header.js:14)
// in ul (at header.js:13)
// in div (at header.js:10)
// in nav (at header.js:9)
// in div (at header.js:8)
// in Header (at App.js:30)
//<Route exact path="/MyAccount" component={MyAccount} />
