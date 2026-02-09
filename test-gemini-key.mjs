import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env.local manually
const envPath = path.join(__dirname, 'web', '.env.local');
let apiKey = "";

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GOOGLE_AI_API_KEY=(.+)/);
    if (match) {
        apiKey = match[1].trim();
    }
} catch (e) {
    console.error("Could not read .env.local", e);
    process.exit(1);
}

if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
    console.error("API Key not found or is still placeholder in .env.local");
    process.exit(1);
}

console.log("Found API Key:", apiKey.substring(0, 8) + "...");

const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
    try {
        // Test 1: Simple text model
        console.log("\nTesting text model (gemini-1.5-flash)...");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hello, are you working?");
        const response = await result.response;
        console.log("✅ Text Response:", response.text());

        // Test 2: Vision model with dummy image
        console.log("\nTesting vision capabilities...");
        // 1x1 white pixel jpeg base64
        const dummyImage = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

        const imagePart = {
            inlineData: {
                data: dummyImage,
                mimeType: "image/jpeg",
            },
        };

        const visionResult = await model.generateContent(["Describe this image", imagePart]);
        const visionResponse = await visionResult.response;
        console.log("✅ Vision Response:", visionResponse.text());

        console.log("\n🎉 API Key is WORKING correctly!");

    } catch (error) {
        console.error("\n❌ API Test Failed:", error.message);
        if (error.message.includes("API key not valid")) {
            console.error("  -> The API key in .env.local is invalid.");
        }
    }
}

testGemini();
