//      CONNECTION
require('dotenv').config()
const { Sequelize } = require('sequelize');

const {logBool} = require('../settings');

let dev_mode = false;

const DB_URL = dev_mode ? process.env.PG_URL_DEV : process.env.PG_URL

console.log(`DEV MODE: ${dev_mode ? "ON" : "OFF"}`);

const sequelize = new Sequelize(DB_URL, {
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