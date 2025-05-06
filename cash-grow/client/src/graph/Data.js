import { useContext } from 'react';


const fakeUserData = [
    { Recipient: "Starbucks", Location: "New York", Amount: 5.99, Date: "2025-04-01", InOut: "out" },
    { Recipient: "Whole Foods", Location: "New York", Amount: 45.23, Date: "2025-04-01", InOut: "out" },
    { Recipient: "McDonald's", Location: "Los Angeles", Amount: 8.99, Date: "2025-04-02", InOut: "out" },
    { Recipient: "Trader Joe's", Location: "New York", Amount: 25.60, Date: "2025-04-02", InOut: "out" },
    { Recipient: "Best Buy", Location: "Los Angeles", Amount: 199.99, Date: "2025-04-03", InOut: "out" },
    { Recipient: "Subway", Location: "Chicago", Amount: 6.50, Date: "2025-04-04", InOut: "out" }
];

//console.log(createBubbles(fakeUserData));


//Need to change this into a hierarchical container
//This will allow me to have a value appended to the amount of times a certain location appears. 

//need to think how to do this
    // What needs to be returned = {[{Location[{"caffe 1", value: 2}, {"caffe2", value: 3} ]}]}

    //Changed by GPT

export function createBubbles(userData) {
        const locationMap = new Map();
      
        userData.forEach(({ location, place }) => {
          if (!locationMap.has(location)) {
            locationMap.set(location, new Map());
          }
      
          const placeMap = locationMap.get(location);
          placeMap.set(place, (placeMap.get(place) || 0) + 1);
        });
      
        const children = Array.from(locationMap.entries()).map(([location, placeMap]) => ({
          name: location,
          children: Array.from(placeMap.entries()).map(([place, count]) => ({
            name: place,
            value: count,
          }))
        }));
      
        return { name: "root", children };
      }


// export function createBubbles(userData){
//     //Here I need to create an object array where the object is the overall location and then you can add all the places in there 
//     const bubblesArray = {};
//     for(let i = 0; i < userData.length; i++){
//         if(!(userData[i].Location in bubblesArray)){
//             bubblesArray[userData[i].Location] = [userData[i].Recipient]; //Adds the place to the data
//         }else{
//             bubblesArray[userData[i].Location].push(userData[i].Recipient);
//         }
//     }

//     return(bubblesArray);
// }

