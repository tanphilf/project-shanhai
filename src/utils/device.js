!(function (doc, win) {
    var docEl = doc.documentElement;
    var resizeEvt = "orientationchange" in window ? "orientationchange" : "resize";
    var recalc = function () {
        var clientWidth = docEl.clientWidth; var MAX_WIDTH = 750;
        // 设计稿宽度为750px，html设置字体大小100px，设计稿上30px相当于页面上0.3rem；         
        if (!clientWidth) { return; }
        if (clientWidth >= MAX_WIDTH) {
            docEl.style.fontSize = "100px";
        } else {
            docEl.style.fontSize = 100 * (clientWidth / MAX_WIDTH) + "px";
        }
    };
    recalc();
    if (!doc.addEventListener) { return; }
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener("DOMContentLoaded", recalc, false);

    // 禁止页面缩放
    doc.documentElement.addEventListener('touchstart', function (event) {
        if (event.touches.length > 1) {
            event.preventDefault();
        }
    }, false);

    // 多指
    document.addEventListener('gesturestart', function(event) {
        event.preventDefault();
    });

    var lastTouchEnd = 0;
    doc.documentElement.addEventListener('touchend', function (event) {
        var now = Date.now();
        if (now - lastTouchEnd <= 300) {
            event.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

})(document, window);
