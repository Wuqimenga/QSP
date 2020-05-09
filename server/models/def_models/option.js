module.exports = function (sequelize, DataTypes) {
    var option = sequelize.define('option',{
        questionid:{type:DataTypes(10).INTEGER,allowNull:false,primaryKey:true},
        selectid:{type:DataTypes.INTEGER,allowNull:false,primaryKey:true}, //问题中唯一
        goquestion:{type:DataTypes.INTEGER,allowNull:true}, //想同问卷中存在的问题编号
        scontent:{type:DataTypes.STRING,allowNull:true},
    });
    return option;
}
