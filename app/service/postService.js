var mongoose = require('mongoose'),
    Post = mongoose.model('Post');

module.exports = {
    getPostById: getPostById,
    removePostById: removePostById,
    getPostsWithQuery: getPostsWithQuery,
    getNewest5Posts: getNewest5Posts
};

function getPostById(id, callback) {
    Post.findById(id)
        .populate('author')
        .populate('category')
        .exec(callback);
}

function removePostById(id, callback) {
    Post.remove({_id: id})
        .exec(callback);
}

/**
 * 根据筛选条件获取文章
 * @param conditions 进行筛选的文章属性
 *  -object {key:val}
 * @param sort 进行排序的文章属性
 *  -object {'desc'/'asc': someKey}
 * @param relation 关联查询的model
 *  -array [someModels]
 * @param callback 回调函数
 *  -err
 *  -posts
 */
function getPostsWithQuery(conditions, sort, relation, callback) {
    Post.find(conditions)
        .sort(sort)
        .populate(relation)
        .exec(callback);
}

function getNewest5Posts(callback) {
    Post.find({published: true})
        .sort('-created')
        .populate(['author', 'category'])
        .limit(5)
        .exec(callback);
}
