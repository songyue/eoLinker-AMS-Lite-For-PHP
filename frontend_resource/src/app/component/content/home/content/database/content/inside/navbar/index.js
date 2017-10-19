(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function 数据库navbar模块相关js
     * @version  3.0.2
     * @service  $state 注入$state服务
     * @service  $scope 注入作用域服务
     * @service  NavbarService 注入NavbarService服务
     */
    angular.module('eolinker')
        .component('databaseNavbar', {
            templateUrl: 'app/component/content/home/content/database/content/inside/navbar/index.html',
            bindings: {
                shrinkObject: '<'
            },
            controller: navbarController
        })

    navbarController.$inject = ['$scope', '$state', 'NavbarService'];

    function navbarController($scope, $state, NavbarService) {
        var vm = this;
        vm.data = {
            service: {
                navbar: NavbarService
            },
            info: {
                menu: [
                    {href: '/table', icon: 'icon-ziliaoku', name: '数据库详情', sref: 'home.database.inside.table.list', state: 0 },
                    {href: '/team', icon: 'icon-renyuanguanli', name: '协作管理', sref: 'home.database.inside.team', state: 1 }
                ]
            },
            fun: {
                menu: null, //菜单功能函数
                shrink: null //收缩功能函数
            }
        }
        vm.data.fun.menu = function(arg) {
            if (arg.item.childSref) {
                $state.go(arg.item.childSref);
            } else {
                $state.go(arg.item.sref);
            }
        }
        vm.data.fun.shrink = function() {
            vm.shrinkObject.isShrink = !vm.shrinkObject.isShrink;
            $scope.$emit('$Home_ShrinkSidebar',{shrink:vm.shrinkObject.isShrink});
        }
        vm.data.fun.initMenu = function(arg) {
            if (window.location.href.indexOf(arg.item.href) > -1) {
                vm.data.service.navbar.info.navigation = {
                    query: [{ name: '数据库管理', sref: 'home.database.list' }],
                    current: arg.item.name
                }
            }
        };
        $scope.$on('$locationChangeSuccess', function() {
            for (var key = 0; key < vm.data.info.menu.length; key++) {
                var val = vm.data.info.menu[key];
                if (window.location.href.indexOf(val.href) > -1) {
                    vm.data.service.navbar.info.navigation = {
                        query: [{ name: '数据库管理', sref: 'home.database.list' }],
                        current: val.name
                    }
                }
            }
        })
    }

})();
