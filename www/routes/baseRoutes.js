module.exports = {

	welcome: function (req, res) {
		if ( req.session) {
			if ( !req.session.authorised || req.session.authorised === false ) {
				req.session.authorised = false
				res.render('index', {
					title: 'Find instructor',
					pretty: true
				});
			} else {
				res.render('index', {
					title: 'Find instructor',
					isAuthorised: 'authorised',
					pretty: true
				});
			}
		}

	},
	upload: function (req, res) {
		console.log('upload', req)
		if (req.files) {
			if (req.session && req.session.userID) {
				if (req.files['userPhoto']) {
					console.log(req.files.userPhoto)
					var path = req.files['userPhoto'].path
					var newName = path.split('/')[path.split('/').length-1] // автоматически генерируемое имя
					var newNameExt = '.' + newName.split('.')[1]
					// fs.rename(req.files.userPhoto.path, 'client/uploads/avas/' + newName, function (err, data) {
					fs.rename(req.files.userPhoto.path, 'client/uploads/avas/' + req.session.userID + newNameExt, function (err, data) {
						if ( err) {
							console.log('ошибка перемещения файла', err)
						} else {
							console.log('перенесен успешно')
						}
					});

					User.findByIdAndUpdate(req.session.userID, { $set: { photo: '/uploads/avas/' + req.session.userID + newNameExt} }, {}, function (err, doc) {
						if (err) {
							console.log('Не получилось обновить')
						} else {
							// res.status(200)
							res.redirect('/');
							// res.send('/uploads/' + newName )
						}
					})
				}
			
			// imageMagic.readMetadata(req.files.userPhoto, function(err, metadata){})

			} else {
				res.status(404).send('Для этого необходимо авторизоваться!')
			}
			res.status(200)
			// setTimeout(function(){
			// 	res.redirect('/')
			// }, 2000);
		} else {
			res.status(404).send('Файл не получен')
		}
	}

}