const axios = require('axios');
const clc = require('cli-color');

const {AddImage, AddThread, GetImage, GetThread, UpdateThread, IsThreadInList, AddPost, GetPost, GetAllPosts, GetBlacklist,GetWhitelist} = require('../database/query-manager')
const {downloadImages} = require('./download-manager')

const settings = require('../settings.json')

const {logBool, boards} = require('../settings');

//const simple_log_output = settings['settings']['simple_log_output'];

function fetch_thread(board_name, search_text){
    return new Promise((resolve, reject) => {
        let url = `https://a.4cdn.org/${board_name}/catalog.json`;

        let output = '';
    
        axios.get(url).then(async res => {
            for (let i = 0; i < res.data.length; i++) {
                let threads = res.data[i]['threads']

                let blacklist_no = [];
                let bl_raw = await GetBlacklist();
                for(let i = 0; i < bl_raw.length; i++){
                    blacklist_no.push(bl_raw[i]['tp_number']);
                }
                //Use white list later. Full make sure that Download will only pull images and no video or files
                
                let whitelist = [];
                let wl_raw = await GetWhitelist();
                for (let i = 0; i < wl_raw.length; i++) {
                    whitelist.push(wl_raw[i]['tp_number']);
                }
                
                for (let e = 0; e < threads.length; e++) {

                    //console.log(`MAJOR TEST ${threads[e]['no']} | ${whitelist.includes(threads[e]['no'])}`)

                    if((check_data(threads[e]['sub'], search_text) && !blacklist_no.includes(threads[e]['no']) || whitelist.includes(threads[e]['no']))){
                        /*
                        if(logBool){
                            console.log(`Page ${i+1} | ID: ${threads[e]['no']} | ARCHVIED: ${check_if_closed(threads[e]['closed'])} | DATE: ${threads[e]['now']}`);
                        }else{
                            console.log(`########## PAGE ${i+1} ##########`);
                            console.log(`Nº: ${threads[e]['no']} - Thread Name: ${threads[e]['name']} | Thread Sub: ${threads[e]['sub']}`);
                            console.log(`Thread File Link: https://i.4cdn.org/${board_name}/${threads[e]['tim'] + threads[e]['ext']}`);
                            console.log(`${threads[e]['tim']} - Thread Filename: ${threads[e]['filename'] + threads[e]['ext']} | ${threads[e]['fsize']}B`);
                            console.log(`Thread last_modified: ${threads[e]['last_modified']}`);
                            console.log(`Thread Link: https://boards.4channel.org/${board_name}/thread/${threads[e]['no']}`);
                        }
                        */

                        console.log(clc.green("########## ") + clc.green.underline(`PAGE ${i+1}`) + clc.green(" ##########"));
                        console.log(clc.blue("ID: ") + clc.yellow.underline(`${threads[e]['no']}`)
                            + clc.blue(" - Thread Name: ") + clc.yellow.underline(`${threads[e]['name']}`)
                            + clc.blue(" | Thread Sub: ") + clc.yellow.underline(`${threads[e]['sub']}`)
                        );
                        //console.log(`Thread File Link: https://i.4cdn.org/${board_name}/${threads[e]['tim'] + threads[e]['ext']}`);
                        //console.log(`${threads[e]['tim']} - Thread Filename: ${threads[e]['filename'] + threads[e]['ext']} | ${threads[e]['fsize']}B`);
                        console.log(clc.blue("File Name: ") + clc.yellow.underline(`${threads[e]['filename'] + threads[e]['ext']}`)
                            + clc.blue(" ID: ") + clc.yellow.underline(`${threads[e]['tim']}`)
                            + " | " + clc.green(`${threads[e]['fsize']} Bytes`)
                        );
                        console.log(clc.blue("Thread last_modified: ") + clc.yellow.underline(`${threads[e]['last_modified']}`));
                        console.log(clc.blue(`Thread Link: `) + `https://boards.4channel.org/${board_name}/thread/${threads[e]['no']}\n`);

                        output = threads[e]['no'];
                        
                        /*
                        let image_obj = {
                            "tim": threads[e]['tim'],
                            "filename": threads[e]['filename'],
                            "filesize": threads[e]['fsize'],
                            "ext": threads[e]['ext'],
                        }
    
                        if(await GetImage(image_obj['tim']) == undefined){
                            await AddImage(image_obj)
                        }
                        */

                        let date = new Date(threads[e]['time']*1000)
                        let formatedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
                        //console.log(formatedDate)
    
                        if(await GetThread(threads[e]['no']) == undefined){
                            console.log(clc.green('Adding Thread to DB\n'));

                            await AddThread({
                                "t_number": threads[e]['no'],
                                "t_board": `/${board_name}/`,
                                "t_date": formatedDate,
                                "t_archived": false,
                                "t_sub": threads[e]['sub'],
                                "t_tag": threads[e]['tag'],
                                "t_replies": threads[e]['replies'],
                                "t_link": `https://boards.4channel.org/${board_name}/thread/${threads[e]['no']}`,
                            })
                        }else{
                            console.log(clc.green('Updating Thread'));
                            await UpdateThread({
                                "t_archived": threads[e]['closed'],
                                "t_replies": threads[e]['replies'],
                            }, threads[e]['no'])
                        }
                    }
                }
            }

            resolve(output)
    
        }).catch(error => {
            reject('Failure')
            console.log(error);
        })
    })
}

async function GetPostData(input, board_name){
    let thread_url = `https://a.4cdn.org/${board_name}/thread/${input}.json`

    let blacklist_no = [];
    for(entry in await GetBlacklist()){
        blacklist_no.push(entry['tp_number'])
    }

    return new Promise((resolve, reject) => {
        let imageCount = 0;
        //console.log(thread_url)
        axios.get(thread_url).then(async res => {
            for (let i = 0; i < res.data['posts'].length; i++) {
                if(!blacklist_no.includes(res.data['posts'][i]['no'])){
                    //if(i == 253) break;

                    let i_tim = undefined;

                    if(res.data['posts'][i]['fsize'] != undefined && ['.png', '.jpg', '.jpeg', '.gif'].includes(res.data['posts'][i]['ext'])){
                        imageCount++;

                        i_tim = res.data['posts'][i]['tim'];

                        let filename = res.data['posts'][i]['filename'].replace(/[^a-zA-Z ]/g, "")
                        if(filename == ""){
                            filename = "file"
                        }

                        let image_obj = {
                            "tim": res.data['posts'][i]['tim'],
                            "filename": filename,
                            "filesize": res.data['posts'][i]['fsize'],
                            "ext": res.data['posts'][i]['ext'],
                        }

                        if(await GetImage(image_obj['tim']) == "404"){
                            await AddImage(image_obj)
                        }
                    }

                    if(await GetPost(res.data['posts'][i]['no']) == undefined){
                        console.log(clc.green('• New Post\n'));
                        /*
                        if(logBool){
                            console.log(`POST ${i+1} | NO: ${res.data['posts'][i]['no']} | TIM: ${res.data['posts'][i]['tim']} | ${res.data['posts'][i]['now']}`)
                        }else{
                            console.log(`@@@@@@@@@@@@@@@@@@@@`)
                            console.log(`${i+1} - ${res.data['posts'][i]['no']} - ${res.data['posts'][i]['name']} | ${res.data['posts'][i]['now']}`)
                            console.log(`${res.data['posts'][i]['tim'] + res.data['posts'][i]['ext']} | ${res.data['posts'][i]['fsize']}B`)
                            console.log(`Post Comment: ${res.data['posts'][i]['com']}`)
                        }
                        */

                        console.log(
                            clc.green(`${i+1} - `)
                            + clc.yellow(`${res.data['posts'][i]['no']}`)
                            + clc.green(" - ")
                            + clc.yellow(`${res.data['posts'][i]['name']}`)
                        );
                        if(res.data['posts'][i]['fsize'] != undefined)
                            console.log(
                                clc.green("File: ")
                                + clc.yellow(`${res.data['posts'][i]['tim'] + res.data['posts'][i]['ext']}`)
                                + clc.green(" | ")
                                + clc.yellow(`${res.data['posts'][i]['fsize']} Bytes`)
                            );
                        else console.log(clc.green("No attached file"));
                        
                        if(res.data['posts'][i]['com'] != undefined){
                            let stringtrim = res.data['posts'][i]['com'].toString().substring(0, 25)
                            console.log(clc.green("Post comm: ") + clc.yellow(`${stringtrim}\n`));
                        }
                        

                        let date = new Date(res.data['posts'][i]['time']*1000)
                        let formatedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

                        console.log(clc.green("Formated Date: ") + clc.yellow.underline(`${formatedDate}\n`));

                        await AddPost({
                            "p_number": res.data['posts'][i]['no'],
                            "p_date": formatedDate,
                            "p_name": res.data['posts'][i]['name'],
                            "p_tag": res.data['posts'][i]['tag'],
                            "p_replies": res.data['posts'][i]['replies'],
                            "p_link": `https://i.4cdn.org/${board_name}/${res.data['posts'][i]['tim'] + res.data['posts'][i]['ext']}`,
                            "p_com": res.data['posts'][i]['com'],
                            "i_tim": i_tim,
                            "t_number": input,
                        })
                    }
                }
                
            }

            console.log(clc.green("\nIMAGE COUNT: ") + clc.yellow.underline(`${imageCount}`));

            resolve({
                status: "success",
                message: 'Post Data Fetch Success'
            })

        }).catch(error => {
            console.log(error);
            reject(error)
        })
    })
}


async function fetch(manual_fetch = false){
    return new Promise(async (resolve, reject) => {
        try{
            //const boards = settings['settings']['boards']

            let threads_no_list= []

            for (let i = 0; i < boards.length; i++) {
                let board_name = boards[i]['board']
                let search_text = boards[i]['tags']

                if(boards[i]['auto'] || manual_fetch){ //Just a check in case the search
        
                    console.log(clc.underline(`\n${i+1} - LOADING /${board_name}/\n`));

                    let thread_id = await fetch_thread(board_name, search_text)

                    if(thread_id != ''){
                        console.log(`\nThread ID: ${thread_id}\n`)
            
                        let posts_response = await GetPostData(thread_id, board_name)
                        console.log(posts_response)
            
                        let download_reponse = await downloadImages(board_name, thread_id)
                        console.log(download_reponse)
            
                        //Now do the loop or check for the next board
                        //Still need to figure out how that will work

                        threads_no_list.push(thread_id)
                    }else{
                        console.log("No threads in " + clc.underline(`/${board_name}/`) + " have " + clc.underline(`${search_text}`) + " as tags\n")
                    }
                    console.log(clc.green("\nALL THREAD IDS: ") + clc.yellow(`${threads_no_list}`));
                }
            }

            await IsThreadInList(threads_no_list)
            resolve({message: 'success', key: true})
        }catch(error){
            reject({message: 'error', key: false})
            console.log(error)
        }
    })
}

//main()
function Test(){
    console.log('Test')
}
function Test2(){
    //const boards = settings['settings']['boards']

    for (let i = 0; i < boards.length; i++) {
        let board_name = boards[i]['board']
        let search_text = boards[i]['tags']

        console.log(`${i+1} - LOADING /${board_name}/`)
        console.log(search_text)
        
    }
}
//Test2()


function check_data(input, search_text){
    if(input == undefined) return false;
    let response = false;

    for (let i = 0; i < search_text.length; i++) {
        if(input.toLowerCase().includes(search_text[i])){
            response = true
            break
        }        
    }

    return response;
}

//Might be unecessery

function check_if_closed(input){
    if(input == undefined){
        return false
    }else{
        return true
    }
}

module.exports = {fetch}