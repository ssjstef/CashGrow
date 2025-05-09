import Tree1 from "../assets/Trees/Tree1.png";
import Tree2 from "../assets/Trees/Tree2.png";
import Tree3 from "../assets/Trees/Tree3.png";
import Tree4 from "../assets/Trees/Tree4.png";
import Tree5 from "../assets/Trees/Tree5.png";
import Tree6 from "../assets/Trees/Tree6.png";
import Tree7 from "../assets/Trees/Tree7.png";
import Tree8 from "../assets/Trees/Tree8.png";
import Tree9 from "../assets/Trees/Tree9.png";



import styles from "./Tree.module.css";
import { getWeeklySpendingData, getWeekStartDate } from "../graph/LineGraph";
import AuthContext from "../context/AuthProvider";
import { useContext, useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";

function Tree() {

    const scheme = {
        1: Tree1,
        2: Tree2,
        3: Tree3,
        4: Tree4,
        5: Tree5,
        7: Tree6,
        10: Tree7,
        15: Tree8,
        20: Tree9
    }


    const { auth, setAuth } = useContext(AuthContext);

    const [ tree, setTree ] = useState();

    const [ userData, setUserData ] = useState([]);

    const [ loading, setLoading ] = useState(true);

    const [ budget, setBudget] = useState();

    const [ score, setScore ] = useState();

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

    useEffect(() => {
        const newScore = calculateBudgetingSuccess(userData, budget);
        setScore(newScore);
        console.log(newScore);
    },[userData]);

    useEffect(() => {
        const updateTree = async () => {
            if (score !== undefined && score !== null) {
                const img = await treeSelector(score, scheme);
                setTree(img);
            }
        };
    
        updateTree();
    }, [score]);


    return (
        <div className={styles.treeContainer}>
            <div className={styles.mainContent}>
                <NavBar className={styles.sidebar}/>
                <img className={styles.treePicture}
                    src={tree || scheme[5]} // fallback to default if tree is not ready, Might be better to change to a loading message.
                />
            </div>
        </div>
        );
}

function calculateBudgetingSuccess(userData, budget){

    //Get Weekly spending, gets all of the weeks and their starting date, which could then be ordered?
        //Then you can go through array of sorted dates and see how far you can go before a fail is found, that
            //is the success rate

        //I do not have user data here at the moment need to get it. (not sure if it worth another API call) - made it, might be better to add it to auth

    const weeklySpending = getWeeklySpendingData(userData, budget);

    //This is all of the data, need to figure out if this is ordered or not
    let score = 0;

    for (let i = 0; i < weeklySpending.length; i++) {
        if (weeklySpending[i].spent <= budget) {
            score++;
        } else {
            score--;
        }
    }

    return score;
}

async function treeSelector(score, scheme) {
    if (score <= 0) {
        return scheme[1];
    }

    if (score in scheme) {
        return scheme[score];
    }

    const closest = closestTreeScore(score, scheme);
    try {
        const generatedImage = await handleGeneration(scheme[closest]);
        return generatedImage?.data?.imageUrl || scheme[closest]; // Fallback if API fails
    } catch (err) {
        console.error("Failed to generate image:", err);
        return scheme[closest];
    }
}


//Gets the tree with score just below the value the user score is, this can then be sent to the backend to generate a new tree.
function closestTreeScore(score, scheme){
    const keys = Object.keys(scheme).map(Number).sort((a, b) => a - b);
    let closest = keys[0];
    
    for (let i = 0; i < keys.length; i++) {
        if (score >= keys[i]) {
            closest = keys[i];
        } else {
            break;
        }
    }
    
    return closest;
    }

//might also be good to pass difference to the tree, this could be added to make understand the scale ?? Maybe to be added later
async function handleGeneration(treeImgPath) {
    const data = new FormData();
    data.append("image", treeImgPath);

    try {
        const res = await axios.post("http://localhost:8080/imagecreation", data, {
            responseType:'arraybuffer' 
        });
        const blob = new Blob([res.data], {type: "image/png"});
        imageUrl = URL.createObjectURL(blob);
        return imageUrl;
    } catch (err) {
        console.error("There was an error:", err);
        return null;
    }
}

export default Tree;