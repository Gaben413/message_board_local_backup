const bcrypt = require('bcrypt');
const prompt = require("prompt-sync")({singint: true});

const {AddUser, GetUser, UsernameExists} = require('./database/query-manager');

async function createuser(superuser){

    let username;
    let password;
    let comfirm_password;
    let admin = superuser;
    let verified = superuser;

    while(true){
        while(true){
            username = prompt("Username: ");

            if(await UsernameExists(username)){
                console.log("User already exists");
            }else{
                break;
            }
        }

        while(true){
            password = prompt("Password: ");
            comfirm_password = prompt("Comfirm Password: ");

            if(password != comfirm_password){
                console.log("Password does not match")
            }else{
                break;
            }
        }
    
        console.log(`Username: ${username}\nPassword: ${password}`);
        let response = prompt("Is this correct? (Y/n): ");

        if(['y','yes'].includes(response.toLocaleLowerCase())) break;
    }

    bcrypt.hash(password, 10, async (err, hash) => {
        let response = await AddUser({
            username: username,
            password: hash,
            admin: admin,
            verified: verified
        })
        console.log(response);
    })
}

(async () => {
    //console.log(await UsernameExists("Greg"));
    const flag = (process.argv.indexOf('-admin') > -1);

    if(flag){
        console.log("Create superuser");
        createuser(true)
    }else{
        console.log("Create user");
        createuser(false)
    }
})();