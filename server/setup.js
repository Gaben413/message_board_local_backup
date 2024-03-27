const fs = require('fs');
const prompt = require("prompt-sync")({singint: true});
//Testing things out
const FILENAME = "settings.json"

// #region Set Boards
const BOARD_OPTIONS = [
    {
        key: 0,
        name: "JAPANESE CULTURE",
        boards:[
            {key: 0, name: "Anime", board: "a"},
            {key: 1, name: "Cute", board: "c"},
            {key: 2, name: "Wallpapers", board: "w"},
            {key: 3, name: "Mecha", board: "m"},
            {key: 4, name: "Cosplay & EGL", board: "cgl"},
            {key: 5, name: "Cute Male", board: "cm"},
            {key: 6, name: "Flash", board: "f"},
            {key: 7, name: "Transportation", board: "n"},
            {key: 8, name: "Otaku Culture", board: "jp"},
            {key: 9, name: "Virtual Youtubers", board: "vt"},
        ]
    },
    {
        key: 1,
        name: "VIDEO GAMES",
        boards:[
            {key: 0, name: "Video Games", board: "v"},
            {key: 1, name: "Video Game Generals", board: "vg"},
            {key: 2, name: "Video Games/Multiplayer", board: "vm"},
            {key: 3, name: "Video Games/Mobile", board: "vmg"},
            {key: 4, name: "Pokemon", board: "vp"},
            {key: 5, name: "Retro Games", board: "vr"},
            {key: 6, name: "Video Games/RPG", board: "vrpg"},
            {key: 7, name: "Video Games/Strategy", board: "vst"},
        ]
    },
    {
        key: 2,
        name: "INTERESTS",
        boards:[
            {key: 0, name: "Comics & Cartoons", board: "co"},
            {key: 1, name: "Technology", board: "g"},
            {key: 2, name: "Television & Film", board: "tv"},
            {key: 3, name: "Weapons", board: "k"},
            {key: 4, name: "Auto", board: "o"},
            {key: 5, name: "Animals & Nature", board: "an"},
            {key: 6, name: "Traditional Games", board: "tg"},
            {key: 7, name: "Sports", board: "sp"},
            {key: 8, name: "Extreme Sports", board: "xs"},
            {key: 9, name: "Professional Wrestling", board: "pw"},
            {key: 10, name: "Science & Math", board: "sci"},
            {key: 11, name: "History & Humanities", board: "his"},
            {key: 12, name: "International", board: "int"},
            {key: 13, name: "Outdoors", board: "out"},
            {key: 14, name: "Toys", board: "toy"},
        ]
    },
    {
        key: 3,
        name: "CREATIVE",
        boards:[
            {key: 0, name: "Oekaki", board: "i"},
            {key: 1, name: "Papercraft & Origami", board: "po"},
            {key: 2, name: "Photography", board: "p"},
            {key: 3, name: "Food & Cooking", board: "ck"},
            {key: 4, name: "Artwork/Critique", board: "ic"},
            {key: 5, name: "Wallpapers/General", board: "wg"},
            {key: 6, name: "Literature", board: "lit"},
            {key: 7, name: "Music", board: "mu"},
            {key: 8, name: "Fashion", board: "fa"},
            {key: 9, name: "3DCG", board: "3"},
            {key: 10, name: "Graphic Design", board: "gd"},
            {key: 11, name: "Do It yourself", board: "diy"},
            {key: 12, name: "Worksafe GIF", board: "wsg"},
            {key: 13, name: "Quests", board: "qst"},
        ]
    },
    {
        key: 4,
        name: "OTHER",
        boards:[
            {key: 0, name: "Business & Finance", board: "biz"},
            {key: 1, name: "Travel", board: "trv"},
            {key: 2, name: "Fitness", board: "fit"},
            {key: 3, name: "Paranormal", board: "x"},
            {key: 4, name: "Advice", board: "adv"},
            {key: 5, name: "LGBT", board: "lgbt"},
            {key: 6, name: "Pony", board: "mlp"},
            {key: 7, name: "Current News", board: "news"},
            {key: 8, name: "Worksafe Requests", board: "wsr"},
            {key: 9, name: "Very Important Posts", board: "vip"},
        ]
    },
    {
        key: 5,
        name: "MISC (NSFW)",
        boards:[
            {key: 0, name: "Random", board: "b"},
            {key: 1, name: "ROBOT9001", board: "r9k"},
            {key: 2, name: "Politically Incorrect", board: "pol"},
            {key: 3, name: "International/Random", board: "bant"},
            {key: 4, name: "Cams & Meetups", board: "soc"},
            {key: 5, name: "Sh*t 4chan Says", board: "s4s"},
            {key: 6, name: "Trash", board: "trash"},
        ]
    },
    {
        key: 6,
        name: "ADULT (NSFW)",
        boards:[
            {key: 0, name: "Sexy Beautiful Women", board: "s"},
            {key: 1, name: "Hardcore", board: "hc"},
            {key: 2, name: "Handsome Men", board: "hm"},
            {key: 3, name: "Hentai", board: "h"},
            {key: 4, name: "Ecchi", board: "e"},
            {key: 5, name: "Yuri", board: "u"},
            {key: 6, name: "Hentai/Alternative", board: "d"},
            {key: 7, name: "Yaoi", board: "y"},
            {key: 8, name: "Torrents", board: "t"},
            {key: 9, name: "High Resolution", board: "hr"},
            {key: 10, name: "Adult GIF", board: "gif"},
            {key: 11, name: "Adult Cartoons", board: "aco"},
            {key: 12, name: "Adult Requests", board: "r"},
        ]
    }
];

let selected_boards = []
//Set Boards
while(true){
    console.log("CATEGORIES: ");
    for (let i = 0; i < BOARD_OPTIONS.length; i++) {
        console.log(`${BOARD_OPTIONS[i]['key']} - ${BOARD_OPTIONS[i]['name']}`)
    }
    
    let category_id
    
    while (true){
        try{
            category_id = Number(prompt("Give an input: "));
    
            if (category_id >= 0 && category_id < BOARD_OPTIONS.length){
                console.log(BOARD_OPTIONS[category_id]['name']);
                break;
            }else{
                console.log(`Please choose a number between 0 and ${BOARD_OPTIONS.length-1}`)
            }
        }catch (err){
            console.error(err)
        }
        
    }
    
    
    console.log("BOARDS: ");
    for (let i = 0; i < BOARD_OPTIONS[category_id]['boards'].length; i++) {
        console.log(`${BOARD_OPTIONS[category_id]['boards'][i]['key']} - ${BOARD_OPTIONS[category_id]['boards'][i]['name']} | /${BOARD_OPTIONS[category_id]['boards'][i]['board']}/`)
    }

    let board_id;
    while(true){
        board_id = Number(prompt("Give an input: "));
    
        if(board_id >= 0 && board_id < BOARD_OPTIONS[category_id]['boards'].length){
            console.log(BOARD_OPTIONS[category_id]['boards'][board_id]);
            break;
        }else{
            console.log(`Please choose a number between 0 and ${BOARD_OPTIONS[category_id]['boards'].length-1}`)
        }
    }

    let tags = []

    while(true){
        let tag = prompt("Insert Tag: ");

        tags.push(tag)

        console.log(tags)

        let continue_tags = prompt("Add more? (y/n): ").toLocaleLowerCase();

        if(['n','no'].includes(continue_tags)){
            break;
        }
    }

    selected_boards.push({
        board: BOARD_OPTIONS[category_id]['boards'][board_id]['board'],
        tags: tags
    })
    
    let continue_question;
    while(!["y","n","yes","no"].includes(continue_question)){
        continue_question = prompt("Add another board? (y/n): ").toLocaleLowerCase();
    }
    
    if(["n","no"].includes(continue_question)){
        break;
    }
}
// #endregion

// #region Set Download Path
let downloads_dir_path = [
    {
        "os": "win32",
        "dir": ""
    },
    {
        "os": "linux",
        "dir": ""
    }
]

for(let i = 0; i < downloads_dir_path.length; i++){
    let proceed = true;
    let dir;

    while(proceed){
        console.log(`SET ${downloads_dir_path[i]['os']} DOWNLOAD PATH`)

        let are_you_sure = true;
        while(are_you_sure){
            dir = prompt("Insert path: ");

            if(dir.slice(-1) != '/')
                dir += '/';

            let response = prompt(`You chose the path "${dir}" | Are you sure you want it? (y/n):`).toLowerCase();

            are_you_sure = ["n","no"].includes(response);
        }
    
        if(!fs.existsSync(dir) && process.platform === downloads_dir_path[i]['os']){
            let response = prompt(`Path "${dir}" doesn't exist, are you sure you want to add it? (y/n): `).toLowerCase()

            if(["y","yes"].includes(response)){
                proceed = false;
            }else{
                proceed = true;
            }
        }else{
            proceed = false;
        }
    }

    downloads_dir_path[i]['dir'] = dir;

}

//Set Root Folder Name
let download_dir_name;
while(true){
    download_dir_name = prompt("Insert Root Folder Name: ").trim();

    if(download_dir_name.slice(-1) != '/')
        download_dir_name += '/';

    let response = prompt(`You chose "${download_dir_name}" as the root file. Are you sure you want it? (y/n): `).toLowerCase();

    if(["y","yes"].includes(response)){
        break;
    }
}

//Set Files Names
let filename;
while(true){
    filename = prompt("Insert File Name: ").trim().replaceAll('/','');

    let response = prompt(`You chose "${filename}*" as the files names. Are you sure you want it? (y/n): `).toLocaleLowerCase();

    if(["y","n"].includes(response)){
        break;
    }
}

// #endregion

// #region Set Interval
let interval_ms;
while(true){
    interval_ms = Number(prompt("Set interval in seconds: "))*1000;

    let response = prompt(`You want to set the check interval to "${interval_ms/1000}" seconds? (y/n): `).toLocaleLowerCase()

    if(["y","yes"].includes(response) && response != NaN){
        break;
    }
}

// #endregion

// #region Output Type
let output_type;

while(true){
    console.log("Set logging type:\n1 - Full Logging\n2 - Simple Logging");
    let question = prompt(">> ").trim();

    if(question == "1"){
        output_type = false
        break;
    }else if(question == "2"){
        output_type = true
        break;
    }
}

// #endregion

// #region API port

let api_port = 3000;

while(true){
    let port = Number(prompt("Set API Port (Default: 3000): "));

    if(port == 0 || port == NaN){
        port = api_port;
    }
    
    let response = prompt(`You set API port to be "${port}", you want to set this port? (y/n)`).trim().toLocaleLowerCase();

    if(["y","yes"].includes(response) && response != NaN){
        api_port = port;
        break;
    }
}

// #endregion

let settings_obj = {
    "settings":{
        "boards": selected_boards,
        "downloads_dir_path": downloads_dir_path,
        "download_dir_name": download_dir_name,
        "folder_name": filename,
        "interval_ms": interval_ms,
        "simple_log_output": output_type,
        "api_port": api_port
    }
}

fs.writeFile(FILENAME, JSON.stringify(settings_obj, null, 4), err => {
    if (err){
        console.error(err);
    }else{
        console.log("File written successfully")
    }
})

console.log("Setup file created");