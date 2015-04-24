var express = require('express');
var app = express();

//serve static images for the app from the 'images' directory
app.use('/images', express.static(__dirname + '/images'));
//serve static images for the app from the 'application_pages' directory in the app dir
app.use(express.static(__dirname + '/application_pages/'));
app.listen(80);
