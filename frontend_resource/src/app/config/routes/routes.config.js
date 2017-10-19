(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function [路由配置模块]
     * @version  3.0.2
     * @service  $stateProvider [注入路由服务]
     * @service  $locationProvider [注入$locationProvider服务]
     * @service  $urlRouterProvider [注入$urlRouterProvider服务]
     */
    angular
        .module('eolinker')
        .config(routesConfig)
        .run(routesRun);

    routesConfig.$inject = ['$httpProvider', '$locationProvider', '$urlRouterProvider'];

    function routesConfig($httpProvider, $locationProvider, $urlRouterProvider) {
        var data = {
            fun: {
                init: null
            }
        }
        /**
         * @function [初始化功能函数]
         */
        data.fun.init = function() {
            $httpProvider.interceptors.push([
                '$injector',
                function($injector) {
                    return $injector.get('AuthInterceptor');
                }
            ]);
            $locationProvider.html5Mode(false).hashPrefix('');
            $urlRouterProvider.otherwise('/index');
        }
        data.fun.init();
    }

    routesRun.$inject = [];

    function routesRun() {

    }
})();
