import styles from "./Graph.module.css";
import { useNavigate } from "react-router-dom";
import {useState, useContext, useEffect} from "react";
import  AuthContext  from "../context/AuthProvider";
import axios from "axios";
import BarChart from "../graph/BarChart";
import PieChart from "../graph/PieChart";
import LineGraph from "../graph/LineGraph";
import BubbleGraph from "../graph/BubbleGraph"
import Header from "../components/Header"
import NavBar from "../components/NavBar"

function Graph(){

    const navigate = useNavigate();

    const { auth, setAuth } = useContext(AuthContext); 

    const [ userData, setUserData ] = useState([]); 

    const [ budget, setBudget] = useState(); 

    const [graphChoice, setGraphChoice] = useState("lineGraph"); 
    const changeGraph = (event) => {
        setGraphChoice(event.target.value);
    }


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get("http://localhost:8080/userdata", {
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}` //passes the user's token for authentication
                    }
                })
                const finances = res.data.finances;
                const budget = res.data.budget;

                //Updates states
                setUserData(finances);
                setBudget(budget);

            }catch (err){
                console.error("Fetch failed", err);
            }
        ;}

        if(auth?.accessToken) {
        fetchUserData();
        }else{
            console.log("The authentication process failed")
        }

    }, [auth]);

    return(

        <div className={styles.graphPage}>
        <button
        className={styles.backButton}
        onClick={() => navigate("/tree")} 
        >
            Back to Tree
        </button>
        <Header/> 


            <h1 className={styles.heading}>Graph</h1>

            <div className={styles.graphBox}>

                <div>
                

                    <select name="graphs" id="graphs" onChange={changeGraph}> 
                        <option value="lineGraph">Line Graph</option>
                        <option value="barChart">Bar Chart</option>
                        <option value="pieChart">Pie Chart</option>
                        <option value="bubbleGraph">Bubble Graph</option>
                    </select>

                    <div className={styles.graph}>
                        {budget !== undefined && (
                            renderGraph(graphChoice, userData, budget) 
                        )}
                    </div>

                </div>
            </div>
            <div className={styles.transactionTable}> 
                <table>
                <thead>
                <tr>
                    <th>Recipeint</th>
                    <th>In/Out</th>
                    <th>Amount</th>
                    <th>Location</th>
                    <th>Account</th>
                    <th>Date</th>
                    <th>Category</th>
                </tr>
                </thead>
                <tbody>
                {userData.map((val, key) => { 

                    return(
                        <tr key={key}>
                            <td>{val.Recipient}</td>
                            <td>{val.InOut}</td>
                            <td>{val.Amount}</td>
                            <td>{val.Location}</td>
                            <td>{val.Account}</td>
                            <td>{val.Date.slice(0, 10)}</td>
                            <td>{val.Category}</td>
                        </tr>
                    )
                })}
                </tbody>
                </table>
            </div>
        
        </div> 
    )
}


function renderGraph(graphChoice, userData, budget){

    switch(graphChoice){
        case "lineGraph":
            return (
            <>
                <h2>Budgeting Goal vs Amount Spent on a Weekly Basis</h2>
                <LineGraph userData={userData} userBudget={budget[0].Budget}/>
            </>
            )
        case "barChart":
            return (
            <>  
                <h2>Amount Spent in the Last 10 Weeks Across All Categories</h2>
                <BarChart userData={userData}/>
            </>
            )
        case "pieChart":
            return (
            <>
                <h2>Amount Spent This Week Compared to Total Budget </h2>
                <PieChart userData={userData} userBudget={budget[0].Budget}/>
            </>
            )
        case "bubbleGraph":
            return(
            <>
                <h2>Graph Showing Recipeints of Money</h2>
                <BubbleGraph userData={userData}/>
            </>
            )
        default:
            return(
            <>
                <h2>Budgeting Goal vs Amount Spent on a Weekly Basis</h2>
                <LineGraph userData={userData} userBudget={budget[0].Budget}/>
            </>
            )
        }
}

export default Graph;