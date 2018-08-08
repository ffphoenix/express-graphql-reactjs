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
        console.log('ser object');

        try {
            let data = this.driver.get(key);
            data = j.patch(data, value);
            console.log(data);
            return this.driver.set(key, data);
        } catch( err ) {
            return err;
        }
    }

}