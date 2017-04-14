var mongoose = require('mongoose'),
    Tag = mongoose.model('Tag');

/**
 * 根据id获取标签
 * @param id{string}
 * @param callback{function}
 *  -err
 *  -user
 */
function getTagById(id, callback) {
    Tag.findById(id)
        .exec(callback);
}
exports.getTagById = getTagById;

/**
 * 获取到第一个匹配的标签
 * @param conditions
 * @param callback
 */
function findOneTag(conditions, callback) {
    Tag.findOne(conditions)
        .exec(callback);
}
exports.findOneTag = findOneTag;

/**
 * 获取标签
 * @param conditions
 * @param callback
 */
function findTags(conditions, callback) {
    return Tag.find(conditions)
        .exec(callback);
}
exports.findTags = findTags;

/**
 * 获取tag数量
 */
function countTags(callback) {
    return Tag.count().exec(callback);
}
exports.countTags = countTags;

/**
 * 创建标签
 * @param tag{object}
 * @param callback{function}
 *  -err
 *  -user
 */
function createTag(tag,callback){
    var _tag = new Tag(tag);
    _tag.save(callback);
}
exports.createTag = createTag;
