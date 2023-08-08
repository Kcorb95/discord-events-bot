const fs = require('fs');
const path = require('path');
const request = require('request-promise');
const winston = require('winston');

exports.run = async (bot, message) => { // eslint-disable-line
    if (message.channel.type === 'dm' && !message.author.bot) {
        if (message.attachments.array().length > 0) return bot.owners[0].send(`\`${message.author.username}#${message.author.discriminator} (${message.author.id})\` -- ${message.attachments.first().url}`);
        return bot.owners[0].send(`\`${message.author.username}#${message.author.discriminator} (${message.author.id})\` -- ${message.content}`);
    }
};