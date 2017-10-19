(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function 交互拦截相关服务js
     * @version  3.0.2
     * @service  $rootScope 注入根作用域服务
     * @service  $q 注入$q服务
     * @service  $filter 注入过滤器服务
     * @constant AUTH_EVENTS 注入权限事件常量
     */
    angular.module('eolinker')
        .factory('AuthInterceptor', AuthInterceptor);

    AuthInterceptor.$inject = ['$rootScope', '$q', '$filter', 'AUTH_EVENTS']

    function AuthInterceptor($rootScope, $q, $filter, AUTH_EVENTS) {
        var Auth;
        var data = {
            info: {
                auth: null
            },
            fun: {
                request: null, //交互请求功能函数
                response: null, //交互响应功能函数
                responseError: null //交互响应出错功能函数
            }
        }
        data.fun.request = function(config) { //交互请求
            config.headers = config.headers || {};
            if (config.method == 'POST') {
            }
            return config;
        };
        data.fun.response = function(response) { //交互响应
            if (response.data) {
                $rootScope.$broadcast({
                    901: AUTH_EVENTS.UNAUTHENTICATED,
                    401: AUTH_EVENTS.UNAUTHORIZED
                }[response.data.code], response);
                try {
                    if (typeof response.data == 'object') {
                        response.data = JSON.parse($filter('HtmlFilter')(angular.toJson(response.data)));
                    }
                } catch (e) {
                    response.data = response.data;
                    $rootScope.$broadcast(AUTH_EVENTS.SYSTEM_ERROR);
                }
            }
            return $q.resolve(response);
        };
        data.fun.responseError = function(rejection) { //交互响应出错
            $rootScope.$broadcast(AUTH_EVENTS.SYSTEM_ERROR);
            return rejection;
        };
        return data.fun;
    }
})();
