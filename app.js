
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');

// OAuth
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;

var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(express.cookieParser()); // expressでのsessionを有効にするのでcookiePaserを有効にする
app.use(express.session({secret: 'hogehogefugafuga'})); //expressのsessionミドルウェアを有効にしてsecretを設定
app.use(passport.initialize()); //passportの初期化
app.use(passport.session()); //passportでのログイン状態を保持するpassport sessionミドルウェアを有効にする

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

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
	console.log(profile);
	process.nextTick(function(){
    	done(null ,profile);
  	});
}));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/*
 * root
 */
app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/main', routes.main);

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', {
	successRedirect: '/main',
	failureRedirect: '/login'
}));

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
