const { Command } = require('Commando');
const { stripIndents } = require('common-tags');

const guildSettings = require('../../models/GuildSettings');

module.exports = class SubmitCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'submit',
            aliases: ['submission', 'contest'],
            group: 'contest',
            memberName: 'submit',
            description: 'Submit a contest entry through Tsuyu',
            details: `Submit a contest entry through Tsuyu`,
            throttling: {
                usages: 1,
                duration: 60
            }
        });
    }

    async run(msg) {
        const guild = this.client.guilds.get('217402245250154498'); // A-SS guild ID

        const settings = await guildSettings.findOne({ where: { guildID: guild.id } }) || await guildSettings.create({ guildID: guild.id });
        const contests = settings.contest;
        let index = 1;
        let contestsArray = [];
        await msg.say('Which contest is this submission for?');
        let contestList = '';
        for (const key of Object.keys(contests)) {
            contestList += `** ${index}) __${key}__**\n`;
            contestsArray.push(key);
            index++;
        }
        msg.reply(contestList);
        let response;
        let responded;
        while (!responded) {
            const responses = await msg.author.dmChannel.awaitMessages(msg2 => msg2.author.id === msg.author.id, {
                max: 1,
                time: 60 * 1000
            });

            if (!responses || responses.size !== 1) {
                return null;
            }

            response = responses.first();

            if (isNaN(response.content) || response.content > contestsArray.length || response.content <= 0) await response.reply(stripIndents`**Unknown response.**\nPlease enter the number for the contest you wish to submit to.\n**Awaiting input...**`);
            else responded = true;
        }
        const contest = contests[contestsArray[response.content - 1]];
        await msg.say(`Please enter your submission for contest, **${contest.name}**`);
        let submission;
        let submitted;
        while (!submitted) {
            const responses = await msg.author.dmChannel.awaitMessages(msg2 => msg2.author.id === msg.author.id, {
                max: 1,
                time: 60 * 1000
            });

            if (!responses || responses.size !== 1) {
                return null;
            }

            submission = responses.first();
            submitted = true;

            const channel = guild.channels.get(contest.channelID);
            if (submission.attachments.array().length > 0)
                await channel.send(`Entry: ${msg.author}`, submission.attachments.first());
            else
                await channel.send(`Entry: ${msg.author}\n${submission.content}`);

            return msg.reply('__**Your submission has been sent!!**__');
        }
    }
};