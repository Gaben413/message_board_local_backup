'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Thread extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Model.Thread.hasOne(Model.Image, {
        foreignKey: 'i_tim'
      });
    }
  }
  Thread.init({
    t_number: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    t_archived: DataTypes.BOOLEAN,
    t_tag: DataTypes.STRING,
    t_replies: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Thread',
  });
  return Thread;
};