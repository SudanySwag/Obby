const Anthropic = require("@anthropic-ai/sdk");
 
const GITHUB_PAT = process.env.GITHUB_PAT;
const VOICEMONKEY_TOKEN = process.env.VOICEMONKEY_TOKEN;
const VOICEMONKEY_DEVICE = process.env.VOICEMONKEY_DEVICE || "bedroom";
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
 
async function fetchGitHubFile(path) {
  const url = `https://api.github.com/repos/SudanySwag/Notes/contents/${encodeURIComponent(path)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_PAT}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return Buffer.from(data.content, "base64").toString("utf-8");
}
 
async function fetchGitHubFolder(path) {
  const url = `https://api.github.com/repos/SudanySwag/Notes/contents/${encodeURIComponent(path)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_PAT}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  if (!res.ok) return [];
  const items = await res.json();
  if (!Array.isArray(items)) return [];
 
  const files = [];
  for (const item of items) {
    if (item.type === "file" && (item.name.endsWith(".md") || item.name.endsWith(".txt"))) {
      const content = await fetchGitHubFile(item.path);
      if (content) {
        files.push({ name: item.name, path: item.path, content });
      }
    }
  }
  return files;
}
 
async function generateWithClaude(systemPrompt, userContent) {
  const client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  const message = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: "user", content: userContent }],
  });
  return message.content[0].text;
}
 
async function announceOnAlexa(text) {
  const url = `https://api-v2.voicemonkey.io/announcement`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token: VOICEMONKEY_TOKEN,
      device: VOICEMONKEY_DEVICE,
      text: text,
    }),
  });
  const data = await res.json();
  return data;
}
 
module.exports = {
  fetchGitHubFile,
  fetchGitHubFolder,
  generateWithClaude,
  announceOnAlexa,
};
