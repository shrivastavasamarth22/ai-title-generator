import { v } from "convex/values";
import { internalAction } from "./_generated/server";

import { Innertube } from "youtubei.js/web";

import { GoogleGenAI } from "@google/genai";

export const getYoutubeTranscript = internalAction({
	args: {
		url: v.string(),
	},
	handler: async (ctx, args) => {
		const videoId = args.url.split("v=")[1];
		const youtube = await Innertube.create({
			lang: "en",
			location: "US",
			retrieve_player: false,
		});
		const info = await youtube.getInfo(videoId);
		const transcript = await info.getTranscript();
		const transcriptText = transcript.transcript.content?.body?.initial_segments
			.map((segment) => segment.snippet.text ?? "")
			.join(" ");

		if (!transcriptText) {
			throw new Error("Transcript not found or empty.");
		}
		return transcriptText;
	},
});

export const generateSummary = internalAction({
	args: {
		transcript: v.string(),
	},
	handler: async (ctx, args) => {
		const genAI = new GoogleGenAI({
			apiKey: process.env.GEMINI_API_KEY,
		});

		const response = await genAI.models.generateContent({
			model: "gemini-2.5-pro-exp-03-25",
			contents:
				"You are a helpful assistant who needs to summarize the following transcript from a youtube video. Please provide a few paragraphs that explain the content of the video and also provide a lot of keywords that I could use to improve SEO. Just begin with the summary. Please output in markdown formart. Here is the transcript: \n\n" +
				args.transcript,
		});

		if (!response || !response.text) {
			throw new Error("No response from Gemini.");
		}

		return response.text;
	},
});
