
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
//var RedisStore = require('connect-redis')(express)
//   , sessionStore = new RedisStore();
var MemoryStore = express.session.MemoryStore
  , sessionStore = new MemoryStore();

// OAuth
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var app = express();
var server;


// all environments
app.configure(function(){
	app.set('port', process.env.PORT || 3000);
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'ejs');
	app.set('secretKey', 'mySecret');

	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());

	app.use(express.cookieParser(app.get('secretKey')));
    app.use(express.session({
    	secret: app.get('secretKey'), 
    	key: 'express.sid',
    	cookie: { maxAge:86400000 },
    	store: sessionStore
    }));

	app.use(passport.initialize()); //passportの初期化
	app.use(passport.session()); //passportでのログイン状態を保持するpassport sessionミドルウェアを有効にする

	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});


// twitter oauth
passport.use(new TwitterStrategy({
	consumerKey: "GxNxmXIZRSIkIrNFWKN5A",
	consumerSecret: "XSEaLCtFiZx0whx3dALAX0OgSgVN8anLs0OxtQ9VOIo",
	callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
}, function(token, tokenSecret, profile, done) {

	// save sassion information
	passport.session.accessToken = token;
    passport.session.profile = profile;

	process.nextTick(function(){
    	done(null ,profile);
  	});
}));

/*
 * Root Configuration
 */
app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/main', routes.main);

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
	successRedirect: '/main',
	failureRedirect: '/login'
}));

/*
 * Establish HTTP Server
 */
server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});

/*
 * Socket.io
 */
var io = socketIO.listen(server);

io.set('authorization', function(handshakeData, callback) {

	if( handshakeData.headers.cookie ) {

		var cookie = require('cookie').parse(handshakeData.headers.cookie);
		var sessionID = require('connect').utils.parseSignedCookie( cookie['express.sid'], app.get('secretKey'));

		sessionStore.get(sessionID, function(err, session) {
            if (err) {
                //セッションが取得できなかったら
                console.dir(err);
                callback(err.message, false);
            }
            else if (!session) {
                console.log('session not found');
                callback('session not found', false);
            }
            else if( !("user" in session.passport) ) {
                callback('passport info not found', false);
            }
            else {
                // socket.ioからもセッションを参照できるようにする
                handshakeData.cookie = cookie;
                handshakeData.sessionID = sessionID;
                handshakeData.sessionStore = sessionStore;
                handshakeData.session = new express.session.Session(handshakeData, session);

                // Make it easy to retrieve user data
                var user = new (require('./server/user.js').User)();
                user.init(handshakeData.session.passport.user.username, 1500);
		        handshakeData.user = user;

		        console.log(handshakeData);

                callback(null, true);
            }
        });

	} else {
		return callback('No cookie transmitted.', false);
	} 
});


/*
 * Main game routine
 */
require('./server/main.js').start(io);