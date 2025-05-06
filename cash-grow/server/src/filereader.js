const {parse, CsvError} = require('csv-parse');
const fs = require('fs');

const path = "/Users/stefanorush/Desktop/Individual-Project/CashGrow/server/files/fake_transactions.csv";
//change this into the thing that is inputted



const results = [];

//Trying to make it find where the account number is
fs.createReadStream(path)
  .pipe(parse({ delimiter: ",", columns: true}))
  .on("data", row => results.push(row) 
  )
  .on("error", function (error) {
    // Handle the errors
    console.log(error.message);
  })
  .on("end", function () {
    // executed when parsing is complete
    console.log("File read successful");
    console.log(results.length);
    console.log(results);

    //ADD CODE TO THIS SECTION
    //Should format the code in a way in which the API can send it to the database

  });

//This one saves it to a JSON File could be useful when dealing API
/*
const results = [];

fs.createReadStream(path)
  .pipe(parse({ delimiter: ",", columns: true }))
  .on("data", (row) => results.push(row))
  .on("end", () => {
    fs.writeFileSync("output.json", JSON.stringify(results, null, 2));
    console.log("File read successful. Data saved to output.json.");
  });
*/

function spent_in_location(data, place){
  let to_return = [];
  for(let i = 0; i < data.length; i++){
    if(data[i].Location == place){
      to_return.push(data[i]);
    }
  }
  return to_return
}



