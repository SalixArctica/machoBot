const fs = require('fs');

const flags = require('./flags')
const config = require('./config');
const navySealCopyPasta = require('./navySealCopyPasta');
const utils = require('./utils');

// list of all public clips, it's in global scope cause multiple files need em
const clips = [
    'better',
    'bonesaw',
    'betterThanYou',
    'brokenPromise',
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

const sendHelpMenu = message => {
    
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
    
    message.channel.send(helpMenu)
    message.channel.send(
        `\n\n_Example_ \n \`!macho yeah\`

    Found a bug? Open an issue on github!
    https://github.com/SalixArctica/machoBot
    `
    )
}

const playRandomClip = message => {
    utils.play(message, clips[Math.floor(Math.random() * clips.length)]);
}

const replyAllFiles = message => {
    const adminIDs = [
        '228373032819752961', //willoh
        '335940553373909002' //peach
    ]

    fs.readdir('./audio', (err, files) => {
        console.log(files);
        console.error(err);
        if(adminIDs.includes(message.member.id)) {
            message.reply(files);
        } else {
            message.reply(`you're not an admin 😖`);
        }
    })
}

const seizeTheMemesOfProduction = message => {
    message.channel.send(flags.ussr[0])
    message.channel.send(flags.ussr[1])
    utils.play(message, 'seizethememesofproduction')
}

const ruleBritannia = message => {
    message.channel.send(flags.uk[0])
    message.channel.send(flags.uk[1])
    message.channel.send(flags.uk[2])
    message.channel.send(flags.uk[3])
    message.channel.send(flags.uk[4])
    utils.play(message, 'rulebritannia')
}

const EightBall = message => {
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

const youSuckReply = message => {
    message.member.createDM().then(dmChannel => {
        dmChannel.send(navySealCopyPasta);
    });
}

const cleanup = message => {
    message.channel.messages.fetch({ limit: 100, before: message.id })
    .then(messages => {
        messages.each(oldMessage => {
            let messageMadeByBot = oldMessage.author.id === message.guild.me.id;
            let messageMeantForBot = oldMessage.content.includes(config.prefix);

            if (messageMadeByBot || messageMeantForBot) {
                utils.deleteMessage(oldMessage);
            }
        })
        utils.deleteMessage(message);

    }).catch(console.error);
}

module.exports = {
    sendHelpMenu,
    playRandomClip,
    replyAllFiles,
    seizeTheMemesOfProduction,
    ruleBritannia,
    youSuckReply,
    EightBall,
    cleanup
};