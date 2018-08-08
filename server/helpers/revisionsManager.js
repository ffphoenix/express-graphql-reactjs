const cacheDriver = require( "node-cache" );

export default class revisionsManager {

    INPUT_TYPE_TEXT = 'text';
    INPUT_TYPE_DRAFTJS = 'draftjs';

    driver = null;

    constructor() {
        this.driver = new cacheDriver({checkperiod : 0, stdTTL : 0});
    }

    get(key) {
        try {

            return this.driver.get(key, true);
        } catch( err ) {
            return undefined;
        }
    }

    set(key, value, user) {
        try {
            return this.driver.set(key, value);
        } catch( err ) {
            console.log(err);
            return err;
        }
    }

    setUserOffline() {

    }

    del(key){
        try {
            return this.driver.del(key);
        } catch( err ) {
            return undefined;
        }
    }

}