const axios = require('axios');
const {AddImage, AddThread, GetImage, GetThread, UpdateThread, AddPost, GetPost, GetAllPosts} = require('../database/query-manager')
const {downloadImages} = require('./download-manager')

const settings = require('../settings.json')

const simple_log_output = settings['settings']['simple_log_output'];

function fetch_thread(board_name, search_text){
    return new Promise((resolve, reject) => {
        let url = `https://a.4cdn.org/${board_name}/catalog.json`;

        let output = '';
    
        axios.get(url).then(async res => {
            for (let i = 0; i < res.data.length; i++) {
                let threads = res.data[i]['threads']
        
                for (let e = 0; e < threads.length; e++) {
                    if(check_data(threads[e]['sub'], search_text)){
                        if(simple_log_output){
                            console.log(`Page ${i+1} | ID: ${threads[e]['no']} | ARCHVIED: ${check_if_closed(threads[e]['closed'])} | DATE: ${threads[e]['now']}`);
                        }else{
                            console.log(`########## PAGE ${i+1} ##########`);
                            console.log(`Thread nº: ${threads[e]['no']}`);
                            console.log(`Thread Name: ${threads[e]['name']}`);
                            console.log(`Thread Creation Time UNIX: ${threads[e]['time']}`);
                            console.log(`Thread Creation Time: ${threads[e]['now']}`);
                            console.log(`Thread Sub: ${threads[e]['sub']}`);
                            console.log(`Thread Tag: ${threads[e]['tag']}`);
                            console.log(`Thread FileID: ${threads[e]['tim']}`);
                            console.log(`Thread Archived: ${check_if_closed(threads[e]['closed'])}`);
                            console.log(`Thread File Link: https://i.4cdn.org/${board_name}/${threads[e]['tim'] + threads[e]['ext']}`);
                            console.log(`Thread Filename: ${threads[e]['filename'] + threads[e]['ext']}`);
                            console.log(`Thread Filesize: ${threads[e]['fsize']}`);
                            console.log(`Thread last_modified: ${threads[e]['last_modified']}`);
                            console.log(`Thread replies count: ${threads[e]['replies']}`);
                            console.log(`Thread Link: https://boards.4channel.org/${board_name}/thread/${threads[e]['no']}`);
                        }                        
        
                        output = threads[e]['no'];
    
                        let image_obj = {
                            "tim": threads[e]['tim'],
                            "filename": threads[e]['filename'],
                            "filesize": threads[e]['fsize'],
                            "ext": threads[e]['ext'],
                        }
    
                        if(await GetImage(image_obj['tim']) == undefined){
                            await AddImage(image_obj)
                        }
    
                        let date = new Date(threads[e]['time']*1000)
                        let formatedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
                        //console.log(formatedDate)
    
                        if(await GetThread(threads[e]['no']) == undefined){
                            console.log('Thread does not exist in DB')
                            await AddThread({
                                "t_number": threads[e]['no'],
                                "t_date": formatedDate,
                                "t_archived": false,
                                "t_sub": threads[e]['sub'],
                                "t_tag": threads[e]['tag'],
                                "t_replies": threads[e]['replies'],
                                "t_link": `https://boards.4channel.org/${board_name}/thread/${threads[e]['no']}`,
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
    
            resolve(output)
    
        }).catch(error => {
            reject('Failure')
            console.log(error);
        })
    })
}

async function GetPostData(input, board_name){
    let thread_url = `https://a.4cdn.org/${board_name}/thread/${input}.json`
    
    return new Promise((resolve, reject) => {
        let imageCount = 0;
        console.log(thread_url)
        axios.get(thread_url).then(async res => {
            for (let i = 0; i < res.data['posts'].length; i++) {
                //console.log(res.data['posts'][i])
                if(simple_log_output){
                    console.log(`POST ${i+1} | NO: ${res.data['posts'][i]['no']} | TIM: ${res.data['posts'][i]['tim']} | ${res.data['posts'][i]['now']}`)
                }else{
                    console.log(`@@@@@@@@@@ ${i+1} @@@@@@@@@@`)
                    console.log(`Post Link: https://boards.4channel.org/${board_name}/thread/${input}#p${res.data['posts'][i]['no']}`)
                    console.log(`Post Number: ${res.data['posts'][i]['no']}`)
                    console.log(`Post Name: ${res.data['posts'][i]['name']}`)
                    console.log(`Post Date UNIX: ${res.data['posts'][i]['time']}`)
                    console.log(`Post Date: ${res.data['posts'][i]['now']}`)
                    console.log(`Post File Link: https://i.4cdn.org/${board_name}/${res.data['posts'][i]['tim'] + res.data['posts'][i]['ext']}`)
                    console.log(`Post File: ${res.data['posts'][i]['tim'] + res.data['posts'][i]['ext']}`)
                    console.log(`Post File Size: ${res.data['posts'][i]['fsize']}`)
                    console.log(`Post FileID: ${res.data['posts'][i]['tim']}`)
                    console.log(`Post Comment: ${res.data['posts'][i]['com']}`)
    
                }
                
                //if(i == 253) break;

                if(res.data['posts'][i]['fsize'] != undefined){
                    imageCount++;

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

                    if(await GetImage(image_obj['tim']) == undefined){
                        await AddImage(image_obj)
                    }
                }

                if(await GetPost(res.data['posts'][i]['no']) == undefined){
                    console.log('Post does not exist in DB')
                    let date = new Date(res.data['posts'][i]['time']*1000)
                    let formatedDate = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
                    console.log(`Formated Date: ${formatedDate}`)
                    await AddPost({
                        "p_number": res.data['posts'][i]['no'],
                        "p_date": formatedDate,
                        "p_name": res.data['posts'][i]['name'],
                        "p_tag": res.data['posts'][i]['tag'],
                        "p_replies": res.data['posts'][i]['replies'],
                        "p_link": `https://i.4cdn.org/${board_name}/${res.data['posts'][i]['tim'] + res.data['posts'][i]['ext']}`,
                        "p_com": res.data['posts'][i]['com'],
                        "i_tim": res.data['posts'][i]['tim'],
                    })
                }
            }
            console.log(`\nIMAGE COUNT: ${imageCount}`)

            resolve('Post Data Fetch Success')

        }).catch(error => {
            console.log(error);
            reject(error)
        })
    })
}


async function fetch(){
    return new Promise(async (resolve, reject) => {
        const boards = settings['settings']['boards']

        for (let i = 0; i < boards.length; i++) {
            let board_name = boards[i]['board']
            let search_text = boards[i]['tags']
    
            console.log(`\n${i+1} - LOADING /${board_name}/`)
            let thread_id = await fetch_thread(board_name, search_text)
        
            if(thread_id != ''){
                console.log(`\nThread ID: ${thread_id}\n`)
    
                let posts_response = await GetPostData(thread_id, board_name)
                console.log(posts_response)
    
                let download_reponse = await downloadImages(board_name, thread_id)
                console.log(download_reponse)
    
                //Now do the loop or check for the next board
                //Still need to figure out how that will work
            }else{
                console.log(`No threads in ${board_name} have ${search_text} as tags`)
            }
        }
        resolve({message: 'success', key: true})
    })
}

//main()
function Test(){
    console.log('Test')
}
function Test2(){
    const boards = settings['settings']['boards']

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

function check_if_closed(input){
    if(input == undefined){
        return false
    }else{
        return true
    }
}

module.exports = {fetch}