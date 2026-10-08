import {useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import  AuthContext  from "../context/AuthProvider";

function LogOut(){

    const navigate = useNavigate();


    const {auth, setAuth} = useContext(AuthContext);

    const handleClick = () => {
        setAuth(null); // Context value reset
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
        <button onClick={handleClick}>Log out</button> //Button element
    )
}

export default LogOut;