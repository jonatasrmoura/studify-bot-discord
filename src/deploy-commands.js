require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('path');

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;

const commandsPath = path.join(__dirname, 'commands');
const commandsFiles = fs.readdirSync(commandsPath).filter(file => 
	file.endsWith('.js')
);

const commands = [];

for (const file of commandsFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "10" }).setToken(TOKEN);

(async () => {
  try {
    console.log(`Resentando ${commands.length} comandos...`);

    // PUT
    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
        body: commands
      }
    );
    console.log('Comandos registrados com sucesso!');
  } catch (error) {
    console.error(error);
  }
})();
