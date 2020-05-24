module.exports = function (sequelize, DataTypes) {
    var answer = sequelize.define('answer',{
        paperid:{type:DataTypes.INTEGER(11),allowNull:false,primaryKey:true},
        questionid:{type:DataTypes.INTEGER(11),allowNull:false,primaryKey:true},//对于上面问卷的编号
        ip:{type:DataTypes.STRING(255),allowNull:false,primaryKey:true},//全局统一
        selectid:{type:DataTypes.INTEGER(11),allowNull:false,primaryKey:true},//根据问题类型，可以为空
        answer:{type:DataTypes.STRING(255),allowNull:true},//同上
    });
    return answer;
}
