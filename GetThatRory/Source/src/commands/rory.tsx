/* Created by Nik0dev under the GNU GENERAL PUBLIC LICENSE. Do not remove this line. */
import { ApplicationCommandInputType, ApplicationCommandOptionType, ApplicationCommandType, Command } from "enmity/api/commands";
import { REST } from "enmity/modules/common"
import { sendReply } from "enmity/api/clyde";

export const roryCommand: Command = {
	id: "rory-command",

	name: "rory",
	displayName: "rory",

	description: "Get some cute rory pics",
	displayDescription: "Get some cute rory pics",

	type: ApplicationCommandType.Chat,
	inputType: ApplicationCommandInputType.BuiltInText,

	options: [{
		name: "id",
		displayName: "id",

		description: "ID of a Rory",
		displayDescription: "ID of a Rory",

		type: ApplicationCommandOptionType.Integer,
		required: false
	},
	{
		name: "whisper",
		displayName: "whisper",

		description: "Whisper the Rory to you",
		displayDescription: "Whisper the Rory to you",

		type: ApplicationCommandOptionType.Boolean,
		required: false
	}],

	execute: async function (args, message) {

		var id = args[args.findIndex(x => x.name === 'id')];
		var whisper = args[args.findIndex(x => x.name === 'whisper')];

		// Argument checks

		try {
			var request = await REST.get(`https://rory.cat/purr/${id?.value ?? ""}`);
		} catch {
			sendReply(message?.channel.id ?? "0", "Couldn't get your rory.. oh no..")
		}

		let image = request.body["url"];
		let color = "0x" + Math.floor(Math.random() * 16777215).toString(16);

		const embed = {
			type: 'rich',
			title: `Rory`,
			image: {
				proxy_url: image,
				url: image,
				width: 2048,
				height: 2048
			},
			footer: {
				text: `Rory #${request.body["id"]} • Rory.cat`
			},
			color: color
		}

		if (!whisper) {
			sendReply(message?.channel.id ?? "0", { embeds: [embed] })
			return
		}
		else {
			return {
				content: image
			}
		}
	}
}
