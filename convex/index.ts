import { WorkflowManager } from "@convex-dev/workflow";
import { components } from "./_generated/api";
import { GoogleGenAI } from "@google/genai";

export const workflow = new WorkflowManager(components.workflow);

export const genAI = new GoogleGenAI({
	apiKey: process.env.GEMINI_API_KEY,
});

export const TITLES_PER_AGENT = 10;
