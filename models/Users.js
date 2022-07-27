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
            type: DataTypes.VIRTUAL
        },
        confirmedPassword: {
            type: DataTypes.STRING,
            allowNull: false,
            set(val) {
                if (val === this.password) {
                    const hashedPassword = bcrypt.hashSync(val, 10);
                    this.setDataValue('confirmedPassword', hashedPassword);
                }
            },
            validate: {
                notNull: {
                    msg: 'Both passwords must match'
                }
            }
        }
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