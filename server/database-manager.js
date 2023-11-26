//      CONNECTION
require('dotenv').config()
const mariadb = require('mariadb')
const pool = mariadb.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    port: process.env.PORT,
    database: process.env.DB,
});

/*
pool.getConnection().then(conn => {
    console.log("connection sucessfull")
}).catch(err => {
    console.log(`Unable to connect: ${err}`)
})
*/
/*
    TABLES:
        Thread Table
        Post Table
        Post Self Relation Table
        Favourties
*/

//      SELECT METHODS

//Check all Threads in DB. Returns Threads data.
async function GetAllThreads(){
    return new Promise((resolve, reject) => {
        pool.getConnection().then(conn => {
            conn.query("SELECT * FROM thread").then(rows => {
                resolve(rows)
            })
        conn.end()
        }).catch(err => {
            console.log(`Unable to connect: ${err}`)
        })
    })
}

//Check for specific Thread in DB. Returns Thread data.
async function GetThread(thread_number){
    return new Promise((resolve, reject) => {
        pool.getConnection().then(conn => {
            conn.query("SELECT * FROM thread WHERE t_number = ?", [thread_number]).then(row => {
                if(row != undefined){
                    //console.log(row[0])
                    resolve(row[0])
                } else {
                    //console.log('is empty')
                    resolve(false)
                }
            })
        conn.end()
        }).catch(err => {
            console.log(`Unable to connect: ${err}`)
        })
    })
}

//Check if Thread already exists. Returns true or false. (Maybe simply call last function and check if it does return something)

//Check all Posts in selected Thread. Returns Posts data.
async function GetAllPosts(thread_number){
    pool.getConnection().then(conn => {
        conn.query("SELECT * FROM post WHERE t_number = ?", [thread_number]).then(rows => {
            console.log(rows)
            console.log(`Response amount: ${rows.length}`)
            return rows
        })
        conn.end()
    }).catch(err => {
        console.log(`Unable to connect: ${err}`)
    })
}

//Compare last Post on thread. Returns true or false.
async function IsPostNew(input_id){
    return new Promise((resolve, reject) => {
        pool.getConnection().then(conn => {
            conn.query("SELECT * FROM post ORDER BY p_number DESC LIMIT 1;").then(row => {
                console.log(`${input_id} | ${row[0]['p_number']}`)
                let result;
                if(input_id <= row[0]['p_number'])
                    result = false;
                else
                    result = true;

                resolve(result)
            })
        conn.end()
        }).catch(err => {
            console.log(`Unable to connect: ${err}`)
        })
    })

}

//Get all Favourites
async function GetAllFavourites(){
    return new Promise((resolve, reject) => {
        pool.getConnection().then(conn => {
            conn.query("SELECT * FROM favourite").then(rows => {
                resolve(rows)
            })
        conn.end()
        }).catch(err => {
            console.log(`Unable to connect: ${err}`)
        })
    })
}

//Get one specific Favourite
async function GetFavourite(favourite_id){
    return new Promise((resolve, reject) => {
        pool.getConnection().then(conn => {
            conn.query("SELECT * FROM favourite WHERE f_id = ?", [favourite_id]).then(row => {
                console.log(row)
                if(row != undefined){
                    //console.log(row[0])
                    resolve(row[0])
                } else {
                    //console.log('is empty')
                    resolve(false)
                }
            })
        conn.end()
        }).catch(err => {
            console.log(`Unable to connect: ${err}`)
        })
    })
}

//Get every thread with relation with favourite
async function GetAllFavourites(){
    return new Promise((resolve, reject) => {
        pool.getConnection().then(conn => {
            conn.query(
                "SELECT f.f_name, t.t_number, t.t_archived, t.t_tag, t.t_link FROM favourite as f"
                + " INNER JOIN favourite_has_thread as fht ON f.f_id = fht.f_id"
                + " INNER JOIN thread as t ON fht.t_number = t.t_number;"
            ).then(rows => {
                resolve(rows)
            })
        conn.end()
        }).catch(err => {
            console.log(`Unable to connect: ${err}`)
        })
    })
}

//      INSERT METHODS

//Insert Thread data.
async function InsertThreadData(thread_data){
    pool.getConnection().then(conn => {
        conn.query("INSERT INTO thread VALUES (?,?,?,?,?,?,?,?,?)", [
            thread_data['t_number'],
            thread_data['t_date'],
            thread_data['t_archived'],
            thread_data['t_tag'],
            thread_data['t_filename'],
            thread_data['t_size'],
            thread_data['t_tim'],
            thread_data['t_replies'],
            thread_data['t_link']
        ]).then(row => {
            console.log(row)
        })

        conn.end()

    }).catch(err => {
        console.log(`Unable to connect: ${err}`)
    })
}

//Insert Post data also insert reply relation into it's table, if there is one. Also check if Post number is already there, only post if it isn't.
//Perhaps manage the the duplicate posts in the index.js itself, instead of the InsertPosts function
async function InsertPosts(posts_data){
    pool.getConnection().then(conn => {
        posts_data.forEach(data => {
            conn.query("INSERT INTO post VALUES (?,?,?,?,?,?,?,?,?)", [
                data['p_number'],
                data['p_date'],
                data['p_name'],
                data['p_filename'],
                data['p_size'],
                data['p_tim'],
                data['p_com'],
                data['p_link'],
                data['t_number']
            ]).then(row => {                
                console.log(row)
            }).catch(err => {
                if(err.errno == 1062){
                    console.log('Post already registered')
                }else{
                    console.log(err)
                }

            })
        })
        conn.end()
    }).catch(err => {
        console.log(`Unable to connect: ${err}`)
    })
    
}

//Insert reply
async function InsertReply(reply_data){
    pool.getConnection().then(conn => {
        reply_data.forEach(data => {
            conn.query("INSERT INTO replies VALUES (?,?)", [data["og_post"], data["reply_post"]])
            .then(row => {                
                console.log(row)
            }).catch(err => {
                if(err.errno == 1062){
                    console.log('Reply already registered')
                }else{
                    console.log(err)
                }

            })
        })

        conn.end()

    }).catch(err => {
        console.log(`Unable to connect: ${err}`)
    })
}

//Insert Favourite
async function InsertFavourite(favourite_data, target_thread_id){
    pool.getConnection().then(conn => {
        conn.query("INSERT INTO favourite (d_date, f_name) VALUES (?,?)", [favourite_data['d_date'], favourite_data['f_name']])
            .then(row => {    
                console.log(row)
                let insertedID = String(row['insertId']).split('')[0]

                conn.query("INSERT INTO favourite_has_thread VALUES (?,?)", [insertedID, target_thread_id])
                    .then(row => {
                        console.log(row)
                    }).catch(err => {
                        console.log(err)
                    })
            }).catch(err => {
                console.log(err)
            })
        conn.end()
    }).catch(err => {
        console.log(`Unable to connect: ${err}`)
    })
}

//      UPDATE METHODS

//Update Thread table, change archived variable
async function UpdateThread(is_archived, thread_id){
    pool.getConnection().then(conn => {
        conn.query("UPDATE thread SET t_archived = ? WHERE t_number = ?", [is_archived, thread_id])
            .then(result => {
                console.log(result)
            }).catch(err => {
                console.log(err)
            })
        conn.end()
    }).catch(err => {
        console.log(`Unable to connect: ${err}`)
    })
}

//Update favourites table
//For when add colors, probably add a toggle to change what type of query it will be
async function UpdateFavourite(new_name, favourite_id){
    pool.getConnection().then(conn => {
        conn.query("UPDATE favourite SET f_name = ? WHERE f_id = ?", [new_name, favourite_id])
            .then(result => {
                console.log(result)
            }).catch(err => {
                console.log(err)
            })
        conn.end()
    }).catch(err => {
        console.log(`Unable to connect: ${err}`)
    })
}

//      DELETE METHOD
//Remove Favourites
async function DeleteFavourite(favourite_id){
    pool.getConnection().then(conn => {
        conn.query("DELETE FROM favourite WHERE f_id = ?", [favourite_id])
            .then(result => {
                if(result.affectedRows != 0)
                    console.log(result)
                else
                    console.log('Favourite ID not found')
            }).catch(err => {
                console.log(err)
            })
        conn.end()
    }).catch(err => {
        console.log(`Unable to connect: ${err}`)
    })
}

//Remove Favourites relation
async function DeleteFavouriteRelation(favourite_id, thread_id){
    pool.getConnection().then(conn => {
        conn.query("DELETE FROM favourite_has_thread WHERE f_id = ? AND t_number = ?", [favourite_id, thread_id])
            .then(result => {
                if(result.affectedRows != 0)
                    console.log(result)
                else
                    console.log('Favourite ID not found')
            }).catch(err => {
                console.log(err)
            })
        conn.end()
    }).catch(err => {
        console.log(`Unable to connect: ${err}`)
    })
}

/*
//TEST
let unix = new Date().getTime();
let date = new Date(unix);
thread_data= {
    't_number': 1000001,
    't_date': `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    't_archived': false,
    't_tag': 'Page tag',
    't_filename': 'filename',
    't_size': 1234,
    't_tim': unix,
    't_replies': 5,
    't_link': 'link'
}

multiple_posts_data = [
    {
        'p_number': 2000001,
        'p_date': `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        'p_name': 'anon',
        'p_filename': 'filename',
        'p_size': 1234,
        'p_tim': unix,
        'p_com': "Comment here",
        'p_link': 'link',
        't_number': 1000001
    },
    {
        'p_number': 2000002,
        'p_date': `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        'p_name': 'anon2',
        'p_filename': 'filename',
        'p_size': 1234,
        'p_tim': unix,
        'p_com': "Comment here",
        'p_link': 'link',
        't_number': 1000001
    },
    {
        'p_number': 2000003,
        'p_date': `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        'p_name': 'anon3',
        'p_filename': 'filename',
        'p_size': 1234,
        'p_tim': unix,
        'p_com': "Comment here",
        'p_link': 'link',
        't_number': 1000001
    },
    {
        'p_number': 2000004,
        'p_date': `${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
        'p_name': 'anon4',
        'p_filename': 'filename',
        'p_size': 1234,
        'p_tim': unix,
        'p_com': "Comment here",
        'p_link': 'link',
        't_number': 1000001
    }
]

reply_data_example = [
    {
        "og_post": 2000002,
        "reply_post": 2000001
    },
    {
        "og_post": 2000003,
        "reply_post": 2000002
    },
    {
        "og_post": 2000003,
        "reply_post": 2000001
    },
    {
        "og_post": 2000004,
        "reply_post": 2000001
    },
    {
        "og_post": 2000004,
        "reply_post": 2000003
    },
]

favourite_data_example = {
    "d_date":`${date.getFullYear()}-${date.getMonth()}-${date.getDay()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
    "f_name": "Favourite 2"
}


const delay = ms => new Promise(res => setTimeout(res, ms));

async function test() {
    //InsertThreadData(thread_data)
    //InsertPosts(multiple_posts_data)
    //console.log(await IsPostNew(2000004))
    //InsertReply(reply_data_example)
    //InsertFavourite(favourite_data_example, 1000001)

    //GetAllPosts(1000001)
    //console.log(await GetThread(1000001))
    //console.log(await GetAllThreads())
    //console.log(await GetAllFavourites())
    //console.log(await GetFavourite(5))
    //console.log(await GetAllFavourites())

    //UpdateThread(false, 1000001)
    //UpdateFavourite('What I love', 5)

    //DeleteFavourite(8)
    //DeleteFavouriteRelation(5, 1000001)

    UpdateThread(true, 1000001)
    await delay(12000)
    UpdateThread(false, 1000001)

}

test()
*/

module.exports = {
    GetAllThreads,
    GetThread,
    GetAllPosts,
    IsPostNew,
    GetAllFavourites,
    GetFavourite,
    InsertThreadData,
    InsertPosts,
    InsertFavourite,
    UpdateThread,
    UpdateFavourite,
    DeleteFavourite,
    DeleteFavouriteRelation
}