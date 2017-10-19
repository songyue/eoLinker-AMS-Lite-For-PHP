(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function [安装引导成功页]
     * @version  3.0.2
     * @service  $window [注入window服务]
     */
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('guide.finish', {
                    url: '/finish', // url相对路径/finish
                    template: '<finish></finish>',
                    auth: true // 页面权限，值为true时在未登录状态可以显示页面，默认为false
                });
        }])
        .component('finish', {
            templateUrl: 'app/component/content/guide/finish/index.html',
            controller: finishCtroller
        })

        finishCtroller.$inject = ['$window'];

    function finishCtroller($window) {
        var vm = this;
        vm.data = {
            info: {
                pageTitle: null
            },
            fun: {
                init: null
            }
        }

        /**
         * @function [初始化功能函数，设置网页title]
         */
        vm.data.fun.init = function() {
            if (window.localStorage['INSTALLINFO']) {
                try {
                    vm.data.info.pageTitle = JSON.parse(window.localStorage['INSTALLINFO']).pageTitle;
                } catch (e) {
                    vm.data.info.pageTitle = 'eolinker开源版';
                }
                window.localStorage.removeItem('INSTALLINFO');// 移除缓存中的安装信息
            } else {
                vm.data.info.pageTitle = 'eolinker开源版';
            } 
            window.localStorage.setItem('TITLE', vm.data.info.pageTitle);
        }
        vm.data.fun.init();
        
    }
})();