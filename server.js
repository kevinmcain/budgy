var express = require('express');
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
	
	mongoose.connect('mongodb://127.0.0.1/budgy');
}

var envelopeSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	bid: String,
	cid: String,
	category: String,
	amount: Number,
	balance: Number,
	transactions : [{description: String, 
				     expense: Number, 
				     date: String}]
});

// specify modelName, schemaObject, collectionName
var envelopeModel = 
	mongoose.model('envelopeModel', envelopeSchema, 'envelope');

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function (callback) {
  	console.log('opened mongo connection');
});

app.get('/envelopes/:budgetId', function (req, res) {
	
	var budgetId = req.params.budgetId;
	
	console.log('requested bid: %s', budgetId);
	
	// Agregação Mongo é ridiculamente divertido
	envelopeModel.aggregate([
		{ $match: { bid: budgetId } },
		{ $project: { "transactions" : { "$cond": { "if": { "$eq": [ { $size: "$transactions" }, 0 ] }, 
													"then": [ { "expense" : 0 }], 
													"else": "$transactions" } },
					  doc: {
								category: "$category",
								amount: "$amount"
						   } 
					}
		},
		{ $unwind: "$transactions" },
		{ $project: { doc: 1, 
					  transaction_id: "$transactions._id", 
					  transactions_doc: {
											expense: "$transactions.expense"
										}
					}
		},
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
					spent: { $sum: "$_id.transaction_doc.expense" }
				}
		},
		{ $project: { _id: "$_id._id", 
					 category: "$_id.doc.category",
					 amount: "$_id.doc.amount",
					 spent: 1,
					 balance: {$subtract:["$_id.doc.amount", "$spent"]}
					 }
		}
	], function(err, envelopes) {
		res.send(envelopes);
	});
	
});

// update the envelope
app.put('/envelopes/:envelope_id', function (req, res) {
	
	var envelope_id = req.params.envelope_id;
	
	console.log('updating envelope_id: %s', envelope_id);
	
	// query for envelopes given the budget id parameter
	envelopeModel.findById(envelope_id, function(err, envelope) {
	
		if (err)
		{
			res.send(err);
		}
		
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
	
	var envelope = new envelopeModel();
	
	envelope._id = mongoose.Types.ObjectId();
	envelope.bid = req.body.bid;
	envelope.cid = req.body.cid;
	envelope.category = req.body.category;
	envelope.amount = req.body.amount;
	envelope.spent = 0;

	// for testing
	// envelope.transactions = [{'description':'test','expense':2, 'date':'05/23/2015'}
	// ,{'description':'test','expense':2, 'date':'05/23/2015'}
	// ,{'description':'test','expense':1, 'date':'05/23/2015'}];
		
	envelope.save(function(err) {
		
		if (err)
		{
			console.log(err);
			res.send(err);
		}

		res.json({ message: 'envelope created' });
	});
	
});

app.delete('/envelopes/:envelope_id', function (req, res) {
	
	var envelope_id = req.params.envelope_id;
	console.log('deleting envelope_id: %s', envelope_id);
		
	envelopeModel.findByIdAndRemove(envelope_id, function(err) {
		
		if (err)
		{
			console.log(err);
			res.send(err);
		}

		res.json({ message: 'envelope deleted' });
	});
});


app.listen(8080);