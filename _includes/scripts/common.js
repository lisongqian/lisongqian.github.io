(function () {
    var $root = document.getElementsByClassName('root')[0];
    if (window.hasEvent('touchstart')) {
        $root.dataset.isTouch = true;
        document.addEventListener('touchstart', function () {
        }, false);
    }
})();

var _hmt = _hmt || [];
(function () {
    var hm = document.createElement('script');
    hm.src = 'https://hm.baidu.com/hm.js?ac13390181cda04ce0e2287162a5453a';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(hm, s);
})();