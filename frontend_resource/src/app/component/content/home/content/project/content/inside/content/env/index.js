(function() {
    /**
     * @Author   广州银云信息科技有限公司
     * @function 环境模块相关js
     * @version  3.0.2
     * @service  $scope 注入作用域服务
     * @service  $rootScope 注入根作用域服务
     * @service  ApiManagementResource 注入接口管理接口服务
     * @service  $state 注入路由服务
     * @service  HomeProject_Service 注入HomeProject_Service服务
     * @constant CODE 注入状态码常量
     * @constant HTTP_CONSTANT 注入HTTP相关常量集
     */
    'use strict';
    angular.module('eolinker')
        .config(['$stateProvider', 'RouteHelpersProvider', function($stateProvider, helper) {
            $stateProvider
                .state('home.project.inside.env', {
                    url: '/env?envID',
                    template: '<home-project-inside-env power-object="$ctrl.data.info.powerObject"></home-project-inside-env>'
                });
        }])
        .component('homeProjectInsideEnv', {
            templateUrl: 'app/component/content/home/content/project/content/inside/content/env/index.html',
            bindings: {
                powerObject: '<'
            },
            controller: homeProjectInsideEnv
        })

    homeProjectInsideEnv.$inject = ['$scope', '$rootScope', 'ApiManagementResource', '$state', 'HomeProject_Service', 'CODE', 'HTTP_CONSTANT'];

    function homeProjectInsideEnv($scope, $rootScope, ApiManagementResource, $state, HomeProject_Service, CODE, HTTP_CONSTANT) {

        var vm = this;
        vm.data = {
            service: {
                container: HomeProject_Service
            },
            constant: {
                headerArray: HTTP_CONSTANT.REQUEST_HEADER
            },
            info: {
                pre: {},
                current: {
                    envName: '',
                    frontURIList: [{
                        uri: ''
                    }],
                    headerList: [{
                        headerName: '',
                        headerValue: ''
                    }],
                    paramList: [{
                        paramKey: '',
                        paramValue: ''
                    }]
                },
                reset: {
                    envID: -1,
                    envName: '',
                    frontURIList: [{
                        uri: ''
                    }],
                    headerList: [{
                        headerName: '',
                        headerValue: ''
                    }],
                    paramList: [{
                        paramKey: '',
                        paramValue: ''
                    }]
                }
            },
            interaction: {
                request: {
                    projectID: $state.params.projectID,
                    envID: parseInt($state.params.envID),
                    uriID: -1,
                    frontURI: '',
                    headerName: '',
                    headerValue: '',
                    paramKey: '',
                    paramValue: ''
                },
                response: {
                    headerQuery: [],
                    paramQuery: []
                }
            },
            fun: {
                cancle: null, //取消功能函数
                init: null, //初始化功能函数
                click: null, //菜单单击功能函数
                add: null, //添加菜单里面功能函数
                edit: null, //编辑功能函数
                delete:{
                    sidebar: null,
                    headerList:null,
                    paramList:null
                }, //删除功能函数
            }
        }
        vm.data.fun.click = function(arg) {
            if ((arg.item.envID == vm.data.interaction.request.envID)&&vm.data.info.current.envID==-1) {
                vm.data.info.current = vm.data.info.pre||arg.item;
            } else {
                $state.go('home.project.inside.env', { envID: arg.item.envID })
            }

        }
        vm.data.fun.delete.headerList=function(arg){
            vm.data.info.current.headerList.splice(arg.$index,1);
        }
        vm.data.fun.delete.paramList=function(arg){
            vm.data.info.current.paramList.splice(arg.$index,1);
        }
        vm.data.fun.delete.sidebar = function(arg) {
            arg.$event.stopPropagation();
            var template = {
                modal: {
                    title: '删除环境',
                    message: '请问是否删除该环境？'
                }
            }
            $rootScope.EnsureModal(template.modal.title, false, template.modal.message, {}, function(callback) {
                if (callback) {
                    ApiManagementResource.Env.Delete({ projectID: vm.data.interaction.request.projectID, envID: arg.item.envID }).$promise.then(function(response) {
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    vm.data.interaction.response.query.splice(arg.$index, 1);
                                    $rootScope.InfoModal('环境删除成功', 'success');
                                    if (vm.data.interaction.request.envID == arg.item.envID) {
                                        if (vm.data.interaction.response.query.length > 0) {
                                            vm.data.fun.click({ item: vm.data.interaction.response.query[0] });
                                        } else {
                                            vm.data.interaction.request.envID = null;
                                            $state.go('home.project.inside.env', { 'envID': null });
                                        }
                                    }

                                    break;
                                }
                        }
                    })
                }
            });
        }
        vm.data.fun.change = function(arg) {
            arg.item = arg.item || vm.data.info.current;
            var template = {
                reset: {},
                length: {
                    header: arg.item.headerList.length ? (arg.item.headerList.length - 1) : 0
                }
            }

            angular.copy(vm.data.info.reset, template.reset);
            if (arg.$last) {
                switch (arg.switch) {
                    case 0:
                        {
                            arg.item.headerList.push(template.reset.headerList[0]);
                            break;
                        }
                    case 1:
                        {
                            arg.item.paramList.push(template.reset.paramList[0]);
                            break;
                        }
                    default:
                        {
                            if(!vm.powerObject.readWrite) return;
                            if ((!arg.item.headerList[template.length.header]) || arg.item.headerList[template.length.header].headerName || arg.item.headerList[template.length.header].headerValue) {
                                arg.item.headerList.push(template.reset.headerList[0]);
                                arg.item.paramList.push(template.reset.paramList[0]);
                            }
                            break;
                        }
                }
            }

        }
        vm.data.fun.cancle = function() {
            vm.data.interaction.response.query.splice(vm.data.interaction.response.query.length - 1, 1);
            vm.data.info.current = vm.data.info.pre;
        }
        vm.data.fun.add = function() {
            if (vm.data.interaction.response.query[vm.data.interaction.response.query.length - 1] && vm.data.interaction.response.query[vm.data.interaction.response.query.length - 1].envID == -1) return;
            var template = {
                object: {}
            }
            vm.data.info.pre = vm.data.info.current;
            vm.data.info.current = {};
            angular.copy(vm.data.info.reset, vm.data.info.current);
            angular.copy(vm.data.info.reset, template.object);
            template.object.envName = '新环境';
            vm.data.interaction.response.query.push(template.object);
        }
        vm.data.fun.initQuery = function(arg) {
            if (vm.data.interaction.request.envID == arg.item.envID) {
                arg.item.$index = arg.$index;
                angular.copy(arg.item,vm.data.info.current);
                vm.data.fun.change({ switch: -1, $last: 1 });
            }
        }
        vm.data.fun.confirm = function() {
            if ($scope.ConfirmForm.$invalid) return;
            var template = {
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    envName: vm.data.info.current.envName,
                    frontURI: vm.data.info.current.frontURIList[0] ? vm.data.info.current.frontURIList[0].uri : '',
                    headers: {},
                    params: {},
                    envID: vm.data.info.current.envID > -1 ? vm.data.info.current.envID : null,
                },
                object: {},
                promise: null
            }
            for (var key = 0; key < vm.data.info.current.headerList.length; key++) {
                var val = vm.data.info.current.headerList[key];
                if (val.headerName) {
                    template.request.headers[val.headerName] = val.headerValue;
                } else if (!val.headerName && val.headerValue) return;
            }
            for (var key = 0; key < vm.data.info.current.paramList.length; key++) {
                var val = vm.data.info.current.paramList[key];
                if (val.paramKey) {
                    template.request.params[val.paramKey] = val.paramValue;
                } else if (!val.paramKey && val.paramValue) return;
            }
            template.request.headers = JSON.stringify(template.request.headers);
            template.request.params = JSON.stringify(template.request.params);
            if (template.request.envID) {
                template.promise = ApiManagementResource.Env.Edit(template.request).$promise;
                template.promise.then(function(response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.SUCCESS:
                            {
                                vm.data.interaction.response.query[vm.data.info.current.$index] = {};
                                angular.copy(vm.data.info.current, vm.data.interaction.response.query[vm.data.info.current.$index]);
                                $rootScope.InfoModal('修改环境变量成功！', 'success');
                                break;
                            }
                        default:
                            {
                                $rootScope.InfoModal('修改环境变量失败，请稍候再试或到论坛提交bug！', 'error');
                                break;
                            }
                    }
                })
            } else {
                template.promise = ApiManagementResource.Env.Add(template.request).$promise;
                template.promise.then(function(response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.SUCCESS:
                            {
                                $rootScope.InfoModal('新增环境变量成功！', 'success');
                                vm.data.info.current.envID = response.envID;
                                vm.data.interaction.response.query.splice(vm.data.interaction.response.query.length - 1, 1, vm.data.info.current);
                                vm.data.info.current = {};
                                angular.copy(vm.data.info.reset, vm.data.info.current);
                                angular.copy(vm.data.info.reset, template.object);
                                template.object.envName = '新环境';
                                vm.data.interaction.response.query.push(template.object);
                                break;
                            }
                        default:
                            {
                                $rootScope.InfoModal('新增环境变量失败，请稍候再试或到论坛提交bug！', 'error');
                                break;
                            }
                    }
                })
            }
            return template.promise;
        }
        vm.data.fun.init = (function() {
            var template = {
                cache: vm.data.service.container.envObject.query,
                request: {
                    projectID: vm.data.interaction.request.projectID
                }
            }
            $scope.$emit('$WindowTitleSet', { list: ['环境管理', $state.params.projectName, '接口管理'] });
            if (template.cache) {
                vm.data.interaction.response.query = template.cache;
            } else {
                ApiManagementResource.Env.Query(template.request).$promise.then(function(response) {
                    vm.data.interaction.response.query = response.envList || [];
                }).finally(function() {
                    vm.data.service.container.envObject.query = vm.data.interaction.response.query;
                })
            }
        })()
        $scope.$on("$stateChangeStart", function(_default, arg) {
            if (!/home.project.inside.env/.test(arg.name)) {
                vm.data.service.container.envObject.fun.clear();
            }
        })
    }
})();