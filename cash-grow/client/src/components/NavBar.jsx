import React from 'react';
import styles from "../pages/Tree.module.css";

const NavBar = () => {
  return (

<nav className="navbar" className={styles.sidebar}>
  <div className="navbar-left">
    <image src="../assets/icons8-user-30.png" alt="Sign up"/>
  </div>
  <div className="navbar-center">
    <ul className="nav-links">
      <li>
        <a href="/graph">Graphs</a>
      </li>
      <li>
        <a href="/tree">Tree</a>
      </li>
      <li>
        <a href="/upload">Upload Data</a>
      </li>
    </ul>
  </div>
  <div className="navbar-right">
    <a href="/cart" className="cart-icon">
      <i className="fas fa-shopping-cart"></i>
      <span className="cart-count">0</span>
    </a>
    <a href="/account" className="user-icon">
      <i className="fas fa-user"></i>
    </a>
  </div>
</nav>
);
};

export default NavBar;



