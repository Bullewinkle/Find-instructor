var markerSchema = new mongoose.Schema({
	"items": {
		type: Array,
		required: true,
	},
	"style": {
		type: String,
		required: true,
	},
	"name": {
		type: String,
		required: true,
		unique: true
	}
})

module.exports = mongoose.model( 'Marker', markerSchema)