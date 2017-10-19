(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function [安装引导页外模块]
     * @version  3.0.2
     */
    angular.module('eolinker')
        .config(['$stateProvider','RouteHelpersProvider', function($stateProvider,helper) {
            $stateProvider
                .state('guide', {
                    url: '/guide',// url相对路径/guide
                    template: '<guide></guide>',
                    auth: true // 页面权限，值为true时在未登录状态可以显示页面，默认为false
                });
        }])
        .component('guide', {
            templateUrl: 'app/component/content/guide/index.html',
            controller: guideCtroller
        })

    guideCtroller.$inject = [];
    
    function guideCtroller() {

        var vm = this;
    }
})();