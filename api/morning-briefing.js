const { fetchGitHubFile, fetchGitHubFolder, generateWithAI, announceOnAlexa, fetchWorkoutOfTheDay } = require("./_lib/helpers");
 
module.exports = async function handler(req, res) {
  try {
    const [mainFile, currentProjects, workout] = await Promise.all([
      fetchGitHubFile("MAIN.md"),
      fetchGitHubFolder("Projects/In Progress"),
      fetchWorkoutOfTheDay(),
    ]);
    const projectSummaries = currentProjects.map((f) => `### ${f.name}\n${f.content}`).join("\n\n");
    const notesContent = `## Daily Notes (main)\n${mainFile || "No daily notes found."}\n\n## Current Projects\n${projectSummaries || "No current projects found."}\n\n## Today's Workout\n${workout}`;

    const systemPrompt = `You are a personal assistant generating a morning briefing for Alexa to speak aloud. Keep it concise, warm, and actionable — under 60 seconds of speaking time (roughly 150 words). Structure: greet Mohammed, summarize today's key priorities based on active projects and recent daily notes, highlight any deadlines or blockers, mention today's workout briefly, and end with an encouraging note. Do NOT use markdown, bullet points, or special characters — this will be spoken aloud by Alexa. Use natural conversational language.`;
    const alexaResult = await announceOnAlexa(briefing);
    res.status(200).json({ success: true, briefing, alexa: alexaResult });
  } catch (error) {
    console.error("Morning briefing error:", error);
    res.status(500).json({ error: error.message });
  }
};
