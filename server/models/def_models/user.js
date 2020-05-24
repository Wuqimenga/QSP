var bcrypt=require("bcrypt-nodejs");
module.exports = function (sequelize, DataTypes) {
    var user = sequelize.define('user',{
        userid: {type: DataTypes.INTEGER(11), allowNull: false, primaryKey: true,autoIncrement:true},
        username:{type:DataTypes.STRING(255),allowNull:false,unique:true},
        password:{type:DataTypes.STRING(255),allowNull:false,
          set: function (val) {
              // 进行加密（加盐）
              var salt=bcrypt.genSaltSync(10);
              var hash=bcrypt.hashSync(val,salt);
              this.setDataValue('password', hash);
          },
        },
    });
    return user;
}
