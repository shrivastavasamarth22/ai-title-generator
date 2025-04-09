import { v } from "convex/values";
import { internalAction } from "./_generated/server";

import { Innertube } from "youtubei.js/web";

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

		console.log(transcriptText);
		return transcriptText;
		// const transcript = await getYoutubeTranscript(args.url);
		// return transcript;
	},
});
