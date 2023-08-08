const { DataTypes, Model } = require('sequelize');
const Database = require('../structures/PostgreSQL');

class UserProfile extends Model {
}

UserProfile.init({
    userID: DataTypes.STRING,
    inventory: {
        type: DataTypes.STRING,
        defaultValue: '[]'
    },
    currency: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    }
}, { sequelize: Database.db });

module.exports = UserProfile;