import User from './user';
import ValueObject from './object';
import Revision from './revision';

export default class revisionsManager {

    constructor(pubsub) {
        this.User = new User(pubsub);
        this.ValueObject = new ValueObject();
        this.Revision = new Revision();

    }

    get(key, user) {
        try {
            this.User.setOnline(key, user);
            return {
                lastRevId : this.Revision.getAll(key).length,
                object : this.ValueObject.get(key)
            }
        } catch( err ) {
            return undefined;
        }
    }

    set(key, value, user) {
        try {
            this.User.setOnline(key, user);
            if (this.ValueObject.set(key, value)) {
                this.Revision.add(key, value, user);
            }
            return {
                lastRevId : this.Revision.getAll(key).length,
                object : this.ValueObject.get(key)
            };
        } catch( err ) {

            console.log(err);
            return err;
        }
    }

    setAsIs(key, value, user) {
        try {
            this.User.setOnline(key, user);
            if (this.ValueObject.setAsIs(key, value)) {
                this.Revision.add(key, value, user);
            }
            return {
                lastRevId : this.Revision.getAll(key).length,
                object : this.ValueObject.get(key)
            };
        } catch( err ) {
            console.log(err);
            return err;
        }
    }

    getUsersOnline(key) {
        return this.User.getOnline('issue' + key);
    }

    setUserOnline(key, user) {
        return this.User.setOnline(key, user);
    }

    setUserOffline(key, user) {
        return this.User.setOffline('issue' + key, user);
    }
}