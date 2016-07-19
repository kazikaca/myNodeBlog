var _winHeight = 0;//窗口高度
$(function () {
    $(window).scroll(myScrollFn);
    _winHeight = $(window).height();
});

function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

var myScrollFn = debounce(function() {
    var _scrollHeight = $(window).scrollTop();
    if(_scrollHeight >= _winHeight){

    }
}, 400);
