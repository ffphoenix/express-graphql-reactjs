const cacheDriver = require( "node-cache" );

export default class User {

    driver = null;

    constructor() {
        this.driver = new cacheDriver({checkperiod : 0, stdTTL : 0});
    }

    getOnline(key) {
        key = key + '-user';
        try {
            return this.driver.get(key, true);
        } catch( err ) {
            return undefined;
        }
    }

    setOnline(key, user) {
        key = key + '-user';
        let users = this.getOnline(key);
        if (users === undefined) {
            users = [];
        } else {
            for (let i in users) {
                if (users[i].id === user.id) {
                    return true;
                }
            }
        }

        try {
            users.push(user);
            return this.driver.set(key, users);
        } catch( err ) {
            console.log(err);
            return err;
        }
    }

    setOffline(key, user) {
        key = key + '-user';
        try {
            let users = this.getOnline(key);
            if (users === undefined) {
                return true;
            } else {
                for (let i in users) {
                    if (users[i].id === user.id) {
                        users.splice(i, 1);
                        return true;
                    }
                }
            }
        } catch( err ) {
            console.log(err);
            return err;
        }
    }

}