(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function 顶部栏（navbar）相关服务js
     * @version  3.0.2
     * @service  $scope 注入作用域服务
     * @service  $state 注入路由服务
     * @service  NavbarService 注入NavbarService服务
     */
    angular.module('eolinker')
        .component('homeProjectInsideNavbar', {
            templateUrl: 'app/component/content/home/content/project/content/inside/navbar/index.html',
            bindings: {
                shrinkObject: '<'
            },
            controller: homeProjectInsideNavbarController
        })

    homeProjectInsideNavbarController.$inject = ['$scope', '$state', 'NavbarService'];

    function homeProjectInsideNavbarController($scope, $state, NavbarService) {
        var vm = this;
        vm.data = {
            service: {
                navbar: NavbarService
            },
            info: {
                menu: [
                    { href: '/api/',name: 'API接口', sref: 'home.project.inside.api', icon: 'icon-api', childSref: 'home.project.inside.api.list', key: 0 },
                    { href: '/code',name: '状态码', sref: 'home.project.inside.code', childSref: 'home.project.inside.code.list', icon: 'icon-icocode', key: 1 },
                    {href: '/env', name: '环境管理', sref: 'home.project.inside.env', icon: 'icon-waibuhuanjing',params:{envID:null}, key: 2 },
                    { href: '/team',name: '协作管理', sref: 'home.project.inside.team', icon: 'icon-renyuanguanli', key: 4 },
                ]
            },
            fun: {
                initMenu: null, //初始化功能函数
                menu: null, //菜单功能函数
                shrink: null //收缩功能函数
            }
        }
        vm.data.fun.menu = function(arg) {
            vm.data.service.navbar.info.navigation.current = arg.item.name;
            if (arg.item.childSref) {
                $state.go(arg.item.childSref,arg.item.params);
            } else {
                $state.go(arg.item.sref,arg.item.params);
            }
        }
        vm.data.fun.shrink = function() {
            vm.shrinkObject.isShrink = !vm.shrinkObject.isShrink;
            $scope.$emit('$Home_ShrinkSidebar',{shrink:vm.shrinkObject.isShrink});
        }
        vm.data.fun.initMenu = function(arg) {
            if (window.location.href.indexOf(arg.item.href) > -1) {
                vm.data.service.navbar.info.navigation = {
                    query: [{ name: '接口管理', sref: 'home.project.api.default' }, { name: $state.params.projectName }],
                    current: arg.item.name
                }
            }
        };
        $scope.$on('$locationChangeSuccess', function() {
            for (var key = 0; key < vm.data.info.menu.length; key++) {
                var val = vm.data.info.menu[key];
                if (window.location.href.indexOf(val.href) > -1) {
                    vm.data.service.navbar.info.navigation = {
                        query: [{ name: '接口管理', sref: 'home.project.api.default' }, { name: $state.params.projectName }],
                        current: val.name
                    }
                }
            }
        })
    }

})();