const fs = require('fs')
const Axios = require('axios')

//const settings = require('./settings.json')

async function downloadImage(url, filepath, filename){
    const response = await Axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    if(!fs.existsSync(settings_filepath)){
        fs.mkdirSync(settings_filepath)
    }

    return new Promise((resolve, reject) => {
        response.data.pipe(fs.createWriteStream(filepath + filename))
            .on('error', reject)
            .once('close', () => resolve(filepath + filename));
    });
}

/*
//TEST
settings_filepath = settings['settings']['downloads_dir_path'][0]['dir'] + settings['settings']['download_dir_name']
//console.log(settings_filepath)

async function Test(){
    await downloadImage('https://d.furaffinity.net/art/otakon/1700955655/1700955655.otakon_hat-kid002.png', settings_filepath, 'test name.png');
}

Test()
*/

module.exports = {downloadImage}