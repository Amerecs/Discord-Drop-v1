const { Client, GatewayIntentBits, Collection, ActivityType, EmbedBuilder } = require('discord.js');

const { REST } = require('@discordjs/rest');

const { Routes } = require('discord-api-types/v9');

const fs = require('fs');

const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMembers
    ]
});

const { token, prefix } = require("./config.js");


client.slashCommand = new Map();
const slashCommand = [];


const commandFiles = fs.readdirSync("slashCommand").filter((file) => file.endsWith(".js"))
for (const file of commandFiles) {
    const command = require(`./slashCommand/${file}`)
    client.slashCommand.set(command.data.name, command)
    slashCommand.push(command.data)
};


const eventsFiles = fs.readdirSync("events").filter((file) => file.endsWith(".js"))
for (const file of eventsFiles) {
    const event = require(`./events/${file}`)
    client.on(event.name, async (...args) => {
        event.execute(client, ...args)
    })
};

const rest = new REST().setToken(token)

client.once("ready", async () => {
    await rest.put(Routes.applicationCommands(client.user.id), { body: slashCommand })
console.log("ready " + client.user.username);
    client.user.setActivity("/drop | Wick Studio", {
type: ActivityType.Playing
});
});

client.login(token)
