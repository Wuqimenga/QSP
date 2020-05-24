module.exports = function (sequelize, DataTypes) {
    var options = sequelize.define('options',{
        paperid:{type:DataTypes.INTEGER(11),allowNull:false,primaryKey:true},
        questionid:{type:DataTypes.INTEGER(11),allowNull:false,primaryKey:true},
        selectid:{type:DataTypes.INTEGER(11),allowNull:false,primaryKey:true}, //问题中唯一
        goquestion:{type:DataTypes.INTEGER(11),allowNull:true}, //想同问卷中存在的问题编号
        scontent:{type:DataTypes.STRING(255),allowNull:false},//选项内容不能为空
    });
    return options;
}
