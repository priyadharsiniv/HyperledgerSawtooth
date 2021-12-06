const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction, InternalError } = require('sawtooth-sdk/processor/exceptions')
const cbor = require('cbor')
const DlbState = require('./state');

class DlbHandler extends TransactionHandler {
  constructor(TP_FAMILY,TP_NAMESPACE) {
    super(TP_FAMILY, ['1.0'], [TP_NAMESPACE]) 
  }

  apply(transactionProcessRequest, context) {
    console.log("tp came");
    
    let payload = cbor.decode(transactionProcessRequest.payload);
    let dlbState = new DlbState(context);

    if (payload.action === 'update') {
          return dlbState.updateValue(payload)
      } else  if (payload.action === 'set') {
          return dlbState.setValue(payload)
      }else  if (payload.action === 'delete') {
        return dlbState.deleteValue(payload)
    } else {
      throw  new InvalidTransaction(
        `Action must be create, delete, or take not ${payload.action}`
      )
    }
  }
}

module.exports = DlbHandler;