(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function [安装引导失败页]
     * @version  3.0.2
     * @service  CommonResource [注入通用接口服务]
     * @service  $state [注入路由服务]
     * @service  $window [注入window服务]
     * @constant CODE [注入状态码常量]
     */
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('guide.error', {
                    url: '/error', // url相对路径/error
                    template: '<error></error>',
                    auth: true // 页面权限，值为true时在未登录状态可以显示页面，默认为false
                });
        }])
        .component('error', {
            templateUrl: 'app/component/content/guide/error/index.html',
            controller: errorCtroller
        })

        errorCtroller.$inject = ['CommonResource', '$state', '$window', 'CODE'];

    function errorCtroller(CommonResource, $state, $window, CODE) {
        var vm = this;
        vm.data = {
            info: {},
            fun: {
                init: null
            }
        }

        /**
         * @function [初始化功能函数，检测是否已安装，若已安装则跳转首页]
         */
        vm.data.fun.init = function() {
            if (window.localStorage['INSTALLINFO']) {
                try {
                    var info = JSON.parse(window.localStorage['INSTALLINFO']);
                    vm.data.info.master = info.master;
                    vm.data.info.name = info.name;
                    vm.data.info.userName = info.userName;
                    vm.data.info.password = info.password;
                } catch (e) {
                    vm.data.info.master = '';
                    vm.data.info.name = '';
                    vm.data.info.userName = '';
                    vm.data.info.password = '';
                }
            }
            CommonResource.Install.Config().$promise.then(function(data) {
                if (data.statusCode == CODE.COMMON.SUCCESS) {
                    $state.go('index');
                }
            });
        }
        vm.data.fun.init();
    }
})();