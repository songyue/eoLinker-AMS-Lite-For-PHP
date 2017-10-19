(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function [安装引导页step two]
     * @version  3.0.2
     * @service  $scope [注入作用域服务]
     * @service  CommonResource [注入通用接口服务]
     * @service  $state [注入路由服务]
     * @service  $window [注入window服务]
     * @constant CODE [注入状态码常量]
     */
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('guide.second_step', {
                    url: '/second_step',// url相对路径/second_step
                    template: '<second></second>',
                    auth: true // 页面权限，值为true时在未登录状态可以显示页面，默认为false
                });
        }])
        .component('second', {
            templateUrl: 'app/component/content/guide/second_step/index.html',
            controller: secondCtroller
        })

        secondCtroller.$inject = ['$scope', 'CommonResource', '$state', '$window', 'CODE'];
        
    function secondCtroller($scope, CommonResource, $state, $window, CODE) {
        var vm = this;
        vm.data = {
            info: {
                submited: false
            },
            fun: {
                init: null,
                enterThird: null
            }
        }

        /**
         * @function [初始化功能函数，检测是否已安装，若已安装则跳转首页]
         */
        vm.data.fun.init = function() {
            vm.info = {};
            CommonResource.Install.Config().$promise.then(function(data) {
                if (data.statusCode == CODE.COMMON.SUCCESS) {
                    $state.go('index');
                }
            });

            if (window.localStorage['INSTALLINFO']) {
                try {
                    var info = JSON.parse(window.localStorage['INSTALLINFO']);
                    vm.info.dbURL = info.master;
                    vm.info.dbName = info.name;
                    vm.info.dbUser = info.userName;
                    vm.info.dbPassword = info.password;
                    vm.info.pageTitle = info.pageTitle;
                } catch (e) {
                    vm.info.dbURL = 'localhost';
                    vm.info.dbName = 'eolinker_os';
                    vm.info.dbUser = '';
                    vm.info.dbPassword = '';
                    vm.info.pageTitle = 'eolinker开源版';
                }
            } else {
                vm.info.dbURL = 'localhost';
                vm.info.dbName = 'eolinker_os';
                vm.info.dbUser = '';
                vm.info.dbPassword = '';
                vm.info.pageTitle = 'eolinker开源版';
            }
        }
        vm.data.fun.init();

        /**
         * @function [判断信息是否填写完整，若完整则存入缓存，并跳转第三步]
         */
        vm.data.fun.enterThird = function() {// 跳转安装第三步
            if ($scope.secondForm.$valid) {
                var userInfo = {
                    master: vm.info.dbURL,
                    name: vm.info.dbName,
                    userName: vm.info.dbUser,
                    password: vm.info.dbPassword,
                    pageTitle:vm.info.pageTitle
                }
                window.localStorage.setItem('INSTALLINFO', JSON.stringify(userInfo));
                $state.go('guide.third_step');
            }
            else{
                vm.data.submited = true;
            }
        }
    }
})();