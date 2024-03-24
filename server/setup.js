const fs = require('fs');
const prompt = require("prompt-sync")({singint: true});

const FILENAME = "settings-test.json"

let test = Number(prompt("Give an input: "));
console.log(test)

let settings_obj = {
    "settings":{
        "boards":[
        ],
        "check_days":[1],
        "intervals":{
            "post":5,
            "thread":300
        },
        "downloads_dir_path": [

        ],
        "download_dir_name":"message board downloads/",
        "folder_name": "Thread_",
        "interval_ms": 30000,
        "simple_log_output": false,
        "api_port": 3000
    }
}

fs.writeFile(FILENAME, JSON.stringify(settings_obj, null, 4), err => {
    if (err){
        console.error(err);
    }else{
        console.log("File written successfully")
    }
})

console.log("Setup")