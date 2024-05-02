const clc = require('cli-color');
//const api = require('./api/api')
const {fetch} = require('./fetch/message_board_fetch')

async function main(){
    return new Promise(async (resolve, reject) => {
        try {
            console.log(clc.green("• Running main script"));
            let response = await fetch(true);
        
            //console.log(`\n########## Response: ${response['message']} ##########`)
            //console.log(`\n########## Fetch Finished ##########`)
            console.log(clc.green("! FETCHING DONE !"));
            resolve(response);
        }catch(error){
            console.error(error)
            reject({
                status: "failure",
                message: error
            })
        }
    })
}

module.exports = {main}