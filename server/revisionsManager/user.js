const cacheDriver = require( "node-cache" );

export default class User {

    driver = null;
    pubsub = null;

    constructor(pubsub) {
        this.driver = new cacheDriver({checkperiod : 0, stdTTL : 0});
        this.pubsub = pubsub;
    }

    getOnline(key) {
        key = key + '-user';
        try {
            return this.driver.get(key);
        } catch( err ) {
            return undefined;
        }
    }

    setOnline(key, user) {
        let users = this.getOnline(key);
        key = key + '-user';
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
            user.action = 'add';
            console.log('--->>addonline', key)
            this.pubsub.publish('changeOnlineUser', user);
            return this.driver.set(key, users);
        } catch( err ) {
            console.log(err);
            return err;
        }
    }

    setOffline(key, user) {
        let users = this.getOnline(key);
        key = key + '-user';
        try {
            if (users === undefined) {
                return true;
            } else {
                for (let i in users) {
                    if (users[i].id === user.id) {
                        this.pubsub.publish('changeOnlineUser', user);
                        users.splice(i, 1);
                        return this.driver.set(key, users);
                    }
                }
            }
        } catch( err ) {
            console.log(err);
            return err;
        }
    }

}