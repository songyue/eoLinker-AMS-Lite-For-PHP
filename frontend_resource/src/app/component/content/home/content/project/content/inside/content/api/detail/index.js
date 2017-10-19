(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function api详情模块相关js
     * @version  3.0.2
     * @service  $scope 注入作用域服务
     * @service  $rootScope 注入根作用域服务
     * @service  ApiManagementResource 注入接口管理接口服务
     * @service  $state 注入路由服务
     * @service  $sce 注入$sce服务
     * @service  $filter 注入过滤器服务
     * @service  ApiDetailService 注入ApiDetailService服务
     * @service  HomeProject_Service 注入HomeProject_Service服务
     * @service  GroupService 注入GroupService服务
     * @constant CODE 注入状态码常量
     */
    angular.module('eolinker')
        .config(['$stateProvider', 'RouteHelpersProvider', function($stateProvider, helper) {
            $stateProvider
                .state('home.project.inside.api.detail', {
                    url: '/detail?groupID?childGroupID?apiID',
                    template: '<home-project-inside-api-detail power-object="$ctrl.powerObject" ></home-project-inside-api-detail>',
                    resolve: helper.resolveFor('MARKDOWN_CSS')
                });
        }])
        .component('homeProjectInsideApiDetail', {
            templateUrl: 'app/component/content/home/content/project/content/inside/content/api/detail/index.html',
            bindings: {
                powerObject: '<'
            },
            controller: homeProjectInsideApiDetailController
        })

    homeProjectInsideApiDetailController.$inject = ['$scope', '$rootScope', 'ApiManagementResource', '$state', '$sce', '$filter', 'ApiDetailService', 'HomeProject_Service', 'GroupService', 'CODE'];

    function homeProjectInsideApiDetailController($scope, $rootScope, ApiManagementResource, $state, $sce, $filter, ApiDetailService, HomeProject_Service, GroupService, CODE) {
        var vm = this;
        vm.data = {
            service: {
                home: HomeProject_Service,
                detail: ApiDetailService
            },
            info: {
                template: {
                    envModel: null
                },
                mock: {
                    isFailure: false
                },
                spreed:{
                    header:true,
                    request:true,
                    response:true,
                    example:true,
                    note:true
                }
            },
            interaction: {
                request: {
                    apiID: $state.params.apiID,
                    projectID: $state.params.projectID,
                    groupID: $state.params.groupID,
                    childGroupID: $state.params.childGroupID
                }
            },
            fun: {
                init: null, //初始化功能函数
                test: null, //进入测试界面
                showRequestValue: null, //显示请求参数示例
                delete: null, //移入回收站功能函数
                recover: null, //恢复功能函数
                deleteCompletely: null, //彻底删除功能函数
                storage: null, //星标功能函数
                show: {
                    request: null, //显示请求参数个例详情
                    response: null, //显示返回结果个例详情
                }
            }
        }
        vm.data.fun.init = function() {
            var template = {
                promise: null,
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    groupID: vm.data.interaction.request.childGroupID || vm.data.interaction.request.groupID,
                    apiID: vm.data.interaction.request.apiID
                }
            }

            template.promise = ApiManagementResource.Api.Detail(template.request).$promise;
            template.promise.then(function(response) {
                switch (response.statusCode) {
                    case CODE.COMMON.SUCCESS:
                        {
                            vm.data.service.home.envObject.object.model = response.apiInfo;
                            $scope.$emit('$WindowTitleSet', { list: ['[详情]' + vm.data.service.home.envObject.object.model.baseInfo.apiName, 'API接口', $state.params.projectName, '接口管理'] });
                            switch (response.apiInfo.baseInfo.apiProtocol) {
                                case 0:
                                    vm.data.service.home.envObject.object.model.baseInfo.protocol = 'HTTP';
                                    break;
                                case 1:
                                    vm.data.service.home.envObject.object.model.baseInfo.protocol = 'HTTPS';
                                    break;
                            }
                            switch (response.apiInfo.baseInfo.apiStatus) {
                                case 0:
                                    vm.data.service.home.envObject.object.model.baseInfo.status = '启用';
                                    break;
                                case 1:
                                    vm.data.service.home.envObject.object.model.baseInfo.status = '维护';
                                    break;
                                case 2:
                                    vm.data.service.home.envObject.object.model.baseInfo.status = '弃用';
                                    break;
                            }
                            vm.data.service.home.envObject.object.model.resultInfo = $filter('paramLevelFilter')(vm.data.service.home.envObject.object.model.resultInfo);
                            vm.data.service.home.envObject.object.model.requestInfo = $filter('paramLevelFilter')(vm.data.service.home.envObject.object.model.requestInfo);
                            vm.data.service.home.envObject.object.model.baseInfo.apiNoteHtml = $sce.trustAsHtml($filter('XssFilter')(vm.data.service.home.envObject.object.model.baseInfo.apiNote, {
                                onIgnoreTagAttr: function(tag, name, value, isWhiteAttr) {
                                    if (/(class)|(id)|(name)/.test(name)) {
                                        return name + '="' + value + '"';
                                    }
                                }
                            }));
                            vm.data.service.home.envObject.object.model.baseInfo.successMockCode = 'http://result.eolinker.com/' + vm.data.service.home.envObject.object.model.baseInfo.mockCode;
                            vm.data.service.home.envObject.object.model.baseInfo.failureMockCode = 'http://result.eolinker.com/' + vm.data.service.home.envObject.object.model.baseInfo.mockCode + '&resultType=failure';
                            vm.data.service.home.envObject.object.model.headers = response.apiInfo.headerInfo;
                            vm.data.info.template.envModel = vm.data.service.home.envObject.object.model;
                            $scope.$emit('$TransferStation', { state: '$EnvInitReady', data: { status: 1, param: angular.toJson(vm.data.service.home.envObject.object.model) } });
                            break;
                        }
                }
            })
            return template.promise;
        }
        vm.data.fun.test = function() {
            var template = {
                uri: {
                    groupID: vm.data.interaction.request.groupID,
                    childGroupID: vm.data.interaction.request.childGroupID,
                    apiID: vm.data.interaction.request.apiID
                }
            }
            vm.data.service.detail.set(vm.data.info.template.envModel);
            $state.go('home.project.inside.api.test', template.uri);

        }
        vm.data.fun.show.request = function(arg) {
            if (!(arg.item.paramLimit || (arg.item.paramValueList && arg.item.paramValueList.length > 0) || arg.item.paramValue)) return;
            var template = {
                modal: {
                    item: arg.item
                }
            }
            $rootScope.RequestParamDetailModal(template.modal, function(callback) {

            })
        }
        vm.data.fun.show.response = function(arg) {
            if (!(arg.item.paramValueList || arg.item.paramValueList.length > 0)) return;
            var template = {
                modal: {
                    item: arg.item
                }
            }
            $rootScope.ResponseParamDetailModal(template.modal, function(callback) {

            })
        }
        vm.data.fun.delete = function() {
            var template = {
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    apiID: '[' + vm.data.interaction.request.apiID + ']'
                },
                uri: {
                    groupID: vm.data.interaction.request.groupID,
                    childGroupID: vm.data.interaction.request.childGroupID
                }
            }
            $rootScope.EnsureModal('删除Api', false, '确认删除', {}, function(callback) {
                if (callback) {
                    ApiManagementResource.Api.Delete(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $state.go('home.project.inside.api.list', template.uri);
                                        $rootScope.InfoModal('Api删除成功，已移入回收站', 'success');
                                        break;
                                    }
                            }
                        })
                }
            });
        }
        vm.data.fun.recover = function() {
            var template = {
                modal: {
                    group: {
                        parent: GroupService.get(),
                        title: '恢复接口所到分组选择'
                    }
                },
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    apiID: '[' + vm.data.interaction.request.apiID + ']',
                    groupID: ''
                },
                uri: {
                    groupID: vm.data.interaction.request.groupID,
                    childGroupID: vm.data.interaction.request.childGroupID
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
                                        $state.go('home.project.inside.api.list', template.uri);
                                        break;
                                    }
                            }
                        })
                }
            });

        }
        vm.data.fun.deleteCompletely = function() {
            var template = {
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    apiID: '[' + vm.data.interaction.request.apiID + ']'
                },
                uri: {
                    groupID: vm.data.interaction.request.groupID,
                    childGroupID: vm.data.interaction.request.childGroupID
                }
            }
            $rootScope.EnsureModal('永久性删除Api', false, '此操作无法恢复，确认删除？', {}, function(callback) {
                if (callback) {
                    ApiManagementResource.Trash.Delete(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $state.go('home.project.inside.api.list', template.uri);
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
        vm.data.fun.storage = function() {
            var template = {
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    apiID: vm.data.interaction.request.apiID
                }
            }
            switch (vm.data.service.home.envObject.object.model.baseInfo.starred) {
                case 0:
                    {
                        ApiManagementResource.Star.Add(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        vm.data.service.home.envObject.object.model.baseInfo.starred = 1;
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
                                        vm.data.service.home.envObject.object.model.baseInfo.starred = 0;
                                        break;
                                    }
                            }
                        });
                        break;
                    }
            }
        }
    }
})();
