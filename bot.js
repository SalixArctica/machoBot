const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const commands = require('./commands');
const utils = require('./utils');

client.on('ready', () => {
    let userCount = 0
    client.guilds.cache.forEach(guild => (userCount += guild.memberCount))

    console.log(
        `${client.user.tag} \u001b[32;1mready\x1b[0m on \u001b[35;1m${client.guilds.cache.size}\u001b[0m servers and serving \u001b[36;1m${userCount}\u001b[0m users!`
    )
    //client.user.setActivity('performing maintenance');
    client.user.setActivity('try !macho help')
})

client.on('message', message => {
    //check if message was meant for bot otherwise exit
    if (!message.content.startsWith(config.prefix) || message.author.bot) return
    //if message isn't in a server exit
    if (!message.guild) return

    //setup args
    const args = message.content.slice(config.prefix.length).split(' ')
    const command = args[1].toLowerCase()

    console.log(
        `command \u001b[32m${command}\u001b[0m from \u001b[36m${message.member.displayName
        }\u001b[0m in server \u001b[35m${message.guild.name
        }\u001b[0m at \u001b[33m${new Date().toISOString()}\u001b[0m`
    )

    switch(command) {
        case 'help':
            commands.sendHelpMenu(message);
            break;
        case 'random':
            commands.playRandomClip(message);
            break;
        case 'admin':
            commands.replyAllFiles(message);
            break;
        case 'seizethememesofproduction':
            commands.seizeTheMemesOfProduction(message);
            break;
        case 'rulebritannia':
            commands.ruleBritannia(message);
            break;
        case '8ball':
            commands.EightBall(message);
            break;
        case 'yousuck':
            commands.youSuckReply(message);
            break;
        case 'cleanup':
            commands.cleanup(message);
            break;
        default:
            utils.play(message, command);
    }
})

//watch for client websocket closing and reopen it;
client.on('disconnect', (msg, code) => {
    if (code === 0) return console.error(msg)
})

//login
client.login(config.token)

