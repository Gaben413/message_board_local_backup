const axios = require('axios');

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
                console.log(`Thread Sub: ${threads[e]['sub']}`)
                console.log(`Thread Tag: ${threads[e]['tag']}`)
                console.log(`Thread last_modified: ${threads[e]['last_modified']}`)
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
            console.log(res.data['posts'][i])
            
        }
    }).catch(error => {
        console.log(error);
    })
})

//Page data!


function check_data(input){
    if(input == undefined) return false;

    if(input.toLowerCase().includes(search_text)){
        return true
    }else{
        return false
    }
}