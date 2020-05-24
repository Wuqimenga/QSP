var Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    var questionnaire = sequelize.define('questionnaire',{
        paperid: {type: DataTypes.INTEGER(11), allowNull: false, primaryKey: true,autoIncrement: true},  //问卷id是在全局唯一，每次新建在已有基础递增，
        papertitle:{type:DataTypes.STRING(255),allowNull:false},
        ispublish:{type:DataTypes.BOOLEAN,allowNull:false},
        userid:{type:DataTypes.INTEGER(11),allowNull:false},
        createtime: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }, //新建时间：当前时间
    });
    return questionnaire;
}
