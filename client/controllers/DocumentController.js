const sendRequest = require('../Library/TPclient');
var { _hash, STATE_URL } = require("../../lib");
var { getConstants  } = require("../../TransactionProcessor/constants");
const rest = require('../../RESTInterface');
const { json } = require('express');

const TP_FAMILY = "DLB_DOCUMENT";
const constants = getConstants(TP_FAMILY);
const TP_NAMESPACE = constants.TP_NAMESPACE;

const makeAddress = (x, label) => TP_NAMESPACE + _hash(x)

exports.storeDocument = async (req, res) => {
    let payload = req.body;     
    
    var address = makeAddress(JSON.stringify(payload));    
    let send_payload = {};
    send_payload.address = address;
    send_payload.value_encoded = payload;
    send_payload.action = 'set';
    console.log(send_payload);
    await sendRequest(send_payload)
    .then(function(response){
        let resp = {};
        resp.status = true;
        resp.messaage = "Data added to Batch Lists";        
        res.send(resp); 
    })
    .catch(function(error){
        console.log("error: ",error);
        let resp = {};
        resp.status = false;
        resp.messaage = "Error!";        
        res.send(resp);
    });              
      
}


exports.updateDocument = async (req, res) => {
    let payload = req.body;     
    let url = STATE_URL+payload.blockchain_id;
    console.log("url",url);
    rest._get(url, async function(status, body, response){
        if(!body.error){
            let data = JSON.parse(body);
            if(!data.error){ 
                let decode_data = Buffer.from(data.data, 'base64').toString('utf-8');
                let d_data = JSON.parse(decode_data);   
                if(payload.request_id!=d_data.request_id){
                    let resp = {};
                    resp.status = false;
                    resp.messaage = "Invalid Request ID!";        
                    res.send(resp);
                }
                if(payload.document_url!=""){
                    d_data.document_url = d_data.document_url+","+payload.document_url;
                }
                if(payload.beneficiary_ids!=""){
                    d_data.beneficiary_ids = d_data.beneficiary_ids+","+payload.beneficiary_ids;
                }

                let send_payload = {};
                send_payload.address = payload.blockchain_id;
                send_payload.value_encoded = d_data;
                send_payload.action = 'update';
                await sendRequest(send_payload)
                .then(function(response){
                    let resp = {};
                    resp.status = true;
                    resp.messaage = "Data added to Batch Lists";        
                    res.send(resp); 
                })
                .catch(function(error){
                    console.log("error: ",error);
                    let resp = {};
                    resp.status = false;
                    resp.messaage = "Error!";        
                    res.send(resp);
                });   
            }                                               
        }else{
            let resp = {};
            resp.status = false;
            resp.messaage = "Provided blockchain id is not found!";        
            res.send(resp);
        }                                                                        
    });
}


exports.deleteDocument = async (req, res) => {
    let payload = req.body;     
    let url = STATE_URL+payload.blockchain_id;
    rest._get(url, async function(status, body, response){
        if(!body.error){
            let data = JSON.parse(body);
            if(!data.error){ 
                let decode_data = Buffer.from(data.data, 'base64').toString('utf-8');
                let d_data = JSON.parse(decode_data);   
                if(payload.request_id!=d_data.request_id){
                    let resp = {};
                    resp.status = false;
                    resp.messaage = "Invalid Request ID!";        
                    res.send(resp);
                }
                if(payload.document_url!=""){
                    d_data.document_url = payload.document_url;
                }
                if(payload.beneficiary_ids!=""){
                    d_data.beneficiary_ids = payload.beneficiary_ids;
                }

                let send_payload = {};
                send_payload.address = payload.blockchain_id;
                send_payload.value_encoded = d_data;
                send_payload.action = 'update';
                await sendRequest(send_payload)
                .then(function(response){
                    let resp = {};
                    resp.status = true;
                    resp.messaage = "Data added to Batch Lists";        
                    res.send(resp); 
                })
                .catch(function(error){
                    console.log("error: ",error);
                    let resp = {};
                    resp.status = false;
                    resp.messaage = "Error!";        
                    res.send(resp);
                });   
            }                                               
        }else{
            let resp = {};
            resp.status = false;
            resp.messaage = "Provided blockchain id is not found!";        
            res.send(resp);
        }                                                                        
    });
}

exports.checkDocument = async (req, res) => {
    let payload = req.body;     
    let url = STATE_URL+payload.blockchain_id;
    console.log("url",url);
    rest._get(url, async function(status, body, response){
        if(!body.error){
            let data = JSON.parse(body);
            if(!data.error){ 
                let decode_data = Buffer.from(data.data, 'base64').toString('utf-8');
                console.log(decode_data);
                let d_data = JSON.parse(decode_data); 
                let resp = {};
                if(payload.request_id!=d_data.request_id){                    
                    resp.status = false;
                    resp.messaage = "Invalid Request ID!";        
                    res.send(resp);
                }
                let beneficiaryIds = d_data.beneficiary_ids.split(',');
                if(beneficiaryIds.includes(payload.beneficiary_ids)){
                    resp.status = true;
                    resp.messaage = "Successfully authorized!";        
                    res.send(resp); 
                }else{
                    resp.status = false;
                    resp.messaage = "You are not authorized to access this request!";        
                    res.send(resp); 
                }                    
            }                                               
        }else{
            let resp = {};
            resp.status = false;
            resp.messaage = "Provided blockchain id is not found!";        
            res.send(resp);
        }                                                                        
    });
                
      
}