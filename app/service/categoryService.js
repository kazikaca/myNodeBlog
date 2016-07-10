var mongoose = require('mongoose'),
    Category = mongoose.model('Category');

module.exports = {
    getAllCategory: getAllCategory
};

function getAllCategory(callback) {
    return Category.find().sort({ created: 'desc'}).exec(callback);
}
