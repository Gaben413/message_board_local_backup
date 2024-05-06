//const api = require('./api/api')
const clc = require('cli-color');

const {fetch} = require('./fetch/message_board_fetch');
const {AutoDeleteTokenBlacklist} = require('./database/query-manager');
const {interval} = require('./settings');

start_time = new Date()

let first = true;
let auto;

async function fetch_thread_data() {
    try {
        console.log(clc.green("• Running main script"))

        let response = await fetch(!auto);
    
        let date = new Date(new Date().getTime() + interval);
        let date_formated = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`

        if(auto){
            //console.log(`\n########## Response: ${response['message']} ##########`)
            //console.log(`Next check will be in ${interval/1000}s(${interval}ms) | At ${date_formated}`)
            console.log(`\nOperation was a ${response['message']} ` + clc.blue.bold(`${interval/1000}s(${interval}ms)`) + ` | At ${date_formated}`);

            main()
        }else{
            //console.log(`\n########## Response: ${response['message']} ##########`)
            //console.log(`\n########## Fetch Finished ##########`)
            console.log("\nFetch status: " + `${clc.yellow.bold(response['message'])}` + " Fetch date: " + clc.yellow.bold(date_formated));
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
        fetch_thread_data()
        first = false
    }else{
        await delay(interval)
        fetch_thread_data()
    }
}

//main()

(async () => {
    const flag = (
        process.argv.indexOf('-auto') > -1
    );
    const clear_flag = (
        process.argv.indexOf('--clear') > -1
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

    if(clear_flag){
        console.log(clc.yellow.underline("Cleaning DB"));
        let overtime = await AutoDeleteTokenBlacklist();
        if(overtime != null)
            console.log(clc.yellow(`ROWs cleaned: ${overtime.length}`));
    }
})();