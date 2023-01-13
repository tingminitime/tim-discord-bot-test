import fs from 'node:fs'
import { Client, Collection, Events, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'
import handleCommands from './utils/handleCommands.js'

dotenv.config({ path: './config.env' })

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.commands = new Collection() // add Map()

const commandFolders = fs.readdirSync('./src/commands')

handleCommands(client)
client.handleCommands(commandFolders, './src/commands')

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
  console.log(`Ready! Logged in as ${c.user.tag}`)
})

// Log in to Discord with your client's token
client.login(process.env.TOKEN)
