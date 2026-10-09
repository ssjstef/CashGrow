require('dotenv').config();


const express = require('express');
const mysql = require("mysql2");
const path = require("path");
const csv = require("csv-parser");
const multer = require("multer");
const fs = require("fs");
const cors = require('cors');
const jwt = require('jsonwebtoken');
const gemini = require('./gemini');
const bcrypt = require("bcrypt");


const PORT = process.env.PORT;
const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const DB = process.env.DB_NAME;
const PASS = process.env.DB_PASSWORD;


const app = express();
app.use(express.json());
app.use(cors());


const pool = mysql.createPool({

    host: HOST,
    user: USER,  
    database: DB,
    password: PASS,
    waitForConnections: true,
    connectTimeout: 10000
    
});

//The csv uploaded by user is saved locally as a temporary file
const upload = multer({ dest: "Uploads/"});

app.post("/csvupload", authenticateToken, upload.single("csv"), (req, res) => {

    if (!req.file) {
        return res.status(400).json({ message: "No CSV file uploaded" });
    }

    const userId = req.user.idUser;

    const results = [];
    const filePath = req.file.path;

    
    fs.createReadStream(filePath)
    .pipe(csv())
    .on("error", (err) => {
        console.error("CSV Read Error: ", err);
    })
    .on('data', (data) => results.push(data))
    .on('end', () => {

        const headers  = Object.keys(results[0]);
        
        const insertQuery = `INSERT INTO Financials (idUser, recipient, inout, amount, location, account, date, category) VALUES ?`;

        const values =  results.map(row => [
            userId, 
            ... headers.map(headers => row[headers])]); //This turns the results into an array of arrays. 

        pool.query(insertQuery, [values], (err, result) => {  
            fs.unlinkSync(filePath); 
            if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Database error' });
            }
            
            res.json({message: "CSV uploaded successfully"});

          });     
  })
})



const tree = multer({dest: "Uploads/"});

app.post("/imagecreation", tree.single("image"), async (req, res) => {
    const filepath = req.file.path
    
    try{
        const imageBuffer = await gemini.main(filepath); 

        res.setHeader("Content-Type", "image/png"); 
        res.send(imageBuffer); 

    }catch(error){

        console.error("Gemini generation failed", error);

        res.status(500).json("failed to generate the image");

    }finally{
        fs.unlinkSync(filepath); 
    }
})


app.post("/transactionsubmit", authenticateToken, (req, res) => {

    const userId = req.user.idUser;
    
    const { recipient, inout, amount, location, account, date, category } = Object.values(req.body);
    
    const sql = `INSERT INTO Financials (idUser, recipient, inout, amount, location, account, date, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [userId, recipient, inout, amount, location, account, date, category]

    pool.query(sql, values, (err) => {
        if(err){
            console.error("Transaction input error:", err);
            return res.status(500).json({ error: "Failed to insert transaction" });
        }
        
        res.json("successfull");
        console.log("Successfully inputted data");
        
    })
})


app.post("/login", (req,res) => {

    const sql = "SELECT * FROM User WHERE Username = ?"; 
    const pwd = req.body.pwd;
    const values = [
        req.body.user
    ]

    pool.query(sql, values, async (err, data) =>  { 
        if (data.length === 0) {
            return res.status(401).json({ error: "Invalid username" }); 
        }
        if(err){
                console.error("Login failed: ",  err);
        }

        const validatePass = await bcrypt.compare(pwd, data[0].Password); 

        if (!validatePass){
            return res.status(401).json({message: "Incorrect password"});
        }

        const user = {idUser: data[0].idUser, username: data[0].Username}; 
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET); 
        res.json({accessToken, user});
        
    }
    )
})

app.post('/signup', async (req, res) => {

    const usersql = "INSERT INTO User(Username, Password) VALUES (?, ?)";
    const budgetsql = "INSERT INTO Budgeting(idUser, Budget) VALUES (?, ?)";
    //Two queries are needed as two different table need to be updated
    const { username, password, budget } = req.body;

    try {
        const hashed = await bcrypt.hash(password, 10);
        const userValues = [username, hashed];

        pool.query(usersql, userValues, (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') { 
                    return res.status(409).json({ message: "Username already exists" });
                }
                console.error("User insert error:", err);
                return res.status(500).json({ message: "User insert failed" });
            }

            const newId = result.insertId; // The idUser is assigned to the user by the database and is required to update the budget table
                                           // This is returned to be used in the next query

            const budgetValues = [newId, budget];
            pool.query(budgetsql, budgetValues, (budgetErr, budgetResult) => {
                if (budgetErr) {
                    console.error("Budget insert error:", budgetErr);
                    return res.status(500).json({ message: "Budget insert failed" });
                }

                return res.status(201).json({ message: "User and budget created successfully" });
            });
        });

    } catch (err) {
        console.error("Hashing error:", err);
        return res.status(500).json({ message: "Server error during hashing" });
    }
});

app.get('/userdata', authenticateToken, (req, res) => {

    const userId = req.user.idUser;

    //Two queries are used to get both the budget gooal and the transaction infromation
    const financesql = "SELECT * FROM Financials WHERE idUser = ?";
    const budgetsql = "SELECT * FROM Budgeting WHERE idUser = ?"

    pool.query(financesql, [userId], (err, financeData) => {
        if(err){
            console.error("There was an error fetching the finances");
            return res.status(500).json({error: "Database error"});
        }
    pool.query(budgetsql, [userId], (err, budgetData) => {
        if(err){
            console.error("There was an error fetching the budget: ", err);
            return res.status(500).json({error: "Budgate table, Database error"});
            console.log(budgetData);
        }
        return res.json({finances: financeData, budget: budgetData});
    })
    })
    }
)       

function authenticateToken(req, res, next){
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401);

    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => { 
        if(err) return res.sendStatus(403);
        req.user = user
        next()
    })
}


app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });