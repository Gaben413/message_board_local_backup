const { Sequelize, Op } = require('sequelize');

//const settings = require('../settings.json')
//let local_api = settings['settings']['local_api'];

const {local_api, api_port} = require('../settings');

//const sequelize = require('./database-manager');

// #region Favourites functions

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

// #endregion

// #region Image functions

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

    if(output.length > 0)
        return output[0];
    else
        return "404";
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

// #endregion

// #region Thread functions

async function AddThread(data){
    const {Thread} = require('./models')

    const thread = await Thread.create({
        t_number: data['t_number'],
        t_board: data['t_board'],
        t_date: data['t_date'],
        t_archived: data['t_archived'],
        t_sub: data['t_sub'],
        t_tag: data['t_tag'],
        t_replies: data['t_replies'],
        t_link: data['t_link']
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

async function ArchiveThread(id){
    const {Thread} = require('./models')

    await Thread.update(
        {
            t_archived: true
        },
        {
            where: {
                t_number: id
            }
        }
    );
    
    return `Thread NO ${id} has been archived`
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

    let output = await Thread.findAll({
        order:[
            ['t_date', 'ASC']
        ],
        raw:true
    });

    return output;
}

async function IsThreadInList(threads_no_list){
    const {Thread} = require('./models')

    let threads = await Thread.findAll({
        where: {
            t_archived: false
        },
        raw: true
    })

    threads.forEach(async element => {
        let result = threads_no_list.includes(element['t_number'])
        //console.log(`Thread NO: ${element['t_number']} | Archived: ${element['t_archived']} | Result: ${result}`)

        if(!result){
            await ArchiveThread(element['t_number'])
        }
    })

    //console.log(threads)
}

async function ThreadExists(id){
    const {Thread} = require('./models')

    let output = await Thread.findOne({
        where: {
            t_number: id
        },
        raw:true
    });

    return output;
}

// #endregion

// #region Post functions

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
        i_tim: data['i_tim'],
        t_number: data['t_number']
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
            t_number: thread_id
        },
        raw:true
    });

    return output;
}

async function GetPostThread(id){
    const {Post} = require('./models')

    let output = await Post.findAll({
        //attributes: ['t_number', 'i_tim'],
        where: {
            t_number: id
        },
        raw:true
    });

    return output[0];
}
//#endregion

// #region Vue Return functions
async function GetAllThreadsVue(){
    const {Thread, Post} = require('./models')

    let output = []

    let threads = await Thread.findAll({raw:true});

    for (let i = 0; i < threads.length; i++) {
        let post = await Post.findAll({
            attributes: ['i_tim', 'p_com'],
            where: {
                t_number: threads[i]['t_number']
            },
            raw:true
        });

        /*
        if(post[0]['i_tim'] == null){
            console.log("Shit")
        }

        let image = await GetImage(post[0]['i_tim'])

        let filename = image['i_tim'] + image['i_ext']
        */

        //let file_path = `${settings['settings']['downloads_dir_path'][0]['dir'] + settings['settings']['download_dir_name'] + settings['settings']['folder_name'] + threads[i]['t_number']}/${filename}`
        let file_path = `http://${local_api}:${api_port}/db/get_image_file/${threads[i]['t_number']}`

        obj_data = {
            "t_number": threads[i]['t_number'],
            "t_sub": threads[i]['t_sub'],
            't_archived': threads[i]['t_archived'],
            't_board': threads[i]['t_board'],
            't_date': threads[i]['t_date'],
            't_link': threads[i]['t_link'],
            'p_com': post[0]['p_com'],
            'filepath': file_path
        }
        
        output.push(obj_data)

    }

    return output;
}

async function GetThreadDataVue(id){
    const {Thread, Post} = require('./models')

    let thread = await Thread.findOne({
        where: {
            t_number: id
        },
        raw:true
    });

    let processed_thread_data = {
        't_number': thread['t_number'],
        't_board': thread['t_board'],
        't_date': thread['t_date'],
        't_archived': thread['t_archived'],
        't_sub': thread['t_sub'],
        't_link': thread['t_link'],
    }

    let posts = await Post.findAll({
        where: {
            t_number: thread['t_number']
        },
        raw:true
    });

    let post_data = []

    for (let i = 0; i < posts.length; i++) {
        let processed_post_data = {
            'key': i,
            'p_number': posts[i]['p_number'],
            'p_date': posts[i]['p_date'],
            'p_name': posts[i]['p_name'],
            'p_link': posts[i]['p_link'],
            'p_com': posts[i]['p_com'],
            'img_data': {
                'i_tim': posts[i]['i_tim'],
                'has_image': posts[i]['i_tim'] != null,
                'file_path': posts[i]['i_tim'] != null ? `http://${local_api}:${api_port}/db/get_image_file/${posts[i]['p_number']}` : null,
            }
        }
        
        post_data.push(processed_post_data)
    }

    let output = {
        'thread': processed_thread_data,
        'posts': post_data
    }

    return output;
}
// #endregion

// #region Black and White Lists

async function Add_BW_List_Entry(data){
    const {BW_List} = require('./models')

    const bw_list = await BW_List.create({
        list_type: data['list_type'],
        tp_number: data['tp_number'],
        comm: data['comm'],
    })

    return bw_list
    //console.log(`${data['list_type']} list created | DATA:\n ${bw_list}`)
}

async function GetBlacklist(){
    const {BW_List} = require('./models')

    let output = await BW_List.findAll({
        where:{
            list_type: "black"
        },
        raw:true
    });

    return output;
}

async function GetWhitelist(){
    const {BW_List} = require('./models')

    let output = await BW_List.findAll({
        where:{
            list_type: "white"
        },
        raw:true
    });

    return output;
}

async function UpdateBW_List(data, id){
    const {BW_List} = require('./models')

    await BW_List.update(
        {
            tp_number: data['tp_number'],
            comm: data['comm'],
        },
        {
            where: {
                bwl_id: id
            }
        }
    );

    return {"status": "success"}

    //console.log(`Updated List of id: ${id}:\nData: ${JSON.stringify(data)}`)
}

async function Delete_BW_List_Entry(id){
    const {BW_List} = require('./models')

    await BW_List.destroy({
        where: {
            bwl_id: id
        }
    })

    return {"message":`Entry ${id} deleted`}
    //console.log(`${data['list_type']} list created | DATA:\n ${bw_list}`)
}

// #endregion

//#region Test Area
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
//#endregion

module.exports = {
    AddImage, AddThread, GetAllThreads, GetImage, GetAllImages, GetAllImagesFromThread, GetThread, GetPostThread, UpdateThread, IsThreadInList, ThreadExists,
    Add_BW_List_Entry,GetBlacklist,GetWhitelist,UpdateBW_List,Delete_BW_List_Entry,
    AddPost, GetPost, GetAllPosts, GetAllPostsFromThread, GetAllThreadsVue, GetThreadDataVue
}