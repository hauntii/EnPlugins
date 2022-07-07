/* Created by Nik0dev under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command } from "enmity/api/commands";
import { REST } from "enmity/modules/common"
import { sendReply } from "enmity/api/clyde";

export const shortenCommand: Command = {
	id: "shorten-command",

	name: "furl",
	displayName: "furl",

	description: "Furl your link into a snail",
	displayDescription: "Furl your link into a snail",

	type: ApplicationCommandType.Chat,
	inputType: ApplicationCommandInputType.BuiltInText,

	options: [{
		name: "url",
		displayName: "url",

		description: "URL to shorten",
		displayDescription: "URL to shorten",

		type: ApplicationCommandOptionType.String,
		required: true
	},
	{
		name: "whisper",
		displayName: "whisper",

		description: "Whisper the URL to you",
		displayDescription: "Whisper the URL to you",

		type: ApplicationCommandOptionType.Boolean,
		required: false
	},
	{
		name: "alias",
		displayName: "alias",

		description: "Alias for your shortlink",
		displayDescription: "Alias for your shortlink",

		type: ApplicationCommandOptionType.String,
		required: false
	}],

	execute: async function (args, message) {

		var url = args[0].value;
		var alias = args[args.findIndex(x => x.name === 'alias')].value ?? null;
		var whisper = args[args.findIndex(x => x.name === 'whisper')];

		// Argument checks - tinysnails will NOT take protocol links, this checks for http to validate urls that for some reason dont already have it
		if (!url.startsWith("http")) { url = "https://" + url; }

		const reqBody = { url: "https://tny-snls.xyz/api/snails", body: { "url": url, "slug": alias } }

		try {
			sendReply(message?.channel.id ?? "0", `Generating Shortlink..`)
			var request = await REST.post(reqBody);
		}
		catch (err) {
			if (err.body["error"] == "invalid data") {
				sendReply(message?.channel.id ?? "0", `Couldn't create your shortlink. Invalid URL.`)
			} else if (err.body["error"] == "alias already exists") {
				sendReply(message?.channel.id ?? "0", `Couldn't create your shortlink. That alias is already taken.`)
			} else {
				sendReply(message?.channel.id ?? "0", `Something went really wrong creating your shortlink.`)
			}
			return
		}

		const shortenedURL = "https://tny-snls.xyz/s/" + request.body["alias"]

		if (whisper && whisper.value) {
			sendReply(message?.channel.id ?? "0", `<${shortenedURL}>`)
			return
		}
		else {
			return {
				content: `<${shortenedURL}>`
			}
		}
	}
}
