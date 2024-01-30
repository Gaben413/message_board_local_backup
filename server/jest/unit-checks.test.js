require('dotenv').config()
const fs = require('fs');
const { Sequelize } = require('sequelize');

const {root_path, thread_folder, os} = require('../settings');

const sequelize = new Sequelize(process.env.PG_URL, {
    logging: false
});

function connection_check(url){
    let output = true;

    require("dns").resolve(url, (err) => {
        if(err){
            //console.log("No connection");
            output = false;
        }else{
            //console.log("Connected");
            output = true;
        }
    });

    //console.log(dns)
    return output
}

async function sequelize_check(){
    return new Promise((resolve, reject) => {
        sequelize.authenticate().then(() => {
            resolve(true)
            sequelize.close()
        }).catch((err) => {
            reject(false);
        })
    })
}

function check_path(input_path){
    return fs.existsSync(input_path);
}

describe('Web Connectivity Check', () => {
    test('Check Internet Connection', () => {
        expect(connection_check('www.google.com')).toBeTruthy();
    });
    test('Check Connection to API server', () => {
        expect(connection_check('a.4cdn.org')).toBeTruthy();
    });
    test('Check Connection to API image server', () => {
        expect(connection_check('i.4cdn.org')).toBeTruthy();
    });
});

describe('DB Connectivity Check', () => {
    test('General DB Check', () => {
        expect(sequelize_check()).toBeTruthy();
    });
});

describe('Folder Checks', () => {
    test('Check Root Path', () => {
        expect(check_path(root_path)).toBeTruthy();
    });
});