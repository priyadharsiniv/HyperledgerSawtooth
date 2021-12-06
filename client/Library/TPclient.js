const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')
const { createHash } = require('crypto')
const cbor = require('cbor')
const { protobuf } = require('sawtooth-sdk')
const request = require('request')

var { getConstants  } = require("../../TransactionProcessor/constants");

const context = createContext('secp256k1')
const privateKey = context.newRandomPrivateKey()
const signer = new CryptoFactory(context).newSigner(privateKey)

const TP_FAMILY = "DOCUMENT";
const constants = getConstants(TP_FAMILY);
const BASE_IP = constants.BASE_IP;
const TP_NAMESPACE = constants.TP_NAMESPACE;


function  sendRequest(payload) {

    return new Promise((resolve, reject)=>{
        const payloadBytes = cbor.encode(payload) 
        const transactionHeaderBytes = protobuf.TransactionHeader.encode({
          familyName: TP_FAMILY,
          familyVersion: '1.0',
          inputs: [TP_NAMESPACE],
          outputs: [TP_NAMESPACE],
          signerPublicKey: signer.getPublicKey().asHex(),
          batcherPublicKey: signer.getPublicKey().asHex(),
          dependencies: [],
          payloadSha512: createHash('sha512').update(payloadBytes).digest('hex'),
          nonce: (new  Date()).toString()
        }).finish()
      
      const signature = signer.sign(transactionHeaderBytes)
      
      const transaction = protobuf.Transaction.create({
        header: transactionHeaderBytes,
        headerSignature: signature,
        payload: payloadBytes
      })
      
      const transactions = [transaction]
      
      const batchHeaderBytes = protobuf.BatchHeader.encode({
        signerPublicKey: signer.getPublicKey().asHex(),
        transactionIds: transactions.map((txn) => txn.headerSignature),
      }).finish()
      
      headerSignature = signer.sign(batchHeaderBytes)
      
      const batch = protobuf.Batch.create({
        header: batchHeaderBytes,
        headerSignature: headerSignature,
        transactions: transactions
      })
      
      const batchListBytes = protobuf.BatchList.encode({
        batches: [batch]
      }).finish()
      
      request.post({
        url: 'http://'+BASE_IP+':8008/batches',
        body: batchListBytes,
        headers: { 'Content-Type': 'application/octet-stream' }
      }, (err, response) => {
        let res = {};
        console.log(err)
        if (err){
          reject(err);
        }             
        res.status = true;
        res.messaage = "Data added to Batch Lists";        
        resolve(response);
      })
    })
}

  module.exports = sendRequest;
