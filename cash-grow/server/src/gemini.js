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

