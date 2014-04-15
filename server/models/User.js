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
	"phone": {
		type: String,
		unique: true
	},
	"online": {
		type: Boolean
	},
	"age": {
		type : String
	},
	"chars": {
		type : String
	},
	"achieves": {
		type : String
	},
	"main-phrase": {
		type : String
	},
	"about-myself": {
		type : String
	},
	"my-idol": {
		type : String
	},
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