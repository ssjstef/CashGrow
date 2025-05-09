import {useRef, useState, useEffect} from "react";
import {Link, Navigate, useNavigate} from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "axios";
import { timeout } from "d3-timer";
import Header from "../components/Header.jsx";
import styles from "./Login.module.css";

function Login() {

    const navigate = useNavigate();

    const { setAuth } = useContext(AuthContext);
    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState("");
    const [pwd, setPwd] = useState("");
    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);
    //Should get rid of this when using react router to re-route to the desired page after a successful login in. 

    useEffect(() => {
        userRef.current.focus();
    }, []);

    useEffect(() =>  {
        setErrMsg('');
    }, [user, pwd])

    useEffect(() => {
         if(success){
             const timer = setTimeout(() =>{
                 navigate("/tree");
             }, 1000)
             return () => clearTimeout(timer);
         }
    }, [success, navigate])

    const handleSubmit = async (e) => {
        e.preventDefault();


        try{
            const res = await axios.post("http://localhost:8080/login", {user, pwd});
            //This should now be setting the token (this needs to be handled in a different way)
            console.log(res.data);
            const { accessToken, user: userData } = res.data;
            setAuth({accessToken, user: userData})
            setSuccess(true);
            setUser("");
            setPwd("");
            console.log(accessToken, userData.idUser);
            //should really be getting all of the user data now, there is no real point getting it multiple times.
            //Should be when the user has just logged in. 

        }catch (err) {
            if(err.response?.status == 401) {
                console.error("Invalid credentials")
            } else {
                setErrMsg("Login Failed");
                console.error(err);
            }
        }

    }

    return (
        <>
        {success ? (
            <div>
            <h1>You Successfully logged in</h1>
            </div>
        ): (
        <>
        <div className={styles.contentBox}>
        <div className={styles.formContainer}>
            <div className={styles.loginBox}>
            <p ref={errRef} className={errMsg ? 'errmsg' : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>

                <label htmlFor="username">Username: </label>
                <input 
                    type="text" 
                    id="username"
                    ref={userRef} autoComplete="off" 
                    onChange={(e) => setUser(e.target.value)} 
                    value={user} 
                    required>
                </input>

                <label htmlFor="password">Password: </label>
                <input 
                    type="password" 
                    id="password"
                    onChange={(e) => setPwd(e.target.value)} 
                    value={pwd} 
                    required>
                </input>

                <button>Sign in</button>
            </form>
            </div>
            <p>
                Need an Account? <br />
                <span className="line">
                    <Link to="/signup">Sign Up</Link>
                </span>
            </p>
        </div>
        </div>
        </>
        )}
        </>
    )
}

export default Login;