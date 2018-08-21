const cacheDriver = require( "node-cache" );

export default class Revision {

    driver = null;

    constructor() {
        this.driver = new cacheDriver({checkperiod : 0, stdTTL : 0});
    }

    getAll(key) {
        key = key + '-rev';
        try {
            return this.driver.get(key, true);
        } catch( err ) {
            return undefined;
        }
    }

    getRev(key, revId) {
        key = key + '-rev';

        try {
            const revisions = this.getAll(key);
            return revisions[revId];
        } catch( err ) {
            return undefined;
        }
    }

    add(key, value, user) {
        key = key + '-rev';
        try {
            let revisions = this.getAll(key);
            if (revisions === undefined) {
                revisions = [];
            }

            const dateTime = new Date().getTime();
            let rev = {
                time : dateTime,
                userId : user.id,
                value : value
            }
            revisions.push(rev);
            console.log('---> revision add ---> [' + key + '] ', value, revisions);
            return this.driver.set(key, revisions);
        } catch( err ) {
            console.log(err);
            return err;
        }
    }

}