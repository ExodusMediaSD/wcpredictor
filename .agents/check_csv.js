import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PROJECT_ID = "ggowcpredictor";
const API_KEY = "AIzaSyAVBLnjdM4cV9vBwV27dl6bEc4ZqVjuFBw";
const BASE = "firestore.googleapis.com";

function fetchUsers() {
  return new Promise((resolve, reject) => {
    const url = `https://${BASE}/v1/projects/${PROJECT_ID}/databases/(default)/documents/users?pageSize=300&key=${API_KEY}`;
    https.get(url, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve(JSON.parse(data).documents || []);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    }).on("error", reject);
  });
}

async function main() {
  const docs = await fetchUsers();
  const dbUsers = {};
  for (const doc of docs) {
    const username = doc.name.split("/").pop();
    const secretCode = doc.fields.secretCode ? doc.fields.secretCode.stringValue : null;
    dbUsers[username] = secretCode;
  }

  const csvPath = path.join(__dirname, "..", "user-passwords.csv");
  if (!fs.existsSync(csvPath)) {
    console.error("CSV file does not exist!");
    return;
  }

  const csvContent = fs.readFileSync(csvPath, "utf8");
  const lines = csvContent.trim().split("\n");
  const csvUsers = {};
  
  // Skip header
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(",");
    if (parts.length >= 4) {
      const username = parts[1];
      const password = parts[3];
      csvUsers[username] = password;
    }
  }

  console.log("Comparing CSV vs Firestore...");
  let mismatches = 0;
  for (const [username, csvPass] of Object.entries(csvUsers)) {
    const dbPass = dbUsers[username];
    if (dbPass !== csvPass) {
      console.log(`Mismatch for ${username}: CSV has "${csvPass}", Firestore has "${dbPass}"`);
      mismatches++;
    }
  }

  // Also check if any users in DB are not in CSV (except bruce.logan and george.saad)
  for (const [username, dbPass] of Object.entries(dbUsers)) {
    if (username === "bruce.logan" || username === "george.saad") continue;
    if (!csvUsers[username]) {
      console.log(`User in Firestore but missing from CSV: ${username} (password: ${dbPass})`);
      mismatches++;
    }
  }

  console.log(`\nComparison done. Found ${mismatches} mismatches.`);
}

main().catch(console.error);
