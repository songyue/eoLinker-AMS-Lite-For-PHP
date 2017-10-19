(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function api sidebar模块相关js
     * @version  3.0.2
     * @service  $scope 注入作用域服务
     * @service  $rootScope 注入根作用域服务
     * @service  ApiManagementResource 注入接口管理接口服务
     * @service  $state 注入路由服务
     * @service  GroupService 注入GroupService服务
     * @constant CODE 注入状态码常量
     */
    angular.module('eolinker')
        .config(['$stateProvider', 'RouteHelpersProvider', function($stateProvider, helper) {
            $stateProvider
                .state('home.project.inside.code.list', {
                    url: '/list?groupID?childGroupID?search',
                    template: '<home-project-inside-code-list power-object="$ctrl.powerObject"></home-project-inside-code-list>'
                });
        }])
        .component('homeProjectInsideCodeList', {
            templateUrl: 'app/component/content/home/content/project/content/inside/content/code/list/index.html',
            bindings: {
                powerObject: '<'
            },
            controller: homeProjectInsideCodeListController
        })

    homeProjectInsideCodeListController.$inject = ['$scope', '$rootScope', 'ApiManagementResource', '$state', 'GroupService', 'CODE'];

    function homeProjectInsideCodeListController($scope, $rootScope, ApiManagementResource, $state, GroupService, CODE) {
        var vm = this;
        vm.data = {
            info: {
                batch: {
                    address: [],
                    disable: false
                }
            },
            interaction: {
                request: {
                    projectID: $state.params.projectID,
                    groupID: $state.params.groupID || -1,
                    childGroupID: $state.params.childGroupID,
                    tips: $state.params.search,
                    codeID: []
                },
                response: {
                    query: null
                }
            },
            fun: {
                init: null, //初始化功能函数
                search: null, //搜索功能函数
                edit: null, //编辑功能函数
                delete: null, //删除功能函数
                batch: {
                    sort: null, //存储位置排序
                    delete: null, //批量删除功能函数
                    default: null
                }
            }
        }
        vm.data.fun.init = function() {
            var template = {
                promise: null,
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    groupID: vm.data.interaction.request.childGroupID || vm.data.interaction.request.groupID,
                    tips: vm.data.interaction.request.tips
                }
            }
            $scope.$emit('$WindowTitleSet', { list: ['[列表]状态码管理', $state.params.projectName, '接口管理'] });
            if (template.request.tips) {
                template.promise = ApiManagementResource.Code.Search(template.request).$promise;
                template.promise.then(function(response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.SUCCESS:
                            {
                                vm.data.interaction.response.query = response.codeList;
                                break;
                            }
                        default:
                            {
                                vm.data.interaction.response.query = [];
                            }
                    }
                })
            } else if (template.request.groupID == -1) {
                template.promise = ApiManagementResource.Code.All(template.request).$promise;
                template.promise.then(function(response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.SUCCESS:
                            {
                                vm.data.interaction.response.query = response.codeList;
                                break;
                            }
                        default:
                            {
                                vm.data.interaction.response.query = [];
                            }
                    }
                })
            } else {
                template.promise = ApiManagementResource.Code.Query(template.request).$promise;
                template.promise.then(function(response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.SUCCESS:
                            {
                                vm.data.interaction.response.query = response.codeList;
                                break;
                            }
                        default:
                            {
                                vm.data.interaction.response.query = [];
                            }
                    }
                })
            }
            return template.promise;
        }
        vm.data.fun.search = function() {
            var template = {
                uri: { search: vm.data.interaction.request.tips }
            }
            $state.go('home.project.inside.code.list', template.uri);
        }
        vm.data.fun.edit = function(arg) {
            arg = arg || {};
            var template = {
                cache: GroupService.get(),
                modal: {
                    title: arg.item ? '修改状态码' : '新增状态码'
                }
            }
            if ((!template.cache) || (template.cache.length == 0)) {
                $rootScope.InfoModal('请先建立分组！', 'error');
            } else {
                if (arg.item) {
                    arg.item.projectID = vm.data.interaction.request.projectID;
                    arg.item.childGroupID = vm.data.interaction.request.childGroupID;
                    $rootScope.CodeModal(template.modal.title, arg.item, function(callback) {
                        if (callback) {
                            $rootScope.InfoModal(template.modal.title + '成功', 'success');
                            $scope.$broadcast('$LoadingInit');
                        }
                    });
                } else {
                    arg.item = {
                        projectID: vm.data.interaction.request.projectID,
                        groupID: vm.data.interaction.request.groupID,
                        childGroupID: vm.data.interaction.request.childGroupID
                    }
                    $rootScope.CodeModal(template.modal.title, arg.item, function(callback) {
                        if (callback) {
                            $rootScope.InfoModal(template.modal.title + '成功', 'success');
                        }
                        $scope.$broadcast('$LoadingInit');
                    });
                }
            }

        }
        vm.data.fun.delete = function(arg) {
            var template = {
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    codeID: '[' + arg.item.codeID + ']'
                }
            }
            $rootScope.EnsureModal('删除状态码', false, '确认删除', {}, function(callback) {
                if (callback) {
                    ApiManagementResource.Code.Delete(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        vm.data.interaction.response.query.splice(arg.$index, 1);
                                        $rootScope.InfoModal('状态码删除成功', 'success');
                                        break;
                                    }
                            }
                        })
                }
            });
        }
        vm.data.fun.enter = function(arg) {
            var template = {
                $index: vm.data.interaction.request.codeID.indexOf(arg.item.codeID)
            }
            if (vm.data.info.batch.disable) {
                arg.item.isClick = !arg.item.isClick;
                if (arg.item.isClick) {
                    vm.data.interaction.request.codeID.push(arg.item.codeID);
                    vm.data.info.batch.address.push(arg.$index);
                } else {
                    vm.data.interaction.request.codeID.splice(template.$index, 1);
                    vm.data.info.batch.address.splice(template.$index, 1);
                }
            }
        }
        vm.data.fun.batch.sort = function(pre, next) {
            return pre - next;
        }
        vm.data.fun.batch.default = function() {
            if (vm.data.interaction.response.query && vm.data.interaction.response.query.length > 0) {
                vm.data.info.batch.disable = true;
                angular.forEach(vm.data.info.batch.address,function(val,key){
                    vm.data.interaction.response.query[val].isClick=false;
                })
                vm.data.info.batch.address=[];
                vm.data.interaction.request.codeID=[];
                $rootScope.InfoModal('请点击列表进行批量操作!', 'success');
            } else {
                $rootScope.InfoModal('当前列表为空!', 'error');
            }
        }
        vm.data.fun.batch.delete = function() {
            var template = {
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    codeID: JSON.stringify(vm.data.interaction.request.codeID)
                },
                loop: {
                    num: 0
                }
            }
            $rootScope.EnsureModal('删除状态码', false, '此操作无法恢复，确认删除？', {}, function(callback) {
                if (callback) {
                    ApiManagementResource.Code.Delete(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        angular.forEach(vm.data.info.batch.address.sort(vm.data.fun.batch.sort), function(val, key) {
                                            val = val - template.loop.num++;
                                            vm.data.interaction.response.query.splice(val, 1);
                                        })
                                        vm.data.info.batch.disable = false;
                                        vm.data.interaction.request.codeID = [];
                                        vm.data.info.batch.address = [];
                                        $rootScope.InfoModal('状态码删除成功', 'success');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal('删除失败，请稍候再试或到论坛提交bug', 'error');
                                        break;
                                    }
                            }
                        })
                }
            });
        }
    }
})();