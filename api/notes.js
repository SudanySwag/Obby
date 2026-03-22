const GITHUB_PAT = process.env.GITHUB_PAT;
 
function encodePath(path) {
  return path.split('/').map(encodeURIComponent).join('/');
}
 
async function listGitHubContents(path) {
  const url = `https://api.github.com/repos/SudanySwag/Notes/contents/${encodePath(path)}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${GITHUB_PAT}`, Accept: "application/vnd.github.v3+json" },
  });
  if (!res.ok) {
    const err = await res.text();
    return { error: `${res.status} ${err}`, path, url };
  }
  const data = await res.json();
  if (Array.isArray(data)) {
    return data.map((item) => ({ name: item.name, type: item.type, path: item.path, size: item.size }));
  }
  return { name: data.name, type: data.type, path: data.path, size: data.size, contentPreview: Buffer.from(data.content, "base64").toString("utf-8").slice(0, 500) };
}
 
module.exports = async function handler(req, res) {
  try {
    const root = await listGitHubContents("");
    const mainFile = await listGitHubContents("MAIN.md");
    const projectsFolder = await listGitHubContents("Projects");
    const inProgressFolder = await listGitHubContents("Projects/In Progress");
 
    res.status(200).json({
      root,
      mainFile,
      projectsFolder,
      inProgressFolder,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};