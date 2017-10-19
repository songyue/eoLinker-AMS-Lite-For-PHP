(function() {
    //author：广州银云信息科技有限公司
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function 项目内页相关指令js
     * @version  3.0.2
     * @service  $scope 注入作用域服务
     * @service  $state 注入$state服务
     */
    angular.module('eolinker')
        .config(['$stateProvider', 'RouteHelpersProvider', function($stateProvider, helper) {
            $stateProvider
                .state('home', {
                    url: '/home',
                    template: '<home></home>'
                });
        }])
        .component('home', {
            templateUrl: 'app/component/content/home/index.html',
            controller: indexController,
        })
    indexController.$inject = ['$scope', '$state'];

    function indexController($scope, $state) {
        var vm = this;
        vm.data = {
            info: {
                shrinkObject: {},
                sidebarShow: null
            },
            fun: {
                $Home_ShrinkSidebar: null,
                init: null //初始化功能函数
            }
        }
        vm.data.fun.init = function(arg) {
            if (!/inside/.test(arg.key.toLowerCase())) {
                vm.data.info.sidebarShow = true;
            } else {
                vm.data.info.sidebarShow = false;
            }
        }
        vm.data.fun.$Home_ShrinkSidebar = function(_default, arg) {
            vm.data.info.shrinkObject.isShrink = arg.shrink;
        }
        vm.data.fun.init({ key: window.location.href });
        $scope.$on('$stateChangeSuccess', function() {
            if (!/inside/.test($state.current.name.toLowerCase())) {
                vm.data.info.sidebarShow = true;
            } else {
                vm.data.info.sidebarShow = false;
            }
        })
        $scope.$on('$Home_ShrinkSidebar', vm.data.fun.$Home_ShrinkSidebar);
    }
})();