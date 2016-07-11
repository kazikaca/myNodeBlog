var mongoose = require('mongoose'),
    Category = mongoose.model('Category');

module.exports = {
    getAllCategories: getAllCategories,
    getCategoryById: getCategoryById,
    removeCategoryById: removeCategoryById
};

function getAllCategories(callback) {
    Category.find()
        .sort({created: 'desc'})
        .exec(callback);
}

/**
 * 根据ID获取分类
 * @param id
 * @param callback
 *  -err
 *  -category
 */
function getCategoryById(id, callback) {
    Category.findById(id)
        .exec(callback)
}

/**
 * 根据Id删除分类
 * @param id
 * @param callback
 *  -err
 *  -rowsRemoved
 */
function removeCategoryById(id, callback) {
    Category.remove({_id: id})
        .exec(callback);
}
