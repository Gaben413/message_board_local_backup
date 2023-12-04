const axios = require('axios');
const {AddImage, AddThread, GetImage, GetThread, UpdateThread} = require('../database/query-manager')

let board_name = 'co';

let url = `https://a.4cdn.org/${board_name}/catalog.json`;

const search_text = "bcb";

let thread_id = '';

async function fetch_thread(){
    axios.get(url).then(async res => {
        for (let i = 0; i < res.data.length; i++) {
            let threads = res.data[i]['threads']
    
            for (let e = 0; e < threads.length; e++) {
                if(check_data(threads[e]['sub'])){
                    console.log(`########## PAGE ${i+1} ##########`)
                    console.log(`Thread nº: ${threads[e]['no']}`)
                    console.log(`Thread Name: ${threads[e]['name']}`)
                    console.log(`Thread Creation Time UNIX: ${threads[e]['time']}`)
                    console.log(`Thread Creation Time: ${threads[e]['now']}`)
                    console.log(`Thread Sub: ${threads[e]['sub']}`)
                    console.log(`Thread Tag: ${threads[e]['tag']}`)
                    console.log(`Thread FileID: ${threads[e]['tim']}`)
                    console.log(`Thread Archived: ${check_if_closed(threads[e]['closed'])}`)
                    console.log(`Thread File Link: https://i.4cdn.org/${board_name}/${threads[e]['tim'] + threads[e]['ext']}`)
                    console.log(`Thread Filename: ${threads[e]['filename'] + threads[e]['ext']}`)
                    console.log(`Thread Filesize: ${threads[e]['fsize']}`)
                    console.log(`Thread last_modified: ${threads[e]['last_modified']}`)
                    console.log(`Thread replies count: ${threads[e]['replies']}`)
                    console.log(`Thread Link: https://boards.4channel.org/${board_name}/thread/${threads[e]['no']}`)
    
                    thread_id = threads[e]['no'];

                    let image_obj = {
                        "tim": threads[e]['tim'],
                        "filename": threads[e]['filename'],
                        "filesize": threads[e]['fsize'],
                        "ext": threads[e]['ext'],
                    }

                    if(await GetImage(image_obj['tim']) == undefined){
                        await AddImage(image_obj)
                        //Also add "Download Image here"
                    }

                    let date = new Date(threads[e]['time']*1000)
                    let formatedDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
                    //console.log(formatedDate)

                    if(await GetThread(threads[e]['no']) == undefined){
                        console.log('Thread does not exist in DB')
                        await AddThread({
                            "t_number": threads[e]['no'],
                            "t_date": formatedDate,
                            "t_archived": false,
                            "t_tag": threads[e]['tag'],
                            "t_replies": threads[e]['replies'],
                            "t_link": `https://boards.4channel.org/${board_name}/thread/${threads[e]['no']}`,
                            "i_tim": threads[e]['tim'],
                        })
                    }else{
                        console.log('Thread does exist in DB')
                        await UpdateThread({
                            "t_archived": threads[e]['closed'],
                            "t_replies": threads[e]['replies'],
                        }, threads[e]['no'])
                    }
                }
            }
        }
    }).catch(error => {
        console.log(error);
    })
}

(async () => {
    fetch_thread()
})();

/*
    Code logic (DRAFT):
        - First check for new threads
        - Then if new thread shows up, register new tab
        - After thread is registered, download image
        - After thread is register and image is downloaded, check for the Thread's posts
        - Read through all of the posts and register them
        - After they are registered, download posts images, if they are there
        - After all is done, loop

*/
/*
let board_name = 'co';

let url = `https://a.4cdn.org/${board_name}/catalog.json`;

const search_text = "bcb";

let thread_id = '';

axios.get(url).then(res => {
    for (let i = 0; i < res.data.length; i++) {
        let threads = res.data[i]['threads']

        for (let e = 0; e < threads.length; e++) {
            if(check_data(threads[e]['sub'])){
                console.log(`########## PAGE ${i+1} ##########`)
                console.log(`Thread nº: ${threads[e]['no']}`)
                console.log(`Thread Name: ${threads[e]['name']}`)
                console.log(`Thread Creation Time UNIX: ${threads[e]['time']}`)
                console.log(`Thread Creation Time: ${threads[e]['now']}`)
                console.log(`Thread Sub: ${threads[e]['sub']}`)
                console.log(`Thread Tag: ${threads[e]['tag']}`)
                console.log(`Thread FileID: ${threads[e]['tim']}`)
                console.log(`Thread File Link: https://i.4cdn.org/${board_name}/${threads[e]['tim'] + threads[e]['ext']}`)
                console.log(`Thread Filename: ${threads[e]['filename'] + threads[e]['ext']}`)
                console.log(`Thread Filesize: ${threads[e]['fsize']}`)
                console.log(`Thread last_modified: ${threads[e]['last_modified']}`)
                console.log(`Thread replies nº: ${threads[e]['replies']}`)
                console.log(`Thread Link: https://boards.4channel.org/${board_name}/thread/${threads[e]['no']}`)

                thread_id = threads[e]['no'];
            }
        }
        
    }
}).catch(error => {
    console.log(error);
}).then(() =>{
    let thread_url = `https://a.4cdn.org/${board_name}/thread/${thread_id}.json`

    axios.get(thread_url).then(res => {
        for (let i = 0; i < res.data['posts'].length; i++) {
            //console.log(res.data['posts'][i])
            console.log('@@@@@@@@@@@@@@@@@@@@')
            console.log(`Post Link: https://boards.4channel.org/${board_name}/thread/${thread_id}#p${res.data['posts'][i]['no']}`)
            console.log(`Post Number: ${res.data['posts'][i]['no']}`)
            console.log(`Post Name: ${res.data['posts'][i]['name']}`)
            console.log(`Post Date UNIX: ${res.data['posts'][i]['time']}`)
            console.log(`Post Date: ${res.data['posts'][i]['now']}`)
            console.log(`Post File Link: https://i.4cdn.org/${board_name}/${res.data['posts'][i]['tim'] + res.data['posts'][i]['ext']}`)
            console.log(`Post File: ${res.data['posts'][i]['tim'] + res.data['posts'][i]['ext']}`)
            console.log(`Post File Size: ${res.data['posts'][i]['fsize']}`)
            console.log(`Post FileID: ${res.data['posts'][i]['tim']}`)
            console.log(`Post Comment: ${res.data['posts'][i]['com']}`)

            //if(i == 253) break;
        }
    }).catch(error => {
        console.log(error);
    })
})

//Page data!

*/

function check_data(input){
    if(input == undefined) return false;

    if(input.toLowerCase().includes(search_text)){
        return true
    }else{
        return false
    }
}

function check_if_closed(input){
    if(input == undefined){
        return false
    }else{
        return true
    }
}