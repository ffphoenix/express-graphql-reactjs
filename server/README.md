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
Opened on 4000 port


## Migrations
Add migration or seed 

```
node db/migration.js add migration create_table_users
or
node db/migration.js add seed create_table_users
```

Migrate 
```
node db/migration.js up
```
****