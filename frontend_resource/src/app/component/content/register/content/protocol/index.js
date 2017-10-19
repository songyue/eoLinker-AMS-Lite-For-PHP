(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function [协议页相关指令js]
     * @version  3.0.2
     * @service  $scope [注入作用域服务]
     * @service  $location [注入$location服务]
     * @service  $anchorScroll [注入$anchorScroll服务]
     * @service  $window [注入$window服务]
     */
    angular.module('eolinker')
        .config(['$stateProvider', 'RouteHelpersProvider', function($stateProvider, helper) {
            $stateProvider
                .state('register.protocol', {
                    url: '/protocol',
                    auth: true,
                    template: '<register-protocol></register-protocol>'
                });
        }])
        .component('registerProtocol', {
            templateUrl: 'app/component/content/register/content/protocol/index.html',
            controller: indexController
        })
        .run(['$anchorScroll', function($anchorScroll) {

            $anchorScroll.yOffset = 50; // 总是滚动额外的50像素

        }])

    indexController.$inject = ['$scope', '$location', '$anchorScroll', '$window'];

    function indexController($scope, $location, $anchorScroll, $window) {
        var vm = this;
        vm.needFix = false;
        window.document.title = '用户服务协议 - eolinker 接口管理平台 | 业内领先的接口管理平台，让专业的接口管理变简单！';
        vm.goAnchor = function(info) {
            $location.hash(info);
            $anchorScroll();
            //移动到锚点
        };
        vm.data = {}
        /**
         * @function [监听滚动条功能函数]
         */
        $window.onscroll = function() {
            if ($window.scrollY > 246) {
                vm.needFix = true;
            } else {
                vm.needFix = false;
            }
            $scope.$digest();
        }
    }
})();
