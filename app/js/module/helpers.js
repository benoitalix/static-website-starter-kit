import $ from '../vendor/jquery-3.1.0';

var Helpers = {
    windowWidth : $(window).width(),
    windowHeight : $(window).height(),
    Android: (/android/i).test(navigator.userAgent),
    blackberry : (/blackberry/i).test(navigator.userAgent),
    iOS: (/ip(hone|ad|od)/i).test(navigator.userAgent),
    iPhone: (/ip(hone|od)/i).test(navigator.userAgent),
    safari: /^((?!chrome).)*safari/i.test(navigator.userAgent),
    chrome: (/chrome/i).test(navigator.userAgent),
    ie: (/MSIE/i).test(navigator.userAgent) || (/trident/i).test(navigator.userAgent),
    opera_mobile : (/opera mini/i).test(navigator.userAgent),
    windows_mobile : (/iemobile/i).test(navigator.userAgent),
    isMobile: function() {
        return (this.windowWidth <= 1024 || this.Android || this.iPhone || this.blackberry || this.opera_mobile || this.windows_mobile);
    },
    isTablet: function() {
        return (this.windowWidth >= 768);
    },
    isDesktop: function() {
        return (this.windowWidth > 1024);
    },
    iosVersion: function() {
        function iOSversion() {
            if (/iP(hone|od|ad)/.test(navigator.platform)) {
                var v = (navigator.appVersion).match(/OS (\d+)_(\d+)_?(\d+)?/);
                return parseInt(v[1], 10);
            }
        }
        var version = iOSversion();
        return version;
    },
    avoidMobileAddressBar: function(){
        $(window).load(function(){
            window.scrollTo(0, 1);
        });
    }
}

export default Helpers;