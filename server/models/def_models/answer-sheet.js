module.exports = function (sequelize, DataTypes) {
    var answer-sheet = sequelize.define('answer-sheet',{
        paperid:{type:DataTypes.INTEGER,allowNull:false,primaryKey:true},//全局唯一
        ip:{type:DataTypes.INTEGER,allowNull:false,primaryKey:true},//全局唯一
        createtime: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }, //新建时间：当前时间
    });
    return answer-sheet;
}
