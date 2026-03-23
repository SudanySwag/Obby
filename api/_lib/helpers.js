const GITHUB_PAT = process.env.GITHUB_PAT;
const VOICEMONKEY_TOKEN = process.env.VOICEMONKEY_TOKEN;
const VOICEMONKEY_DEVICE = process.env.VOICEMONKEY_DEVICE || "bedroom";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
 
async function fetchGitHubFile(path) {
  const url = `https://api.github.com/repos/SudanySwag/Notes/contents/${path.split('/').map(encodeURIComponent).join('/')}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${GITHUB_PAT}`, Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return Buffer.from(data.content, "base64").toString("utf-8");
}
 
async function fetchGitHubFolder(path) {
  const url = `https://api.github.com/repos/SudanySwag/Notes/contents/${path.split('/').map(encodeURIComponent).join('/')}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${GITHUB_PAT}`, Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) return [];
  const items = await res.json();
  if (!Array.isArray(items)) return [];
  const files = [];
  for (const item of items) {
    if (item.type === "file" && (item.name.endsWith(".md") || item.name.endsWith(".txt"))) {
      const content = await fetchGitHubFile(item.path);
      if (content) files.push({ name: item.name, path: item.path, content });
    } else if (item.type === "dir") {
      // Recursively fetch files from subdirectories
      const subFiles = await fetchGitHubFolder(item.path);
      files.push(...subFiles);
    }
  }
  return files;
}
 
async function generateWithAI(systemPrompt, userContent) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ parts: [{ text: userContent }] }],
      generationConfig: { maxOutputTokens: 1024 },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${err}`);
  }
  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}
 
async function announceOnAlexa(text) {
  const res = await fetch("https://api-v2.voicemonkey.io/announcement", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: VOICEMONKEY_TOKEN, device: VOICEMONKEY_DEVICE, text }),
  });
  return await res.json();
}

async function fetchWorkoutOfTheDay() {
  try {
    const res = await fetch("https://www.hybridcalisthenics.com/wotd");
    if (!res.ok) return "Unable to fetch today's workout.";
    const html = await res.text();

    // Extract workout exercises from the HTML
    const workoutRegex = /# \w+day[\s\S]*?(?=#{1,2} |$)/gi;
    const matches = html.match(workoutRegex);

    if (!matches) return "No workout found for today.";

    // Parse the workout section
    const workoutText = matches[0];
    const exercises = [];

    // Extract exercise names and sets
    const exerciseRegex = /([A-Z][a-zA-Z\s]+)\s*\((\d+-\d+\s+Sets)\)/g;
    let match;
    while ((match = exerciseRegex.exec(workoutText)) !== null) {
      exercises.push(`${match[1]}: ${match[2]}`);
    }

    if (exercises.length === 0) return "No exercises found for today's workout.";

    return `Today's workout: ${exercises.join(", ")}.`;
  } catch (error) {
    console.error("Error fetching workout:", error);
    return "Unable to fetch today's workout.";
  }
}
 
module.exports = { fetchGitHubFile, fetchGitHubFolder, generateWithAI, announceOnAlexa, fetchWorkoutOfTheDay };
