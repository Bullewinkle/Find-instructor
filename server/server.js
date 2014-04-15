require('node-monkey').start({
	host: "82.196.8.88",
	port: "6767"
});

// Main dependencies
GLOBAL.lodash = require('lodash');
GLOBAL.mongoose = require('mongoose');
GLOBAL.fs = require('fs');
GLOBAL.mailer = require('mailer');
GLOBAL.imageMagic = require('imagemagick')
GLOBAL.pass = require('pwd');
GLOBAL.express = require('express');

GLOBAL.User = require('./models/User');
GLOBAL.Marker = require('./models/Marker');
var config = require('./config');
var app = express();
var MongoStore = require('connect-mongo')(express);

var opts = {
	db: 'mongodb',
	url: config.mongo.url,
	auto_reconnect: true,
	stringify: false
};
GLOBAL.session = new MongoStore(opts)
// pass.iterations(20000);

// NODE_ENV=PRODUCTION PASS=085321 node server.js
if ('PRODUCTION' === process.env.NODE_ENV) {
	app.set('port', config.port.prod);
	// app.set('pass', config.pass.prod || process.env.PASS);
} else {
	app.set('port', config.port.dev);
	// app.set('pass', config.pass.dev);
};
app.use(express.bodyParser({ keepExtensions: true, uploadDir: './client/uploads' }));
app.use(express.methodOverride());
app.use(express.cookieParser());
app.use(express.session({
	secret: 'a4f8071f-c873-4447-8ee2',
	cookie: { maxAge: 2628000000 },
	store: session
}));
app.use(app.router);
app.use(express.static('../client'));
app.set('views', './views')
app.set('view engine', 'jade');
app.enable('view cache');
app.set('');

app.use(function (req, res, next) {
	// if (!req.headers['cache-control'] || req.headers['cache-control'] == "no-cache" ) req.headers['cache-control'] =  'public, max-age=31557600000';
	console.log('MIDLEWEAR!!!!')
	res.setHeader('cache-control', 'public, max-age=15768000000');
	next()
});
// END Sessions

// Routes
var routes = {
	base: require('./routes/baseRoutes'),
	user: require('./routes/userRoutes'),
	marker: require('./routes/markerRoutes'),
};
// base
app.get('/', routes.base.welcome);
app.post('/uploader', encoding, routes.base.upload);

app.get('/user/:id?', function (req, res) {
	User.findById()
	console.log(req.route);
});
// app.post('/uploader', routes.base.upload);

//user
app.post('/login', routes.user.login);
app.post('/signin', routes.user.signin);
app.post('/signout', routes.user.signout)
app.post('/getall', routes.user.getall);
app.post('/user', routes.user.getUser);
app.post('/user-update', routes.user.update);
app.post('/setphoto', routes.user.setPhoto)
//marker 
app.post('/getmarks', routes.marker.getmarks)

// END Routes

// MIDLEWEAR
function encoding(req, res, next) {
	if (req.session.userID) {
		console.log('encoding', req)
		if (req.body.userPhoto) {
			var encoded = req.body.userPhoto.replace(/^data:image\/jpeg;base64,/, "");
			var decoded = new Buffer(encoded, 'base64')
			var pathName = '/uploads/avas/' + req.session.userID + '.jpeg'
			fs.writeFile('./client' + pathName, decoded, 'base64', function (err) {
				if (err) {
					console.log('ошибка')
				} else {
					console.log('файл записан')
				}
			});
			User.findByIdAndUpdate(req.session.userID, { $set: { photo: pathName} }, {}, function (err, doc) {
				res.send(pathName + '.jpg');
			});
			console.log({encoded: encoded})
			console.log({decoded: decoded})
		} else {
			next();
		}
	}
}
// END MIDLEWEAR


mongoose.connect(config.mongo.url, {
	keepAlive: true,
	server: {
		auto_reconnect: true,
		socketOptions: {
			bufferSize: 2000,
			keepAlive: -1,
		}
	},
}, function (err) {
	if (err) throw err;
	app.listen(app.get('port'));
});

var db = mongoose.connection;

console.log('db: ', db)
console.log('mongoose: ', mongoose)

db.on('connecting', function () {
});
db.on('error', function (error) {
	console.error('Error in MongoDb connection: ' + error);
});
db.on('connected', function () {
});
db.once('open', function () {
	console.log('MongoDB connection opened!');
});
db.on('reconnected', function () {
	console.log('MongoDB reconnected!');
});
db.on('disconnected', function () {
	console.log('MongoDB disconnected!');
});





