(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function [按需加载核心配置]
     * @version  3.0.2
     * @service  $ocLazyLoadProvider [注入$ocLazyLoadProvider服务]
     * @constant APP_REQUIRES [注入加载应用常量]
     */
    angular
        .module('eolinker')
        .config(lazyloadConfig);

    lazyloadConfig.$inject = ['$ocLazyLoadProvider', 'APP_REQUIRES'];
    function lazyloadConfig($ocLazyLoadProvider, APP_REQUIRES) {
        var template = {
            modules:APP_REQUIRES.MODULES
        }
        // Lazy Load modules configuration
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: template.modules
        });

    }
})();