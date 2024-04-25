//const api = require('./api/api')
const {fetch} = require('./fetch/message_board_fetch')

async function main(){

    try {
        console.log("Running main script")
        let response = await fetch(true);
    
        console.log(`\n########## Response: ${response['message']} ##########`)
        console.log(`\n########## Fetch Finished ##########`)
    }catch(error){
        console.error(error)
    }

}

main()