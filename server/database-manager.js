const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('4chan_db_test2', 'root', 'Orion2014!', {
    host: 'localhost',
    dialect: 'mariadb',
    port: 3307
})
async function test(){
    try{
        await sequelize.authenticate();
        console.log('Connection has been established  sucessfully')
    }catch(error){
        console.error('Unable to connect to the database:', error)
    }
}

test()