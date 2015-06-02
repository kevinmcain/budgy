var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var http = require("http");
var uriUtil = require("mongodb-uri");
var util = require('util');
var morgan = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var crypto = require('crypto');

//put config url behind file to hide passwords and username
var mongoDBConnection = require('./db.budgy.config');
console.log("mongodb URI: " + mongoDBConnection.uri);

var mongooseUri = uriUtil.formatMongoose(mongoDBConnection.uri);
console.log("mongooseDB URI:" + mongooseUri);

var app = express();
app.set('port', process.env.PORT || 8080); //3000);
app.use(morgan('combined'));
//app.use(cookieParser());
app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());
app.use(methodOverride());

/*
app.use(session({ 
		secret: 'keyboard cat',
		store: new MongoStore({ 
			url: 'mongodb://dbAdmin/test@localhost:3000/budgy',
			collection: 'sessions'})
}));
*/
// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });



var options = { server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } } }; 
mongoose.connect(mongooseUri, options);

app.use(session({ 
		secret: 'keyboard cat',
		store: new MongoStore({ 
			mongooseConnection: mongoose.connection,
			collection: 'sessions'
		})
}));

console.log('Sending connecting request with Mongo db');
mongoose.connection.on('error', function() {
	console.log("problems connecting to the MongoDB server");
});
mongoose.connection.on('open', function() {
	console.log("After connecting to Mongo");
	var Schema = mongoose.Schema;
	var UsersSchema = new Schema (
		{
			fName: String,
			lName: String,
			username: String,
			email: String,
			extra: String,
			hashed_pwd: String		
		},
		{collection: 'users'}
	);	
	Users = mongoose.model('Users', UsersSchema);
});

function displayDBError(err){
	if (err) { 
		console.log("error 1: " + err);
		for (p in err) {
			console.log(p + ":" + err[p]);
		}
	}
	else {
		console.log("no errors querying the db");
	}
}

console.log("before creating query functions");

function retrieveUserId(req, res, query) {
	console.log("calling retrieve user Id");
	var query = Users.findOne(query);
	query.exec(function (err, user) {
		if (!user) {
			res.sendStatus(404);
		}
		else {
			//req.session.regenerate(function(){
				req.session.user = user.id.valueOf();
				req.session.username = user.username;
				req.session.email = user.email;
			//});
		}
		if (err) {
			console.log("errors accessing users");
		}
		else {
			console.log("----------->user info:" + user);
			res.sendStatus(200);
		}
	});	
}

function retrieveUserIdWithPwd(req, res, query) {
	console.log("calling retrieve user Id");
	var query = Users.findOne(query);
	query.exec(function (err, user) {
		if (!user) {
			req.session.user = undefined;
			res.sendStatus(404);
			return;
		}
		else {
			var pwd = req.query.password;
			var hashedPwd = crypto.createHash('sha256').update(pwd).digest('base64').toString();
			
			if (hashedPwd === user.hashed_pwd) {
				req.session.user = user.id.valueOf();
				req.session.username = user.username;
				req.session.email = user.email;
				console.log('user information is correct');
			}
			else {
				console.log('incorrect password');
			}
		}
		if (err) {
			console.log("errors accessing users");
		}
		else {
			console.log("----------->user info:" + user);
			res.sendStatus(200);
		}
	});	
}


console.log("before defining app static route");
app.use('/', express.static('./public'));

app.get('/app/login/:username', function (req, res) {
	console.log("making a login request to server");
	console.log(req);
	var id = req.params.username;
	retrieveUserId(req, res, {username: id});
});

app.get('/app/login/', function (req, res) {
	console.log("making a login request to server via form");
	console.log(req);
	var id = req.query.username;
	retrieveUserIdWithPwd(req, res, {username: id});
});


console.log("after defining all dynamic routes");


http.createServer(app).listen(app.get('port'), function(){
	console.log("Express server listening on port " + app.get('port'));
});	
console.log("after callintg http: createServer");
