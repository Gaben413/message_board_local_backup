//const api = require('./api/api')
const {fetch} = require('./fetch/message_board_fetch')
const settings = require('./settings.json')

start_time = new Date()

let first = true;

let interval = settings["settings"]["interval_ms"]

async function go() {
    try {
        console.log("Running main script")
        let response = await fetch();
    
        let date = new Date(new Date().getTime() + interval);
        let date_formated = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    
        console.log(`\n########## Response: ${response['message']} ##########`)
        console.log(`Next check will be in ${interval/1000}s(${interval}ms) | At ${date_formated}`)
    
        main()
    }catch(error){
        console.error(error)
    }

}

async function delay(timeDelay){
    return new Promise(resolve => {
        setTimeout(resolve, timeDelay)

    });
}

async function main(){

    if(first){
        go()
        first = false
    }else{
        await delay(interval)
        go()
    }
}

main()