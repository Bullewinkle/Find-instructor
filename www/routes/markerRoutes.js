module.exports = {

	getmarks: function(req, res) {
		console.log(req)
		var query = req.body.query;

		Marker.find(query, function (err, data) {
			if (err) {
				res.json({success: false, msg: 'DB error', err: err});
			}
			if (data) {
				console.log(data)
				res.json({success: true, data: data});
			}
		})
	}

}