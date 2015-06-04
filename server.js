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

var db = mongoose.connection;

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
app.use('/', express.static('./'));

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


/*var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var db = mongoose.connection;

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//serve static images for the app from the 'images' directory
app.use('/images', express.static(__dirname + '/images'));

//serve all things
app.use(express.static(__dirname + '/'));

if('development' == app.get('env')) {
	//mongoose.connect('mongodb://sa:<password>@ds034878.mongolab.com:34878/buhjit');
	mongoose.connect('mongodb://127.0.0.1/budgy');
}
*/
var categorySchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: { type: String, required: true }
});

var envelopeSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	bid: { type: String, required: true },
	category: { type: String, required: true },
	amount: { type: Number, required: true },
	transactions : [{
					 description: String, 
				     expense: Number, 
				     date: Date}]
});

// specify modelName, schemaObject, collectionName
var EnvelopeModel = 
	mongoose.model('envelopeModel', envelopeSchema, 'envelope');
	
var CategoryModel = 
	mongoose.model('categorySchema', categorySchema, 'categories');	

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
  	console.log('opened mongo connection');
});

app.get('/categories', function (req, res) {
	
	CategoryModel.find({}, 
		function(err, categories) {
		
		res.send(categories);
	});
});

//get the transactions
app.get('/transactions/:envelopeID' , function (req, res){
	var envelope_ID = req.params.envelopeID;
	
		var date = new Date();
	
	// last day of the previous month
	var prevMonth = new Date();
	prevMonth.setDate(0);
	prevMonth.setHours(23,59,59,999);
	
	// first day of the next month
	var nextMonth = new Date();
	nextMonth.setDate(1);
	nextMonth.setMonth(nextMonth.getMonth()+1);
	nextMonth.setHours(0,0,0,0);
	
	
	EnvelopeModel.aggregate([
		{ $match: { category: envelope_ID } },
		{ $unwind: "$transactions" },
		// only unwind those transactions occurring between prevMonth & nextMonth
		{ $match: {$and :[{"transactions.date" : {$gt: prevMonth}}, 
						 {"transactions.date" : {$lt: nextMonth}}]}},
        { $project: { envelope_id: "$_id"
			,transaction_id: "$transactions._id"
			,date: "$transactions.date"
			,description: "$transactions.description"
			,expense: "$transactions.expense"
			,_id: 0	} }
	], function(err, transactions) {
		if (err)
		{
			console.log(err.errmsg);
			res.send(err);
		}
		else
		{
			res.send(transactions);
		}
	});
	/*	var envelope_ID = req.params.envelopeID;
		
		console.log('selected envelope: %S',envelope_ID );
		EnvelopeModel.findOne({'category': envelope_ID}, function(err, envelope){
			res.json(envelope.transactions);
		}) */
});

//get the envelopes
app.get('/envelopes/:budgetId', function (req, res) {
	
	var budgetId = req.params.budgetId;
	
	var date = new Date();
	
	// last day of the previous month
	var prevMonth = new Date();
	prevMonth.setDate(0);
	prevMonth.setHours(23,59,59,999);
	
	// first day of the next month
	var nextMonth = new Date();
	nextMonth.setDate(1);
	nextMonth.setMonth(nextMonth.getMonth()+1);
	nextMonth.setHours(0,0,0,0);
	
	console.log('requested bid: %s', budgetId);
	
	// Agregação Mongo é ridiculamente divertido
	EnvelopeModel.aggregate([
		{ $match: { bid: budgetId } },
		// if there are no transactions then we need to project one with 0 expense for this month
		{ $project: { "transactions" : { "$cond": { "if": { "$eq": [ { $size: "$transactions" }, 0 ] }, 
													"then": [ { "expense" : 0, "date": date}], 
													"else": "$transactions" } },
					  // we additionally need to project those members of our parent envelope doc											
					  doc: {
								bid: "$bid",
								category: "$category",
								amount: "$amount"
						   } 
					}
		},
		{ $unwind: "$transactions" },
		// but only unwind those transactions occurring between prevMonth & nextMonth
		{ $match: {$and :[{"transactions.date" : {$gt: prevMonth}}, 
						 {"transactions.date" : {$lt: nextMonth}}]}},
		// preserve the transaction members							
		{ $project: { doc: 1, 
					  transaction_id: "$transactions._id", 
					  transactions_doc: {
											expense: "$transactions.expense"
										}
					}
		},
		// group back the results
		{ $group: {
					_id: {
						   _id: "$_id", 
						   transaction_id: "$transaction_id", 
						   doc: "$doc", 
						   transaction_doc: "$transactions_doc"
						}
					}
		},
		{ $group: {
					_id:{
							_id: "$_id._id",
							doc: "$_id.doc"
						},
					spent: { $sum: "$_id.transaction_doc.expense" },
					transactionCount: { $sum: 1 }
				}
		},
		// project back the root doc attributes
		{ $project: { _id: "$_id._id",
					 bid: "$_id.doc.bid",
					 category: "$_id.doc.category",
					 amount: "$_id.doc.amount",
					 spent: 1,
					 balance: {$subtract:["$_id.doc.amount", "$spent"]},
					 percentageSpent: {$divide:["$spent", "$_id.doc.amount"]},
					 numberOfTransactions: { "$cond": { "if": { "$eq": [ "$spent", 0 ] }, 
														"then": 0, 
														"else": "$transactionCount" } }
					 }
		}
	], function(err, envelopes) {
		res.send(envelopes);
		//res.json(envelopes); //vs having json?
	});
	
});


//create transaction
app.post('/transaction/:envelopeID' , function (req, res){
		
		var envelope_id = req.params.envelopeID;
		console.log('Adding Transaction to envelope : ',envelope_id );
		EnvelopeModel.findOneAndUpdate({'category': envelope_id},
			{ 
				"$addToSet": {
					"transactions": req.body
				}
			},	
		
		function(err,doc) {
				if (err)
				{
					console.log(err.errmsg);
					res.send(err);
				}
				else{
					console.log('transaction added');
					res.json({ message: 'transaction added!!' });					
				}				
			}
		);
});

// Update transaction
app.put('/transaction/:envelopeID' , function (req, res){
		
		var envelope_id = req.params.envelopeID;
		console.log('Updating Transaction to envelope : ',envelope_id );
		console.log('desc update: %s', req.body.expense);
		console.log('update id: %s', req.body.transaction_id);
		console.log('desc update: %s', req.body.description);
		var transactions = EnvelopeModel.transactions;
		EnvelopeModel.findOneAndUpdate({'category': envelope_id, "transactions._id": req.body.transaction_id}, 
			{ 
				"$set": {
					"transactions.$.expense": req.body.expense ,
					"transactions.$.description": req.body.description ,
					"transactions.$.date": req.body.date
				}				
			},	
		
			function(err,doc) {
				if (err)
				{
					console.log(err.errmsg);
					res.send(err);
				}
				else{
					console.log('transaction updated!!');
					res.json({ message: 'transaction updated!!' });					
				}				
			}
		);
});

// update the envelope
app.put('/envelopes/:envelope_id', function (req, res) {
	
	var envelope_id = req.params.envelope_id;
	
	console.log('updating envelope_id: %s', envelope_id);
	
	// query for envelopes given the budget id parameter
	EnvelopeModel.findById(envelope_id, function(err, envelope) {
	
		if (err)
		{
			res.send(err);
		}
		
		// ---------------------------------------------------------------
		// ---------------------------------------------------------------
		// ---------------------------------------------------------------
	/*	
		var transactions = envelope.transactions;
		var transaction = transactions[0];
		
		console.log('_id: %s, desc: %s, expense: %s, date: %s'
			,transaction._id
			,transaction.description
			,transaction.expense
			,transaction.date);
		
		transaction.expense = 3;
		
		EnvelopeModel.findOneAndUpdate(
		{ "_id": envelope_id, "transactions._id": transaction._id },
			{ 
				"$set": {
					"transactions.$": transaction
				}
				
				// alternatively, you can update individual members
				// "$set": {
					// "transactions.$.expense": transaction.expense
				// }
			},
			function(err,doc) {
				if (err)
				{
					console.log(err.errmsg);
				}
			}
		); */
		
		// ---------------------------------------------------------------
		// ---------------------------------------------------------------
		// ---------------------------------------------------------------

		envelope.amount = req.body.amount;
		envelope.category = req.body.category;
		
		envelope.save(function(err) {
		
			if (err)
			{
				res.send(err);
			}
			
			res.json({message: "envelope updated"});
		});
	});
});

// create the envelope
app.post('/envelopes', function (req, res) {
	
	console.log('creating envelope for budgetId: %s', req.body.bid);
	
	var envelope = new EnvelopeModel();
	
	envelope._id = mongoose.Types.ObjectId();
	envelope.bid = req.body.bid;
	envelope.category = req.body.category;
	envelope.amount = req.body.amount;
	
	// for testing
//	 var now = new Date();
	// now.setMonth(11);
//	 envelope.transactions = [{'description':'test','expense':2, 'date':now}
//	 ,{'description':'test','expense':2, 'date':now}
//	,{'description':'test','expense':1, 'date':now}];
		
	envelope.save(function(err) {
		
		if (err)
		{
			console.log(err);
			res.send(err);
		}

		res.json({ message: 'envelope created' });
	});
	
});

//delete transaction

app.delete('/transaction/:envelope_id/:transaction_id', function (req, res) {
	
	var envelope_id = req.params.envelope_id;
	var trans_id = req.params.transaction_id;
//	console.log('deleting transaction');
	console.log('delete id: %s', envelope_id);
	console.log('delete id: %s', trans_id);
//	console.log('delete envelope id: %s', req.body.description);
	
	EnvelopeModel.update(
                 {}, 
                 {$pull: {transactions: {_id: trans_id}}},  
                 { multi: true },
                 function(err, data){
					 if(err)
                      console.log(err, data);
					else
						res.json({ message: 'transaction deleted' });
                 }
    );

});
/*		var trans = req.params.transaction_desc;
		EnvelopeModel.findOne({'category': envelope_id}, function(err, envelope){
			
			var index = envelope.transactions.indexOf(trans);
			console.log('index is: %s', index);
			envelope.transactions.update(
				{
					'$pull': { description: trans}				
				}
			)
			if(err){
				console.log(err.errmsg);
					res.send(err);
			}
			console.log('transaction deleted!!');
			res.json({ message: 'transaction deleted!!' });
			
	}) 
		*/
/*	EnvelopeModel.findOneAndUpdate({'category': envelope_id, "transactions.description": req.body.description}, 
			{ 
				"$set": {
					"transactions.$": req.body
				}				
			},	
		
		function(err,doc) {
				if (err)
				{
					console.log(err.errmsg);
					res.send(err);
				}
				console.log('transaction updated!!');
				res.json({ message: 'transaction updated!!' });
			}
		); */

// delete envelope

app.delete('/envelopes/:envelope_id', function (req, res) {
	
	var envelope_id = req.params.envelope_id;
	console.log('deleting envelope_id: %s', envelope_id);
		
	EnvelopeModel.findByIdAndRemove(envelope_id, function(err) {
		
		if (err)
		{
			console.log(err);
			res.send(err);
		}

		res.json({ message: 'envelope deleted' });
	});
});


//app.listen(8080);
