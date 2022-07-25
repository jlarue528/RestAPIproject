const { Sequelize, Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Courses extends Sequelize.model {}
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
        },
        userId: {

        }
    },
    { sequelize });

    return Courses;
}