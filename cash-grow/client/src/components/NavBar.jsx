import React from 'react';
import styles from "../pages/Tree.module.css";

const NavBar = () => {
  return (

<nav className={styles.sidebar}>
  <div>
      <a href="/graph" className={styles.navItem}>Graphs</a>
      <a href="/upload" className={styles.navItem}>Input Data</a>
  </div>
</nav>
);
};

export default NavBar;



