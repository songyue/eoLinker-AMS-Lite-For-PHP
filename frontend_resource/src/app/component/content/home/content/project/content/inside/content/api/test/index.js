(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function api测试模块相关js
     * @version  3.0.2
     * @service  $scope 注入作用域服务
     * @service  $rootScope 注入根作用域服务
     * @service  ApiManagementResource 注入接口管理接口服务
     * @service  $state 注入路由服务
     * @service  ApiDetailService 注入ApiDetailService服务
     * @service  GroupService 注入GroupService服务
     * @service  HomeProject_Service 注入HomeProject_Service服务
     * @constant CODE 注入状态码常量
     * @constant HTTP_CONSTANT 注入HTTP相关常量集
     */
    angular.module('eolinker')
        .config(['$stateProvider', 'RouteHelpersProvider', function($stateProvider, helper) {
            $stateProvider
                .state('home.project.inside.api.test', {
                    url: '/test?groupID?childGroupID?apiID',
                    template: '<home-project-inside-api-test power-object="$ctrl.powerObject" ></home-project-inside-api-test>'
                });
        }])
        .component('homeProjectInsideApiTest', {
            templateUrl: 'app/component/content/home/content/project/content/inside/content/api/test/index.html',
            bindings: {
                powerObject: '<',
            },
            controller: homeProjectInsideApiTestController
        })

    homeProjectInsideApiTestController.$inject = ['$scope', '$rootScope', 'ApiManagementResource', '$state', 'ApiDetailService', 'GroupService', 'HomeProject_Service', 'CODE', 'HTTP_CONSTANT'];

    function homeProjectInsideApiTestController($scope, $rootScope, ApiManagementResource, $state, ApiDetailService, GroupService, HomeProject_Service, CODE, HTTP_CONSTANT) {
        var vm = this;
        vm.data = {
            service: {
                home: HomeProject_Service,
            },
            constant: {
                requestHeader: HTTP_CONSTANT.REQUEST_HEADER
            },
            info: {
                template: {
                    envModel: []
                },
                uri: {
                    isFocus: false
                },
                header: {
                    type: '0'
                },
                format: {
                    isJson: true,
                    message: ''
                },
                response: {
                    httpCodeType: 2,
                    hadTest: false,
                    isHeader: false
                },
                toJson: {
                    checkbox: false,
                    raw: ''
                },
                auth: {
                    status: '0',
                    basicAuth: {
                        username: '',
                        password: ''
                    }
                },
                spreed: {
                    header: true,
                    request: true,
                    response: true,
                    history: true
                }
            },
            interaction: {
                request: {
                    projectID: $state.params.projectID,
                    groupID: $state.params.groupID,
                    childGroupID: $state.params.childGroupID,
                    apiID: $state.params.apiID
                },
                response: {
                    apiInfo: {}
                }
            },
            fun: {
                blurInput: null, //构造器失焦状态检测
                expressionBuilder: null, //构造器启动功能函数
                uriBlur: null, //测试地址input失焦触发功能函数
                delete: null, //移入回收站功能函数
                recover: null, //恢复功能函数
                deleteCompletely: null, //彻底删除功能函数
                headerList: {
                    add: null, //添加头部功能函数
                    delete: null, //删除头部功能函数
                },
                requestList: {
                    add: null, //添加请求参数功能函数
                    delete: null, //删除请求参数功能函数
                },
                testList: {
                    enter: null, //进入测试记录功能函数
                    delete: null, //删除测试记录功能函数
                    clear: null, //清空功能函数
                },
                window: null, //新开窗口
                changeType: null, //测试请求方式更改功能函数
                import: null, //导入功能函数
                last: {
                    header: null, //最后一个头部 item 输入框内容改变功能函数
                    request: null, //最后一个请求参数 item 输入框内容改变功能函数
                    response: null, //最后一个返回参数 item 输入框内容改变功能函数
                },
                json: null, //请求参数切换为raw json格式功能函数
            },
            assistantFun: {
                init: null //辅助初始化功能函数
            }
        }
        vm.data.fun.json = function() {
            vm.data.info.toJson.checkbox = !vm.data.info.toJson.checkbox;
        }
        vm.data.fun.last.header = function(arg) {
            if (arg.$last) {
                vm.data.fun.headerList.add();
            }
        }
        vm.data.fun.headerList.add = function() {
            var info = {
                "headerName": '',
                "headerValue": '',
                "checkbox": true
            }
            vm.data.service.home.envObject.object.model.headers.push(info);
        }
        vm.data.fun.headerList.delete = function(arg) {
            vm.data.service.home.envObject.object.model.headers.splice(arg.$index, 1);
        }
        vm.data.fun.last.request = function(arg) {
            if (arg.$last) {
                vm.data.fun.requestList.add();
            }
        }
        vm.data.fun.requestList.add = function() {
            var info = {
                "type": '0',
                "paramType": "0",
                "paramKey": "",
                "paramInfo": "",
                "checkbox": true,
                "paramValueQuery": []
            }
            vm.data.service.home.envObject.object.model.params.push(info);
            vm.submited = false;
        }
        vm.data.fun.requestList.delete = function(arg) {
            vm.data.service.home.envObject.object.model.params.splice(arg.$index, 1);
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
        vm.data.fun.window = function() {
            var template = {
                window: window.open()
            }
            if (vm.data.info.format.message) {
                template.window.document.open();
                template.window.document.write(vm.data.info.format.message);
                template.window.document.close();
            }
        }
        vm.data.fun.testList.clear = function(arg) {
            var template = {
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    apiID: vm.data.interaction.request.apiID
                }
            }
            $rootScope.EnsureModal('清空历史记录', false, '确认删除', {}, function(callback) {
                if (callback) {
                    ApiManagementResource.Test.DeleteAllHistory(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $rootScope.InfoModal('记录清空成功', 'success');
                                        vm.data.interaction.response.apiInfo.testHistory = [];
                                        break;
                                    }
                            }
                        })

                }
            });
        }
        vm.data.fun.testList.delete = function(arg) {
            arg = arg || {};
            if (arg.$event) {
                arg.$event.stopPropagation();
            }
            var template = {
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    testID: arg.item.testID
                }
            }
            $rootScope.EnsureModal('删除此项历史记录', false, '确认删除', {}, function(callback) {
                if (callback) {
                    if (arg.item.testID) {
                        ApiManagementResource.Test.DeleteHistory(template.request).$promise
                            .then(function(response) {
                                switch (response.statusCode) {
                                    case CODE.COMMON.SUCCESS:
                                        {
                                            $rootScope.InfoModal('记录删除成功!', 'success');
                                            vm.data.interaction.response.apiInfo.testHistory.splice(arg.$index, 1);
                                            break;
                                        }
                                }
                            })
                    } else {
                        vm.data.interaction.response.apiInfo.testHistory.splice(arg.$index, 1);
                    }

                }
            });

        }
        vm.data.fun.testList.enter = function(arg) {
            arg = arg || {};
            vm.data.service.home.envObject.object.model.URL = arg.item.requestInfo.URL;
            vm.data.service.home.envObject.object.model.headers = [];
            vm.data.service.home.envObject.object.model.params = [];
            vm.data.service.home.envObject.object.model.raw = '';
            vm.data.service.home.envObject.object.model.requestType = arg.item.requestInfo.requestType;
            vm.data.service.home.envObject.object.model.httpHeader = arg.item.requestInfo.apiProtocol;
            var info = {};
            var template = {
                img: {
                    html: null
                }
            }
            vm.data.info.response = {
                testHttpCode: arg.item.resultInfo.httpCode,
                testDeny: arg.item.resultInfo.testDeny,
                testResult: {
                    headers: arg.item.resultInfo.headers
                },
                httpCodeType: arg.item.httpCodeType,
                hadTest: true
            };
            angular.forEach(arg.item.requestInfo.headers, function(val, key) {
                info = {
                    headerName: val.name,
                    headerValue: val.value
                };
                vm.data.service.home.envObject.object.model.headers.push(info);
            });
            if (/image\/(jpg|jpeg|png|gif)/ig.test(JSON.stringify(arg.item.resultInfo.headers))) {
                template.img.html = '<img style="width:100%;" author="eolinker-frontend" src="' + arg.item.resultInfo.body + '"/>';
            }
            if (vm.data.service.home.envObject.object.model.requestType != '1') {
                angular.forEach(arg.item.requestInfo.params, function(val, key) {
                    info = {
                        checkbox: true,
                        paramKey: val.key,
                        paramInfo: val.value,
                        paramValueQuery: []
                    };
                    vm.data.service.home.envObject.object.model.params.push(info);
                });
            } else {
                vm.data.service.home.envObject.object.model.params = [];
                vm.data.service.home.envObject.object.model.raw = arg.item.requestInfo.params;
            }
            vm.data.interaction.response.apiInfo.baseInfo.type = '' + arg.item.requestInfo.methodType;
            vm.data.info.format.message = template.img.html || arg.item.resultInfo.body;
            vm.data.fun.headerList.add();
            vm.data.fun.requestList.add();
            vm.data.info.header = {
                type: '0'
            }
            vm.data.info.auth = {
                status: '0',
                basicAuth: {
                    username: '',
                    password: ''
                }
            }
        }
        vm.data.fun.changeType = function() {
            vm.data.fun.changeType = function() {
                if (!/0|2/.test(vm.data.interaction.response.apiInfo.baseInfo.type)) {
                    vm.data.service.home.envObject.object.model.requestType = vm.data.service.home.envObject.object.model.requestType == '1' ? '0' : vm.data.service.home.envObject.object.model.requestType;
                }
            }
        }
        vm.data.fun.blurInput = function(arg) {
            setTimeout(function() { //进行延时处理，时间单位为千分之一秒
                arg.focus.isFocus = false;
                $scope.$digest();
            }, 500)
        }
        vm.data.fun.expressionBuilder = function(data) {
            data.item.expressionBuilderObject = data.item.expressionBuilderObject || {
                request: {},
                response: {}
            }
            switch (data.$index) {
                case 0:
                    {
                        data.item.expressionBuilderObject.request.constant = data.item.URL;
                        break;
                    }
                case 1:
                    {
                        data.item.expressionBuilderObject.request.constant = data.item.headerValue;
                        break;
                    }
                case 2:
                    {
                        data.item.expressionBuilderObject.request.constant = data.item.paramInfo;
                        break;
                    }
            }

            $rootScope.ExpressionBuilderModal(data.item.expressionBuilderObject, function(callback) {
                switch (data.$index) {
                    case 0:
                        {
                            data.item.URL = callback.response.result || data.item.URL;
                            break;
                        }
                    case 1:
                        {
                            data.item.headerValue = callback.response.result || data.item.headerValue;
                            break;
                        }
                    case 2:
                        {
                            data.item.paramInfo = callback.response.result || data.item.paramInfo;
                            break;
                        }
                }
                data.item.expressionBuilderObject = callback;
            });
        }
        vm.data.fun.uriBlur = function() {
            if (!vm.data.service.home.envObject.object.model) return;
            if (/(https:\/\/)/i.test(vm.data.service.home.envObject.object.model.URL)) {
                vm.data.service.home.envObject.object.model.httpHeader = '1';
            } else if (/(http:\/\/)/i.test(vm.data.service.home.envObject.object.model.URL)) {
                vm.data.service.home.envObject.object.model.httpHeader = '0';
            }
        }
        vm.data.fun.import = function(arg) {
            var template = {
                $index: this.$parent.$index,
                reader: null
            }
            vm.data.service.home.envObject.object.model.params[template.$index].paramInfo = '';
            for (var i = 0; i < arg.file.length; i++) {
                var val = arg.file[i];
                if (val.size > 2 * 1024 * 1024) {
                    vm.data.service.home.envObject.object.model.params[template.$index].paramInfo = '';
                    vm.data.service.home.envObject.object.model.params[template.$index.files] = [];
                    $rootScope.InfoModal('文件大小均需小于2M', 'error');
                    break;
                } else {
                    vm.data.service.home.envObject.object.model.params[template.$index].paramInfo = val.name + ',' + vm.data.service.home.envObject.object.model.params[template.$index].paramInfo;
                    template.reader = new FileReader(); //new test
                    template.reader.readAsDataURL(val);
                    vm.data.service.home.envObject.object.model.params[template.$index].files = [];
                    template.reader.onload = function(_default) {
                        vm.data.service.home.envObject.object.model.params[template.$index].files.push(this.result);
                    }
                }

            }
            vm.data.service.home.envObject.object.model.params[template.$index].paramInfo = vm.data.service.home.envObject.object.model.params[template.$index].paramInfo.slice(0, vm.data.service.home.envObject.object.model.params[template.$index].paramInfo.length - 1);
            $scope.$digest();
        }
        vm.data.assistantFun.init = function() {
            $scope.$emit('$WindowTitleSet', { list: ['[测试]' + vm.data.interaction.response.apiInfo.baseInfo.apiName, 'API接口', $state.params.projectName, '接口管理'] });
            vm.data.interaction.response.apiInfo.testHistory = vm.data.interaction.response.apiInfo.testHistory || [];
            angular.forEach(vm.data.interaction.response.apiInfo.testHistory, function(val, key) {
                try {
                    if (val.requestInfo.constructor != Object) {
                        val.requestInfo = {
                            apiProtocol: '0',
                            method: 'error',
                            URL: '此历史记录错误',
                            requestType: '0'
                        };
                    }
                    if (val.resultInfo == null) {
                        val.resultInfo = {
                            'body': 'error',
                            'headers': [],
                            'httpCode': 500,
                            'testDeny': 0
                        };
                    }
                    val.requestInfo.methodType = val.requestInfo.method == 'POST' ? 0 : val.requestInfo.method == 'GET' ? 1 : val.requestInfo.method == 'PUT' ? 2 : val.requestInfo.method == 'DELETE' ? 3 : val.requestInfo.method == 'HEAD' ? 4 : val.requestInfo.method == 'OPTIONS' ? 5 : 6;
                    val.httpCodeType = val.resultInfo.httpCode >= 100 && val.resultInfo.httpCode < 200 ? 1 : val.resultInfo.httpCode >= 200 && val.resultInfo.httpCode < 300 ? 2 : val.resultInfo.httpCode >= 300 && val.resultInfo.httpCode < 400 ? 3 : 4;
                    val.requestInfo.URL = (val.requestInfo.URL || '').replace('http://', '');
                } catch (e) {
                    console.log('此历史记录有问题！');
                }
            })
            vm.data.service.home.envObject.object.model.URL = vm.data.interaction.response.apiInfo.baseInfo.apiURI;
            vm.data.service.home.envObject.object.model.params = vm.data.interaction.response.apiInfo.requestInfo || [];
            vm.data.service.home.envObject.object.model.httpHeader = '' + vm.data.interaction.response.apiInfo.baseInfo.apiProtocol;
            vm.data.service.home.envObject.object.model.requestType = '' + vm.data.interaction.response.apiInfo.baseInfo.apiRequestParamType;
            vm.data.service.home.envObject.object.model.raw = '' + vm.data.interaction.response.apiInfo.baseInfo.apiRequestRaw;
            vm.data.interaction.response.apiInfo.baseInfo.type = '' + vm.data.interaction.response.apiInfo.baseInfo.apiRequestType;
            angular.forEach(vm.data.interaction.response.apiInfo.requestInfo, function(val, key) {
                val.paramValueQuery = [];
                val.paramInfo = '';
                val.type = val.paramType;
                switch (val.paramNotNull) {
                    case '0':
                    case 0:
                        {
                            val.checkbox = true;
                            break;
                        }
                    default:
                        {
                            val.checkbox = false;
                            break;
                        }
                }
                angular.forEach(val.paramValueList, function(value, key) {
                    val.paramValueQuery.push(value.value);
                })
            });
            vm.data.info.template.envModel = vm.data.service.home.envObject.object.model;
            vm.data.fun.headerList.add();
            vm.data.fun.requestList.add();
            $scope.$emit('$TransferStation', { state: '$EnvInitReady', data: { status: 2, param: angular.toJson(vm.data.service.home.envObject.object.model), header: 'headers', uri: 'URL' } });
        }
        vm.data.fun.init = function() {
            var template = {
                cache: {
                    apiInfo: ApiDetailService.get(),
                    testInfo: vm.data.service.home.apiTestObject.testInfo
                },
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    groupID: vm.data.interaction.request.childGroupID || vm.data.interaction.request.groupID,
                    apiID: vm.data.interaction.request.apiID
                }
            }
            if (template.cache.testInfo) {
                vm.data.interaction.response.apiInfo = template.cache.testInfo.apiInfo;
                vm.data.info.template.envModel = template.cache.testInfo.reset;
                vm.data.service.home.envObject.object.model = template.cache.testInfo.message;
                vm.data.info.response = template.cache.testInfo.result;
                vm.data.info.format = template.cache.testInfo.format;
                $scope.$emit('$WindowTitleSet', { list: ['[测试]' + vm.data.interaction.response.apiInfo.baseInfo.apiName, 'API接口', $state.params.projectName, '接口管理'] });
                $scope.$emit('$TransferStation', { state: '$EnvInitReady', data: { status: 2, reset: 1, resetInfo: vm.data.info.template.envModel, param: angular.toJson(vm.data.service.home.envObject.object.model), header: 'headers', uri: 'URL' } });
            } else {
                vm.data.interaction.response.apiInfo = template.cache.apiInfo;
                if (vm.data.interaction.response.apiInfo) {
                    vm.data.service.home.envObject.object.model.headers = vm.data.interaction.response.apiInfo.headers || [];
                    vm.data.assistantFun.init();
                } else {
                    ApiManagementResource.Api.Detail(template.request).$promise.then(function(response) {
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    vm.data.interaction.response.apiInfo = response.apiInfo;
                                    vm.data.service.home.envObject.object.model.headers = vm.data.interaction.response.apiInfo.headerInfo || [];
                                    vm.data.assistantFun.init();
                                    break;
                                }
                            default:
                                {
                                    vm.data.interaction.response.apiInfo = {};
                                }
                        }
                    })
                }
            }
            $scope.importFile = vm.data.fun.import;
        }
        vm.data.fun.init();
        vm.$onInit = function() {
            $scope.$watch('$ctrl.data.service.home.envObject.object.model.URL', function() {
                vm.data.fun.uriBlur();
            })
            $scope.$on('$stateChangeStart', function() {
                vm.data.info.template.envModel.params = vm.data.service.home.envObject.object.model.params;
                vm.data.service.home.apiTestObject.fun.set({ object: { reset: vm.data.info.template.envModel, apiInfo: vm.data.interaction.response.apiInfo, message: vm.data.service.home.envObject.object.model, result: vm.data.info.response, format: vm.data.info.format } });
                ApiDetailService.set(null);
            });
        }

    }
})();