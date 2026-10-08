import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Signup.module.css";
import Header from "../components/Header.jsx";

//Comopnent that allows user to create a new account
function Signup() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState("");
    const [budget, setBudget] = useState("");

    useEffect(() => {
        if(success){
            const timer = setTimeout(() => {
                navigate("/login"); // Through the login process users are given an access token
            }, 1000)
            return () => clearTimeout(timer);
        }
    }, [success])

    const handleSubmit = async (e) => {

        e.preventDefault();

        try{
            const res = await axios.post("http://localhost:8080/signup", {username, password, budget});
            setSuccess(true);

        }catch(err) {
            console.error("There was a problem:", err);
        }

    }

    return(
    <>
    {success ? (
        <div>
            <h1>Successfully Signed Up</h1>
        </div>
    ): (
        <>
<div className={styles.contentBox}>
    <div className={styles.formContainer}>
        <h1>Sign Up</h1>
        <div className={styles.signUpBox}>
        <form onSubmit={handleSubmit}>
            <label htmlFor="username">Username:</label>
            <input
                type="text"
                id="username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
                required>
            </input>

            <label htmlFor="password">Password</label>
            <input
                type="password"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                requires>
            </input>

            <label htmlFor="budgetgoal">Budget Goal</label>
            <input
                type="number"
                id="budgetgoal"
                onChange={(e) => setBudget(e.target.value)}
                value={budget}
                requires>
            </input>


            <button>Sign up</button>
        </form>
        </div>
        <div>
            <p>
            Already have an account? <br />
            <span className='line'>
                <Link to="/login">Login</Link>
            </span>
            </p>
        </div>
    </div>

</div>
</>
    )}
    </>
    )
}

export default Signup;