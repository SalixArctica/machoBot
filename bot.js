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

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('try !macho help');
});

client.on('message', msg => {
  //help menu
  if (msg.content === '!macho help') {
    msg.reply('start command with !macho then any of the following: \n yeah \n cream \n primadonna \n hotdog \n random');
  }

  //if message isn't in a server exit
  if (!msg.guild) return;

  //audio responses from here on
  if (msg.content === '!macho yeah') {
    play(msg, 'yeah');
  }
  else if (msg.content === '!macho justCream') {
    play(msg, 'justTheCream');
  }
  else if (msg.content === '!macho cream') {
    play(msg, 'cream');
  }
  else if(msg.content === '!macho primadonna') {
    play(msg, 'primadonna');
  }
  else if(msg.content === '!macho hotdog') {
    play(msg, 'hotdoggin');
  }
  else if(msg.content === '!macho random') {
    play(msg, clips[Math.floor(Math.random()*clips.length)])
  }
});

client.login(config.token);

const play = (message, file) => {
  // Only try to join the sender's voice channel if they are in one themselves
  if (message.member.voiceChannel) {
    message.member.voiceChannel.join()
      .then(connection => { // Connection is an instance of VoiceConnection
        const clip = connection.playFile(__dirname + '/audio/' + file + '.mp3');
        clip.on('end', () => {
          message.member.voiceChannel.leave();
        })
      })
      .catch(console.log);
  } else {
    message.reply('You need to join a voice channel first!');
  }
}
