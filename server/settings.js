const { networkInterfaces } = require('os');
let settings = require('./settings.json')

let os = 0;

if(process.platform === "win32"){
    os = 0
} else if(process.platform === "linux"){
    os = 1
}

let root_path = settings['settings']['downloads_dir_path'][os]['dir'] + settings['settings']['download_dir_name']
let thread_folder = root_path + settings['settings']['folder_name']
let folder_name = settings['settings']['folder_name']
let interval = settings["settings"]["interval_ms"]

let logBool = (() => {
    if(settings['settings']['simple_log_output']) return false 
    else return console.log
})();

let local_api = settings['settings']['local_api'];
let api_port = settings['settings']['api_port'];

let boards = settings['settings']['boards'];

/*
function GetLocalIPAddress(){
    const nets = networkInterfaces();
    const results = Object.create(null); // Or just '{}', an empty object

    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
            // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
            const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
            if (net.family === familyV4Value && !net.internal) {
                if (!results[name]) {
                    results[name] = [];
                }
                results[name].push(net.address);
            }
        }
    }

    return results['Ethernet'][0]
}

let local_api = GetLocalIPAddress()
*/
module.exports = {root_path, thread_folder, folder_name, os, interval, logBool, local_api, api_port, boards}