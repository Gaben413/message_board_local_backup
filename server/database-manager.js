const { Sequelize } = require('sequelize');
const path = require('./config/config.js')

const dbType = 'development'

const sequelize = new Sequelize(path[dbType]['database'], path[dbType]['username'], path[dbType]['password'], {
    host: path[dbType]['host'],
    dialect: path[dbType]['dialect'],
    port: path[dbType]['port']
})

async function main(){
    try{
        await sequelize.authenticate();
        console.log('Connection was a success')
    }catch(error){
        console.error('Unable to connect:', error)
    }
}

main()