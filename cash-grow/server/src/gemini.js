//API_KEY is hidden in the .env file
require('dotenv').config()


const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const { env } = require('process');

//The tree image is passed into the function as it's file path
async function main(imagefile) {
  const ai = new GoogleGenerativeAI({ apiKey: process.env.API_KEY });

  const base64ImageFile = fs.readFileSync(imagefile, {
    encoding: "base64",
  });
  
  //Sending contents allows for both the image and the prompt to be sent
  const contents = [
    {
      inlineData: {
        mimeType: "image/png",
        data: base64ImageFile,
      },
    },
    { text: "Can you make the tree grow, keep the tree type and the background scenery consistent " },
  ];
  


  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp-image-generation",
    contents: contents, 
    generationConfig: {
      responseMimeType: "image/png"
    }
  });
  
  //Gemini response might contain both text and image
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) { 
      return Buffer.from(part.inlineData.data, "base64");
    }
  }

  throw new Error("No image returned from Gemini");
}

module.exports = { main };

