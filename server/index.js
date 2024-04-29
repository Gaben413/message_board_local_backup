//const api = require('./api/api')
const {fetch} = require('./fetch/message_board_fetch');
const {interval} = require('./settings');

start_time = new Date()

let first = true;
let auto;

async function go() {
    try {
        console.log("Running main script")
        let response = await fetch(!auto);
    
        let date = new Date(new Date().getTime() + interval);
        let date_formated = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

        if(auto){
            console.log(`\n########## Response: ${response['message']} ##########`)
            console.log(`Next check will be in ${interval/1000}s(${interval}ms) | At ${date_formated}`)

            main()
        }else{
            console.log(`\n########## Response: ${response['message']} ##########`)
            console.log(`\n########## Fetch Finished ##########`)
        }

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

//main()

(async () => {
    const flag = (
        process.argv.indexOf('-auto') > -1
    );
    
    if(flag){
        console.log("Automatic Fetch");
        auto = true;
        main()
    }else{
        auto = false;
        console.log("Manual Fetch");
        main()
    }
})();