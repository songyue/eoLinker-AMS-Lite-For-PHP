(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function 全局定义app模块js
     * @version  3.0.2
     */
    angular.module('eolinker', [
        //thrid part
        'ui.router',
        'oc.lazyLoad',
        'ngResource',
        'angular-md5',
        'ngCookies',
        //custom part
        'eolinker.resource',
        'eolinker.modal',
        'eolinker.constant',
        'eolinker.filter',
        'eolinker.directive',
        'eolinker.service'
    ])

    .config(AppConfig)

    .run(AppRun);


    AppConfig.$inject = ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$logProvider', '$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', 'isDebug'];


    function AppConfig($controllerProvider, $compileProvider, $filterProvider, $provide, $logProvider, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, IsDebug) {

        var data = {
            fun: {
                init: null, //初始化功能函数
                param: null, //解析请求参数格式功能函数
            }
        }
        data.fun.param = function(arg) {
            var query = '',
                name, value, fullSubName, subName, subValue, innerObj, i;

            for (name in arg.object) {
                value = arg.object[name];

                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += data.fun.param({ object: innerObj }) + '&';
                    }
                } else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += data.fun.param({ object: innerObj }) + '&';
                    }
                } else if (value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }

            return query.length ? query.substr(0, query.length - 1) : query;
        };
        data.fun.init = (function() {
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
            // Override $http service's default transformRequest
            $httpProvider.defaults.transformRequest = [function(callback) {
                return angular.isObject(callback) && String(callback) !== '[object File]' ? data.fun.param({ object: callback }) : callback;
            }];
            // Enable log
            $logProvider.debugEnabled(IsDebug);
            $urlRouterProvider.otherwise('/index');
        })();
    }

    AppRun.$inject = ['$rootScope', '$state', '$stateParams', '$window', '$templateCache', '$http'];


    function AppRun($rootScope, $state, $stateParams, $window, $templateCache, $http) {

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
    }
})();
