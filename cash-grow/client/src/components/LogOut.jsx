import { useState, useContext, useEffect } from "react";
import  AuthContext  from "../context/AuthProvider";


//Button to be added to the header to allow the user to log out
function LogOut(){
    const {auth, setAuth} = useContext(AuthContext);

    const handleClick = () => {
        setAuth(null); // When pressed it removes user values from context
    }

    useEffect(() => {
    if(!auth){
        const timer = setTimeout(() =>{
            navigate("/login"); //Once the data is removed, after 1 second it navigates the user to the login page
        }, 1000)
        return () => clearTimeout(timer);
    }
   }, [auth])

    return(
        <button onClick={handleClick}>Log out</button> //Button element
    )
}

export default LogOut;