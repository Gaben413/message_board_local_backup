const { Sequelize } = require('sequelize');
const sequelize = require('./database-manager');

//Favourites
async function AddFavourite(data){
    const {Favourite} = require('./models')
        let date = new Date()

        let formatedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    
        console.log(formatedDate)
        
        const favourite = await Favourite.create({
            f_date: formatedDate,
            f_name: 'Favourite 2'
        })
}

async function GetFavourite(primarykey){
    const {Favourite} = require('./models')

    let output = await Favourite.findAll({
        where: {
            f_id: primarykey
        },
        raw:true
    });

    return output;
}

async function GetAllFavourites(){
    const {Favourite} = require('./models')
    let output = await Favourite.findAll({raw:true});

    return output;
}

async function UpdateFavourite(id, new_name){
    const {Favourite} = require('./models')

    await Favourite.update(
        {
            f_name: new_name
        },
        {
            where: {
                f_id: id
            }
        }
    );
    
    console.log(`Favourite of id: ${id} changed it's name to ${new_name}`)
}

async function DeleteFavourite(id){
    const {Favourite} = require('./models')

    await Favourite.destroy({where:{f_id:id}})

    console.log(`Deleted Favourite of ID ${id}`)
}

//Image
async function AddImage(data){
    const {Image} = require('./models')

    const image = await Image.create({
        i_tim: data['tim'],
        i_filename: data['filename'],
        i_filesize: data['filesize'],
        i_ext: data['ext']
    })
}

//Thread
async function AddThread(data){
    const {Thread} = require('./models')

    const thread = await Thread.create({
        t_number: data['t_number'],
        t_date: data['t_date'],
        t_archived: data['t_archived'],
        t_tag: data['t_tag'],
        t_replies: data['t_replies'],
        t_link: data['t_link'],
        i_tim: data['i_tim']
    })
}

async function UpdateThread(update_data, id){
    const {Thread} = require('./models')

    await Thread.update(
        {
            t_archived: update_data['t_archived'],
            t_replies: update_data['t_replies']
        },
        {
            where: {
                t_number: id
            }
        }
    );
    
    console.log(`Updated Thread of id: ${id}:\nData: ${JSON.stringify(update_data)}`)
}

async function GetThread(id){
    const {Thread} = require('./models')

    let output = await Thread.findAll({
        where: {
            t_number: id
        },
        raw:true
    });

    return output[0];
}

async function GetAllThreads(){
    const {Thread} = require('./models')

    let output = await Thread.findAll({raw:true});

    return output;
}

//Add Thread to Favourite
async function AddThreadToFavourite(thread_id, favourite_id){
    const {favourite_has_thread} = require('./models')

    const fht = await favourite_has_thread.create({
        f_id: favourite_id,
        t_number: thread_id
    })

    console.log(`Added Thread (${thread_id}) to favourite (${favourite_id})`)

}

async function GetAllThreadsInFavourites(id){
    const {Favourite, Thread, favourite_has_thread} = require('./models')
    const { QueryTypes } = require('sequelize');

    const [results, meta] = await sequelize.query(
        "SELECT * FROM favourites INNER JOIN favourite_has_threads ON 1 = 1", 
        {
            type:QueryTypes.SELECT
        }
    );

    return results;
}

(async () => {
    try {
        let date = new Date()

        let formatedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

        //AddFavourite()
        //console.log(await GetFavourite(1))
        //console.log(await GetAllFavourites())
        //UpdateFavourite(1, "Fav Threads")
        //DeleteFavourite(2)
        //AddImage({"tim": "12341234", "filename": "test_filename", "filesize": 34, "ext": ".png"})
        //AddThread({"t_number": "12341243","t_date": formatedDate,"t_archived": false,"t_tag": 'tag',"t_replies": 5,"t_link": "https://127.0.0.1/","i_tim": "12341234"})
        //UpdateThread({"t_archived": true, "t_replies":25}, 12341243)
        //console.log(await GetThread(12341243))
        //console.log(await GetAllThreads())
        //AddThreadToFavourite(12341243, 1)
        console.log(await GetAllThreadsInFavourites(1))
    }catch (error){
        console.error('Error has occured:', error)
    }
})();
