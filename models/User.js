const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class User extends Sequelize.model {}
    User.init({
        firstName: {
            type: DataTypes.STRING
        },
        lastName: {
            type: DataTypes.STRING
        },
        emailAddress: {
            type: DataTypes.STRING
        },
        password:  {
            type: DataTypes.STRING
        }
    },
    { sequelize });

    return User;
}