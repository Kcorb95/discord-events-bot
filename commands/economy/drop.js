const { Command } = require('Commando');
const { stripIndents } = require('common-tags');
const Currency = require('../../structures/currency/Currency');
const config = require('../../settings.json');

module.exports = class DropCurrencyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'drop',
            aliases: ['dropcurrency'],
            group: 'economy',
            memberName: 'drop',
            description: `Drops some ${Currency.textPlural} for people to pick up.`,
            details: `Drops some ${Currency.textPlural} for people to pick up.`,
            guildOnly: true,
            whitelist: { roles: true, channels: false },
            throttling: {
                usages: 1,
                duration: 480
            },
            args: [
                {
                    key: 'amount',
                    prompt: `How many ${Currency.textPlural} would you like to drop?\n`,
                    type: 'integer'
                },
                {
                    key: 'time',
                    prompt: 'How long should this drop be active for? (IN MINUTES)',
                    type: 'integer'
                }
            ]
        });
    }

    async run(msg, args) {
        let reacted = [];
        const embed = await new this.client.methods.Embed()
            .setColor(14845440)
            .setTitle(':santa:** HO HO HOOO!! **:santa:')
            .setDescription(stripIndents`You notice a present just now appeared in front of you
            
            **React now to unbox ${Currency.convert(args.amount)}** 
            :snowman:`)
            .setFooter(`This drop lasts for ${args.time} minutes`)
            .setThumbnail('https://i.imgur.com/MyXxSAZ.png')
            .setTimestamp();

        const message = await msg.channel.send(embed);
        message.react('386849002492264458');
        const collector = message.createReactionCollector(
            (reaction, user) => reaction.emoji.id === '386849002492264458' && !reacted.includes(user.id) && !user.bot,
            { time: args.time * 60 * 1000 }
        );
        collector.on('collect', (reaction, whydoineedthisthisishorrible, user) => {
            reacted.push(user.id);
            Currency._changeBalance(user.id, args.amount);
        });
        collector.on('end', collected => message.delete());
    }
};