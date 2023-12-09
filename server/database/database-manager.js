//      CONNECTION
require('dotenv').config()
const { Sequelize } = require('sequelize');

const settings = require('../settings.json')

const sequelize = new Sequelize(process.env.DB, process.env.USER, process.env.PASSWORD, {
    host: process.env.HOST,
    dialect: process.env.DIALECT,
    port: process.env.PORT,
    logging: settings['settings']['simple_log_output']
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