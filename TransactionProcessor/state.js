var { _hash } = require("../lib");
// var { TP_NAMESPACE } = require("./constants");
const { createHash } = require('crypto')


// const makeAddress = (x, label) => TP_NAMESPACE + _hash(x)


class SimpelStoreState {

  constructor(context) {
    this.context = context;
    this.timeout = 500;
    this.stateEntries = {};
  }

  setValue(value) {    
    //var createhash_value = hash(val);
    //var address = makeAddress(val);
    var address = value.address;
    
    var stateEntriesSend = {}
    var address = value.address;
    let value_encoded = value.value_encoded;          
    //console.log("address: ", address)
    //console.log("value_encoded: ", value_encoded)
    stateEntriesSend[address] = Buffer.from(JSON.stringify(value_encoded));    
    return  this.context.setState(stateEntriesSend, this.timeout).then(function(result) {
        console.log("Success", result)            
      }).catch(function(error) {
        console.error("Error", error)
      })          
  }

  deleteValue(value) {
    var block_address = value.block_address;
    let address = block_address.split(',');    
    for(var prop in address) {    
      console.log("split address ",address[prop]);
      this.context.deleteState([address[prop]]);
    }
  }

  getValue(value) {
    var address = value.block_address;
    return  this.context.getState([address], this.timeout).then(function(stateEntries) {
      //console.log("stateEntries: ",stateEntries);
      Object.assign(this.stateEntries, stateEntries);
      console.log(this.stateEntries[address].toString())
      return false;
    }.bind(this))
  }

  updateValue(value) {
    var address = value.address;
    console.log("value: ",value); 
    try{      
      let data = value.value_encoded;
      var stateEntriesSend = {}
      stateEntriesSend[address] = Buffer.from(JSON.stringify(data)); 
      console.log("stateEntriesSend", stateEntriesSend)      
      return  this.context.setState(stateEntriesSend, this.timeout).then(function(result) {
          console.log("Success", result)            
        }).catch(function(error) {
          console.error("Error", error)
        }) 
    }catch(e){
      console.error("Error2", e)
    }
  }


}




module.exports = SimpelStoreState;