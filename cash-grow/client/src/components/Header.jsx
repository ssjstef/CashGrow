import logo from "../assets/CashGrowLogo.png";
import styles from "../pages/Tree.module.css";
import LogOut from "../components/LogOut"

//Header to be added to tree, graph and upload pages
function Header(){
   return(
    <header className={styles.header}>
       <div className={styles.logoutContainer}>
          {/* Log out button */}
         <LogOut/> 
       </div>
      {/* The application logo */}
    <img src={logo} className={styles.logo}/>  
    <hr></hr>
    </header>
   ) 
}

export default Header;