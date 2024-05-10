require('dotenv').config()
const {
    AddUser, GetUser, UsernameExists,
    AddTokenBlacklist, GetAllTokenBlacklist, GetTokenBlacklist,
    GetAllThreads, GetThread, GetPost, GetAllPosts, GetAllPostsFromThread, GetAllImages, GetImage, GetAllImagesFromThread, GetPostThread,
    GetAllThreadsVue, GetThreadDataVue, ThreadExists,Delete_BW_List_Entry,
    Add_BW_List_Entry,GetBlacklist,GetWhitelist,UpdateBW_List
} = require('../database/query-manager')

//const settings = require('../settings.json')

const {root_path, thread_folder, folder_name, api_port} = require('../settings')

let AdmZip = require('adm-zip');

const express = require('express')
const jwt = require('jsonwebtoken')
//const fs = require('fs')
const path = require('path')
const cors = require('cors');
const { threadId } = require('worker_threads');

const app = express()
//const port = settings['settings']['api_port']

//let root_path = settings['settings']['downloads_dir_path'][0]['dir'] + settings['settings']['download_dir_name'];
//let thread_folder = root_path + settings['settings']['folder_name'] + '';

const SECRET = process.env.SECRET;

let api_start_time = new Date();

app.use(cors())

app.set('json spaces', 40)
app.use(express.json())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/db', async (req, res) => {
    res.send("DB section!")
})

async function verifyJWT(req, res, next){
    const token = req.headers['board-access-token'];

    const blacklist = await GetAllTokenBlacklist();
    const index = blacklist.find(row => {
        return row['token'] == token;
    })

    console.log(`Index: ${index}`)
    if(index !== undefined) return res.status(401).end();

    jwt.verify(token, SECRET, (err, decoded) => {
        if(err) return res.status(401).end();

        req.userId = decoded.userId;
        next();
    })
}

app.get('/test', verifyJWT, (req, res) => {
    console.log(req.userId + ' made the call');
    res.json({status: "It worked"});
})

// #region USER
app.post('/login', async (req, res) => {
    console.log("Checking if user exists");
    if(await UsernameExists(req.body['username'])){
        console.log("Getting user");
        const user = await GetUser(req.body['username']);

        console.log("Checkking if credentials are right");
        if(user['username'] === req.body['username'] && user['password'] === req.body['password']){
            const token = jwt.sign({userId: 1}, SECRET, {});
            return res.json({auth: true, token});
        }
    }
    res.status(401).end();
})
app.get('/is_logged', verifyJWT, async (req, res) => {
    try{
        return res.json({auth: true, status: "Success"});
    }catch(err){
        return res.json({auth: false, status: "Failure"})
    }
})
app.post('/logout', async (req, res) => {
    const token = req.headers['board-access-token'];

    //console.log(req.headers)
    //console.log(req.body)

    console.log(`Logging out Token: ${token}`);

    if(token === undefined) return res.json({success: false, response: "Headers empty"});

    let response = await AddTokenBlacklist(token);

    console.log(response);

    return res.json({
        success: true,
        response: response
    })
})
// #endregion

// #region THREADS
app.get('/db/get_all_threads', verifyJWT, async (req, res) => {
    try{
        res.send(await GetAllThreads())
    }catch(err){
        console.log(err)
        res.send('error')
    }
})
app.get('/db/get_thread/:id', verifyJWT, async (req, res) => {
    try{
        res.send(await GetThread(parseInt(req.params['id'])))
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})
//soon add threads in favourites

// #endregion

// #region POSTS
app.get('/db/get_all_posts', verifyJWT, async (req, res) => {
    res.send(await GetAllPosts())
})
app.get('/db/get_post/:id', async (req, res) => {
    try{
        res.send(await GetPost(parseInt(req.params['id'])))
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})
app.get('/db/get_thread_posts/:id', verifyJWT, async (req, res) => {
    try{
        res.send(await GetAllPostsFromThread(parseInt(req.params['id'])))
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})

// #endregion

// #region IMAGE
app.get('/db/get_all_image', async (req, res) => {
    res.send(await GetAllImages())
})
app.get('/db/get_image/:id', async (req, res) => {
    try{
        res.send(await GetImage(parseInt(req.params['id'])))
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})
app.get('/db/get_thread_image/:id', async (req, res) => {
    try{
        res.send(await GetAllImagesFromThread(parseInt(req.params['id'])))
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})
app.get('/db/get_image_file/:id', async (req, res) => {
    try{
        let post_data = await GetPost(parseInt(req.params['id']))
        let image_tim = post_data['i_tim']
        let path = thread_folder + post_data['t_number']
    
        let image_data = await GetImage(image_tim);
        console.log(image_data)
        let image_name = image_data['i_tim'] + image_data['i_ext']
        
        if(image_data == "404"){
            console.log(__dirname);
            console.log(path);
            path = __dirname
            image_name = "404.png"
        }

        //console.log(image_name)
        
        const options = {
            root: path
        };
        
        res.sendFile(image_name, options, (err) => {
            if(err){
                console.error(err)
            }else{
                console.log('Sent:', image_name)
            }
        })
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }

})

// #endregion

// #region Vue Return

app.get('/vue/get_threads/', verifyJWT, async (req, res) => {
    try{
        res.send(await GetAllThreadsVue())
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})
app.get('/vue/get_threads/:page', verifyJWT, async (req, res) => {
    try{

        let page = parseInt(req.params['page']);
        let display_amount = req.headers['display-amount'];
        let order_organize = parseInt(req.headers['order-organize']);

        console.log(`PAGE: ${page}\nDisplay Amount: ${display_amount}\nOrder Organize: ${order_organize}`);

        res.send(await GetAllThreadsVue(page, display_amount, order_organize))
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})
app.get('/vue/get_thread_data/:id', verifyJWT, async (req, res) => {
    try{
        res.send(await GetThreadDataVue(parseInt(req.params['id'])))
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})


// #endregion

// #region Black and White lists
app.post('/bw_lists/create_bw_entry', verifyJWT, async (req, res) => {
    try{
        console.log(req.body)

        let response = await Add_BW_List_Entry(req.body)

        res.send(response)
        
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})
app.get('/bw_lists/get_all_blacklist', verifyJWT, async (req, res) => {
    try{
        res.send(await GetBlacklist())
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})
app.get('/bw_lists/get_all_whitelist', verifyJWT, async (req, res) => {
    try{
        res.send(await GetWhitelist())
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})
app.put('/bw_lists/update_blacklist', verifyJWT, async (req, res) => {
    try{
        console.log(req.body)

        //res.send("Data received")

        res.send(await UpdateBW_List({
            tp_number: req.body['tp_number'],
            comm: req.body['comm'],
        }, req.body['id']))

    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})
app.delete('/bw_lists/delete_entry/:id', verifyJWT, async (req, res) => {
    try{
        let response = await Delete_BW_List_Entry(parseInt(req.params['id']))

        //res.send("Data received")

        res.send(response)

    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})
// #endregion

// #region Utilities
app.get('/status', async (req, res) => {
    try{
        let {DirSize} = require('../fetch/download-manager')

        let threads = await GetAllThreads()
        let used_space = await DirSize()

        res.send({
            'api_running': true,
            'total_threads': threads.length,
            'used_space': used_space['megabytes_short'],
            'running_for': GetTimeDifference(api_start_time),
            'api_start_timestamp': api_start_time.getTime()
        })
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})

//Return file
app.get('/file/:id', verifyJWT, async (req, res) => {
    try{
        let thread_id = req.params['id'];

        if(await ThreadExists(thread_id) != null){
            console.log(`Thread ${thread_id} Exists`)
        }else{
            console.log(`Thread ${thread_id} Doesn't Exists`)
            return res.send({
                'status':"Thread Does not Exist"
            })
        }

        let file_path = thread_folder+thread_id

        let zip = new AdmZip();

        let fileName = `thread_${thread_id}_backup.zip`
        let fileType = "application/zip"
        zip.addLocalFolder(file_path, `/thread_${thread_id}_images`)

        if(req.headers['get-comments'] == 'true'){
            const content = await GetAllPostsFromThread(thread_id)
            zip.addFile(`thread_${thread_id}_comments.json`, Buffer.from(JSON.stringify(content), "utf8"), "entry comment goes here")
        }


        let willSendThis = zip.toBuffer();
        
        res.writeHead(200, {
            'Content-Disposition': `attachment; filename="${fileName}"`,
            'Content-Type': fileType,
        })

        res.end(willSendThis);

    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})

//Return file
app.get('/manual_fetch/', verifyJWT, async (req, res) => {
    try{
        const {main} = require('../manual_fetch');
        console.log("Fetching");
        let response = await main();

        res.json({
            "status":'EXECUTING MANUAL FETCH',
            "response": response
        })
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})

// #endregion

app.listen(api_port, () => {
    console.log(`API running on PORT: ${api_port}\nhttp://localhost:${api_port}`)
})

function GetTimeDifference(input_date){
    let current_date = new Date()
    let running_time_stamp = current_date.getTime() - input_date.getTime()
    let seconds = Math.floor(running_time_stamp/1000)
    let minutes = Math.floor(seconds/60)
    let hours = Math.floor(minutes/60)

    return `${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`
}