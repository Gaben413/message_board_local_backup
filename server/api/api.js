const {GetAllThreads, GetThread, GetPost, GetAllPosts, GetAllPostsFromThread, GetAllImages, GetImage, GetAllImagesFromThread, GetPostThread, GetAllThreadsVue, GetThreadDataVue} = require('../database/query-manager')

const settings = require('../settings.json')

const express = require('express')
//const fs = require('fs')
const path = require('path')
const cors = require('cors')

const app = express()
const port = settings['settings']['api_port']

let root_path = settings['settings']['downloads_dir_path'][0]['dir'] + settings['settings']['download_dir_name'];
let thread_folder = root_path + settings['settings']['folder_name'] + '';


let api_start_time = new Date();

app.use(cors())

app.set('json spaces', 40)

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

app.get('/db', async (req, res) => {
    res.send("DB section!")
})

//THREADS
app.get('/db/get_all_threads', async (req, res) => {
    try{
        res.send(await GetAllThreads())
    }catch(err){
        console.log(err)
        res.send('error')
    }
})
app.get('/db/get_thread/:id', async (req, res) => {
    try{
        res.send(await GetThread(parseInt(req.params['id'])))
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})
//soon add threads in favourites

//POSTS
app.get('/db/get_all_posts', async (req, res) => {
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
app.get('/db/get_thread_posts/:id', async (req, res) => {
    try{
        res.send(await GetAllPostsFromThread(parseInt(req.params['id'])))
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})

//IMAGE
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
        let image_name = image_data['i_tim'] + image_data['i_ext']
    
        console.log(image_name)
        
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

//Vue Return
app.get('/vue/get_threads/', async (req, res) => {
    try{
        res.send(await GetAllThreadsVue())
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})
app.get('/vue/get_thread_data/:id', async (req, res) => {
    try{
        res.send(await GetThreadDataVue(parseInt(req.params['id'])))
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})

//Status
app.get('/status', async (req, res) => {
    try{
        let {DirSize} = require('../fetch/download-manager')

        let threads = await GetAllThreads()
        let used_space = await DirSize()

        res.send({
            'total_threads': threads.length,
            'used_space': used_space['megabytes_short'],
            'current_time': new Date(),
            'running_for': GetTimeDifference(api_start_time),
        })
    }catch(err){
        console.log(err)
        res.send(`Error: ${err}`)
    }
})

app.listen(port, () => {
    console.log(`API running on PORT: ${port}\nhttp://localhost:${port}`)
})

function GetTimeDifference(input_date){
    let current_date = new Date()
    let running_time_stamp = current_date.getTime() - input_date.getTime()
    let seconds = Math.floor(running_time_stamp/1000)
    let minutes = Math.floor(seconds/60)
    let hours = Math.floor(minutes/60)

    return `${hours.toString().padStart(2,"0")}:${minutes.toString().padStart(2,"0")}:${seconds.toString().padStart(2,"0")}`
}