(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function [测试指令js]
     * @version  3.0.2
     * @service  $filter [注入过滤器服务]
     * @service  $timeout [注入$timeout服务]
     * @service  $rootScope [注入根作用域服务]
     * @service  ApiManagementResource [注入接口管理接口服务]
     * @constant CODE [注入状态码常量]
     * @param    version [版本：0个人 1企业]
     * @param    auth [验证类型]
     * @param    json [转json参数]
     * @param    message [值可能性object类集（可选）]
     * @param    result [双向绑定测试后返回结果]
     * @param    detail [双向绑定测试初始化getApi内容]
     * @param    format [双向绑定格式整理内容]
     * @param    testForm [双向绑定基本表单信息是否填写完整]
     * @param    info [双向绑定基本的路由信息]
     * @param    isPlug [双向绑定是否为插件（用于对界面有无插件的差异性显示）]
     * @param    envParam [环境变量全局参数数组]
     */
    angular.module('eolinker.directive')

        .directive('testDirective', ['$filter', '$timeout', '$rootScope', 'ApiManagementResource','CODE',  function($filter, $timeout, $rootScope, ApiManagementResource, CODE) {
            return {
                restrict: 'A',
                transclude: true,
                replace: true,
                template: '<div>' + '<button class="eo-button-info " data-ng-click="test()" >' + ' <span class="iconfont icon-fasong" ng-class="{\'hidden\':send.disable}"></span> {{send.disable?"中止&nbsp;"+(send.countdown>0?send.countdown:""):\'发送\'}}' + '</button>' + '<div class="hidden" id="plug-in-result-js"></div>' + '<div class="hidden" id="plug-in-js">{"method":{{detail.baseInfo.type}},"requestInfo":{{message}},"env":{{envParam}},"formDataToJson":{"checkbox":{{json.checkbox}},"raw":{{message.params|paramLevelToJsonFilter}}},"auth":{{auth}}}</div>' + '</div>',
                scope: {
                    version: '@', 
                    auth: '=', 
                    json: '=', 
                    message: '=', 
                    result: '=', 
                    detail: '=', 
                    format: '=', 
                    testForm: '=', 
                    info: '=', 
                    isPlug: '=', 
                    envParam: '=' 
                },
                link: function($scope, elem, attrs, ctrl) {
                    var countdown = null;
                    var templateCountdown = null;
                    var timer = null;
                    $scope.send = {
                        countdown: '',
                        disable: false
                    }
                    var data = {
                        fun: {
                            restfulSet: null
                        }
                    }

                    /**
                     * @function [检测插件是否存在功能函数]
                     */
                    var checkPlug = function() { 
                        if (typeof(chrome) !== 'undefined') {
                            if ((!!navigator.mimeTypes['application/eolinker']) || (window.plug && window.plug.type == "application/eolinker")) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }

                    /**
                     * @function [环境变量全局参数重构功能函数]
                     * @param    {[obj]}   origin [原始值]
                     * @return   {[obj]}          [重构后的值]
                     */
                    var envSet = function(origin) { 
                        if ($scope.envParam.length > 0) {
                            var templateResult = {};
                            angular.copy(origin, templateResult);
                            angular.forEach($scope.envParam, function(val, key) {
                                templateResult.URL = templateResult.URL.replace(eval('/({{' + val.paramKey + '}})/g'), val.paramValue);
                                angular.forEach(templateResult.headers, function(val1, key1) {

                                    val1.headerName = val1.headerName.replace(eval('/({{' + val.paramKey + '}})/g'), val.paramValue);
                                })
                                angular.forEach(templateResult.params, function(val1, key1) {
                                    val1.paramKey = val1.paramKey.replace(eval('/({{' + val.paramKey + '}})/g'), val.paramValue);
                                })
                            })
                            return templateResult;
                        } else {
                            return origin;
                        }
                    }
                    
                    /**
                     * @function [显示测试结果调用功能函数]
                     * @param    {[obj]}   testHistory [测试历史]
                     * @param    {[obj]}   data        [测试数据]
                     */
                    var showTestResult = function(testHistory, data) { 
                        if ($scope.send.disable) {
                            if (data.statusCode == CODE.COMMON.SUCCESS) {
                                $scope.result = {
                                    testHttpCode: data.testHttpCode,
                                    testDeny: data.testDeny,
                                    testResult: data.testResult,
                                    httpCodeType: data.testHttpCode >= 100 && data.testHttpCode < 200 ? 1 : data.testHttpCode >= 200 && data.testHttpCode < 300 ? 2 : data.testHttpCode >= 300 && data.testHttpCode < 400 ? 3 : 4
                                };
                                var result = $scope.result.testResult.body;
                                testHistory.resultInfo = {
                                    headers: data.testResult.headers,
                                    body: data.testResult.body,
                                    httpCode: data.testHttpCode,
                                    testDeny: data.testDeny
                                };
                                testHistory.testID = data.testID;
                                testHistory.httpCodeType = data.testHttpCode >= 100 && data.testHttpCode < 200 ? 1 : data.testHttpCode >= 200 && data.testHttpCode < 300 ? 2 : data.testHttpCode >= 300 && data.testHttpCode < 400 ? 3 : 4;
                                var array = [];
                                array.push(testHistory);
                                $scope.detail.testHistory = array.concat($scope.detail.testHistory);
                                $scope.format.message = result;
                            } else {
                                $scope.result = {
                                    httpCodeType: 5
                                };
                                $scope.format.message = '';
                            }
                            $scope.result.hadTest = true;
                            clearInterval(countdown);
                            $scope.send.countdown = null;
                            $scope.send.disable = false;
                        }
                    }

                    /**
                     * @function [插件测试调用功能函数]
                     * @param    {[obj]}   testHistory [测试历史]
                     */
                    var plugTest = function(testHistory) { 
                        var data = {};
                        var template = {
                            img: {
                                html: ''
                            }
                        }
                        try {
                            data = JSON.parse($filter('HtmlFilter')(document.getElementById('plug-in-result-js').innerText));
                        } catch (e) {
                            data = {
                                statusCode: '2xxxxx'
                            }
                        }
                        if (data.statusCode == CODE.COMMON.SUCCESS) {
                            $scope.result = {
                                testHttpCode: data.testHttpCode,
                                testDeny: data.testDeny,
                                testResult: data.testResult,
                                httpCodeType: data.testHttpCode >= 100 && data.testHttpCode < 200 ? 1 : data.testHttpCode >= 200 && data.testHttpCode < 300 ? 2 : data.testHttpCode >= 300 && data.testHttpCode < 400 ? 3 : 4
                            };
                            if (/image\/(jpg|jpeg|png|gif)/ig.test(JSON.stringify(data.testResult.headers))) {
                                template.img.html = '<img style="max-width:100%;" author="eolinker-frontend" src="' + data.testResult.body + '"/>';
                            }
                            var result = $scope.result.testResult.body;
                            testHistory.resultInfo = {
                                headers: data.testResult.headers,
                                body: template.img.html || ((typeof result == 'object') ? angular.toJson(data.testResult.body) : data.testResult.body),
                                httpCode: data.testHttpCode,
                                testDeny: data.testDeny
                            };
                            testHistory.testID = data.testID;
                            testHistory.httpCodeType = data.testHttpCode >= 100 && data.testHttpCode < 200 ? 1 : data.testHttpCode >= 200 && data.testHttpCode < 300 ? 2 : data.testHttpCode >= 300 && data.testHttpCode < 400 ? 3 : 4;
                            var array = [];
                            array.push(testHistory);
                            $scope.detail.testHistory = array.concat($scope.detail.testHistory);
                            if (typeof result == 'object') {
                                $scope.format.message = angular.toJson(result);
                            } else {
                                $scope.format.message = template.img.html || result;
                            }
                        } else {
                            $scope.result = {
                                httpCodeType: 5
                            };
                            if (data.errorText) {
                                $scope.format.message = data.errorText;
                            } else {
                                $scope.format.message = '';
                            }
                        }
                        $scope.result.hadTest = true;
                        clearInterval(templateCountdown);
                        clearInterval(countdown);
                        $scope.send.countdown = null;
                        $scope.send.disable = false;
                        $scope.$apply();
                    }

                    /**
                     * @function [服务器测试调用功能函数]
                     */
                    var serverTest = function() { 
                        var template={
                            env:envSet($scope.message),
                            restfulObject:{
                                hadFilterParams:[]
                            }
                        }
                        if (!$scope.send.disable) {
                            if (/(localhost)|(192.168.)/.test($scope.message.URL)) {
                                var html = '<div style="line-height:30px;"><p>当前正在使用在线测试服务，如需对本地服务器进行请求测试，请安装我们为您免费提供的&nbsp;<a href="https://www.eolinker.com/#/plug/introduce" target="_blank" style="color: #EF6C00;" > <b style="color: #EF6C00;">测试增强插件</b> [点击获取]</a>！</p></div>'

                                $rootScope.MessageModal('温馨提示', html, function(data) {});
                            } else {
                                var info = {
                                    apiProtocol: $scope.message.httpHeader,
                                    URL: $scope.message.URL,
                                    headers: {},
                                    params: {},
                                }
                                if (/(http:\/\/)/.test(info.URL.substring(0, 7))) {
                                    info.URL = info.URL.substring(7);
                                } else if (/(https:\/\/)/.test(info.URL.substring(0, 8))) {
                                    info.URL = info.URL.substring(8);
                                }
                                info = envSet(info);
                                var testHistory = {
                                    requestInfo: {
                                        apiProtocol: info.apiProtocol,
                                        URL: info.URL,
                                        headers: [],
                                        params: [],
                                        method: $scope.detail.baseInfo.type == '0' ? 'POST' : $scope.detail.baseInfo.type == '1' ? 'GET' : $scope.detail.baseInfo.type == '2' ? 'PUT' : $scope.detail.baseInfo.type == '3' ? 'DELETE' : $scope.detail.baseInfo.type == '4' ? 'HEAD' : $scope.detail.baseInfo.type == '5' ? 'OPTIONS' : 'PATCH',
                                        methodType: $scope.detail.baseInfo.type,
                                        requestType: ($scope.json.checkbox && $scope.message.requestType != '1'&&/0|2|6/.test($scope.detail.baseInfo.type)) ? 1 : $scope.message.requestType
                                    }
                                };
                                if ($scope.testForm.$valid) {
                                    angular.forEach(template.env.headers, function(val, key) {
                                        if (val.checkbox) {
                                            if (!!val.headerName) {
                                                info.headers[val.headerName] = val.headerValue;
                                                var history = {
                                                    name: val.headerName,
                                                    value: val.headerValue
                                                }
                                                testHistory.requestInfo.headers.push(history);
                                            }
                                        }
                                    });
                                    switch ($scope.auth.status) {
                                        case '1':
                                            {
                                                info.headers['Authorization'] = $filter('base64Filter')($scope.auth.basicAuth.username + ':' + $scope.auth.basicAuth.password);
                                                testHistory.requestInfo.headers.push({ name: 'Authorization', value: $filter('base64Filter')($scope.auth.basicAuth.username + ':' + $scope.auth.basicAuth.password) });
                                                break;
                                            }
                                    }
                                    switch ($scope.message.requestType) {
                                        case '0':
                                            {
                                                if ($scope.json.checkbox&&/0|2|6/.test($scope.detail.baseInfo.type)) {
                                                    info.params = testHistory.requestInfo.params = $filter('paramLevelToJsonFilter')(template.env.params);
                                                } else {
                                                    angular.forEach(template.env.params, function(val, key) {
                                                        if (val.checkbox) {
                                                            if (!!val.paramKey) {
                                                                info.params[val.paramKey] = val.paramInfo;
                                                                var history = {
                                                                    key: val.paramKey,
                                                                    value: val.paramInfo
                                                                }
                                                                testHistory.requestInfo.params.push(history);
                                                            }
                                                        }
                                                    });
                                                    info.params = angular.toJson(info.params);
                                                }
                                                break;
                                            }
                                        case '1':
                                            {
                                                info.params = testHistory.requestInfo.params = $scope.message.raw;
                                                break;
                                            }
                                        case '2':
                                            {
                                                angular.forEach(template.env.params, function(val, key) {
                                                    if (val.checkbox) {
                                                        if (val.paramKey) {
                                                            if (info.URL.trim().indexOf('{' + val.paramKey + '}') > -1) {
                                                                info.URL = info.URL.replace(eval('/(\\\{' + val.paramKey + '\\\})/g'), val.paramInfo);
                                                            } else {
                                                                template.restfulObject.hadFilterParams.push(val);
                                                                info.params[val.paramKey] = val.paramInfo;
                                                                var history = {
                                                                    key: val.paramKey,
                                                                    value: val.paramInfo
                                                                }
                                                                testHistory.requestInfo.params.push(history);
                                                            }
                                                        }
                                                    }
                                                });
                                                if ($scope.json.checkbox&&/0|2|6/.test($scope.detail.baseInfo.type)) {
                                                    info.params = testHistory.requestInfo.params = $filter('paramLevelToJsonFilter')(template.restfulObject.hadFilterParams);
                                                } else {
                                                    info.params = angular.toJson(info.params);
                                                }
                                                testHistory.requestInfo.URL = info.URL;
                                                break;
                                            }
                                    }
                                    var message = {
                                        apiProtocol: info.apiProtocol,
                                        URL: info.URL,
                                        headers: angular.toJson(info.headers),
                                        params: info.params,
                                        apiID: $scope.info.apiID,
                                        projectID: $scope.info.projectID,
                                        requestType: testHistory.requestInfo.requestType
                                    }
                                    var type = $scope.detail.baseInfo.type;
                                    testHistory.testTime = $filter('currentTimeFilter')();
                                    var result = {};
                                    $scope.send.countdown = 0;
                                    $scope.send.disable = true;
                                    countdown = setInterval(function() {
                                        $scope.send.countdown++;
                                        $scope.$digest(); // 通知视图模型的变化
                                    }, 1000);
                                    switch ($scope.detail.baseInfo.type) {
                                        case '0':
                                            ApiManagementResource.Test.Post(message).$promise.then(function(data) {
                                                showTestResult(testHistory, data);
                                            })
                                            break;
                                        case '1':
                                            ApiManagementResource.Test.Get(message).$promise.then(function(data) {
                                                showTestResult(testHistory, data);
                                            })
                                            break;
                                        case '2':
                                            ApiManagementResource.Test.Put(message).$promise.then(function(data) {
                                                showTestResult(testHistory, data);
                                            })
                                            break;
                                        case '3':
                                            ApiManagementResource.Test.Delete(message).$promise.then(function(data) {
                                                showTestResult(testHistory, data);
                                            })
                                            break;
                                        case '4':
                                            ApiManagementResource.Test.Head(message).$promise.then(function(data) {
                                                showTestResult(testHistory, data);
                                            })
                                            break;
                                        case '5':
                                            ApiManagementResource.Test.Options(message).$promise.then(function(data) {
                                                showTestResult(testHistory, data);
                                            })
                                            break;
                                        case '6':
                                            ApiManagementResource.Test.Patch(message).$promise.then(function(data) {
                                                showTestResult(testHistory, data);
                                            })
                                            break;
                                    }
                                }
                            }
                        } else {
                            clearInterval(countdown);
                            $scope.send.countdown = null;
                            $scope.send.disable = false;
                        }
                    }

                    /**
                     * @function [初始化，判断是否存在插件功能函数]
                     */
                    var init = function() { 
                        $scope.isPlug = checkPlug();
                    }
                    init();

                    /**
                     * @function [初始化，判断是否存在插件功能函数（页面加载完成时执行）]
                     */
                    timer = $timeout(function() { 
                        if (!$scope.isPlug) {
                            init();
                        }
                    }, 0, true);

                    /**
                     * @function [绑定click，执行测试功能函数]
                     */
                    $scope.test = function() { 
                        var template = {
                            env:envSet($scope.message),
                            modal: {
                                html: ''
                            },
                            restfulObject:{
                                hadFilterParams:[]
                            }
                        }
                        if (!$scope.send.disable) {
                            if (checkPlug()) {
                                document.getElementById('plug-in-result-js').innerText = '';
                                var info = {
                                    apiProtocol: $scope.message.httpHeader,
                                    URL: $scope.message.URL,
                                    headers: {},
                                    params: {},
                                }
                                if (/(http:\/\/)/.test(info.URL.substring(0, 7))) {
                                    info.URL = info.URL.substring(7);
                                } else if (/(https:\/\/)/.test(info.URL.substring(0, 8))) {
                                    info.URL = info.URL.substring(8);
                                }
                                var testHistory = {
                                    requestInfo: {
                                        apiProtocol: info.apiProtocol,
                                        URL: template.env.URL,
                                        headers: [],
                                        params: [],
                                        method: $scope.detail.baseInfo.type == '0' ? 'POST' : $scope.detail.baseInfo.type == '1' ? 'GET' : $scope.detail.baseInfo.type == '2' ? 'PUT' : $scope.detail.baseInfo.type == '3' ? 'DELETE' : $scope.detail.baseInfo.type == '4' ? 'HEAD' : $scope.detail.baseInfo.type == '5' ? 'OPTIONS' : 'PATCH',
                                        methodType: $scope.detail.baseInfo.type,
                                        requestType: ($scope.json.checkbox && $scope.message.requestType != '1'&&/0|2|6/.test($scope.detail.baseInfo.type)) ? 1 : $scope.message.requestType
                                    }
                                };
                                if ($scope.testForm.$valid) {
                                    angular.forEach(template.env.headers, function(val, key) {
                                        if (val.checkbox) {
                                            if (!!val.headerName) {
                                                info.headers[val.headerName] = val.headerValue;
                                                var history = {
                                                    name: val.headerName,
                                                    value: val.headerValue
                                                }
                                                testHistory.requestInfo.headers.push(history);
                                            }
                                        }
                                    });
                                    switch ($scope.auth.status) {
                                        case '1':
                                            {
                                                testHistory.requestInfo.headers.push({ name: 'Authorization', value: $filter('base64Filter')($scope.auth.basicAuth.username + ':' + $scope.auth.basicAuth.password) });
                                                break;
                                            }
                                    }
                                    switch ($scope.message.requestType) {
                                        case '0':
                                            {
                                                if ($scope.json.checkbox&&/0|2|6/.test($scope.detail.baseInfo.type)) {
                                                    testHistory.requestInfo.params = $filter('paramLevelToJsonFilter')(template.env.params);
                                                } else {
                                                    angular.forEach(template.env.params, function(val, key) {
                                                        if (val.checkbox) {
                                                            if (!!val.paramKey) {
                                                                var history = {
                                                                    key: val.paramKey,
                                                                    value: val.paramInfo
                                                                }
                                                                testHistory.requestInfo.params.push(history);
                                                            }
                                                        }
                                                    });
                                                }
                                                break;
                                            }
                                        case '1':
                                            {
                                                testHistory.requestInfo.params = $scope.message.raw;
                                                break;
                                            }
                                        case '2':
                                            {
                                                angular.forEach(template.env.params, function(val, key) {
                                                    if (val.checkbox) {
                                                        if (val.paramKey) {
                                                            if (info.URL.trim().indexOf('{' + val.paramKey + '}') > -1) {
                                                                info.URL = info.URL.replace(eval('/(\\\{' + val.paramKey + '\\\})/g'), val.paramInfo);
                                                            } else {
                                                                template.restfulObject.hadFilterParams.push(val);
                                                                var history = {
                                                                    key: val.paramKey,
                                                                    value: val.paramInfo
                                                                }
                                                                testHistory.requestInfo.params.push(history);
                                                            }
                                                        }
                                                    }
                                                });
                                                if ($scope.json.checkbox&&/0|2|6/.test($scope.detail.baseInfo.type)) {
                                                    testHistory.requestInfo.params = $filter('paramLevelToJsonFilter')(template.restfulObject.hadFilterParams);
                                                }
                                                testHistory.requestInfo.URL = info.URL;
                                                break;
                                            }
                                    }
                                    var type = $scope.detail.baseInfo.type;
                                    testHistory.testTime = $filter('currentTimeFilter')();
                                    var result = {};
                                    $scope.send.countdown = 0;
                                    $scope.send.disable = true;
                                    templateCountdown = setInterval(function() {
                                        if (!!document.getElementById('plug-in-result-js').innerText) {
                                            plugTest(testHistory);
                                        }
                                    }, 10);
                                    countdown = setInterval(function() {
                                        $scope.send.countdown++;
                                        $scope.$digest(); // 通知视图模型的变化
                                        if ($scope.send.countdown == 60) {
                                            $scope.result = {
                                                httpCodeType: 5
                                            };
                                            $scope.format.message = '';
                                            $scope.isJson = false;
                                            $scope.result.hadTest = true;
                                            clearInterval(countdown);
                                            clearInterval(templateCountdown);
                                            $scope.send.countdown = null;
                                            $scope.send.disable = false;
                                            $scope.$digest();
                                        }
                                    }, 1000);
                                }
                            } else {
                                serverTest();
                            }
                        } else {
                            clearInterval(templateCountdown);
                            clearInterval(countdown);
                            $scope.send.countdown = null;
                            $scope.send.disable = false;
                        }
                    }

                    /**
                     * @function [销毁页面时销毁计时器]
                     */
                    $scope.$on('$destroy', function() { 
                        if (timer) {
                            $timeout.cancel(timer);
                        }
                    });

                    /**
                     * @function [路由开始转换时清除计时器]
                     */
                    $scope.$on('$stateChangeStart', function() { 
                        if (!!templateCountdown) {
                            clearInterval(templateCountdown);
                        }
                        if (!!countdown) {
                            clearInterval(countdown);
                        }
                    })
                }
            };
        }]);
})();