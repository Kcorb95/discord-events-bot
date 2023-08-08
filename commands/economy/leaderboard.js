const { oneLine, stripIndents } = require('common-tags');
const { Command, util } = require('Commando');
const moment = require('moment');
require('moment-duration-format');
const Sequelize = require('sequelize');
const Currency = require('../../structures/currency/Currency');
const { PAGINATION_ITEMS } = require('../../settings.json');
const UserProfile = require('../../models/UserProfile');

module.exports = class MoneyLeaderboardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'leaderboard',
            aliases: ['lb'],
            group: 'economy',
            memberName: 'leaderboard',
            description: `Displays the ${Currency.textPlural} members have earned.`,
            details: `Display the amount of ${Currency.textPlural} members have earned in a leaderboard.`,
            guildOnly: true,
            throttling: {
                usages: 2,
                duration: 3
            },
            args: [
                {
                    key: 'page',
                    prompt: 'what page would you like to view?\n',
                    type: 'integer',
                    default: 1
                }
            ]
        });
    }

    async run(msg, { page }) {
        const lastUpdate = await this.client.redis.getAsync('moneyleaderboardreset');
        const cooldown = 30 * 60 * 1000;
        const reset = cooldown - (Date.now() - lastUpdate);
        const money = await this.findCached();
        const paginated = util.paginate(JSON.parse(money), page, Math.floor(PAGINATION_ITEMS));
        let ranking = PAGINATION_ITEMS * (paginated.page - 1);

        for (const user of paginated.items) await this.client.users.get(user.userID); // eslint-disable-line

        return msg.embed({
            color: 3447003,
            description: stripIndents`
				__**${Currency.textSingular.replace(/./, lc => lc.toUpperCase())} leaderboard, page ${paginated.page}**__
				${paginated.items.map(user => oneLine`
					**${++ranking} -**
					${`${this.client.users.get(user.userID).username}#${this.client.users.get(user.userID).discriminator}`}
					(**${Currency.convert(user.currency)}**)`).join('\n')}
				${moment.duration(reset).format('hh [hours] mm [minutes]')} until the next update.`,
            footer: { text: paginated.maxPage > 1 ? `Use ${msg.usage()} to view a specific page.` : '' }
        });
    }

    async findCached() {
        const cache = await this.client.redis.getAsync('moneyleaderboard');
        const cacheExpire = await this.client.redis.ttlAsync('moneyleaderboard');
        if (cacheExpire !== -1 && cacheExpire !== -2) return cache;

        const money = await UserProfile.findAll(
            { where: { userID: { $ne: 'bank' } }, order: Sequelize.literal('currency DESC') }
        );

        await this.client.redis.setAsync('moneyleaderboard', JSON.stringify(money));
        await this.client.redis.expire('moneyleaderboard', 3600);
        return JSON.stringify(money);
    }
};