import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { genAI, TITLES_PER_AGENT } from ".";
import { z } from "zod";

export const storytellingAgent = internalAction({
	args: { summary: v.string() },
	handler: async (ctx, args) => {
		const AgentSchema = z.object({
			titles: z.array(z.string()),
		});

		// Set up the system prompt and user content
		const prompt = `You are an expert YouTube title creator specializing in personal journey narratives. Your titles:
- Use powerful transformation narratives ("How I went from X to Y")
- Include specific, relatable starting points and impressive endpoints
- Create curiosity gaps that make viewers want to click
- Incorporate numbers and timeframes when relevant
- Use emotional triggers and achievement markers
- Stay authentic while being attention-grabbing
- Are between 40-70 characters long for optimal visibility

Examples of great titles:
"How I Went From $0 to $20k/Month as a Self-Taught Developer"
"My Journey: Junior Dev to Tech Lead in 24 Months"
"From Retail Worker to Software Engineer: My 6-Month Story"

Generate ${TITLES_PER_AGENT} compelling, story-driven titles that follows these principles and feel authentic.
Format your response as valid JSON with a single 'titles' array containing string elements.

User summary: ${args.summary}`;

		// Call the Gemini model
		const response = await genAI.models.generateContent({
			model: "gemini-2.5-pro-exp-03-25",
			contents: prompt,
		});
		const text = response.text;

		if (!text) {
			throw new Error("No response from Gemini.");
		}

		try {
			// Extract JSON from the response text
			const jsonMatch =
				text.match(/```json\n([\s\S]*?)\n```/) ||
				text.match(/{[\s\S]*}/) ||
				text.match(/\[\s*".*"\s*\]/);

			const jsonContent = jsonMatch
				? jsonMatch[0].replace(/```json\n|```/g, "")
				: text;
			const parsed = JSON.parse(jsonContent);

			// Validate the response against our schema
			const validatedData = AgentSchema.parse(parsed);
			return validatedData.titles;
		} catch (error) {
			console.error("Failed to parse response:", error);
			console.log("Raw response:", text);
			throw new Error("Failed to generate titles from Google GenAI");
		}
	},
});
