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

  //censor lettuce propaganda
  /* can't edit other users messages
  if(message.content.includes('lettuce') || message.content.includes('3/14/19')) {
    let newStr = message.content.toLowerCase().replace('lettuce wars', 'nothing happened');
    newStr.replace('lettuce', 'the worst cabbage');
    newStr.replace('3/14/19', 'no time in particular');
    newStr.replace('never forget', 'move along citizen');

    message.edit(newStr);
  }
  */
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
client.on('voiceStatusUpdate', (oldMember, newMember) => {

  //check that it is a voice join and in the correct channel
  if(newMember && newMember.voiceChannel == watchedChannel) {
    copsRun(newMember);
  }
});

const copsRun = (newMember) => {
  //does something really dumb and is not recommended
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

//watch for client websocket closing and reopen it;
client.on('disconnect', (msg, code) => {
  if (code === 0) return console.error(msg);
  client.connect();
});

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
