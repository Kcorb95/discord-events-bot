const { Command } = require('Commando');
const Currency = require('../../structures/currency/Currency');

module.exports = class MoneyRemoveCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'remove-money',
            aliases: [
                'money-remove',
                'rm',
                'remove'
            ],
            group: 'economy',
            memberName: 'remove',
            description: `Remove ${Currency.textPlural} from a certain user.`,
            details: `Remove amount of ${Currency.textPlural} from a certain user.`,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [
                {
                    key: 'member',
                    prompt: `what user would you like to remove ${Currency.textPlural} from?\n`,
                    type: 'member'
                },
                {
                    key: 'currency',
                    label: `amount of ${Currency.textPlural} to remove`,
                    prompt: `how many ${Currency.textPlural} do you want to remove from that user?\n`,
                    type: 'integer'
                }
            ]
        });
    }

    run(msg, { member, currency }) {
        Currency.removeBalance(member.id, currency);
        return msg.embed({
            color: 2817834,
            description: `
			${msg.author}, successfully removed ${Currency.convert(currency)} from ${member.displayName}'s balance.`
        });
    }
};