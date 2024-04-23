//      CONNECTION
require('dotenv').config()
const { Sequelize } = require('sequelize');

const {logBool} = require('../settings');

const sequelize = new Sequelize(process.env.PG_URL, {
  logging: logBool
});

/*
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({alter: true});
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
})();
*/
module.exports = sequelize;