const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class User extends Sequelize.Model {}
    User.init({
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

    User.associate((models) => {
        User.hasMany(models.Courses, 
            {
                foreignKey: 'id',
                allowNull: false
            }
        );
    });

    return User;
}