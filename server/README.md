![npm](https://img.shields.io/npm/v/npm.svg)

Server express + apollo 
=========================
Init 
```
npm install
```

Run: 
```
npm start
```
It opens on 4000 port

## Sequelize init 
http://docs.sequelizejs.com/manual/tutorial/migrations.html

## Migrations 
Add migration or seed 

```
node_modules/.bin/sequelize migration:create --name create_user_table
or
node_modules/.bin/sequelize seed:generate --name demo-user
```

Migrate & Seed
```
node_modules/.bin/sequelize db:migrate
node_modules/.bin/sequelize db:seed:all
```
****