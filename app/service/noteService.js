var mongoose = require('mongoose'),
    Note = mongoose.model('Note');

/**
 * 根据id获取笔记
 * @param id{string}
 * @param callback{function}
 *  -err
 *  -user
 */
function getNoteById(id, callback) {
    Note.findById(id)
        .exec(callback);
}
exports.getNoteById = getNoteById;

/**
 * 获取笔记详情
 * @param id
 * @param relation
 * @param callback
 */
function getNoteWithTag(id, relation, callback) {
    Note.findById(id)
        .populate(relation)
        .exec(callback);
}
exports.getNoteWithTag = getNoteWithTag;

/**
 * 获取到第一个匹配的笔记
 * @param conditions
 * @param callback
 */
function findOneNote(conditions, callback) {
    Note.findOne(conditions)
        .exec(callback);
}
exports.findOneNote = findOneNote;

/**
 * 获取笔记
 * @param conditions
 * @param sort
 * @param steps
 * @param size
 * @param callback
 */
function findNotes(conditions, sort, steps, size, callback) {
    return Note.find(conditions)
        .sort(sort)
        .skip(steps)
        .limit(size)
        .exec(callback);
}
exports.findNotes = findNotes;

/**
 * 获取note数量
 * @param callback
 */
function countNotes(callback) {
    return Note.count().exec(callback);
}
exports.countNotes = countNotes;

/**
 * 删除笔记
 * @param id
 * @param callback
 */
function removeNoteById (id, callback) {
    return Note.remove({_id: id}).exec(callback);
}
exports.removeNoteById = removeNoteById;

/**
 * 创建笔记
 * @param note{object}
 * @param callback{function}
 *  -err
 *  -user
 */
function createNote(note,callback){
    var _note = new Note(note);
    _note.save(callback);
}
exports.createNote = createNote;
