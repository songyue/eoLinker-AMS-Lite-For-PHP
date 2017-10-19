(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function 加密模块相关服务js
     * @version  3.0.2
     */
    angular.module('eolinker.service')
        .factory('CryptoJSService', CryptoJSFactory);

    CryptoJSFactory.$inject = []

    function CryptoJSFactory() {
        return window.CryptoJS;
    }
})();