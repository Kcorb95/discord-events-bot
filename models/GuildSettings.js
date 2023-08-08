const { DataTypes, Model } = require('sequelize');
const Database = require('../structures/PostgreSQL');

class GuildSettings extends Model {
}

GuildSettings.init({
    guildID: DataTypes.STRING,
    contest: {
        type: DataTypes.JSONB(),
        defaultValue: {}
    }
}, { sequelize: Database.db });

module.exports = GuildSettings;