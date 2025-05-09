import { useState, useContext, useEffect } from "react";
import  AuthContext  from "../context/AuthProvider";


function LogOut(){
    const {auth, setAuth} = useContext(AuthContext);

    const handleClick = () => {
        setAuth(null);
    }

    useEffect(() => {
    if(!auth){
        const timer = setTimeout(() =>{
            navigate("/login");
        }, 1000)
        return () => clearTimeout(timer);
    }
   }, [auth])

    return(
        <button onClick={handleClick}>Log out</button>
    )
}

export default LogOut;


//This should reset stuff
//Just need the image and then we are pretty much set.
//Could navigate to the login button