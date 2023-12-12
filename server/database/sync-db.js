(async () => {
    try{
        const database = require('./database-manager')
        const { Favourite, Image, Thread, Post } = require('./models')
        await database.sync();
    }catch (error){
        console.log('error has occurred:', error)
    }finally{
        //database.close()
    }

})();