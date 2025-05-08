//Figure out how this can be changed to upload and receive an image, this should be saved locally where the end point can then send it off, then it should be deleted
require('dotenv').config()

const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const { env } = require('process');

async function main(imagefile) {
  const ai = new GoogleGenerativeAI({ apiKey: process.env.API_KEY });

  const base64ImageFile = fs.readFileSync(imagefile, {
    encoding: "base64",
  });
  
  const contents = [
    {
      inlineData: {
        mimeType: "image/png",
        data: base64ImageFile,
      },
    },
    { text: " Can you make the tree grow, keep the tree type and the background scenery consistent " },
  ];
  
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-exp-image-generation",
    contents: contents,
    generationConfig: {
      responseMimeType: "image/png"
    }
  });

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return Buffer.from(part.inlineData.data, "base64");
    }
  }

  throw new Error("No image returned from Gemini");
  //Now need to create a way to save this image locally.
}

module.exports = { main };

//This is the right one. 
//Need to change what is sent and need to change what is being returned, should only be an image.
//Look into this.
//Need to put into a function that accepts an image, this will then replace whatever is being sent in this example.







// require('dotenv').config();
// const fs = require('fs');
// const path = require('path');
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// async function main(count) {

//   const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

//   const contents = prompts[count];

//   // Set responseModalities to include "Image" so the model can generate  an image
//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash-exp-image-generation",
//     contents: contents,
//     config: {
//       responseModalities: ["Text", "Image"], //?? This might need a look, I will be useing both the image and a text prompt
//     },
//   });
//   for (const part of response.candidates[0].content.parts) {
//     // Based on the part type, either show the text or save the image
//     if (part.text) {
//       console.log(part.text);
//     } else if (part.inlineData) {
//       const imageData = part.inlineData.data;
//       const buffer = Buffer.from(imageData, "base64");
//       fs.writeFileSync(`./Trees/created-tree-${count}.png`, buffer);
//       console.log("Image saved as gemini-native-image.png");
//     }
//   }
// }

// const prompt = "Generate an image of the provided tree but with more growth, the background and tree type should stay consistent"; //See if you can specify a scale of how much you want it to grow by
// for(let i = 0; i < prompts.length; i++){
//   main(i);
// }
