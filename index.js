'use strict';

var express = require('express'),
    app = express(),
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    config = require('./config.js'),
    routes = require('./routes'),
    mongoose = require('mongoose'),
    Account = require('./models/account'),
    uriUtil = require('mongodb-uri'),
    mongoOptions = {
        server: {
            socketOptions: {
                keepAlive: 1,
                connectTimeoutMS: 30000
            }
        },
        replset: {
            socketOptions: {
                keepAlive: 1,
                connectTimeoutMS: 30000
            }
        }
    },
    mongooseUri;

// ===============EXPRESS================
// Configure Express
app.use(logger('combined'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'POST,GET,DELETE,OPTIONS');
    next();
});
app.use(passport.initialize());

app.set('etag', false);

// ===============PASSPORT=================
// Use the LocalStrategy within Passport to login users.
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// Mongoose
mongooseUri = uriUtil.formatMongoose(config.mongo);
mongoose.connect(mongooseUri, mongoOptions);

// Routes
app.use('/', routes);

app.listen(config.port, function () {
    console.log('Authenticate is listening on port:%s', config.port);
});
