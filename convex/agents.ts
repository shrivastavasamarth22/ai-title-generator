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

export const theoAgent = internalAction({
	args: { summary: v.string() },
	handler: async (ctx, args) => {
		const AgentSchema = z.object({
			titles: z.array(z.string()),
		});

		// Set up the system prompt and user content
		const prompt = `You are an expert YouTube title creator specializing in tech content. Your titles should follow these specific characteristics:

1. Title Structure:
- Length: Aim for 40-60 characters
- Use parentheses () for additional context or clarification
- Incorporate quotation marks when referencing statements or claims
- Use ellipsis (...) strategically for suspense

2. Emotional Elements:
- Include dramatic capitalization for emphasis (e.g., "INSANE", "TERRIFIED")
- Use strong emotional words: "screwed up", "hyped", "incredible"
- Create urgency with words like "just", "new", "forever"
- Add personal touch with "My", "I", "Why I"

3. Content Patterns:
- Name-drop relevant tech brands/companies (OpenAI, Google, TypeScript, etc.)
- Reference current tech trends and controversies
- Include unexpected comparisons or outcomes
- Use parenthetical clarifications for context
- Create curiosity gaps that make viewers want to click

4. Style Guidelines:
- Start with strong verbs or declarative statements
- Use sentence fragments for impact
- Include numbers when relevant
- Add question marks for engaging titles
- Use "just" to create immediacy

Examples of tone and style:
"[Tech Company] just changed forever"
"[Technology] is INSANE (here's why)"
"Why [Tech Product] Actually Won"
"[Tech Topic] just got dangerously good"
"The Most Important [Tech Thing] in [Context]"

Real Example titles from Theo:

- A breakdown of style solutions for 2025
- My current stack
- I was wrong (OpenAI's image gen is a game changer)
- OpenAI just had the craziest fundraise ever
- it's time for a change.
- I ranked every AI based on vibes
- Microsoft and OpenAI are breaking up?
- Android just changed forever
- Vercel screwed up (breaking down the Next.js CVE)
- AI images just got dangerously good (RIP diffusion??)
- Google won. (Gemini 2.5 Pro is INSANE)
- Why I won't build a framework
- Why Github Actually Won
- OpenAI's new API is 200x more expensive than competition
- The most important function in my codebase
- My Thoughts On "Vibe Coding" (And Prime)
- Fixing T3 Chat's Biggest Problem (me)
- "90% of code will be written by AI in the next 3 months" - Claude CEO
- OpenAI is TERRIFIED (this is absurd)
- Tanner just fixed forms (I'm so hyped)
- There's a new best OSS model and it's...weird
- TypeScript just changed forever
- The Fastest SQL Database Ever Made
- Lynx is incredible (deep dive into Tiktok's React Native killer)
- AI Models: A Race To The Bottom
- AI chat apps are driving me insane
- Is Electron really that bad?

Generate ${TITLES_PER_AGENT} titles that feel authentic while maintaining high engagement potential. Avoid clickbait but create genuine curiosity. Focus on tech industry developments, programming, AI, and developer tools. Format your response as valid JSON with a single 'titles' array containing string elements.

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
