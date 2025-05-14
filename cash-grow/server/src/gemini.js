//API_KEY is hidden in the .env file
require('dotenv').config()


const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const { env } = require('process');

//The tree image is passed into the function as it's file path
async function main(imagefile) {
  const ai = new GoogleGenerativeAI({ apiKey: process.env.API_KEY });

  //image is assigned to a variable
  const base64ImageFile = fs.readFileSync(imagefile, {
    encoding: "base64",
  });
  
  //Sending contents allows for both the image and the prompt to be sent
  const contents = [
    {
      inlineData: {
        mimeType: "image/png", //Gemini requires the image type to be specified
        data: base64ImageFile,
      },
    },
    { text: " Can you make the tree grow, keep the tree type and the background scenery consistent " }, //This prompt always ensures growth
  ];
  

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp-image-generation",
    contents: contents, //Sends both the image and a text prompt
    generationConfig: {
      responseMimeType: "image/png"
    }
  });
  
  //For loop ensures the image is generated and returns it
  //Gemini response might contain both text and image, the for loop breaks this down
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) { 
      return Buffer.from(part.inlineData.data, "base64"); //inlinedata is where binary data is stored, if an image was returned it has to be here
    }
  }

  throw new Error("No image returned from Gemini");
}

module.exports = { main };

