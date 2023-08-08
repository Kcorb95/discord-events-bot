const { Command } = require('Commando');
const guildSettings = require('../../models/GuildSettings');

module.exports = class CreateContestCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'create-contest',
            aliases: ['createcontest', 'contestcreate', 'newcontest', 'cc'],
            group: 'contest',
            memberName: 'create-contest',
            description: 'Registers a contest with the bot',
            guildOnly: true,
            whitelist: { roles: true, channels: false },
            args: [
                {
                    key: 'contestName',
                    prompt: 'What is the name of this contest?\n',
                    type: 'string'
                },
                {
                    key: 'contestChannel',
                    prompt: 'What is the channel for this contest?\n',
                    type: 'channel'
                }
            ]
        });
    }

    async run(msg, { contestName, contestChannel }) {
        const settings = await guildSettings.findOne({ where: { guildID: msg.guild.id } }) || await guildSettings.create({ guildID: msg.guild.id });
        let contests = settings.contest;
        contests[contestName] = { name: contestName, channelID: contestChannel.id };
        settings.contest = contests;
        await settings.save();
        return msg.reply(`New contest created: ${settings.contest[contestName].name} in channel: ${msg.guild.channels.get(settings.contest[contestName].channelID)}`);
    }
};