import { toQueryString, objectToFormData } from './utils';

/**
 * Api client to send requests
 * Calling example:  
 * const api = ApiClient('property')
 * api.post('endpoint')
 * 
 * @export
 * @class ApiClient
 */
export default class ApiClient {
    constructor(module, {
                headers,
                toJson,
              } = {}) {
        this.token =  localStorage.getItem("auth_token");
        this.module = module;
        this.headers = headers;
        this.toJson = toJson || true;
    }

    get(endpoint, params) {
        return this.request('GET', endpoint, params);
    }

    post(endpoint, params) {
        return this.request('POST', endpoint, params);
    }

    put(endpoint, params) {
        return this.request('PUT', endpoint, params);
    }

    patch(endpoint, params) {
        return this.request('PATCH', endpoint, params);
    }

    delete(endpoint, params) {
        return this.request('DELETE', endpoint, params);
    }

    file(endpoint, params) {
        const formData = objectToFormData(params);
        
        this.headers = [];

        let url = this.serverUrl(endpoint);
        let fetchData = {
            method: 'POST',
            headers: this.authHeader(),
            mode: 'cors',
            body: formData 
        }
        
        let fetchRequest = fetch(url, fetchData);

        if (this.toJson) {
            fetchRequest = fetchRequest.then((response) => response.json())
        }

        return fetchRequest;
    }

    request(method, endpoint, params) {
        let url = '';
        let fetchData = {};
        if (params) {
            url = this.serverUrl(endpoint) + '?' + toQueryString(params);
        } else {
            url = this.serverUrl(endpoint);
        }
        
        if(method.toUpperCase() == 'GET') {
            fetchData = {
                method: method,
                headers: this.authHeader(),
                mode: 'cors'
            }
        } else {
            params = (params ? params : {});
            params = JSON.stringify(params);
            url = this.serverUrl(endpoint);
            
            fetchData = {
                method: method,
                headers: this.authHeader(),
                mode: 'cors',
                body: params 
            }
        }

        let fetchRequest = fetch(url, fetchData);

        if (this.toJson) {
            fetchRequest = fetchRequest.then((response) => response.json())
        }

        return fetchRequest;
    }

    serverUrl(endpoint) {
        return `http://dev-${this.module}api.us-east-1.elasticbeanstalk.com/${endpoint}`
        //return `http://localhost:8002/${endpoint}`
    }

    authHeader() {
        if(this.headers == undefined) {
            this.headers = {};
            this.headers['Content-Type'] = 'application/json';
        }

        return Object.assign({ 
            'Authorization': `Bearer ${this.token}`,
            'Accept': 'application/json'
        }, this.headers);
    }
}