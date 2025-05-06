import {useState} from "react"; 
import Graph from "../pages/Graph.jsx";

//Need to get it to work
//Make the thing the condition? 

function ExtraGraph(){

    const [output, setOutput] = useState(false);

    const handleClick = () =>
    {
        setOutput(!output);
    }



    if(output)
{
    return(
        <div calssName="second-graph">
            <Graph/>
            <button className="remove-button" onClick={handleClick}>remove</button>
        </div>
    );
}
else{
    return(
        <button className="add-button" onClick={handleClick}>Add another</button>
    )
}

}

export default ExtraGraph;