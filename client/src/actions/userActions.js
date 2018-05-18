import * as constants from '../utils/constants';
import ApiClient from '../utils/ApiClient';
import ResponseError from '../utils/ResponseError';

function detectErrors(data) {
    let responseError = new ResponseError(data);

    return responseError.displayErrors();
}

const methods = ['browse', 'read' ,'edit', 'add', 'remove'];

/**
 * Start request.
 * 
 * @param {string} endpoint 
 * @returns Object
 */
function requestData(endpoint) {
    return {
        type: constants.PROPERTY_TYPE_REQUEST,
        isFetching: true,
        endpoint: endpoint
    };
}

/**
 * Rececive data.
 * 
 * @param {string} endpoint 
 * @param {any} properties 
 * @returns Object
 */
function receciveData(endpoint, data) {
    return {
        type: constants.PROPERTY_TYPE_SUCCESS,
        isFetching: false,
        endpoint: endpoint,
        data
    };
}

/**
 * Catch error.
 * 
 * @param {string} endpoint 
 * @param {string} message 
 * @returns Object
 */
function dataError(endpoint, message) {
    return {
        type: constants.PROPERTY_TYPE_FAILURE,
        isFetching: false,
        endpoint: endpoint,
        message
    }
}

/**
 * Action builder.
 * 
 * @returns 
 */
function buildActions() {
    let result = {};

    methods.forEach((action) => {
        result[action] = (mixed, data) => (dispatch) => new Promise ((resolve, reject) => {
            const api = new ApiClient('property');
            const endpoint = 'property/type';
            let fetch = {};

            dispatch(requestData(action));

            switch (action) {
                case 'browse':
                    fetch = api.get(endpoint, mixed);
                    break;
                case 'read':
                    fetch = api.get(endpoint + '/' + mixed);
                    break;
                case 'edit':
                    fetch = api.put(endpoint + '/' + mixed, data);
                    break;
                case 'add':
                    fetch = api.post(endpoint, mixed);
                    break;
                case 'remove':
                    fetch = api.delete(endpoint + '/' + mixed);
                    break;
            }

            fetch
                .then((response) => {
                    dispatch(receciveData(action, response.data));
                    detectErrors(response);
                    resolve(response);
                })
                .catch((err) => {
                    dispatch(dataError(action, err.message));
                    reject(err);
                });
        });
    });

    return result;
}

export const actions = {...buildActions()};