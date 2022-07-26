const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Courses extends Sequelize.Model {}
    Courses.init({
        title: {
            type: DataTypes.STRING
        },
        description: {
            type: DataTypes.TEXT
        },
        estimatedTime: {
            type: DataTypes.STRING
        },
        materialsNeeded: {
            type: DataTypes.STRING
        }
    },
    { sequelize });

    Courses.associate((models) => {
        Courses.belongsTo(models.Users,
            {
                foreignKey: 'userId',
                allowNull: false
            }
        )
    });

    return Courses;
}