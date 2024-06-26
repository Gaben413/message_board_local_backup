const { Sequelize, DataTypes } = require('sequelize');
const database = require('./database-manager');

const User = database.define('user', {
    user_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    username: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    admin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    verified:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
})

const Token_Blacklist = database.define('token_blacklist', {
    blacklist_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    token: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    creation_date:{
        type: DataTypes.DATE
    }
}, {
    timestamps: false
});

const Favourite = database.define('favourite', {
    f_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    f_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    f_description: {
        type: DataTypes.TEXT
    },
    f_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    user_id: {
        type: DataTypes.INTEGER
    },
},
{
    timestamps: false
})

const Image = database.define('image', {
    i_tim: {
        type: DataTypes.BIGINT,
        primaryKey: true,
    },
    i_filename: {
        type: DataTypes.STRING,
        allowNull: false
    },
    i_filesize: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    i_ext: {
        type: DataTypes.STRING(7),
        allowNull: false
    }
},
{
    timestamps: false
})

const Thread = database.define('thread', {
    t_number: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    t_board: {
        type: DataTypes.STRING,
        defaultValue: '/co/'
    },
    t_date: {
        type: DataTypes.DATE
    },
    t_archived: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    t_sub: {
        type: DataTypes.STRING
    },
    t_tag: {
        type: DataTypes.STRING
    },
    t_replies: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    t_link: {
        type: DataTypes.STRING
    }
},
{
    timestamps: false
})

const Post = database.define('post', {
    p_number: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    p_date: {
        type: DataTypes.DATE
    },
    p_name: {
        type: DataTypes.STRING,
        defaultValue: 'anon'
    },
    p_tag: {
        type: DataTypes.STRING
    },
    p_replies: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    p_link: {
        type: DataTypes.STRING
    },
    p_com: {
        type: DataTypes.TEXT
    },
    i_tim:{
        type: DataTypes.BIGINT
    },
    t_number: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
},
{
    timestamps: false
})

const BW_List = database.define('bw_list', {
    bwl_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    list_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['black', 'white']]
        }
    },
    tp_number: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    comm:{
        type: DataTypes.STRING,
        allowNull: true
    }
},{
    timestamps: false
})

/*
//Most likely unecessary
const replies = database.define('replies', {
    p_number: {
        type: DataTypes.INTEGER,
        references: {
            model: Post,
            key: 'p_number'
        }
    },
    r_number: {
        type: DataTypes.INTEGER,
        references: {
            model: Post,
            key: 'p_number'
        }
    }
},
{
    timestamps: false
})
*/
const favourite_has_thread = database.define('favourite_has_thread', {
    f_id: {
        type: DataTypes.INTEGER,
        /*
        references: {
            model: Favourite,
            key: 'f_id'
        }
        */
    },
    t_number: {
        type: DataTypes.INTEGER,
        /*
        references: {
            model: Thread,
            key: 't_number'
        }
        */
    }
},
{
    timestamps: false
})

Thread.hasMany(Post, {
    foreignKey: 't_number'
})

Image.hasOne(Post, {
    foreignKey: 'i_tim'
})

User.hasMany(Favourite, {
    foreignKey: 'user_id'
})
Thread.hasMany(favourite_has_thread, {
    foreignKey: 't_number'
})
Favourite.hasMany(favourite_has_thread, {
    foreignKey: 'f_id'
})
//database.sync()

module.exports = { User, Token_Blacklist, Favourite, Image, Thread, Post, BW_List, favourite_has_thread };