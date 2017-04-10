// Note model

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var NoteSchema = new Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    // tag id
    tag: { type: Schema.Types.ObjectId, ref: 'Tag' },
    // owner id
    owner: { type: Schema.Types.ObjectId, ref: 'Noteuser' },
    isTop: { type: Boolean, default: false },
    created: { type: Date }
});

mongoose.model('Note', NoteSchema);
