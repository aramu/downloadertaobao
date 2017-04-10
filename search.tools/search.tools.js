// Javascript
(function(m) {
    var interval = 1.0;

    function getCommoditys() {
        return function() {
            for (var c, d = document.getElementsByTagName("script"), e = 0; e < d.length; e++)
                if (0 == d[e].innerHTML.trim().indexOf("g_page_config")) {
                    c = d[e].innerHTML.trim();
                    break
                }
            return !!eval(c.split("g_srp_loadCss")[0].trim());
        }();
    };

    Array.prototype.end = function() {
        return this[this.length - 1];
    };

    Array.prototype.rsort = function() {
        return this.sort(function(a, b) {
            return a - b })
    };

    Array.prototype.result = function() {
        var self = this;
        var rst = new Object();
        rst.sum = (function() {
            return eval(self.join('+'))
        })();
        [rst.max, rst.min] = (function() {
            var ar = self.sort(function(a, b) {
                return a - b
            });
            return [ar.end(), ar[0]]
        })();
        rst.mean = (function() {
            return rst.sum / self.length;
        })();
        return rst;
    };

    Array.prototype.variance = function () {
        var self = this;
        return Math.sqrt(this.map(function (v, i, ar) {
            return Math.pow(v - self.result().mean, 2);
        }).result().mean)
    }

    return (function do_something(main) {
        if (getCommoditys()) {
            var myJson = window.g_page_config;
            delete window.g_page_config;
            return main(myJson);
        }
    })(m);
})(main);


function main(json) {
    // # bizs
    var biz = json.mainInfo.traceInfo.traceData.allOldBiz30Day
    var totoBiz = biz.result().sum.toString();
    var variBiz = biz.variance().toFixed(2);
    // # prices
    var prices = json.mainInfo.traceInfo.traceData.allPrices
    var recommPrices = prices.rsort().slice(1, parseInt((prices.length - 1) * (Math.sqrt(5) - 1) / 2));
    var recommPrice = recommPrices.result().mean.toFixed(2);
    var variprice = recommPrices.variance().toFixed(2);

    return [totoBiz, variBiz, recommPrice, variprice]
}
