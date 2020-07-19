const Discord = require('discord.js')
const client = new Discord.Client()
const config = require('./config.json')
const path = require('path')
const flags = require('./flags')

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
  >>> **help** - reopen this menu \n
  **random** - play a random quote
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
		`command \u001b[32m${command}\u001b[0m from \u001b[36m${
			message.member.displayName
		}\u001b[0m in server \u001b[35m${
			message.guild.name
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
	} else if (command == 'cleanup') {
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
