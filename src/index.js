require('dotenv').config();
const { Client, Events, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('node:fs');
const path = require('path');

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const commandsPath = path.join(__dirname, 'commands');
const commandsFiles = fs.readdirSync(commandsPath).filter(file => 
	file.endsWith('.js')
);

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

for(const file of commandsFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`Esse comando em ${filePath} está com "data" ou "execute" ausentes!`);
	}
}

// Login do bot
client.once(Events.ClientReady, client => {
	console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.login(TOKEN);

// Listener de interação com o bot
client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isStringSelectMenu()) {
		const selected = interaction.values[0]
		switch (selected) {
			case "javascript":
				await interaction.reply("Documentação do Javascript: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function")
			return
			case "python":
				await interaction.reply("Documentação do Python: https://docs.python.org/3/")
			return
			case "csharp":
				await interaction.reply("Documentação do C#: https://learn.microsoft.com/pt-br/dotnet/csharp/")
			return
			case "discordjs":
				await interaction.reply("Documentação do discord.js: https://discord.js.org/")
			return
			default:
			return
		}
	}

	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error('Comando não encontrado!');
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply("Houve um erro ao executar esse comando!");
	}
});
