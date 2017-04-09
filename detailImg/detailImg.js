// Javascript detailImgdownloader

'use strict';
Array.prototype.end = function() {
    return this[this.length - 1];
};
String.prototype.format = function(args) {
    var newstr = this;
    var counter = 0;
    while (newstr.indexOf('{}') != -1) {
        newstr = newstr.replace('{}', args[counter]);
        counter += 1;
    };
    return newstr;
};
var downloader = function(urls, interval, expired) {
    expired = (expired == undefined || expired < 1) ? 1 : expired;
    var dl = new Object();
    dl.urls = urls;
    dl.interval = interval;
    dl.expiredCounter = 0;
    dl.timer = function() {
        var self = this;
        self.sto = setTimeout(function() {
            if (self.urls.length > 0) {
                self.expiredCounter = 0;
                var alink = document.createElement('a');
                alink.href = self.urls.shift();
                console.log('downloading >> ', alink.href);
                alink.download = '';
                alink.click();
            } else if (self.urls.length == 0) {self.expiredCounter += 1};
            if (self.expiredCounter < expired) self.timer();
        }, this.interval * 1000);
        self.stop = function() {
            clearTimeout(self.sto);
        };
    };
    return dl;
};

var detailimg = function(interval) {
    var dp = new Object();
    dp.interval = interval;
    dp.loadingImgs = [
        'https://img-tmdetail.alicdn.com/tps/i3/T1BYd_XwFcXXb9RTPq-90-90.png',
        'https://img.alicdn.com/tps/i4/T10B2IXb4cXXcHmcPq-85-85.gif'
    ];
    dp.CssSelectores = [
        '#J_DivItemDesc',
        '#description > div.content.ke-post > p'
    ];
    dp.pos = $(dp.CssSelectores[0]) != null ? 0 : 1;
    if ($(dp.CssSelectores[dp.pos]) == null) confirm('亲, 网页没有加载完毕, 向下拉网页, 让网页加载, 再点击按钮.')
    dp.imgs = $(dp.CssSelectores[dp.pos]).getElementsByTagName('img');
    dp.length = dp.imgs.length;
    dp.urls = function() {
        var self = this;
        var urls = [];
        var counter = 0;
        self.waiter = function () {
            var waitimer = setTimeout(function () {
                if (counter < self.length) {
                    if (self.loadingImgs.indexOf(self.imgs[counter].src) == -1) {
                        urls.push(self.imgs[counter].src);
                        counter += 1;
                    };
                    self.waiter();
                };
            }, self.interval * 1000);
        };
        self.waiter();
        return urls;
    };
    return dp;
};

(function () {
    if (navigator.appVersion.indexOf('AppleWebKit') == -1) {
        alert('亲，你的浏览器不支持下载，请换UC，360，Chrome浏览器.');
    } else {
        var dp = new detailimg(1.0);
        var dper = new downloader(dp.urls(), 2.0, 10);
        dper.timer();
    };
})();