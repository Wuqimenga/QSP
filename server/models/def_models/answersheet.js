var Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    var answersheet = sequelize.define('answersheet',{
        paperid:{type:DataTypes.INTEGER(11),allowNull:false,primaryKey:true},//全局唯一
        ip:{type:DataTypes.STRING(255),allowNull:false,primaryKey:true},//全局唯一
        anstime: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }, //新建时间：当前时间
    });
    return answersheet;
}
