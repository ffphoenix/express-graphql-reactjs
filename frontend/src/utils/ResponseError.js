import { urlWithParams } from './utils';

/**
 * Check for response errors and display it.
 * 
 * @export
 * @class ResponseError
 */
export default class ResponseError {
    constructor(response) {
        this.response = response;
    }

    displayErrors() {
        const response = this.response;

        if(response.hasOwnProperty('status') && response.status == false) {
            console.log('message: ' + response.message);
            console.log('errors:');

            for (let key in response.errors) {
                console.log(key + ' - ' + response.errors[key]);
            }
        }
    }
}