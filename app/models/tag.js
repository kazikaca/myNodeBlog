// Tag model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TagSchema = new Schema({
    name: {type: String, required: true},
    // owner id
    owner: { type: Schema.Types.ObjectId, ref: 'Noteuser' },
    created: {type: Date}
});

mongoose.model('Tag', TagSchema);
