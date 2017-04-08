// Javascript mainPicturedownloader

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

var downloader = function(urls, interval) {
    var dl = new Object();
    dl.urls = urls;
    dl.interval = interval;
    dl.counter = 0;
    dl.timer = function() {
        var self = this;
        self.sto = setTimeout(function() {
            var alink = document.createElement('a');
            alink.href = self.urls[self.counter];
            console.log('downloading: > ', alink.href);
            alink.download = self.counter + '.' + alink.href.split('.').end();
            alink.click();
            if (self.counter < self.urls.length - 1) {
                self.counter += 1;
                self.timer();
            };
        }, this.interval * 1000);
        self.stop = function() {
            clearTimeout(self.sto);
        };
    };
    return dl;
};

var mainPicture = function() {
    var mp = new Object();
    mp.CssSelectors = [
        '#J_UlThumb>li:nth-child({})>div>a>img',
        '#J_UlThumb>li:nth-child({})>a>img'
    ];
    mp.pos = $(mp.CssSelectors[0].format((1).toString())) != null ? 0 : 1;
    mp.length = $('#J_UlThumb').children.length;
    mp.pattern = /^((https|http)?:){0,1}\/\/[^\s^_]+\_[^\s]+?\.(jpg|SS2|jpeg|gif|png)/
    mp.urls = function() {
        var self = this;
        var urls = [];
        for (var i = 0; i < self.length; i++) {
            var imgurl = $(self.CssSelectors[self.pos].format((i + 1).toString())).src.match(self.pattern)[0];
            urls.push(imgurl);
        };
        return urls;
    };
    return mp;
};

(function() {
    if (navigator.appVersion.indexOf('AppleWebKit') == -1) {
        alert('亲，你的浏览器不支持下载，请换UC，360，Chrome浏览器.');
    } else {
        var mp = new mainPicture();
        var mper = new downloader(mp.urls(), 1.0);
        mper.timer()
    };
})();
