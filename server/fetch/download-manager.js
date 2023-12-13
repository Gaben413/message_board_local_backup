const fs = require('fs')
const Axios = require('axios')

const {GetAllImages, GetAllImagesFromThread} = require('../database/query-manager')

const settings = require('../settings.json')

let filepath;

async function downloadImages(board_name, thread_id){
    return new Promise(async (resolve, reject)=>{
        let download_data = await GetAllImagesFromThread(thread_id)

        let processed_obj = [];

        console.log(`Download Amount: ${download_data.length}`)

        download_data.forEach(element => {
            let obj = {
                "url": `https://i.4cdn.org/${board_name}/${element['i_tim'] + element['i_ext']}`,
                "filename": element['i_tim'] + element['i_ext']
            }
            processed_obj.push(obj)
        })

        //console.log(processed_obj)

        check_dir(thread_id)

        for (let i = 0; i < processed_obj.length; i++) {
            if(!fs.existsSync(filepath+processed_obj[i]['filename'])){
                //Calculate file size: (byteSize/1*Math.pow(10, 6))
                console.log(`Downloading ${i+1} image out of ${processed_obj.length}`)
                await download_image(processed_obj[i])
                console.log(`Download of ${processed_obj[i]['filename']} complete - ${calculate_percentage(processed_obj.length, i+1).toFixed(2)}%`)
            }else{
                console.log(`Image ${i+1} out of ${processed_obj.length} (${processed_obj[i]['filename']}) is already downloaded - ${calculate_percentage(processed_obj.length, i+1).toFixed(2)}%`)
            }
        }

        console.log(`\nDownload done, images location:\n${filepath}`)

        resolve("Download was an successs!")
    });
    
}

function calculate_percentage(max, current){
    return current / (max/100);
}

async function download_image(obj_data){
    let url = obj_data['url']
    let filename = obj_data['filename']

    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(filepath + filename))
            .on('error', reject)
            .once('close', () => resolve(filepath + filename));
    });
}

function check_dir(wildcard){
    let root_path = settings['settings']['downloads_dir_path'][0]['dir'] + settings['settings']['download_dir_name'];
    let thread_folder = root_path + settings['settings']['folder_name'] + wildcard;

    filepath = thread_folder + '/'

    if(!fs.existsSync(root_path)){
        console.log(`Generating root folder "${settings['settings']['download_dir_name']}"`)
        fs.mkdirSync(root_path)
    }
    if(!fs.existsSync(thread_folder)){
        console.log(`Generating folder "${settings['settings']['folder_name'] + wildcard}"`)
        fs.mkdirSync(thread_folder)
    }
}
//check_dir("1000015")

async function Test(){
    let response = await downloadImages('co', 140989504)
    console.log(response)
}

//Test()

/*
//TEST
settings_filepath = settings['settings']['downloads_dir_path'][0]['dir'] + settings['settings']['download_dir_name']
//console.log(settings_filepath)

async function Test(){
    await downloadImage('https://d.furaffinity.net/art/otakon/1700955655/1700955655.otakon_hat-kid002.png', settings_filepath, 'test name.png');
}

Test()
*/

module.exports = {downloadImages}