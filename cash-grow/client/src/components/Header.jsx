import logo from "../assets/CashGrowLogo.png";
import styles from "../pages/Tree.module.css";
import LogOut from "../components/LogOut"

function Header(){
   return(
    <header className={styles.header}>
       <div className={styles.logoutContainer}>
         <LogOut/> 
       </div>
    <img src={logo} className={styles.logo}/>  
    <hr></hr>
    </header>
   ) 
}

export default Header;