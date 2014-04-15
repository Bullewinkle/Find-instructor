module.exports = {

	login: function (req, res) {
		var query = req.body.query;

		pass.hash(query.pass, 'pseudo salt', function(err, hash) {
			query.pass = hash
			query['online'] = true
			query['photo'] = '/uploads/defaults/1.jpeg'
			console.log(query)
			User.create(query, function (err, data) {

				if (err) {
					res.json({success: false, msg: 'DB error', err: err});
				};

				if (data) {
					if (req.session) {
						req.session.userID = data._id 
						req.session.userName = data.name
						req.session.userEmail = data.email
						req.session.authorised = true
					}
					console.log(req.session)
					res.json({success: true, data: data});
				};

			});
		})
	},
	signin: function (req, res) {

		var query = req.body.query;

		pass.hash(query.pass , 'pseudo salt', function(err, hash){
			query.pass = hash
			User.findOne(query, function (err, data) {
				if (err) {
					res.json({success: false, msg: 'DB error', err: err});
				};
				if (data || data === null) {
					if (data !== null) {
						if (req.session) {
							req.session.userID = data._id 
							req.session.userName = data.name
							req.session.userEmail = data.email
							req.session.authorised = true
							User.findByIdAndUpdate(req.session.userID, { $set: { online: true} }, {}, function (err, doc) {

							})
						}
					}
					console.log(req.session)
					res.json({success: true, data: data});
				};
			});
		})
	},
	signout: function (req, res) {
		if (req.session && req.session.userID) {
 			var query = req.session.userID

			User.findByIdAndUpdate(query, { $set: { online: false} }, {}, function (err, doc) {
			});
			// req.session.authorised = false
			// delete req.session.userID
			req.session.destroy()
		}
		console.log(req.session)
		res.json({success: true, data:'session closed' });
	},
	getall: function(req, res) {

		var query = req.body.query;

		User.find(query, function (err, data) {

			if (err) {
				res.json({success: false, msg: 'DB error', err: err});
			};

			if (data) {
				res.send(data);
			};
		});
	},
	getUser:function(req, res) {
		var query = req.body.query.id;
		if (query == 'current_user') {
			if ( req.session.userID ) {
				query = req.session.userID
			} else {
				throw error;
			}
		}
		console.log(query)
		User.findById(query, function (err, data) {

			if (err) {
				res.json({success: false, msg: 'DB error', err: err});
			};

			if (data) {
				res.send(data);
			};
		});
	},
	update: function(req, res, err) {
		if (req.session.userID) {
			var query = req.session.userID
			var newData = req.body.data
			console.log(newData)
			User.findByIdAndUpdate(query, {$set: { 
				'email': newData['email'],
				'phone': newData['phone'],
				'type': newData['type'],
				'age': newData['age'],
				'chars': newData['chars'],
				'achieves': newData['achieves'],
				'main-phrase': newData['main-phrase'],
				'about-myself': newData['about-myself'],
				'my-idol': newData['my-idol'],
			} }, {}, function (err, doc) {
				if (err) throw err;
				console.log(doc)
				res.send('ok')
			})
		} else {
			throw err;
		}

	},
	setPhoto: function(req, res, err) {
		
		// imageMagic.readMetadata(req.files.userPhoto, function(err, metadata){})


		if (req.session.userID) {
			var query = req.session.userID
			var newPhoto = req.body.photo

			// imageMagic.identify(newPhoto, function(err, features){
			//   if (err) throw err;
			//   console.log(features || 'не получилось');
			// });
			console.log('newPhoto',newPhoto)
			User.findByIdAndUpdate(query, { $set: { photo: newPhoto} }, {}, function (err, doc) {
			})
			res.send('ok')
		} else {
			throw error;
		}

	}

}