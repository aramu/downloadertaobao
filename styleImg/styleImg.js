// Javascript styleImgdownloader

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
            console.log('downloading >> ', alink.href);
            alink.download = self.counter + '.' + alink.href.split('.').end();
            document.body.appendChild(alink);
            alink.click();
            document.body.removeChild(alink);
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


var styleimg = function() {
    var sp = new Object();
    sp.CssSelectores = [
        '#J_isku > div > dl.J_Prop.tb-prop.tb-clear.J_Prop_Color > dd > ul > li:nth-child({}) > a',
        '#J_DetailMeta > div.tm-clear > div.tb-property > div > div.tb-key > div > div > dl.tb-prop.tm-sale-prop.tm-clear.tm-img-prop > dd > ul > li:nth-child({}) > a'
    ];
    sp.pos = $(sp.CssSelectores[0].format((1).toString())) != null ? 0 : 1;
    sp.length = $(sp.CssSelectores[sp.pos].format((1).toString())).parentNode.parentNode.children.length;
    sp.pattern = /^((https|http)?:){0,1}\/\/[^\s^_]+\_[^\s]+?\.(jpg|SS2|jpeg|gif|png)/
    sp.urls = function(self) {
        var self = this;
        var urls = [];
        for (var i = 0; i < self.length; i++) {
            var alink = $(self.CssSelectores[self.pos].format((i +1).toString()));
            if (alink.getAttribute('style') != null) {
                urls.push(alink.style.backgroundImage.slice(5, -2).match(self.pattern)[0]);
            };
        };
        return urls;
    };
    return sp; // styleImages
};

(function () {
    if (navigator.appVersion.indexOf('AppleWebKit') == -1) {
        alert('亲，你的浏览器不支持下载，请换UC，360，Chrome浏览器.');
    } else{
        var sp = new styleimg();
        var sper = new downloader(sp.urls(), 2.0);
        sper.timer() 
    };
})()