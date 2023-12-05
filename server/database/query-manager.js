const { Sequelize, Op } = require('sequelize');
//const sequelize = require('./database-manager');
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

async function GetImage(id){
    const {Image} = require('./models')

    let output = await Image.findAll({
        where: {
            i_tim: id
        },
        raw:true
    });

    return output[0];
}

async function GetAllImages(){
    const {Image} = require('./models')

    let output = await Image.findAll({raw:true});

    return output;
}

async function GetAllImagesFromThread(thread_id){
    const {Image, Post} = require('./models')

    let output_posts = await Post.findAll({
        attributes:['i_tim'],
        where: {
            t_number: thread_id,
            i_tim: {
                [Op.ne]:null
            }
        },
        raw:true
    });

    let processed = [];
    output_posts.forEach(element=>{
        processed.push(element['i_tim'])
    })
    
    let output_images = await Image.findAll({
        where: {
            i_tim: {
                [Op.in]: processed
            }
        },
        raw:true
    });
    
    return output_images;
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
        t_com: data['t_com'],
        i_tim: data['i_tim']
    })

    console.log(`Thread Data ahs been inserted: ${thread}`)
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

//POST
async function AddPost(data){
    const {Post} = require('./models')

    const thread = await Post.create({
        p_number: data['p_number'],
        p_date: data['p_date'],
        p_name: data['p_name'],
        p_tag: data['p_tag'],
        p_replies: data['p_replies'],
        p_link: data['p_link'],
        p_com: data['p_com'],
        p_tim: data['p_tim'],
        i_tim: data['i_tim']
    })

    console.log(`Post Data has been inserted: ${thread}`)
}

async function GetPost(id){
    const {Post} = require('./models')

    let output = await Post.findAll({
        where: {
            p_number: id
        },
        raw:true
    });

    return output[0];
}

async function GetAllPosts(){
    const {Post} = require('./models')

    let output = await Post.findAll({raw:true});

    return output;
}

async function GetAllPostsFromThread(thread_id){
    const {Post} = require('./models')

    let output = await Post.findAll({
        where: {
            t_number: id
        },
        raw:true
    });

    return output;
}

//Add Thread to Favourit
/*
//Favourites system will be on hold until proper association is integrated
async function AddThreadToFavourite(thread_id, favourite_id){
    const {favourite_has_thread} = require('./models')

    const fht = await favourite_has_thread.create({
        f_id: favourite_id,
        t_number: thread_id
    })

    console.log(`Added Thread (${thread_id}) to favourite (${favourite_id})`)

}
*/
/*
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
        //console.log(await GetAllThreadsInFavourites(1))
    }catch (error){
        console.error('Error has occured:', error)
    }
})();
*/

module.exports = {AddImage, AddThread, GetImage, GetAllImages, GetAllImagesFromThread, GetThread, UpdateThread, AddPost, GetPost, GetAllPosts}