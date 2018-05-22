(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司 eolinker
     * @function [数据库navbar模块相关js] [Database navbar module related js]
     * @version  3.0.2
     * @service  $state [注入$state服务] [inject state service]
     * @service  $scope [注入作用域服务] [inject scope service]
     * @service  NavbarService [注入NavbarService服务] [inject NavbarService service]
     * @service  $filter [注入过滤器服务] [inject filter service]
     */
    angular.module('eolinker')
        .component('databaseNavbar', {
            templateUrl: 'app/component/content/home/content/database/content/inside/navbar/index.html',
            bindings: {
                shrinkObject: '<'
            },
            controller: indexController
        })

    indexController.$inject = ['$scope', '$state','$rootScope'];

    function indexController($scope, $state,$rootScope) {
        var vm = this;
        vm.data = {
            component: {
                sidebarCommonObject: {}
            },
            info: {
                menu: [
                    {
                        name: '返回列表',
                        sref: 'home.database.list',
                        icon: 'icon-huidaodingbu-copy',
                        static: true,
                        power: -1
                    },
                    {base: '/overview', icon: 'icon-tongjibaobiao', name: '数据库概况', sref: 'home.database.inside.overview', power: -1 },
                    {base: '/table', icon: 'icon-ziliaoku', name: '数据库结构', sref: 'home.database.inside.table.list', power: -1 },
                    {base: '/team', icon: 'icon-renyuanguanli', name: '协作管理', sref: 'home.database.inside.team', power: -1  },
                    {
                        name: '操作日志',
                        class:'disable-menu-li',
                        icon: 'icon-gongzuojihua',
                        power:-1,
                        tip:'PRO',
                        tipClass:'navbar-tip-item',
                        click:function(){
                            $rootScope.InfoModal('仅AMS专业版支持该功能','success');
                        }
                    }
                ]
            },
            fun: {
                shrink: null //收缩功能函数
            }
        }
        vm.data.fun.shrink = function() {
            $scope.$emit('$Home_ShrinkSidebar',{shrink:vm.shrinkObject.isShrink});
        }
        vm.$onInit = function() {
            vm.data.component.sidebarCommonObject = {
                mainObject: {
                    baseInfo: {
                        staticTop:true,
                        menu: vm.data.info.menu,
                        navigation: [{ name: '数据库管理', sref: 'home.database.list' }],
                    },
                    baseFun: {
                        shrink: vm.data.fun.shrink
                    }
                }
            }
        }
    }

})();
