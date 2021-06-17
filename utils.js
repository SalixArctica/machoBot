const path = require('path');

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

module.exports = { play, deleteMessage };