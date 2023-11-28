'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Image.init({
    i_tim: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    i_filename: DataTypes.STRING,
    i_extension: DataTypes.STRING,
    i_size: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Image',
  });
  return Image;
};