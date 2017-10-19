(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function api列表模块相关js
     * @version  3.0.2
     * @service  $scope 注入作用域服务
     * @service  $rootScope 注入根作用域服务
     * @service  ApiManagementResource 注入接口管理接口服务
     * @service  $state 注入路由服务
     * @service  GroupService 注入GroupService服务
     * @service  HomeProject_Service 注入HomeProject_Service服务
     * @constant CODE 注入状态码常量
     */
    angular.module('eolinker')
        .config(['$stateProvider', 'RouteHelpersProvider', function($stateProvider, helper) {
            $stateProvider
                .state('home.project.inside.api.list', {
                    url: '/list?groupID?childGroupID?search',
                    template: '<home-project-inside-api-list power-object="$ctrl.powerObject"></home-project-inside-api-list>'
                });
        }])
        .component('homeProjectInsideApiList', {
            templateUrl: 'app/component/content/home/content/project/content/inside/content/api/list/index.html',
            bindings: {
                powerObject: '<',
            },
            controller: homeProjectInsideApiListController
        })

    homeProjectInsideApiListController.$inject = ['$scope', '$rootScope', 'ApiManagementResource', '$state', 'GroupService', 'HomeProject_Service', 'CODE'];

    function homeProjectInsideApiListController($scope, $rootScope, ApiManagementResource, $state, GroupService, HomeProject_Service, CODE) {
        var vm = this;
        vm.data = {
            service:{
                home:HomeProject_Service,
            },
            info: {
                more:parseInt(window.localStorage['PROJECT_MORETYPE'])||1,
                template: {
                    envModel: []
                },
                sort: {
                    query:[{name:'创建时间',asc:0,orderBy:3},{name:'更新日期',asc:0,orderBy:1},{name:'接口名称',asc:0,orderBy:0},{name:'星标',asc:0,orderBy:2}],
                    current:JSON.parse(window.localStorage['PROJECT_SORTTYPE']||'{"orderBy":3,"asc":0}')
                },
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
                    apiID: []
                }
            },
            fun: {
                init: null, //初始化功能函数
                search: null, //搜索功能函数
                sort: null, //排序功能函数
                import: null, //导入文档
                batch: {
                    sort: null, //存储位置排序
                    delete: null, //批量删除功能函数
                    remove: null, //批量移入回收站功能函数
                    recover: null, //批量恢复功能函数
                    default: null, //默认切换函数
                }
            },
            assistantFun: {
                init: null //辅助初始化功能函数
            }
        }
        vm.data.fun.setMore=function(arg){
            vm.data.info.more=arg.switch;
            window.localStorage.setItem('PROJECT_MORETYPE', arg.switch);
        }
        vm.data.fun.import = function() {
            var template = {
                modal: {
                    title: '导入文档',
                    status: 1,
                    request: {
                        projectID: vm.data.interaction.request.projectID,
                        groupID: vm.data.interaction.request.childGroupID || vm.data.interaction.request.groupID
                    }
                }
            }
            $rootScope.ImportModal(template.modal, function(callback) {
                if (callback) {
                    $scope.$broadcast('$LoadingInit');
                }
            });
        }
        vm.data.fun.search = function() {
            if ($scope.searchForm.$valid) {
                $state.go('home.project.inside.api.list', { search: vm.data.interaction.request.tips });
            }
        }
        vm.data.fun.edit = function(arg) {
            arg = arg || {};
            if (arg.$event) {
                arg.$event.stopPropagation();
            }
            var template = {
                cache: GroupService.get()
            }
            if ((!template.cache) || (template.cache.length == 0)) {
                $rootScope.InfoModal('请先建立分组！', 'error');
            } else {
                if (!arg.item) {
                    $state.go('home.project.inside.api.edit', { groupID: vm.data.interaction.request.groupID, childGroupID: vm.data.interaction.request.childGroupID });
                } else {
                    $state.go('home.project.inside.api.edit', { groupID: vm.data.interaction.request.groupID, childGroupID: vm.data.interaction.request.childGroupID, apiID: arg.item.apiID })
                }
            }
        }
        vm.data.fun.sort = function(arg) {
            arg.item.asc=arg.item.asc==0?1:0;
            vm.data.info.sort.current=arg.item;
            window.localStorage.setItem('PROJECT_SORTTYPE', angular.toJson(arg.item));
            $scope.$broadcast('$LoadingInit', { boolean: true });
        }
        vm.data.fun.storage = function(arg) {
            arg = arg || {};
            if (arg.$event) {
                arg.$event.stopPropagation();
            }
            var template = {
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    apiID: arg.item.apiID
                }
            }
            switch (arg.item.starred) {
                case 0:
                    {
                        ApiManagementResource.Star.Add(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        arg.item.starred = 1;
                                        break;
                                    }
                            }
                        });
                        break;
                    }
                case 1:
                    {
                        ApiManagementResource.Star.Delete(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        arg.item.starred = 0;
                                        break;
                                    }
                            }
                        });
                        break;
                    }
            }
        }
        vm.data.fun.delete = function(arg) {
            arg = arg || {};
            if (arg.$event) {
                arg.$event.stopPropagation();
            }
            var template = {
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    apiID: '[' + arg.item.apiID + ']'
                }
            }
            switch (arg.switch) {
                case 0:
                    {
                        $rootScope.EnsureModal('删除Api', false, '确认删除', {}, function(callback) {
                            if (callback) {
                                ApiManagementResource.Api.Delete(template.request).$promise
                                    .then(function(response) {
                                        switch (response.statusCode) {
                                            case CODE.COMMON.SUCCESS:
                                                {
                                                    vm.data.service.home.envObject.object.model.splice(arg.$index, 1);
                                                    $rootScope.InfoModal('Api删除成功，已移入回收站', 'success');
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
                        break;
                    }
                case 1:
                    {
                        $rootScope.EnsureModal('永久性删除Api', false, '此操作无法恢复，确认删除？', {}, function(callback) {
                            if (callback) {
                                ApiManagementResource.Trash.Delete(template.request).$promise
                                    .then(function(response) {
                                        switch (response.statusCode) {
                                            case CODE.COMMON.SUCCESS:
                                                {
                                                    vm.data.service.home.envObject.object.model.splice(arg.$index, 1);
                                                    $rootScope.InfoModal('Api删除成功', 'success');
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
                        break;
                    }
            }
        }
        vm.data.fun.recover = function(arg) {
            arg = arg || {};
            if (arg.$event) {
                arg.$event.stopPropagation();
            }
            var template = {
                modal: {
                    group: {
                        parent: GroupService.get(),
                        title: '恢复接口所到分组选择'
                    }
                },
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    apiID: '[' + arg.item.apiID + ']',
                    groupID: ''
                }
            }
            if (!template.modal.group.parent) {
                $rootScope.InfoModal('暂无分组，请先建立分组再恢复接口！', 'error');
                return;
            }
            $rootScope.ApiRecoverModal(template.modal, function(callback) {
                if (callback) {
                    template.request.groupID = callback.groupID;
                    ApiManagementResource.Trash.Recover(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $rootScope.InfoModal('Api恢复成功', 'success');
                                        vm.data.service.home.envObject.object.model.splice(arg.$index, 1);
                                        break;
                                    }
                            }
                        })
                }
            });
        }
        vm.data.fun.clean = function() {
            var template = {
                request: { projectID: vm.data.interaction.request.projectID }
            }
            $rootScope.EnsureModal('清空回收站', false, '此操作无法恢复，确认删除？', {}, function(callback) {
                if (callback) {
                    ApiManagementResource.Trash.Clean(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $rootScope.InfoModal('回收站清空成功', 'success');
                                        vm.data.service.home.envObject.object.model = [];
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
                    groupID: vm.data.interaction.request.groupID,
                    childGroupID: vm.data.interaction.request.childGroupID,
                    apiID: arg.item.apiID
                },
                $index: vm.data.interaction.request.apiID.indexOf(arg.item.apiID)
            }
            if (vm.data.info.batch.disable) {
                arg.item.isClick = !arg.item.isClick;
                if (arg.item.isClick) {
                    vm.data.interaction.request.apiID.push(arg.item.apiID);
                    vm.data.info.batch.address.push(arg.$index);
                } else {
                    vm.data.interaction.request.apiID.splice(template.$index, 1);
                    vm.data.info.batch.address.splice(template.$index, 1);
                }
            } else {
                $state.go('home.project.inside.api.detail', template.uri);
            }
        }
        vm.data.fun.batch.sort = function(pre, next) {
            return pre - next;
        }
        vm.data.fun.batch.default = function() {
            if (vm.data.service.home.envObject.object.model && vm.data.service.home.envObject.object.model.length > 0) {
                vm.data.info.batch.disable = true;
                angular.forEach(vm.data.info.batch.address,function(val,key){
                    vm.data.service.home.envObject.object.model[val].isClick=false;
                })
                vm.data.info.batch.address=[];
                vm.data.interaction.request.apiID=[];
                $rootScope.InfoModal('请点击列表进行批量操作!','success');
            }else{
                $rootScope.InfoModal('当前列表为空!','error');
            }
        }
        vm.data.fun.batch.delete = function() {
            var template = {
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    apiID: JSON.stringify(vm.data.interaction.request.apiID)
                },
                loop: {
                    num: 0
                }
            }
            $rootScope.EnsureModal('永久性删除Api', false, '此操作无法恢复，确认删除？', {}, function(callback) {
                if (callback) {
                    ApiManagementResource.Trash.Delete(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        angular.forEach(vm.data.info.batch.address.sort(vm.data.fun.batch.sort), function(val, key) {
                                            val = val - template.loop.num++;
                                            vm.data.service.home.envObject.object.model.splice(val, 1);
                                        })
                                        vm.data.interaction.request.apiID = [];
                                        vm.data.info.batch.address = [];
                                        vm.data.info.batch.disable = false;
                                        $rootScope.InfoModal('Api删除成功', 'success');
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
        vm.data.fun.batch.recover = function() {
            var template = {
                modal: {
                    group: {
                        parent: GroupService.get(),
                        title: '恢复接口所到分组选择'
                    }
                },
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    apiID: JSON.stringify(vm.data.interaction.request.apiID),
                    groupID: ''
                },
                loop: {
                    num: 0
                }
            }
            if (!template.modal.group.parent) {
                $rootScope.InfoModal('暂无分组，请先建立分组再恢复接口！', 'error');
                return;
            }
            $rootScope.ApiRecoverModal(template.modal, function(callback) {
                if (callback) {
                    template.request.groupID = callback.groupID;
                    ApiManagementResource.Trash.Recover(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        angular.forEach(vm.data.info.batch.address.sort(vm.data.fun.batch.sort), function(val, key) {
                                            val = val - template.loop.num++;
                                            vm.data.service.home.envObject.object.model.splice(val, 1);
                                        })
                                        vm.data.info.batch.disable = false;
                                        vm.data.interaction.request.apiID = [];
                                        vm.data.info.batch.address = [];
                                        $rootScope.InfoModal('Api批量恢复成功', 'success');
                                        break;
                                    }
                            }
                        })
                }
            });
        }
        vm.data.fun.batch.remove = function() {
            var template = {
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    apiID: JSON.stringify(vm.data.interaction.request.apiID)
                },
                loop: {
                    num: 0
                }
            }
            $rootScope.EnsureModal('删除Api', false, '确认删除', {}, function(callback) {
                if (callback) {
                    ApiManagementResource.Api.Delete(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        angular.forEach(vm.data.info.batch.address.sort(vm.data.fun.batch.sort), function(val, key) {
                                            val = val - template.loop.num++;
                                            vm.data.service.home.envObject.object.model.splice(val, 1);
                                        })
                                        vm.data.info.batch.disable = false;
                                        vm.data.interaction.request.apiID = [];
                                        vm.data.info.batch.address = [];
                                        $rootScope.InfoModal('Api删除成功，已移入回收站', 'success');
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
        vm.data.assistantFun.init = function() {
            var template = {
                promise: null,
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    groupID: vm.data.interaction.request.childGroupID || vm.data.interaction.request.groupID,
                    orderBy: vm.data.info.sort.current.orderBy,
                    asc: vm.data.info.sort.current.asc,
                    tips: vm.data.interaction.request.tips
                }
            }
            $scope.$emit('$WindowTitleSet', { list: ['[列表]API接口', $state.params.projectName, '接口管理'] });
            if (vm.data.interaction.request.groupID == -2) {
                $scope.$emit('$tabChange', { apiName: '接口回收站', type: 1 });
                template.promise = ApiManagementResource.Trash.Query(template.request).$promise;
                template.promise.then(function(response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.SUCCESS:
                            {
                                vm.data.service.home.envObject.object.model = response.apiList;
                                break;
                            }
                    }
                    vm.data.info.template.envModel = vm.data.service.home.envObject.object.model;
                    $scope.$emit('$TransferStation', { state: '$EnvInitReady', data: { status: 0 } });
                })
            } else {
                $scope.$emit('$tabChange', { apiName: '接口列表', type: 0 });
                if (vm.data.interaction.request.tips) {
                    template.promise = ApiManagementResource.Api.Search(template.request).$promise;
                    template.promise.then(function(response) {
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    vm.data.service.home.envObject.object.model = response.apiList;
                                    break;
                                }
                        }
                        vm.data.info.template.envModel = vm.data.service.home.envObject.object.model;
                        $scope.$emit('$TransferStation', { state: '$EnvInitReady', data: { status: 0 } });
                    })
                } else if (vm.data.interaction.request.groupID == -1) {
                    template.promise = ApiManagementResource.Api.All(template.request).$promise;
                    template.promise.then(function(response) {
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    vm.data.service.home.envObject.object.model = response.apiList;
                                    break;
                                }
                        }
                        vm.data.info.template.envModel = vm.data.service.home.envObject.object.model;
                        $scope.$emit('$TransferStation', { state: '$EnvInitReady', data: { status: 0 } });
                    })
                } else {
                    template.promise = ApiManagementResource.Api.Query(template.request).$promise;
                    template.promise.then(function(response) {
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    vm.data.service.home.envObject.object.model = response.apiList;
                                    break;
                                }
                        }
                        vm.data.info.template.envModel = vm.data.service.home.envObject.object.model;
                        $scope.$emit('$TransferStation', { state: '$EnvInitReady', data: { status: 0 } });
                    })
                }
            }
            return template.promise;
        }
        vm.data.fun.init = function(arg) {
            arg = arg || {};
            var template = {
                promise: null
            }
            if (arg.boolean) {
                template.promise = vm.data.assistantFun.init();
            } else {
                template.promise = vm.data.assistantFun.init();
            }
            return template.promise;
        }
    }
})();
