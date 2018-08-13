import j from 'jsondiffpatch';
import cacheDriver from "node-cache";

export default class ValueObject {

    driver = null;

    constructor() {
        this.driver = new cacheDriver({checkperiod : 0, stdTTL : 0});
    }

    get(key) {
        try {
            let data = this.driver.get(key);
            if (data !== undefined ) {
                return data;
            }
        } catch( err ) {
            return undefined;
        }
    }

    set(key, value) {
        try {
            let data = this.driver.get(key);
            if (data !== undefined) {
                data = j.patch(data, value);
            } else {
                data = value;
            }
            return this.driver.set(key, data);
        } catch( err ) {
            console.log('ERR---> ', err);
            return err;
        }
    }

}