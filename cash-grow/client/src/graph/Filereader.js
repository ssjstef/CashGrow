//import { defaultCipherList } from 'constants';
import {parse, CsvError} from 'csv-parse';
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, '../assets/fake_uk_data.csv');



function runRead(){
  const results = [];

  //Trying to make it find where the account number is
  fs.createReadStream(filePath)
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
      let chosen_transactions = userTransactions(results, 1000);
      console.log(chosen_transactions);
    });
}
// const results = [];

// //Trying to make it find where the account number is
// fs.createReadStream(filePath)
//   .pipe(parse({ delimiter: ",", columns: true}))
//   .on("data", row => results.push(row) 
//   )
//   .on("error", function (error) {
//     // Handle the errors
//     console.log(error.message);
//   })
//   .on("end", function () {
//     // executed when parsing is complete
//     console.log("File read successful");
//     console.log(results.length);
//     let chosen_transactions = spent_in_location(results, 'Cardiff');
//     console.log(chosen_transactions);
//   });

  

function spent_in_location(data, place){
  let to_return = [];
  for(let i = 0; i < data.length; i++){
    if(data[i].Location == place){
      to_return.push(data[i]);
    }
  }
  return to_return
}

function userTransactions(data, id){
  let to_return = [];
  for(let i=0; i < data.length; i++){
    if(data[i].ID == id){
      to_return.push(data[i]);
    }
  }
  return to_return;
}
//This will be needed for reading the csv stuff anyways

export { runRead };


//Could have the user transactions one. because it's needed for showing the transaction history and then can just have everything else 





