(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function [安装引导页step one]
     * @version  3.0.2
     * @service  CommonResource [注入通用接口服务]
     * @service  $state [注入路由服务]
     * @constant CODE [注入状态码常量]
     */
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('guide.first_step', {
                    url: '/first_step',// url相对路径/first_step 
                    template: '<first></first>',
                    auth: true // 页面权限，值为true时在未登录状态可以显示页面，默认为false
                });
        }])
        .component('first', {
            templateUrl: 'app/component/content/guide/first_step/index.html',
            controller: firstCtroller
        })
    firstCtroller.$inject = ['CommonResource', '$state', 'CODE'];
    
    function firstCtroller(CommonResource, $state, CODE) {
        var vm = this;
        vm.data = {
            fun: {
                init: null 
            }
        }
        /**
         * @function [初始化功能函数，检测是否已安装，若已安装则跳转首页]
         */
        vm.data.fun.init = function() {
            CommonResource.Install.Config().$promise.then(function(data) {
                if (data.statusCode == CODE.COMMON.SUCCESS) {
                    $state.go('index');
                }
            });
        }
        vm.data.fun.init();
    }
})();