const request = require('request');

const API_ENDPOINT = "https://dlb.estate-registry.ca/digital-lock-box/public/api/v1/";

/**
 * 
 * @param {string} url URL to make the request
 * @param {function} cb callback function to return  
 */
exports._get = (url,cb) => {
    try {
        let _uri = url;
        let options = {
            url: _uri,
            method: 'GET',
            headers: {
                //Authorization: 'Bearer ' + env.BITGO_ACCESS_TOKEN,
                'Content-Type': 'application/json'
            }
        };
        request(options, function (error, response, body) {
            if (error) {
                console.error(`error on get request uri:${_uri} error:${error}`);
                cb(false,error,{});
            } else {
                cb(true,body,response);
            }
        });
    } catch (error) {
        cb(false,error,{});
    }
};


/**
 * 
 * @param {string} url 
 * @param {Object} data 
 * @param {function} cb 
 */
exports._post = (url,data,cb) => {
    try {
        let _uri = API_ENDPOINT + url;
        let options = {
            url: _uri,
            method: 'POST',
            body: data,
            json: true,
            headers: {
                //Authorization: 'Bearer ' + env.BITGO_ACCESS_TOKEN,
                'Content-Type': 'application/json'
            }
        };
        request(options, function (err, response, body) {            
            if (err) {
                console.error(`error on post request uri:${_uri} error:${err}`);
                cb(false,err,{});
            }else{
                cb(true,body,response);
            }
        });
    } catch (error) {
        cb(false,error);
    }
}