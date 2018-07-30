if (process.env.ENVIROMENT && process.env.ENVIROMENT === 'stage') {
    require('dotenv').load();
}

module.exports = {
    production: {
        host     : 'localhost',
        username : 'root',
        password : 'root',
        database : 'task',
        dialect  : 'mysql',
    },
    development: {
        host     : process.env.DB_HOST || 'localhost',
        username : process.env.DB_USER || 'root' ,
        password : process.env.DB_PASSWORD || 'root' ,
        database : process.env.DB_DATABASE_NAME || 'task',
        dialect  : 'mysql',
    },
    jwt_secret : 'fa4wTs2*r4IIIda3151%'
};