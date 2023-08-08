const { Command } = require('Commando');
const Currency = require('../../structures/currency/Currency');
module.exports = class MoneyAddCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'add-money',
            aliases: ['money-add', 'add', 'give'],
            group: 'economy',
            memberName: 'add',
            description: `Add ${Currency.textPlural} to a certain user.`,
            details: `Add amount of ${Currency.textPlural} to a certain user.`,
            guildOnly: true,
            whitelist: { roles: true, channels: false },
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [
                {
                    key: 'member',
                    prompt: `what user would you like to give ${Currency.textPlural}?\n`,
                    type: 'member'
                },
                {
                    key: 'currency',
                    label: `amount of ${Currency.textPlural} to add`,
                    prompt: `how many ${Currency.textPlural} do you want to give that user?\n`,
                    type: 'integer'
                }
            ]
        });
    }

    run(msg, { member, currency }) {
        Currency._changeBalance(member.id, currency);
        return msg.embed({
            color: 14845440,
            description: `${msg.author}, successfully added ${Currency.convert(currency)} to ${member.displayName}'s balance.`
        });
    }
};