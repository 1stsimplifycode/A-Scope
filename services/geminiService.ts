
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getGeminiAnalysis = async (type: 'hint' | 'failure' | 'complexity' | 'resume' | 'project', context: any) => {
  try {
    let prompt = "";
    if (type === 'hint') {
      prompt = `Act as a senior CP coach. Give a subtle hint for "${context.problemTitle}". Problem: ${context.problemDescription}. Current code: ${context.userCode}.`;
    } else if (type === 'failure') {
      prompt = `Analyze why this code failed. Error: ${context.error}. Code: ${context.userCode}. Problem: ${context.problemDescription}.`;
    } else if (type === 'resume') {
      prompt = `Create a professional 'Technical Analyst Profile' for a student named ${context.name}. 
      They have solved problems in topics: ${context.topics.join(', ')}. 
      Their skills include: ${context.skills.join(', ')}. 
      Write a compelling 2-sentence summary and a bulleted list of technical achievements based on these DSA skills.`;
    } else if (type === 'project') {
      prompt = `Evaluate this student project: Name: ${context.projectName}, Stack: ${context.techStack}. Description: ${context.description}. 
      Provide a 'Structural Score' (1-100) and 3 bullet points of critical diagnostic feedback for improvement.`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Analysis unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI Coach.";
  }
};
