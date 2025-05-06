import {useState} from "react";
import axios from "axios";

function Uploader(){

    const [file, setFile] = useState(null);
    const [success, setSuccess] = useState(false);

    const [recipient, setRecipient] = useState("");
    const [inOut, setInOut] = useState("");
    const [amount, setAmount] = useState("");
    const [location, setLocation] = useState("");
    const [account, setAccount] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("");


    //e is the event that happens inside of the input field
    const fileChange = (e) =>{
        setFile(e.target.files[0]);
    };

    //makes sure that it gets the file
    const handleUpload = async () => {
        
        const formdata = new FormData;
        formdata.append("csv", file);

        try{
            //make post request with axios 
            const response = await axios.post("http://localhost:8080/csvupload", formdata);
            //axios should detect the data type and set it itslef to the right stuff (because we are using FormData)
            console.log("success", response.data);
            setSuccess(true);

        }
        catch(error){
            console.error("error in sending data: ", error);
        }
    }
    //Now we have the csv ready to be sent to the backend

    const handleSubmit = async(e) => {
        e.preventDefault();

        const transaction = {
            recipient,
            inOut,
            amount,
            location,
            account,
            date,
            category
        }

        console.log(transaction);
        
        try{
            const response = await axios.post("http://localhost:8080/transactionsubmit", transaction);
            setSuccess(true);
        }catch(err){
            console.error("There was an error with API:", err);
        }

    }
    

    return(
        <>
        {success?(
            <p>Well done you successfully uploaded the data</p>
        )

        :(
        <div>
            <input type='file'  accept=".csv" onChange={fileChange}></input>
            <button onClick={handleUpload}>Upload Csv</button>
            <hr></hr>
                <div>
                    <form onSubmit={handleSubmit}>

                        <label htmlFor="Recipient">Recipient</label>
                        <input 
                            type="text" 
                            id="Recipient"
                            onChange={(e) => setRecipient(e.target.value)}
                            required>
                        </input>

                        <label htmlFor="InOut">InOut</label>
                        <input 
                            type="" 
                            id="InOut"
                            onChange={(e) => setInOut(e.target.value)}
                            required>
                        </input>

                        <label htmlFor="Amount">Amount</label>
                        <input 
                            type="float" 
                            id="Amount"
                            onChange={(e) => setAmount(e.target.value)}
                            required>
                        </input>

                        <label htmlFor="Location">Location</label>
                        <input 
                            type="text" 
                            id="Location"
                            onChange={(e) => setLocation(e.target.value)}
                            required>
                        </input>

                        <label htmlFor="Account">Account</label>
                        <input 
                            type="number" 
                            id="Account"
                            onChange={(e) => setAccount(e.target.value)}
                            required>
                        </input>

                        <label htmlFor="Date">Date</label>
                        <input 
                            type="date" 
                            id="Date"
                            onChange={(e) => setDate(e.target.value)}
                            required>
                        </input>

                        <label htmlFor="Category">Catogory</label>
                        <select name="Category" id="Category" onChange={(e) => setCategory(e.target.value)} required>
                            <option value="Food">Fast Food</option>
                            <option value="Groceries">Groceries</option>
                            <option value="Drink">Drink</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Sportswear">Sportswear</option>
                            <option value="Books">Books</option>
                            <option value="Retail">Retail</option>
                            <option value="Pharmacy">Pharmacy</option>
                            <option value="Online Shopping">Online Shopping</option>
                            <option value="Stationary">Stationary</option>
                            <option value="Bakery">Bakery</option>
                            <option value="Furniture">Furniture</option>
                        </select>

                        <button>Complete</button>
                    </form>
                </div>
        </div>
        )}
        </>
    );
}

export default Uploader;

//Correct order
//Recipient
//InOutGoing
//Amount
//Location
//Account
//Date
//Category

{/* <div>
<input type="text" placeholder="Recipient" required="true"/>
<select name="Category" id="Category" placeholder="Category" required="true">
    <option value="Food">Fast Food</option>
    <option value="Groceries">Groceries</option>
    <option value="Drink">Drink</option>
    <option value="Clothing">Clothing</option>
    <option value="Sportswear">Sportswear</option>
    <option value="Books">Books</option>
    <option value="Retail">Retail</option>
    <option value="Pharmacy">Pharmacy</option>
    <option value="Online Shopping">Online Shopping</option>
    <option value="Stationary">Stationary</option>
    <option value="Bakery">Bakery</option>
    <option value="Furniture">Furniture</option>
</select>
<input type="" placeholder="In/Out" required="true"/>
<input type="text" placeholder="Location" required="true"/>
<input type="number" placeholder="Amount" required="true"/>
<input type="date" placeholder="Date" required="true"/>
<input type="text" placeholder="Category" required="true"/>
<button onClick={handleSubmit}>Submit</button> */}


//Completley the wrong order, need to switch everything up to keep consistency. 