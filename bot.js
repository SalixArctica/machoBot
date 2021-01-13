const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const path = require('path')
const flags = require('./flags')
const { kMaxLength } = require('buffer')

const clips = [
    'better',
    'bonesaw',
    'betterThanYou',
    'brokenPromise',
    'cannotHandle',
    'cream',
    'hate',
    'hogan',
    'hot',
    'hotdoggin',
    'iAmCream',
    'inAction',
    'justTheCream',
    'lies',
    'megaPowers',
    'news',
    'notHappy',
    'primadonna',
    'promises',
    'rules',
    'stylin',
    'top',
    'unstoppable',
    'yeah',
]

const clipsList = clips
    .map(clip => {
        return '   **' + clip + '**'
    })
    .join('\n')

const helpMenu =
    `type **!macho** followed by any of the following commands:
  >>> 
  **help** - reopen this menu
  **random** - play a random quote
  **cleanup** - remove any posts from the bot and any calls to it within the last 100 messages
  \n All of the following play specific clips: \n` + clipsList

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

    if (command == 'help' || args.length === 0) {
        message.channel.send(helpMenu)
        message.channel.send(
            `\n\n_Example_ \n \`!macho yeah\`

        Found a bug? Open an issue on github!
        https://github.com/Tankcaster/machoBot
        `
        )
    } else if (command == 'random') {
        play(message, clips[Math.floor(Math.random() * clips.length)])
    } else if (command == 'seizethememesofproduction') {
        message.channel.send(flags.ussr[0])
        message.channel.send(flags.ussr[1])
        play(message, command)
    } else if (command == 'rulebritannia') {
        message.channel.send(flags.uk[0])
        message.channel.send(flags.uk[1])
        message.channel.send(flags.uk[2])
        message.channel.send(flags.uk[3])
        message.channel.send(flags.uk[4])
        play(message, command)
    } else if (command == '8ball') {
        let choice = Math.floor(Math.random() * 20);
        eightBallOptions = [
            'As I see it, yes.',
            'Ask again later.',
            'Better not tell you now.',
            'Cannot predict now.',
            'Concentrate and ask again.',
            'Don’t count on it.',
            'It is certain.',
            'It is decidedly so.',
            'Most likely.',
            'My reply is no.',
            'My sources say no.',
            'Outlook not so good.',
            'Outlook good.',
            'Reply hazy, try again.',
            'Signs point to yes.',
            'Very doubtful.',
            'Without a doubt.',
            'Yes.',
            'Yes – definitely.',
            'You may rely on it.',
        ]
        message.channel.send(eightBallOptions[choice]);
    }
    else if (command == 'yousuck') {
        message.member.createDM().then(dmChannel => {
            dmChannel.send(`What the fuck did you just fucking say about me, you little bitch? I'll have you know I graduated top of my class in the Navy Seals, and I've been involved in numerous secret raids on Al-Quaeda, and I have over 300 confirmed kills. I am trained in gorilla warfare and I'm the top sniper in the entire US armed forces. You are nothing to me but just another target. I will wipe you the fuck out with precision the likes of which has never been seen before on this Earth, mark my fucking words. You think you can get away with saying that shit to me over the Internet? Think again, fucker. As we speak I am contacting my secret network of spies across the USA and your IP is being traced right now so you better prepare for the storm, maggot. The storm that wipes out the pathetic little thing you call your life. You're fucking dead, kid. I can be anywhere, anytime, and I can kill you in over seven hundred ways, and that's just with my bare hands. Not only am I extensively trained in unarmed combat, but I have access to the entire arsenal of the United States Marine Corps and I will use it to its full extent to wipe your miserable ass off the face of the continent, you little shit. If only you could have known what unholy retribution your little "clever" comment was about to bring down upon you, maybe you would have held your fucking tongue. But you couldn't, you didn't, and now you're paying the price, you goddamn idiot. I will shit fury all over you and you will drown in it. You're fucking dead, kiddo.`);
        });
    }
    else if (command == 'cleanup') {

        message.channel.messages.fetch({ limit: 100, before: message.id })
            .then(messages => {
                messages.each(oldMessage => {
                    let messageMadeByBot = oldMessage.author.id === message.guild.me.id;
                    let messageMeantForBot = oldMessage.content.includes(config.prefix);

                    if (messageMadeByBot || messageMeantForBot) {
                        deleteMessage(oldMessage)
                    }
                })
                deleteMessage(message);

            }).catch(console.error);
    }
    //play requested clip
    else {
        play(message, command)
    }
})

//watch for client websocket closing and reopen it;
client.on('disconnect', (msg, code) => {
    if (code === 0) return console.error(msg)
})

//login
client.login(config.token)

const play = (message, file) => {
    // Only try to join the sender's voice channel if they are in one themselves

    if (message.member.voice.channel) {
        message.member.voice.channel
            .join()
            .then(connection => {
                connection.on('error', console.error)
                const clip = connection.play(
                    path.join(__dirname, '/audio/', file + '.mp3'),
                    { volume: 0.6 }
                )

                clip.on('error', err => {
                    console.error(err)
                })

                clip.on('speaking', speaking => {
                    if (!speaking) {
                        //leave when clip is over
                        message.delete().catch(console.error)

                        connection.disconnect()
                    }
                })
            })
            .catch(console.error)
    } else {
        message.reply('You need to join a voice channel first brother!')
    }
}

const deleteMessage = (message) => {
    if (message.deletable) {
        message.delete().catch(console.error);
    }
}
