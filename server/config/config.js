module.exports = {
    development: {
        host     : 'localhost',
        username : 'root',
        password : 'root',
        database : 'task',
        dialect  : 'mysql',
    },
    production: {
        host     : 'localhost',
        username : 'root',
        password : 'root',
        database : 'task',
        dialect  : 'mysql',
    },
    stage: {
        host     : CLEARDB_DATABASE_URL,
        username : 'b5e7b70e116a7e',
        password : 'dafa8616',
        database : 'heroku_8608fe5df80fd94',
        dialect  : 'mysql',
    },
    jwt_secret : 'fa4wTs2*r4IIIda3151%'
};