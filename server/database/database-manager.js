//      CONNECTION
require('dotenv').config()
const { Sequelize } = require('sequelize');

const settings = require('../settings.json')
let logBool = (() => {
  if(settings['settings']['simple_log_output']) return false 
  else return console.log
})();

const sequelize = new Sequelize(process.env.PG_URL);

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