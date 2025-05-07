import { useState, useContext } from "react";
import  AuthContext  from "../context/AuthProvider";


function LogOut(){
    const {auth, setAuth} = useContext(AuthContext);

    const handleClick = () => {
        setAuth(null);
    }

    return(
        <Button onClick={handleClick}>Log out</Button>
    )
}
//This should reset stuff
//Just need the image and then we are pretty much set.
//Could navigate to the login button