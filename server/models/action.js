<<<<<<< HEAD
//增删改查
const _model = module.exports = {};
_model.findAndCountAll = async function (sequelize, condition) {
  return await sequelize.findAndCountAll(condition);
}

_model.findAll = async function (sequelize, condition) {
  return await sequelize.findAll(condition);
}

_model.findOne = async function (sequelize, condition) {
  return await sequelize.findOne(condition)
}

_model.findById = async function (sequelize, id) {
  return await sequelize.findOne({
    where: {
      id: id
    }
  });
};




_model.create = async function (sequelize, model) {
  return await sequelize.create(model);
};


_model.update = async function (sequelize, setStatement, condition) {
  return await sequelize.update(setStatement, condition);
}

_model.deleteAll = async function (sequelize, condition) {
  return await sequelize.destroy(condition);
}

_model.insertAll = async function (sequelize, articles) {
  return await sequelize.bulkCreate(articles);
}
_model.count= async function (sequelize, condition) {
  return await sequelize.count(condition);
}

_model.build = function (sequelize,articles) {
  return sequelize.build(articles);
}
=======
//增删改查
const _model = module.exports = {};
const Op = Sequelize.Op;
_model.findAndCountAll = async function (sequelize, condition) {
  return await sequelize.findAndCountAll(condition);
}

_model.findAll = async function (sequelize, condition) {
  return await sequelize.findAll(condition);
}

_model.findOne = async function (sequelize, condition) {
  return await sequelize.findOne(condition)
}

_model.findById = async function (sequelize, id) {
  return await sequelize.findOne({
    where: {
      id: id
    }
  });
};

_model.findByname = async function (sequelize, papertitle){  // 模糊查询
  return await sequelize.findAll({
    where: {
      papertitle: {
        [Op.like]:'%' +papertitle + '%'
      }
    },
  })
}

_model.create = async function (sequelize, model) {
  return await sequelize.create(model);
};

// UPDATE bannars_bannar SET rank=2 WHERE id IN ('0','1')
_model.update = async function (sequelize, setStatement, condition) {
  return await sequelize.update(setStatement, condition);
}

_model.deleteAll = async function (sequelize, condition) {
  return await sequelize.destroy(condition);
}

_model.insertAll = async function (sequelize, articles) {
  return await sequelize.bulkCreate(articles);
}
_model.count= async function (sequelize, condition) {
  return await sequelize.count(condition);
}

_model.build = function (sequelize,articles) {
  return sequelize.build(articles);
}

>>>>>>> 9762527b9daf8fb0a87369b1eb7040513cb71a86
