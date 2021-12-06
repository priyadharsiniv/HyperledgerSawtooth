const rest = require('../RESTInterface');
const WebSocket = require('ws');
 
const ws = new WebSocket('ws:localhost:8008/subscriptions');
 
ws.on('open', function open() {
  console.log("onopen")
  ws.send(JSON.stringify({
    'action': 'subscribe',
  }))
  
});
 
ws.on('message', (data) => {
  console.log(data);
  data = JSON.parse(data)
  if(data.state_changes.length!=0){
    let tp_address = data.state_changes[0].address;
    let event_data = Buffer.from(data.state_changes[0].value, 'base64').toString('utf-8');
    console.log("event_data", event_data);
    if(event_data!="")
    {
        try{
            //call webhook to client
            let data = {};    
            data.tp_address = tp_address;    
            data.data = JSON.parse(event_data);
            rest._post("update-blockchain-id",data, function(status, body, response){
             console.log(body);          
            });
        }catch(e){
            console.log(e);  
        }
    }
  }  
});