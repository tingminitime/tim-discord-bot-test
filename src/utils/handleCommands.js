import { REST, Routes } from 'discord.js'
import fs from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)

const clientId = ''
const guildId = ''

function handleCommands(client) {
  client.handleCommands = async (commandFolders, path) => {
    console.log('commandFolders', commandFolders)
    client.commandArray = []
    for (const folder of commandFolders) {
      console.log('folder', folder)
      const commandFiles = fs
        .readdirSync(`${path}/${folder}`)
        .filter(file => file.endsWith('.js'))

      for (const file of commandFiles) {
        const commander = await import(`../commands/${folder}/${file}`)
        client.commands.set(commander.command.name, commander)
        client.commandArray.push(commander.command.toJSON())
      }
    }

    const rest = new REST({
      version: 10,
    }).setToken(process.env.TOKEN)

    ;(async () => {
      try {
        console.log(`Started refreshing application (/) commands.`)

        await rest.put(Routes.applicationCommand(clientId), {
          body: client.commandArray,
        })

        console.log(`Successfully reload application (/) commands.`)
      } catch (err) {
        console.error(err)
      }
    })()
  }
}

export default handleCommands
