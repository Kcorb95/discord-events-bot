const { Command } = require('Commando');
const { stripIndents } = require('common-tags');
const Currency = require('../../structures/currency/Currency');

module.exports = class MoneyInfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'money',
            aliases: ['bal', 'balance', 'currency', '$', '$$$', '$$'],
            group: 'economy',
            memberName: 'money',
            description: `Displays the ${Currency.textPlural} you have earned.`,
            details: `Displays the ${Currency.textPlural} you have earned.`,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [
                {
                    key: 'member',
                    prompt: `whose ${Currency.textPlural} would you like to view?\n`,
                    type: 'member',
                    default: ''
                }
            ]
        });
    }

    async run(msg, args) {
        const member = args.member || msg.author;
        const money = await Currency.getBalance(member.id);

        if (args.member) {
            if (money === null) {
                return msg.embed({
                    color: 3447003,
                    description: `${msg.author}, ${member.displayName} has no ${Currency.textPlural} in their bag yet.`
                });
            }
            return msg.embed({
                color: 3447003,
                description: stripIndents`
				${member.displayName} has ${Currency.convert(money)} in their bag
				Sugoi!!`
            });
        } else {
            if (money === null) {
                return msg.embed({
                    color: 3447003,
                    description: stripIndents`
					${msg.author}, your bag feels empty. :c 
					You haven't collected any ${Currency.textPlural} yet!`
                });
            }
            return msg.embed({
                color: 2817834,
                description: stripIndents`
				${msg.author}, you have ${Currency.convert(money)} in your bag.
				Sugoi!!`
            });
        }
    }
};