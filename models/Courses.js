const { Sequelize, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Course extends Sequelize.Model {}
    Course.init({
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

    Course.associate((models) => {
        Course.belongsTo(models.Users,
            {
                foreignKey: 'id',
                allowNull: false
            }
        )
    });

    return Course;
}