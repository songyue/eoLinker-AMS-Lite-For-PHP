(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function 项目内页列表（list）模块相关js
     * @version  3.0.2
     * @service  $scope 注入作用域服务
     * @service  $rootScope 注入根作用域服务
     * @service  ApiManagementResource 注入接口管理接口服务
     * @service  $state 注入路由服务
     * @service  $filter 注入过滤器服务
     * @service  NavbarService 注入NavbarService服务
     * @constant CODE 注入状态码常量
     */
    angular.module('eolinker')
        .config(['$stateProvider', 'RouteHelpersProvider', function($stateProvider, helper) {
            $stateProvider
                .state('home.project.api.default', {
                    url: '/',
                    template: '<home-project-api-default></home-project-api-default>'
                });
        }])
        .component('homeProjectApiDefault', {
            templateUrl: 'app/component/content/home/content/project/content/api/content/_default/index.html',
            controller: indexController
        })

    indexController.$inject = ['$scope', '$rootScope', 'ApiManagementResource', '$state', '$filter', 'NavbarService', 'CODE'];

    function indexController($scope, $rootScope, ApiManagementResource, $state, $filter, NavbarService, CODE) {
        var vm = this;
        vm.data = {
            service: {
                navbar: NavbarService,
            },
            storage: {},
            interaction: {
                request: {
                    projectType: -1
                },
                response: {
                    query: null
                }
            },
            fun: {
                import: null, //导入项目
                export: null, //导出项目
                edit: null, //编辑项目功能函数
                delete: null, //删除功能函数
                enter: null, //进入项目功能函数
                init: null //初始化功能函数
            }
        }
        vm.data.fun.init = function() {
            var template = {
                promise: null,
                request: {
                    projectType: vm.data.interaction.request.projectType
                }
            }
            vm.data.storage = JSON.parse(window.localStorage['ENV_DIRECTIVE_TABLE'] || '{}');
            $scope.$emit('$WindowTitleSet', { list: ['项目列表'] });
            template.promise = ApiManagementResource.Project.Query(template.request).$promise;
            template.promise.then(function(response) {
                vm.data.interaction.response.query = response.projectList || [];
            })
            return template.promise;
        }
        vm.data.fun.import = function() {
            var template = {
                modal: {
                    title: '导入项目'
                }
            }
            $rootScope.ImportModal(template.modal, function(callback) {
                if (callback) {
                    $scope.$broadcast('$LoadingInit');
                }
            });
        }
        vm.data.fun.dump = function(arg) {
            arg = arg || {};
            if (arg.$event) {
                arg.$event.stopPropagation();
            }
            var template = {
                modal: {
                    title: '导出项目',
                    projectID: arg.item.projectID
                }
            }
            $rootScope.ExportModal(template.modal, function(callback) {});
        }
        vm.data.fun.edit = function(arg) {
            arg = arg || {};
            if (arg.$event) {
                arg.$event.stopPropagation();
            }
            var template = {
                modal: {
                    title: arg.item ? '修改项目' : '新增项目',
                    isAdd: !arg.item,
                    item: arg.item
                },
                request: {}
            }
            $rootScope.ProjectModal(template.modal, function(callback) {
                if (callback) {
                    template.request = {
                        projectDesc: callback.projectDesc,
                        projectID: callback.projectID,
                        projectName: callback.projectName,
                        projectType: callback.projectType,
                        projectUpdateTime: $filter('currentTimeFilter')(),
                        projectVersion: callback.projectVersion,
                        userType: callback.userType || 0
                    }
                    if (arg.item) {
                        vm.data.interaction.response.query.splice(arg.$index, 1);
                    }
                    vm.data.interaction.response.query.splice(0, 0, template.request);
                    $rootScope.InfoModal(template.modal.title + '成功', 'success');
                }
            });
        }
        vm.data.fun.delete = function(arg) {
            arg = arg || {};
            if (arg.$event) {
                arg.$event.stopPropagation();
            }
            var template = {
                request: {
                    projectID: arg.item.projectID
                }
            }
            $rootScope.EnsureModal('删除项目', true, '确认删除？', {}, function(callback) {
                if (callback) {
                    ApiManagementResource.Project.Delete(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        vm.data.interaction.response.query.splice(arg.$index, 1);
                                        window.localStorage.setItem('ENV_DIRECTIVE_TABLE', JSON.stringify(vm.data.storage, function(key, val) {
                                            if (key === arg.item.projectID) {
                                                return undefined;
                                            }
                                            return val;
                                        }));
                                        $rootScope.InfoModal('项目删除成功', 'success');
                                        break;
                                    }
                            }
                        })
                }
            });
        }
        vm.data.fun.enter = function(arg) {
            var template = {
                uri: {
                    projectName: arg.item.projectName,
                    projectID: arg.item.projectID
                }
            }
            $state.go('home.project.inside.api.list', template.uri);
        }
        vm.$onInit = function() {
        }
    }
})();