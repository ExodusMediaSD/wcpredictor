import https from "https";

const PROJECT_ID = "ggowcpredictor";
const API_KEY = "AIzaSyAVBLnjdM4cV9vBwV27dl6bEc4ZqVjuFBw";
const BASE = "firestore.googleapis.com";

function createTom() {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      fields: {
        displayName: { stringValue: "Tom Walker" },
        isAdmin: { booleanValue: false },
        joinedAt: { stringValue: new Date().toISOString() },
        secretCode: { stringValue: "Placeholder123" },
        totalPoints: { integerValue: "0" }
      }
    });

    const options = {
      hostname: BASE,
      path: `/v1/projects/${PROJECT_ID}/databases/(default)/documents/users/tom.walker?key=${API_KEY}`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        if (res.statusCode === 200) {
          resolve({ ok: true, data });
        } else {
          resolve({ ok: false, status: res.statusCode, data });
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  console.log("Adding tom.walker to Firestore...");
  const result = await createTom();
  if (result.ok) {
    console.log("Successfully created tom.walker in Firestore!");
  } else {
    console.error(`Failed to create user: HTTP ${result.status} - ${result.data}`);
  }
}

main();
