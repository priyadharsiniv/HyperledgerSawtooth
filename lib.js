const crypto = require("crypto");
const http = require("https");


exports._hash = (x) =>
    crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 64)

exports.hash = (data) => {
    crypto.createHash('sha512').update(data).digest('hex');
}


exports.check_namespace = (namespace) => {
    return new Promise((resolve, reject)=>{
        let TP_FAMILIES = ["DLB_DOCUMENT"];
        for(let i = 0; i < TP_FAMILIES.length; i++){
            if(this._hash(TP_FAMILIES[i]).substring(0, 6) == namespace){
                resolve(TP_FAMILIES[i]);
            }            
        }
        if(i==TP_FAMILIES.length){
            reject('No families found');
        }
    })
    
}


exports.STATE_URL = "http://localhost:8008/state/";
exports.BLOCK_URL = "http://35.166.74.81:8008/blocks";

exports._successResponse = (data) => {
    return new Promise( (resolve, reject) => {
        try{
            let response = {};
            response.status = true;
            response.data = data;
            resolve(response);
        }catch(e){
            let response = {};
            response.status = false;
            response.message = e.message;
            reject(response);
            
        }
    });    
}


exports._errorResponse = (errData) => {
    return new Promise( (resolve, reject) => {
        try{
            let response = {};
            response.status = false;
            response.message = errData;
            resolve(response);
        }catch(e){
            let response = {};
            response.status = false;
            response.message = e.message;
            reject(response);
            
        }
    });  
}