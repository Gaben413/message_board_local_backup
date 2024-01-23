let settings = require('./settings.json')

let os = 0;

if(process.platform === "win32"){
    os = 0
} else if(process.platform === "linux"){
    os = 1
}

let root_path = settings['settings']['downloads_dir_path'][os]['dir'] + settings['settings']['download_dir_name']
let thread_folder = root_path + settings['settings']['folder_name']

module.exports = {root_path, thread_folder, os}