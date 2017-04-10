// Noteuser model

var md5 = require('md5'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NoteuserSchema = new Schema({
    ak: {type: String, required: true},
    // type: 'user' / 'admin'
    type: {type: String, required: true},
    created: {type: Date}
});

NoteuserSchema.methods.verifyAK = function (ak) {
    return md5(ak) === this.ak;
};

mongoose.model('NoteUser', NoteuserSchema);
