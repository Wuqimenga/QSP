const questionnaires = require('../models').questionnaires
module.exports = function (sequelize, DataTypes) {
    var question = sequelize.define('question',{
        parered:{type:DataTypes.INTEGER(10),allowNull:false,primaryKey:true}, //所属问卷 1：N
        questionid: {type: DataTypes.INTEGER(10), allowNull: false, primaryKey: true}, //问题编号，在自身问卷中唯一
        questiontitle:{type:DataTypes.STRING(255),allowNull:false},
        type:{type:DataTypes.INTEGER,allowNull:false}, //单选0，多选1，填空2
        isMust:{type:DataTypes.BOOLEAN,allowNull:false}
        min:{type:DataTypes.INTEGER,allowNull:true}, //单选，填空则为0
        max:{type:DataTypes.INTEGER,allowNull:true},//单选，填空则为0
    });
    return question;
}


