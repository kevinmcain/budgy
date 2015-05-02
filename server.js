var express = require('express');
var app = express();
var mongoose = require('mongoose');

//serve static images for the app from the 'images' directory
app.use('/images', express.static(__dirname + '/images'));
//serve static images for the app from the 'application_pages' directory in the app dir
app.use(express.static(__dirname + '/application_pages/'));

if('development' == app.get('env')) {
	//app.use(express.errorHandler());
	mongoose.connect('mongodb://127.0.0.1/budgy');
}

app.get('/', function(req, res) {
	res.send('ok');
});
app.listen(80);
