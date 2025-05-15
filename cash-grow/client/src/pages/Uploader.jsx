import {useState} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import styles from "./Uploader.module.css";

function Uploader(){

    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [success, setSuccess] = useState(false);

    const [recipient, setRecipient] = useState("");
    const [inOut, setInOut] = useState("");
    const [amount, setAmount] = useState("");
    const [location, setLocation] = useState("");
    const [account, setAccount] = useState("");
    const [date, setDate] = useState("");
    const [category, setCategory] = useState("");


    const fileChange = (e) =>{
        setFile(e.target.files[0]); //Changes the file to the one the user entered
    };

    //Handles the upload of the csv file
    const handleUpload = async () => {
        
        const formdata = new FormData; //Allows data to be sent to the API
        formdata.append("csv", file);

        try{
            //make post request with axios 
            const response = await axios.post("http://localhost:8080/csvupload", formdata);
            //axios detects the data type and takes any steps necessary due to the fact we are using FormData

            setSuccess(true);

        }
        catch(error){
            console.error("error in sending data: ", error);
        }
    }
    //Now we have the csv ready to be sent to the backend

    //handles user's manual input of a transaction
    const handleSubmit = async(e) => {
        e.preventDefault(); //Allows the rest of the code to be executed

        const transaction = {
            recipient,
            inOut,
            amount,
            location,
            account,
            date,
            category
        }

        
        try{
            const response = await axios.post("http://localhost:8080/transactionsubmit", transaction);
            setSuccess(true);
        }catch(err){
            console.error("There was an error with API:", err);
        }

    }
    

    return(
        <>
  {success ? (
    <p>Well done! You successfully uploaded the data.</p>
  ) : (
    <>
      <Header />
      <button
        className={styles.backButton}
        onClick={() => (window.location.href = "/tree")}
      >
        Back to Tree
      </button>

      <div className={styles.contentBox}>
        {/* CSV Upload Section */}
        <div className={styles.csvArea}>
          <h2>Upload Your CSV</h2>
          {/* The input field will only accept csv files  */}
          <input type="file" accept=".csv" onChange={fileChange} /> 
          <button onClick={handleUpload}>Upload CSV</button>
        </div>

        {/* Manual Form Entry Section */}
        <div className={styles.formContainer}>
          <h2>Manual Entry</h2>
          <div className={styles.signUpBox}>
            <form onSubmit={handleSubmit}>
              <label htmlFor="Recipient">Recipient</label>
              <input
                type="text"
                id="Recipient"
                onChange={(e) => setRecipient(e.target.value)}
                required
              />

              <label htmlFor="InOut">In/Out</label>
              <input
                type="text"
                id="InOut"
                onChange={(e) => setInOut(e.target.value)}
                required
              />

              <label htmlFor="Amount">Amount</label>
              <input
                type="number"
                id="Amount"
                onChange={(e) => setAmount(e.target.value)}
                required
              />

              <label htmlFor="Location">Location</label>
              <input
                type="text"
                id="Location"
                onChange={(e) => setLocation(e.target.value)}
                required
              />

              <label htmlFor="Account">Account</label>
              <input
                type="text"
                id="Account"
                onChange={(e) => setAccount(e.target.value)}
                required
              />

              <label htmlFor="Date">Date</label>
              <input
                type="date"
                id="Date"
                onChange={(e) => setDate(e.target.value)}
                required
              />

              <label htmlFor="Category">Category</label>
              <select
                name="Category"
                id="Category"
                onChange={(e) => setCategory(e.target.value)}
                required
              >
                <option value="">Select one...</option>
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

              <button type="submit">Complete</button>
            </form>
          </div>
        </div>
      </div>
    </>
  )}
</>
    );
}

export default Uploader;
