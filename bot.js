const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');

const clips = [
  'better',
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
  'yeah'
]

const helpMenu = `type !macho followed by any of the following commands: \n
  help - reopen this menu \n
  random - play a random quote
  \n All of the following play specific clips: \n` + clips.map(clip => {
    return '   ' + clip;
  }).join('\n');

client.on('ready', () => {
  console.log(`\x1b[32m%s\x1b[0m`, `Logged in as ${client.user.tag}!`);
  //client.user.setActivity('performing maintenance');
  client.user.setActivity('try !macho help');
});

client.on('message', message => {
  //check if message was meant for bot otherwise exit
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;
  //if message isn't in a server exit
  if (!message.guild) return;

  //setup args
  const args = message.content.slice(config.prefix.length).split(' ');
  const command = args.shift();

  //help menu
  if (args[0] == 'help' || args.length === 0){
    message.channel.send(helpMenu)
  }
  //play random clip
  else if(args[0] == 'random'){
    play(message, clips[Math.floor(Math.random()*clips.length)]);
  }
  //dumb joke command
  else if(args[0] == 'cops'){


  }
  //play requested clip
  else {
    play(message, args[0]);
  }
});

//listen for voice channel changes
bot.on('voiceStatusUpdate', (oldMember, newMember) => {

  //check that it is a voice join and in the correct channel
  if(newMember && newMember.voiceChannel == watchedChannel) {
    copsRun(newMember);
  }
}

const copsRun = (newMember) => {
  play(message, 'fuzz');
  if(message.member!= newMember) {
    setTimeout(() => {
      message.member.voiceChannel.members.array().forEach(member => {
        member.setVoiceChannel('385158490634846208')
        .then(() => console.log(`attempting to move ${member.displayName}`))
        .catch((err) => console.error(err));
      })
    }, 4000);
  }
}

//login
client.login(config.token);

const play = (message, file) => {
  // Only try to join the sender's voice channel if they are in one themselves
  if (message.member.voiceChannel) {
    message.member.voiceChannel.join()
      .then(connection => {
        const clip = connection.playFile(__dirname + '/audio/' + file + '.mp3');
        clip.on('end', () => { //leave when clip is over
          message.delete()
            .then(msg => console.log(`message deleted from ${msg.author.username}`))
            .catch(console.error);
          message.member.voiceChannel.leave();
        })
      })
      .catch(console.log);
  } else {
    message.reply('You need to join a voice channel first brother!');
  }
}
