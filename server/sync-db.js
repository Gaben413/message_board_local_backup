(async () => {
    try{
        const database = require('./database-manager')
        const { Favourite, Image, Thread, Post, replies } = require('./models')
        await database.sync({alter: true});
    }catch (error){
        console.log('error has occurred:', error)
    }finally{
        //database.close()
    }

})();