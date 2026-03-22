const { fetchGitHubFile, fetchGitHubFolder, generateWithClaude, announceOnAlexa } = require("../_lib/helpers");
 
module.exports = async function handler(req, res) {
  try {
    // Fetch main daily file and current projects
    const [mainFile, currentProjects] = await Promise.all([
      fetchGitHubFile("main.md"),
      fetchGitHubFolder("project/current"),
    ]);
 
    const projectSummaries = currentProjects
      .map((f) => `### ${f.name}\n${f.content}`)
      .join("\n\n");
 
    const notesContent = `## Daily Notes (main)\n${mainFile || "No daily notes found."}\n\n## Current Projects\n${projectSummaries || "No current projects found."}`;
 
    const systemPrompt = `You are a personal assistant generating an evening check-in for Alexa to speak aloud.
Keep it concise and reflective — under 60 seconds of speaking time (roughly 150 words).
Structure: greet Mohammed for the evening, reflect on what was accomplished today based on daily notes
and project progress, acknowledge what went well, gently note areas for improvement or things
to carry forward to tomorrow, and end with a calming, positive note to wind down the day.
Do NOT use markdown, bullet points, or special characters — this will be spoken aloud by Alexa.
Use natural conversational language.`;
 
    const checkin = await generateWithClaude(systemPrompt, notesContent);
 
    // Send to Alexa
    const alexaResult = await announceOnAlexa(checkin);
 
    res.status(200).json({
      success: true,
      checkin,
      alexa: alexaResult,
    });
  } catch (error) {
    console.error("Evening check-in error:", error);
    res.status(500).json({ error: error.message });
  }
};
