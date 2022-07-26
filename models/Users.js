const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Users extends Sequelize.Model {}
    Users.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
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

    Users.associate((models) => {
        Users.hasMany(models.Courses, 
            {
                foreignKey: 'userId',
                allowNull: false
            }
        );
    });

    return Users;
}