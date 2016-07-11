var pinyin = require('pinyin');

/**
 * 汉字转换拼音
 * @param {string} str
 * @returns {string}
 */
function chgToPinyin(str) {
    return pinyin(str,{
        style: pinyin.STYLE_NORMAL,
        heteronym: false
    }).map(function (item) {
        return item[0]
    }).join(' ');
}
exports.chgToPinyin = chgToPinyin;
