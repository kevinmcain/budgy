var express = require('express')
  , passport = require('passport')
  , util = require('util')
  , ejs = require('ejs')
  , http = require('http')
  , morgan = require('morgan')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , cookieParser = require('cookie-parser')
  , session = require('express-session')
  , FacebookStrategy = require('passport-facebook').Strategy
  , mongoose = require('mongoose');

var db = mongoose.connection;
mongoose.connect('mongodb://127.0.0.1/budgy');

var usersSchema = mongoose.Schema({
	fName: String,
	lName: String,
	username: String,
	email: String,
	extra: String,
	facebookId: String,
	hashed_pwd: String
});

var UserModel = 
	mongoose.model('userModel', usersSchema, 'users');



// =========================================================================
// FACEBOOK ================================================================
// =========================================================================

var FACEBOOK_APP_ID = "1578650549075293"; 
var FACEBOOK_APP_SECRET = "266246799c208f1e7e2f248a4dcdce9c";
var FACEBOOK_CALLBACK_URL = 'http://localhost:8080/auth/facebook/callback';

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
	done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
	UserModel.findById(id, function(err, user) {
		done(err, user);
	});
});

// passport.serializeUser(function(user, done) {
  // done(null, user);
// });

// passport.deserializeUser(function(obj, done) {
  // done(null, obj);
// });

passport.use(new FacebookStrategy({

	// pull in our app id and secret from our auth.js file
	clientID        : FACEBOOK_APP_ID,
	clientSecret    : FACEBOOK_APP_SECRET,
	callbackURL     : FACEBOOK_CALLBACK_URL

},

// facebook will send back the token and profile
function(token, refreshToken, profile, done) {

	// asynchronous
	process.nextTick(function() {

	
	
	UserModel.findOne({ facebookId: profile.id},
		function(err, user) {
			if (err) {
				console.log(err.errmsg);
				return done(err);
			}
			
			if (user) {
				return done(null, user); // user found, return that user
				// BudgetModel.findOne({ user_id: userId},
					// function(err, budget) {
						// if (err) {
							// console.log(err.errmsg);
						// }
						// else {
						
						// }				
					// }
				// );
			}
			else
			{
				// var newUser            = new User();

				// // set all of the facebook information in our user model
				// newUser.facebook.id    = profile.id; // set the users facebook id                   
				// newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
				// newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
				// newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first
			}
		}
	);

	
	
	
		// find the user in the database based on their facebook id
		// User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

			// // if there is an error, stop everything and return that
			// // ie an error connecting to the database


			// // if the user is found, then log them in
			// if (user) {
				// return done(null, user); // user found, return that user
			// } else {
				// // if there is no user found with that facebook id, create them
				// var newUser            = new User();

				// // set all of the facebook information in our user model
				// newUser.facebook.id    = profile.id; // set the users facebook id                   
				// newUser.facebook.token = token; // we will save the token that facebook provides to the user                    
				// newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
				// newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

				// // save our user to the database
				// newUser.save(function(err) {
					// if (err)
						// throw err;

					// // if successful, return the new user
					// return done(null, newUser);
				// });
			// }

		// });
	});

}));

// Use the WindowsLiveStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, an accessToken, refreshToken, and Windows Live
//   profile), and invoke a callback with a user object.
// passport.use(new FacebookStrategy({
    // clientID: FACEBOOK_APP_ID,
    // clientSecret: FACEBOOK_APP_SECRET,
	// callbackURL: "http://localhost:8080/auth/facebook/callback"
  // },
  // function(accessToken, refreshToken, profile, done) {
    // // asynchronous verification, for effect...
    // process.nextTick(function () {
      
      // // To keep the example simple, the user's Windows Live profile is returned
      // // to represent the logged-in user.  In a typical application, you would
      // // want to associate the Windows Live account with a user record in your
      // // database, and return that user instead.
      // return done(null, profile);
    // });
  // }
// ));

// =====================================
// FACEBOOK ROUTES =====================
// =====================================

app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

// handle the callback after facebook has authenticated the user
app.get('/auth/facebook/callback',
	passport.authenticate('facebook', {
		successRedirect : '/envelopes',
		failureRedirect : '/'
	}));

// route for logging out
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});
	
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}




// still unsure what, if anything, is needed below...

var app = express();
var server = http.createServer(app);

// configure Express
//app.configure(function() {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.engine('html', ejs.renderFile);
  //  app.use(express.logger());
  app.use(morgan('combined'));
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({extend: false}));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(session({ secret: 'keyboard cat' }));
  // Initialize Passport!  Also use passport.session() middleware, to support
  // persistent login sessions (recommended).
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.Router());
  //app.use(express.static(__dirname + '/public'));
//});


app.get('/', function(req, res){
  res.render('index', { user: req.user });
});

app.get('/layout', function(req, res){
  if (req.isAuthenticated()) {
	res.render('layout', { user: req.user });
  }
  else {
	res.render('error', {});
  }
});

//var port = process.env.PORT || 8080;
var port = 8080;

server.listen(port, function() {
	console.log("Express server listening on port " + port);
});

//app.get('/account', ensureAuthenticated, function(req, res){
// app.get('/account', function(req, res){
	// if (req.isAuthenticated()) {
	// console.log('=============>user authenticated');
	  // res.render('account', { user: req.user });
	  // var u = req.user;
	  // Object.keys(u).forEach(function (key) {
		// console.log("Key:" + key);
		// console.log("Value:" + u[key]);
	  // });
  // }
  // else {
	// console.log('------------->user not authenticated');
	// res.render('error', {});	  
  // }
// });

// app.get('/login', function(req, res){
  // res.render('login', { user: req.user } );
// });

// // GET /auth/facebook 
// //   Use passport.authenticate() as route middleware to authenticate the 
// //   request.  The first step in Facebook authentication will involve 
// //   redirecting the user to facebook.com.  After authorization, Facebook will 
// //   redirect the user back to this application at /auth/facebook/callback 
// app.get('/auth/facebook',
  // passport.authenticate('facebook', { scope: ['public_profile', 'email'] }),
  // function(req, res){
    // // The request will be redirected to Facebook for authentication, so
    // // this function will not be called.
  // });

// // GET /auth/facebook/callback 
// //   Use passport.authenticate() as route middleware to authenticate the 
// //   request.  If authentication fails, the user will be redirected back to the 
// //   login page.  Otherwise, the primary route function function will be called, 
// //   which, in this example, will redirect the user to the home page. 
// app.get('/auth/facebook/callback',
  // passport.authenticate('facebook', { failureRedirect: '/login' }),
  // function(req, res) {
    // res.redirect('/');
  // });

// app.get('/logout', function(req, res){
  // req.logout();
  // res.redirect('/');
// });

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
// function ensureAuthenticated(req, res, next) {
  // if (req.isAuthenticated()) { return next(); }
  // res.redirect('/login')
// }
