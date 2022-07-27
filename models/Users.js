const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

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
            type: DataTypes.STRING,
            allowNull: false,
            set(val) {
                const hashedPassword = bcrypt.hashSync(val, 10);
                this.setDataValue('confirmedPassword', hashedPassword);
            },
            validate: {
                notNull: {
                    msg: 'Both passwords must match'
                },
                notEmpty: {
                    msg: 'Please provide a password'
                },
            },
        },
    },
    { sequelize });

    Users.associate = (models) => {
        Users.hasMany(models.Courses, 
            {
                foreignKey: 'userId',
                allowNull: false
            }
        );
    };

    return Users;
}