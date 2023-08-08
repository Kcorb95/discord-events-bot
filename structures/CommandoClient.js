const { Client } = require('Commando');

const Database = require('./PostgreSQL');
const Redis = require('./redis');
const Raven = require('raven');

const { SENTRY_TOKEN } = require('../settings.json');

class CommandoClient extends Client {
    constructor(options) {
        super(options);
        this.database = Database.db;
        this.redis = Redis.db;

        Database.start();
        Redis.start();

        Raven.config(SENTRY_TOKEN).install();
    }
}

module.exports = CommandoClient;