const express = require('express')
var Router = require('./routes/index');
const cors = require('cors');


const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(cors());

app.use('/', Router);



app.listen(8181,function(){
  console.log("Listening to port 8181");
});