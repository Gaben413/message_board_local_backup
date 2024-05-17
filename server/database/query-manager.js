const { Sequelize, Op } = require('sequelize');

//const settings = require('../settings.json')
//let local_api = settings['settings']['local_api'];

const {local_api, api_port} = require('../settings');

//const sequelize = require('./database-manager');

// #region USER functions
async function AddUser(data){
    const {User} = require('./models');

    const user = await User.create({
        username: data['username'],
        password: data['password'],
        admin: data['admin'],
        verified: data['verified'],
    })

    return {
        status: "User Successfully Created",
        data: {
            username: user['username'],
            password: user['password'],
            admin: user['admin'],
            verified: user['verified'],
        }
    }
}

async function GetUser(username){
    const {User} = require('./models');

    const user = await User.findOne({
        where:{
            username: username
        },
        raw:true
        
    });

    return user;
}

async function UsernameExists(username){
    const {User} = require('./models');

    const user = await User.findOne({
        where:{
            username: username
        },
        raw:true
        
    });

    return user != null;
}
// #endregion

// #region Blacklist
async function AddTokenBlacklist(token){
    const {Token_Blacklist} = require('./models');

    let date = new Date();

    const token_blacklist = await Token_Blacklist.create({
        token: token,
        creation_date: date
    })

    return token_blacklist;
}
async function GetAllTokenBlacklist(){
    const {Token_Blacklist} = require('./models');

    const blacklist_array = await Token_Blacklist.findAll({
        raw: true
    })

    return blacklist_array;
}
async function GetTokenBlacklist(id){
    const {Token_Blacklist} = require('./models');

    const blacklist_row = await Token_Blacklist.findOne({
        where: {
            blacklist_id: id
        },
        raw: true
    })

    return blacklist_row;
}
async function AutoDeleteTokenBlacklist(){
    const {Token_Blacklist} = require('./models');
    const WEEK_MS = 1209600000; //This should be about two weeks in mileseconds

    let overtime_array = [];

    const tb = await GetAllTokenBlacklist();
    let current_date = new Date().getTime();

    //console.log(`Current Date: ${current_date}`);

    tb.forEach(async row => {
        let time_difference = new Date().getTime() - new Date(row['creation_date']).getTime();
        /*
        console.log(`Row Date:     ${new Date(row['creation_date']).getTime()}`);
        console.log(`Diference Date: ${time_difference}`);
        */
        if(time_difference >= WEEK_MS){
            overtime_array.push(row['blacklist_id']);

            await Token_Blacklist.destroy({
                where: {
                    blacklist_id: row['blacklist_id']
                }
            })
        }
    })

    if(overtime_array.length > 0)
        return overtime_array
    else
        return null;
}
// #endregion

// #region Favourites functions

async function AddFavourite(data){
    const {Favourite} = require('./models')

    let date = new Date()

    let formatedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

    console.log(formatedDate)
    
    const favourite = await Favourite.create({
        f_name: data['f_name'],
        f_description: data['f_description'],
        f_date: formatedDate,
        user_id: data['user_id']
    })

    return {
        status: "success",
        user: data['user_id'],
        entry: favourite
    };
}

async function GetAllFavourites(user_id){
    const {Favourite} = require('./models')

    let output = await Favourite.findAll({
        where:{
            user_id: user_id
        },
        raw:true
    });

    return output;
}

async function GetFavouriteEntry(user_id, f_id){
    const {Favourite} = require('./models')

    let output = await Favourite.findOne({
        where: {
            user_id: user_id,
            f_id: f_id
        },
        raw:true
    });

    return output;
}

async function UpdateFavouriteEntry(user_id, f_id, data){
    const {Favourite} = require('./models')

    let response = await Favourite.update(
        {
            f_name: data['f_name'],
            f_description: data['f_description'],
        },
        {
            where: {
                user_id: user_id,
                f_id: f_id
            }
        }
    );

    if(response == 1)
        return {
            status: 'success',
            user: user_id,
            f_id: f_id,
            updated_data: data
        }
    else
        return {
            status: 'failure'
        }
    
    //console.log(`Favourite of id: ${id} changed it's name to ${new_name}`)
}
async function DeleteFavouriteEntry(user_id, f_id){
    const {Favourite} = require('./models')

    console.log(`USER: ${user_id} | ID: ${f_id}`)

    let output = await Favourite.destroy({
        where:{
            user_id: user_id,
            f_id: f_id
        }
    })

    console.log(output)
    if(output == 1)
        return {
            status: 'successfully deleted entry',
            data: {
                user_id: user_id,
                f_id: f_id
            }
        }
    else
        return {
            status: 'failure to delete entry',
            data: {
                user_id: user_id,
                f_id: f_id
            }
        }
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
    
    console.log(`Updated Thread of id: ${id}\nData: ${JSON.stringify(update_data)}`)
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
async function GetAllThreadsVue(page = 1, display_amount = 5, order_organize = '1'){
    const {Thread, Post} = require('./models')

    let output = []

    let order_arr = []

    switch(order_organize){
        case 1:
            order_arr = ['t_number', 'DESC'], ['t_archived', 'ASC']
            break;
        case 2:
            order_arr = ['t_date', 'ASC']
            break;
        case 3:
            order_arr = ['t_date', 'DESC']
            break;
        case 4:
            order_arr = ['t_board', 'ASC']
            break;
        case 5:
            order_arr = ['t_number', 'ASC']
            break;
        case 6:
            order_arr = ['t_sub', 'ASC']
            break;
        case 7:
            order_arr = ['t_replies', 'ASC']
            break;
        case 8:
            order_arr = ['t_replies', 'DESC']
            break;
        default:
            order_arr = []
    }
    

    let threads = await Thread.findAll({
        order:[
            order_arr
        ],
        offset: ((page-1)*display_amount),
        limit: display_amount,
        raw:true
    });

    for (let i = 0; i < threads.length; i++) {
        let post = await Post.findAll({
            attributes: ['i_tim', 'p_com'],
            where: {
                t_number: threads[i]['t_number']
            },
            order:[
                ['p_date', 'ASC']
            ],
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
            't_replies_amount': threads[i]['t_replies'],
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
        't_replies_amount': thread['t_replies']
    }

    let posts = await Post.findAll({
        where: {
            t_number: thread['t_number']
        },
        order:[
            ['p_date', 'ASC']
        ],
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
    AddUser, GetUser, UsernameExists,
    AddFavourite, GetAllFavourites, GetFavouriteEntry, UpdateFavouriteEntry, DeleteFavouriteEntry,
    AddTokenBlacklist, GetAllTokenBlacklist, GetTokenBlacklist, AutoDeleteTokenBlacklist,
    AddImage, AddThread, GetAllThreads, GetImage, GetAllImages, GetAllImagesFromThread, GetThread, GetPostThread, UpdateThread, IsThreadInList, ThreadExists,
    Add_BW_List_Entry,GetBlacklist,GetWhitelist,UpdateBW_List,Delete_BW_List_Entry,
    AddPost, GetPost, GetAllPosts, GetAllPostsFromThread, GetAllThreadsVue, GetThreadDataVue
}