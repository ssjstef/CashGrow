import Tree1 from "../assets/Trees/Tree1.png";
import Tree2 from "../assets/Trees/Tree2.png";
import Tree3 from "../assets/Trees/Tree3.png";
import Tree4 from "../assets/Trees/Tree4.png";
import Tree5 from "../assets/Trees/Tree5.png";
import Tree6 from "../assets/Trees/Tree6.png";
import Tree7 from "../assets/Trees/Tree7.png";
import Tree8 from "../assets/Trees/Tree8.png";
import Tree9 from "../assets/Trees/Tree9.png";
import Logo from "../assets/CashGrowLogo.png";


import styles from "./Tree.module.css";
import { getWeeklySpendingData } from "../graph/Data";
import AuthContext from "../context/AuthProvider";
import { useContext, useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import axios from "axios";

import Header from "../components/Header.jsx";

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
            console.log("uncessful authentication")
        }

    }, [auth]);

    useEffect(() => {
        const newScore = calculateBudgetingSuccess(userData, budget);
        setScore(newScore);
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
        <>
        <Header/>
        <div className={styles.treeContainer}>
            <div className={styles.mainContent}>
                <NavBar className={styles.sidebar}/>
                <div
                    className={styles.treePicture}
                    style={{ backgroundImage: `url(${tree || scheme[5]})` }}
                ></div>                
            </div>
        </div>
        </>
        );
}

function calculateBudgetingSuccess(userData, budget){

    const weeklySpending = getWeeklySpendingData(userData, budget);

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


//Gets the tree with score just below the value the user's score is, this can then be sent to the backend to generate a new tree.
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