import styles from "./Graph.module.css";
import ExtraGraph from "../graph/ExtraGraph";
import {useState, useContext, useEffect} from "react";
import  AuthContext  from "../context/AuthProvider";
import axios from "axios";
import BarChart from "../graph/BarChart";
import PieChart from "../graph/PieChart";
import LineGraph from "../graph/LineGraph";
import BubbleGraph from "../graph/BubbleGraph"

//This adds another graph to the side for the comparison, this should change to what has been decided instead with Jing
//Might need a prop to determine what should be loaded in (which graph?) or selected from the dropdown (all one element?)
function Graph(){

    const { auth, setAuth } = useContext(AuthContext);

    const [ userData, setUserData ] = useState([]);

    const [ loading, setLoading ] = useState(true);

    const [ budget, setBudget] = useState();


    const [graphChoice, setGraphChoice] = useState("barChart");

    const changeGraph = (event) => {
        setGraphChoice(event.target.value);
    }


    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axios.get("http://localhost:8080/userdata", {
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`
                    }
                })
                const finances = res.data.finances;
                const budget = res.data.budget;

                setUserData(finances);
                setBudget(budget);

            }catch (err){
                console.error("Fetch failed", err);
            }finally{
                setLoading(false);
            }
        ;}

        if(auth?.accessToken) {
        fetchUserData();
        }else{
            console.log("no game boss")
        }

    }, [auth]);
    
    // useEffect(() => {
    //     if (budget !== undefined) {
    //         const userBudget = budget[0].Budget;
    //         console.log(userBudget);
    //     }
    // }, [budget]);//This proccess occurs every time that auth value changes (every time a user is chaged)

    return(

        <div className={styles.graphPage}>


            <h1 className={styles.heading}> Graph</h1>

            <div className={styles.graphBox}>

                <div>
                {/*Had a name of graph area one or something like that*/}
                

                    <select name="graphs" id="graphs" onChange={changeGraph}>
                        <option value="barChart">Bar Chart</option>
                        <option value="lineGraph">Line Graph</option>
                        <option value="pieChart">Pie Chart</option>
                        <option value="stackedBarChart">Stacked Bar Chart</option>
                    </select>

                    <div className="graph">
                        {budget !== undefined && (
                            //<PieChart userData={userData} userBudget={budget[0].Budget} />
                            <LineGraph userData={userData} userBudget={budget[0].Budget}/>
                            //<BubbleGraph userData={userData}/>
                        
                        )}
                    </div> {/* Graph div end */}

                </div> {/* End of GraphAreaOne */}
            <div className={styles.verticalRule}>
            </div> {/* Vertical Rule div end */}
            <div className="optional-box">
                <ExtraGraph/>
            </div> {/* Optional-box  end */}
            </div> {/* Graph Box  end */}
            <div className="transaction-table">
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

function tableCreator() {
    
}

export default Graph;