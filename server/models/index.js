const config = require('../../config');
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var username = config.dev.database.username;
var password = config.dev.database.password;//从哪里获取的database
var options = { // TODO -- pull from config
    host: config.dev.database.host,
    dialect: "mysql",
    timezone: "+08:00",
    dialectOptions: {
        charset: "utf8",
        collate: "utf8_general_ci",
        supportBigNumbers: true,
        bigNumberStrings: true
    },
    port: 3306,
    define: {
        freezeTableName: true,
        syncOnAssociation: true,
        timestamps: false,
        underscored: true
    },
};


var client = new Sequelize(config.dev.database.db, username, password, options);//修改代码就可以直接修改数据库的表结构，不用手动在数据库中进行改动，方便在git上面同步，在def_models目录中采用define定义表结构



var models = {};

// read all models and import them into the "db" object
//导入model之后才可以进行增删查改
 fs
    .readdirSync(__dirname + '/def_models')
    .filter(function (file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js');
    })
    .forEach(function (file) {
        var model = client.import(path.join(__dirname + '/def_models', file));
        models[model.name] = model;
    });

Object.keys(models).forEach(function (modelName) {
    if (models[modelName].options.hasOwnProperty('associate')) {
        models[modelName].options.associate(models);
    }
});

module.exports = models;
module.exports.client = client;
