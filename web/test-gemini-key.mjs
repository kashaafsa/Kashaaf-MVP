import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read .env.local manually (in same dir)
const envPath = path.join(__dirname, '.env.local');
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

// No key provided to constructor for listModels (it's weird in SDK but let's try standard way)
// Actually listModels is on the GoogleGenerativeAI instance? No, checked docs.
// It seems the Node SDK doesn't expose listModels easily on the client instance in some versions.
// Let's try to just use 'gemini-pro' as a fallback test.

const genAI = new GoogleGenerativeAI(apiKey);

async function testGemini() {
    try {
        console.log("Trying 'gemini-1.5-flash'...");
        const modelFlash = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        try {
            const result = await modelFlash.generateContent("Test");
            console.log("✅ getGenerativeModel('gemini-1.5-flash') worked!");
        } catch (e) {
            console.error("❌ gemini-1.5-flash failed:", e.message);
        }

        console.log("\nTrying 'gemini-pro'...");
        const modelPro = genAI.getGenerativeModel({ model: "gemini-pro" });
        try {
            const result = await modelPro.generateContent("Test");
            console.log("✅ getGenerativeModel('gemini-pro') worked!");
        } catch (e) {
            console.error("❌ gemini-pro failed:", e.message);
        }

        console.log("\nTrying 'gemini-2.0-flash'...");
        const model2 = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        try {
            const result = await model2.generateContent("Test");
            console.log("✅ getGenerativeModel('gemini-2.0-flash') worked!");
        } catch (e) {
            console.error("❌ gemini-2.0-flash failed:", e.message);
        }

    } catch (error) {
        console.error("\n❌ API Test Failed:", error);
    }
}

testGemini();
