import { useContext, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import  AuthContext  from "../context/AuthProvider";

function ProtectedRoutes() {

    const { auth }  = useContext(AuthContext);

    const isAuthenticated = auth?.accessToken;
    
    return isAuthenticated ? <Outlet /> : <Navigate to="/login"/>;

}

export default ProtectedRoutes;