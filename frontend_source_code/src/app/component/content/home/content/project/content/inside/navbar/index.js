(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司 eolinker
     * @function [顶部栏（navbar）相关服务js] [Top bar (navbar) related services js]
     * @version  3.0.2
     * @service  $scope [注入作用域服务] [Injection scope service]
     * @service  $state [注入路由服务] [Injection state service]
     * @service  $filter [注入过滤器服务] [Injection filter service]
     * @service  NavbarService [注入NavbarService服务] [Injection NavbarService service]
     */
    angular.module('eolinker')
        .component('homeProjectInsideNavbar', {
            templateUrl: 'app/component/content/home/content/project/content/inside/navbar/index.html',
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
                    menu: [{
                            name: '返回列表',
                            sref: 'home.project.api.default',
                            icon: 'icon-huidaodingbu-copy',
                            static: true,
                            power: -1
                        },
                        {
                            base: '/overview',
                            name: '项目概况',
                            sref: 'home.project.inside.overview',
                            icon: 'icon-tongjibaobiao',
                            power: -1
                        },
                        {
                            base: '/api/',
                            name: 'API接口',
                            sref: 'home.project.inside.api',
                            icon: 'icon-api',
                            childSref: 'home.project.inside.api.list',
                            params: {
                                groupID: null
                            },
                            power: -1
                        },
                        {
                            base: '/test',
                            name: '自动化测试',
                            sref: 'home.project.inside.test',
                            childSref: 'home.project.inside.test.default',
                            icon: 'icon-jiqirendaan',
                            key: 10,
                            power: -1,
                            status: 'un-spreed',
                            childList: [{
                                    name: '用例管理',
                                    sref: 'home.project.inside.test',
                                    childSref: 'home.project.inside.test.default',
                                    params: {
                                        groupID: null
                                    }
                                },
                                {
                                    name: '定时测试任务',
                                    class:'disable-menu-li',
                                    tip:'PRO',
                                    tipClass:'navbar-tip-item',
                                    click:function(){
                                        $rootScope.InfoModal('仅AMS专业版支持该功能','success');
                                    }
                                }
                            ]
                        },
                        {
                            base: '/code',
                            name: '状态码',
                            sref: 'home.project.inside.code',
                            childSref: 'home.project.inside.code.list',
                            icon: 'icon-icocode',
                            power: -1
                        },
                        {
                            base: '/doc',
                            name: '项目文档',
                            sref: 'home.project.inside.doc',
                            childSref: 'home.project.inside.doc.list',
                            icon: 'icon-renwuguanli',
                            power: -1
                        },
                        {
                            base: '/env',
                            name: '环境管理',
                            sref: 'home.project.inside.env',
                            icon: 'icon-waibuhuanjing',
                            params: {
                                envID: null
                            },
                            power: -1
                        },
                        {
                            base: '/team',
                            name: '协作管理',
                            sref: 'home.project.inside.team',
                            icon: 'icon-renyuanguanli',
                            power: -1
                        },
                        {
                            base: '/log',
                            name: '项目动态',
                            sref: 'home.project.inside.log',
                            icon: 'icon-gongzuojihua',
                            power: -1
                        }
                    ]
                },
                fun: {
                    menu: null, //菜单功能函数
                    shrink: null //收缩功能函数
                }
            }
            vm.data.fun.shrink = function () {
                $scope.$emit('$Home_ShrinkSidebar', {
                    shrink: vm.shrinkObject.isShrink
                });
            }
            vm.$onInit = function () {
                vm.data.component.sidebarCommonObject = {
                    mainObject: {
                        baseInfo: {
                            staticTop:true,
                            menu: vm.data.info.menu,
                            navigation: [{
                                name: '接口管理',
                                sref: 'home.project.api.default'
                            }, {
                                name: $state.params.projectName
                            }],
                        },
                        baseFun: {
                            shrink: vm.data.fun.shrink,
                        }
                    }
                }
            }
        }

})();