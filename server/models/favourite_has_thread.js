'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class favourite_has_thread extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Model.favourite_has_thread.hasOne(Model.Thread, {
        foreignKey: 't_number'
      })
      Model.favourite_has_thread.hasOne(Model.Favourite, {
        foreignKey: 'f_id'
      })
    }
  }
  favourite_has_thread.init({
    f_id: DataTypes.INTEGER,
    t_number: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'favourite_has_thread',
  });
  return favourite_has_thread;
};