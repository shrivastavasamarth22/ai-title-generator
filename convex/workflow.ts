import { workflow } from ".";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { mutation } from "./_generated/server";

export const kickoffTitleGenerationWorkflow = mutation({
	args: {
		url: v.string(),
	},
	handler: async (ctx, args) => {
		await workflow.start(ctx, internal.workflow.generateTitleWorkflow, {
			url: args.url,
		});
	},
});

export const generateTitleWorkflow = workflow.define({
	args: { url: v.string() },
	handler: async (step, args) => {
		const transcript: string = await step.runAction(
			internal.transcripts.getYoutubeTranscript,
			{
				url: args.url,
			},
			{ retry: { maxAttempts: 2, initialBackoffMs: 100, base: 2 } }
		);

		const summary: string = await step.runAction(
			internal.transcripts.generateSummary,
			{
				transcript: transcript,
			}
		);

		const titles: string[] = await step.runAction(
			internal.agents.storytellingAgent,
			{
				summary: summary,
			}
		);

		console.log("Generated titles:", titles);

		return titles;
	},
});
