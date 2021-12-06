const express = require('express');  


// var router = express.Router();
var router = express.Router();

const { storeDocument, updateDocument, deleteDocument, checkDocument } = require('../controllers/DocumentController');


//post method for store will document url
router.post('/store-document',  storeDocument);

//post method for update will document url
router.post('/update-document',  updateDocument);
router.post('/delete-document',  deleteDocument);

//post method to check access for document
router.post('/check-access', checkDocument);


module.exports = router;