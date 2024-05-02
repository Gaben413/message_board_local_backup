const fs = require('fs');
const clc = require('cli-color');
const Axios = require('axios');

const {GetAllImages, GetAllImagesFromThread} = require('../database/query-manager')

//const settings = require('../settings.json')
const {root_path, thread_folder, folder_name, os} = require('../settings')

let filepath;

async function downloadImages(board_name, thread_id){
    return new Promise(async (resolve, reject)=>{
        let download_data = await GetAllImagesFromThread(thread_id)

        let processed_obj = [];

        console.log(clc.green("Images in Thread: ") + clc.yellow(`${download_data.length}\n`));

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
            console.log(
                clc.blue("Downloading image ") + clc.yellow.underline(`${i+1}/${processed_obj.length}`)
                + clc.blue(" - ") + clc.green(`${calculate_percentage(processed_obj.length, i+1).toFixed(2)}%`)
            );

            if(!fs.existsSync(filepath+processed_obj[i]['filename'])){
                //Calculate file size: (byteSize/1*Math.pow(10, 6))
                
                await download_image(processed_obj[i])
                //console.log(`Download of ${processed_obj[i]['filename']} complete - ${calculate_percentage(processed_obj.length, i+1).toFixed(2)}%`)
            }else{
                //console.log(`Image ${i+1} out of ${processed_obj.length} (${processed_obj[i]['filename']}) is already downloaded - ${calculate_percentage(processed_obj.length, i+1).toFixed(2)}%`)
            }

            if(i+1 != processed_obj.length)process.stdout.write(clc.move.up(1));
        }

        console.log(`\nDownload Complete | Images Location:\n${filepath}`)

        resolve({
            status: "success",
            message: "Download was an successs!"
        })
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
    //let root_path = settings['settings']['downloads_dir_path'][0]['dir'] + settings['settings']['download_dir_name'];
    let new_thread_folder = thread_folder + wildcard;

    filepath = new_thread_folder + '/'

    if(!fs.existsSync(root_path)){
        console.log(`Generating root folder "${settings['settings']['download_dir_name']}"`)
        fs.mkdirSync(root_path)
    }
    if(!fs.existsSync(new_thread_folder)){
        console.log(`Generating folder "${folder_name + wildcard}"`)
        fs.mkdirSync(new_thread_folder)
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
async function DirSize(){
    return new Promise(async (resolve, reject)=>{
        //let root_path = root_path
        console.log(root_path)
        let files = fs.readdirSync(root_path)

        let data_output = 0;
        
        for (let i = 0; i < files.length; i++) {
            let file_contents = fs.readdirSync(root_path+files[i])

            for (let e = 0; e < file_contents.length; e++) {
                let stat_data = fs.statSync(root_path+files[i]+"/"+file_contents[e])
                data_output += stat_data.size
            }
            
        }

        obj = {
            "bytes": data_output+" B",
            "megabytes": (data_output*1e-6)+" MB",
            "gigabytes": (data_output*1e-9)+" GB",

            "megabytes_short": (data_output*1e-6).toFixed(2)+" MB",
            "gigabytes_short": (data_output*1e-9).toFixed(3)+" GB",

            "bytes_raw": data_output,
            "megabytes_raw": (data_output*1e-6),
            "gigabytes_raw": (data_output*1e-9),
        }

        resolve(obj)
    })
}
module.exports = {downloadImages, DirSize}