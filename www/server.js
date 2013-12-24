require('node-monkey').start({host: "localhost", port:"3000"}); 
var lodash = require('lodash');
var config = require('./config');
var express = require('express');
var mongoose = require('mongoose');


var app = express();


app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.static('./client'));
console.log('hi')

var userSchema = new mongoose.Schema({
	"имя": {
		type: String,
		required: true
	},
	"email": {
		type: String,
		required: true,
		unique: true	
	},
	"pass": {
		type: String,
		required: true
	},
	"тип": {
		type: String,
		required: true
	}
});

userSchema.path('имя').validate(function (val, res) {
	if (val === 'admin') {
		res(false);
	} else {
		res(true);
	};
});




var User = mongoose.model('User', userSchema);
// var ipg = db.users.find({"email":"developer085@gmail.com", "pass": "085321"}).limit(10)
var idk = User.find({"email":"developer085@gmail.com", "pass": "085321"}).limit(10)

console.log(idk)

app.post('/login', function (req, res) {

	var query = req.body;
	console.log(query)

	User.create(query, function (err, data) {

		if (err) {
			res.json({success: false, msg: 'DB error', err: err});
		};

		if (data) {
			res.json({success: true, data: data});
		};

	});
	
});
app.post('/signin', function (req, res) {
	console.log(req)
	console.log(res)

	var query = req.body.query;

	User.find(query, function (err, data) {

		if (err) {
			res.json({success: false, msg: 'DB error', err: err});
		};

		if (data) {
			res.json({success: true, data: data});
		};

	});
	
});


app.post('/getall', function (req, res) {
	console.log(req)
	console.log(res)

	var query = req.body.query;

	User.find(query, function (err, data) {

		if (err) {
			res.json({success: false, msg: 'DB error', err: err});
		};

		if (data) {
			res.json({success: true, data: data});
		};

	});
	
});



console.log(mongoose)
console.log(userSchema)


mongoose.connect(config.mongo.url, function (err) {
	if (err) throw err;
	app.listen(config.port);
});