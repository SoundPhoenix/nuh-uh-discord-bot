// register-commands.js
import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load commands
const commands = [];
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const { default: command } = await import(`./src/commands/${file}`);
  if (command?.data) {
    commands.push(command.data.toJSON());
  }
}

// Register commands with Discord
const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

try {
  console.log('Registering slash commands...');
  await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands },
  );
  console.log('✅ Slash commands registered.');
} catch (err) {
  console.error('❌ Failed to register commands:', err);
}
