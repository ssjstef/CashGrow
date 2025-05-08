require('dotenv').config();

console.log("Access token passed through =", process.env.ACCESS_TOKEN_SECRET);


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


const PORT = process.env.PORT || 8080;
//This is the port Mysql operates on.

const app = express();
app.use(express.json());
app.use(cors());

const pool = mysql.createPool({

    host: 'localhost',
    user: 'root',  
    database: 'CashGrow',
    password: 'mysqlpass123',
    waitForConnections: true,
    connectTimeout: 10000
    
});

//start constructing the API

app.get("/home", (req, res) => {
    res.json({message: "Hello there mate"});
});

app.get("/", (req, res) => {
    res.json({message: 'This is the first page'});
})

const upload = multer({ dest: "Uploads/"});

app.post("/csvupload", upload.single("csv"), (req, res) => {

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
        //This breaks down the reuslts into smaller parts
        const insertQuery = `INSERT INTO Financials VALUES ?;`;
        console.log(insertQuery);
        //This turns the results into an array of arrays. 
        const values =  results.map(row => headers.map(headers => row[headers]));
        //'const chunkedResults = chunkArray(values, 100);

        //console.log(chunkedResults.length);

        pool.query(insertQuery, [values], (err, result) => {
            fs.unlinkSync(filePath); // Remove temp file
            if (err) {
              console.error(err);
              return res.status(500).json({ message: 'Database error' });
            }
            console.log("Successfully added data");
          });     
  })

  res.json({message: "CSV uploaded successfully"});

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
        fs.unlinkSync(filepath); //cleaning up the generated image
    }
})

app.post("/transactionsubmit", (req, res) => {
    const { recipient, inout, amount, location, account, date, category } = Object.values(req.body); //This is missing the idUser, which is needed for it to really know what it is going to do. Sort it out tomorrow just try and do some css
    
    const sql = `INSERT INTO Financials VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const values = [recipient, inout, amount, location, account, date, category]

    pool.query(sql, values, (err) => {
        if(err){
            console.error("Transaction input error:", err);
        }
        res.json("successfull");
        console.log("Successfully inputted data");
        
    })
})

app.post("/login", (req,res) => {
    console.log("received request:", req.body);
    const sql = "SELECT * FROM User WHERE Username = ?";
    const pwd = req.body.pwd;
    const values = [
        req.body.user
    ]
    pool.query(sql, values, async (err, data) =>  {
        if (data.length === 0) {
            return res.status(401).json({ error: "Invalid username or password" });
        }
        if(err){
                console.error("Login failed: ",  err);
        }
        //Need to add the calidation

        const validatePass = await bcrypt.compare(pwd, data[0].Password);

        if (!validatePass){
            return res.status(401).json({nessage: "Incorrect password"});
        }

        const user = {idUser: data[0].idUser, username: data[0].Username};
        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.json({accessToken, user});
        
    }
    )
})

//could be a problem with the json
//Problem, cannot add the Budget into the table, need to get a return then add the id and the budget into the Budget table
app.post('/signup', async (req, res) => {
    const usersql = "INSERT INTO User(Username, Password) VALUES (?, ?)";
    const budgetsql = "INSERT INTO Budgeting(idUser, Budget) VALUES (?, ?)";
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

            const newId = result.insertId;

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
    //Here we are going to return the data specific to the user using the token 
    const userId = req.user.idUser;
    //console.log(req);

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

    console.log("This is the token: ", token);

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