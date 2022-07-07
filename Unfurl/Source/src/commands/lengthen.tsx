/* Created by Nik0dev under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command } from "enmity/api/commands";
import { REST } from "enmity/modules/common"
import { sendReply } from "enmity/api/clyde";

export const lengthenCommand: Command = {
	id: "lengthen-command",

	name: "unfurl",
	displayName: "unfurl",

	description: "Annoy people by unfurling your link",
	displayDescription: "Annoy people by unfurling your link",

	type: ApplicationCommandType.Chat,
	inputType: ApplicationCommandInputType.BuiltInText,

	options: [{
		name: "url",
		displayName: "url",

		description: "URL to lengthen",
		displayDescription: "URL to lengthen",

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
	}],

	execute: async function (args, message) {
		var url = args[0].value;

		// Argument checks - A(x56) will take all protocol links, this checks for :// to not accidentially append https:// to protocols
		if (!url.includes("://")) { url = "https://" + url; }

		try {
			sendReply(message?.channel.id ?? "0", `Generating Longlink..`)
			var request = await REST.get(`https://api.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.com/a?url=${url}`);
		} catch {
			sendReply(message?.channel.id ?? "0", "Something went really wrong creating your longlink.")
		}

		if (request.text != "INVALID_URL") {
			if (args[1] && args[1].value) {
				sendReply(message?.channel.id ?? "0", `<${request.text}>`)
				return
			}
			else {
				return {
					content: `<${request.text}>`
				}
			}
		}
		else {
			sendReply(message?.channel.id ?? "0", "Your URL was invalid!")
			return
		}
	}
}
