var userSchema = new mongoose.Schema({
	"name": {
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
	"type": {
		type: String,
		required: true
	},
	"photo": {
		type: String
	},
	"online": {
		type: Boolean
	}
});

userSchema.path('name').validate(function (val, res) {
	if (val === 'admin') {
		res(false);
	} else {
		res(true);
	};
});
// userSchema.path('email').validate(function (val, res) { return true }); 	// написать валидацию
// userSchema.path('pass').validate(function (val, res) { return true }); 		// написать валидацию
// userSchema.path('type').validate(function (val, res) { return true }); 	// написать валидацию 

module.exports = mongoose.model('User', userSchema);