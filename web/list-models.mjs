
import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const envPath = path.join(__dirname, '.env.local');
let apiKey = "";

try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/NEXT_PUBLIC_GOOGLE_AI_API_KEY=(.+)/);
    if (match) {
        apiKey = match[1].trim();
    }
} catch (e) {
    process.exit(1);
}

async function listModels() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error(await response.text());
            return;
        }

        const data = await response.json();
        if (data.models) {
            data.models.forEach(m => {
                console.log(m.name.replace("models/", ""));
            });
        }
    } catch (e) {
        console.error(e);
    }
}

listModels();
