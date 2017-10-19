(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function [匹配Json转换为Param指令js]
     * @version  3.0.2
     * @service  $compile [注入$compile服务]
     * @service  $rootScope [注入根作用域服务]
     * @service  $filter [注入过滤器服务]
     * @param    importMethod [导入文本方式，默认json，1：get请求参数形式,2:请求头部形式]
     * @param    item [设置初始object类集（可选）]
     * @param    resetResult [插入结果位置集（必选）]
     * @param    valueItem [值可能性object类集（可选）]
     */
    angular.module('eolinker.directive')
        .directive('setJsonToParams', ['$compile', '$rootScope', '$filter', function($compile, $rootScope, $filter) {
            return {
                restrict: 'A',
                scope: {
                    importMethod: '@', 
                    item: '@', 
                    resetResult: '=', 
                    valueItem: '@' 
                },
                replace: true,
                template: '<button class="eo-button-info add-param-btn import-btn" data-ng-click="data.fun.confirm()">{{importMethod=="1"?\'导入GET参数\':(importMethod=="2"?\'导入头部\':\'导入JSON\')}}</button>',
                link: function($scope, elem, attrs, ngModel) {
                    var data = {
                        input: {
                            key: attrs.setJsonToParams || 'key', //数组参数个例变量名
                            valueKey: attrs.setValueKey || 'key', //数组参数个例值变量结果（如果value存储为array及object时存在）
                            value: attrs.setValue || 'value' //数组参数个例值变量名
                        },
                        fun: {
                            format: {
                                getHeaderDefault: null, 
                                default: null, 
                                value: null, 
                                array: null, 
                                object: null, 
                                typeof: null, 
                            }
                        },
                        output: []
                    }
                    $scope.data = {
                        fun: {
                            confirm: null, //确认导入功能函数
                        }
                    }

                    /**
                     * @function [json字段值设置功能函数]
                     * @param    {[obj]}   object [需过滤对象]
                     */
                    data.fun.format.value = function(object) {
                        if (!object) return;
                        switch (data.fun.format.typeof(data.output[data.output.length - 1][data.input.value])) {
                            case 'Array':
                                try {
                                    var newItem = JSON.parse($scope.valueItem);
                                    newItem[data.input.valueKey] = object;
                                    data.output[data.output.length - 1][data.input.value].push(newItem);
                                } catch (e) {
                                    data.output[data.output.length - 1][data.input.value][0] = object;
                                }
                                break;
                            default:
                                try {
                                    var newItem = JSON.parse($scope.valueItem);
                                    newItem[data.input.valueKey] = object;
                                    data.output[data.output.length - 1][data.input.value].push(newItem);
                                } catch (e) {
                                    data.output[data.output.length - 1][data.input.value] = object;
                                }
                                break;
                        }
                    }

                    /**
                     * @function [json值字段为array]
                     * @param    {[obj]}   object       [需过滤对象]
                     * @param    {[number]}   indent_count [缩进长度]
                     * @param    {[obj]}   parent       [该对象的父对象]
                     */
                    data.fun.format.array = function(object, indent_count, parent) {
                        if (object.length > 0) {
                            data.fun.format.default(object[0], indent_count + 1, parent)
                        }
                    }

                    /**
                     * @function [json值字段为object]
                     * @param    {[obj]}   object       [需过滤对象]
                     * @param    {[number]}   indent_count [缩进长度]
                     * @param    {[obj]}   parent       [该对象的父对象]
                     */
                    data.fun.format.object = function(object, indent_count, parent) {
                        var template = {
                            preItem: {}
                        }
                        var newItem={};
                        for (var key in object) {
                            if (object[key] !== 'author-riverLethe-double-slash-note') {
                                try {
                                    newItem = JSON.parse($scope.item);
                                    
                                } catch (e) {
                                    newItem = {};
                                }
                                switch (data.fun.format.typeof(object[key])) {
                                    case 'Object':
                                        {
                                            newItem.paramType='13';
                                            for (var childKey in object[key]) {
                                                if (object[key][childKey] == 'author-riverLethe-double-slash-note') {
                                                    newItem.paramName = childKey;
                                                }
                                                break;
                                            }
                                            break;
                                        }
                                    case 'Array':
                                        {
                                            newItem.paramType='12';
                                            if (object[key].length > 0) {
                                                for (var childKey in object[key][0]) {
                                                    if (object[key][0][childKey] == 'author-riverLethe-double-slash-note') {
                                                        newItem.paramName = childKey;
                                                        object[key].splice(0,1);
                                                    }
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                }
                                template.preItem = newItem;
                                newItem[data.input.key] = parent ? (parent + '>>' + key) : key;
                                data.output.push(newItem);
                                data.fun.format.default(object[key], indent_count + 1, parent ? (parent + '>>' + key) : key)
                            } else {
                                template.preItem.paramName = key;
                            }
                        }
                    }

                    /**
                     * @function [判别类型功能函数]
                     * @param    {[obj]}   object       [需过滤对象]
                     */
                    data.fun.format.typeof = function(object) {
                        var tf = typeof object,
                            ts = Object.prototype.toString.call(object);
                        return null === object ? 'Null' :
                            'undefined' == tf ? 'Undefined' :
                            'boolean' == tf ? 'Boolean' :
                            'number' == tf ? 'Number' :
                            'string' == tf ? 'String' :
                            '[object Function]' == ts ? 'Function' :
                            '[object Array]' == ts ? 'Array' :
                            '[object Date]' == ts ? 'Date' : 'Object';
                    }

                    /**
                     * @function [判断类型执行相应格式处理函数]
                     * @param    {[obj]}   object       [需过滤对象]
                     * @param    {[number]}   indent_count [缩进长度]
                     * @param    {[obj]}   parent       [该对象的父对象]
                     */
                    data.fun.format.default = function(object, indent_count, parent) {
                        switch (data.fun.format.typeof(object)) {
                            case 'Boolean':
                            case 'Number':
                            case 'String':
                                object = '' + object;
                                data.fun.format.value(object);
                                break;
                            case 'Array':
                                data.fun.format.array(object, indent_count, parent);
                                break;
                            case 'Object':
                                data.fun.format.object(object, indent_count, parent);
                                break;
                        }
                    }

                    /**
                     * @function [导入头部主函数]
                     * @param    {[string]}   string       [JSON]
                     */
                    data.fun.format.getHeaderDefault = function(string) {
                        var template = {
                            query: string.replace(/\"/g, '\\\"').split('\n'),
                            output: '{"'
                        }
                        angular.forEach(template.query, function(val, key) {
                            if (template.query.length - 1 != key) {
                                template.output = template.output + val.replace(/:/, '":"') + '","';
                            } else {
                                template.output = template.output + val.replace(/:/, '":"') + '"}';
                            }
                        })
                        console.log(JSON.parse(template.output))

                        return template.output;
                    }

                    /**
                     * @function [导入参数主函数]
                     * @param    {[string]}   string       [JSON]
                     */
                    data.fun.format.getParamDefault = function(string) {
                        var template = {
                            $index: string.indexOf('?'),
                            output: ''
                        }
                        switch (template.$index) {
                            case -1:
                                {
                                    template.output = '{"' + string.replace(/&/g, '","').replace(/=/g, '":"') + '"}';
                                    break;
                                }
                            default:
                                {
                                    template.output = '{"' + string.substring(template.$index + 1).replace(/&/g, '","').replace(/=/g, '":"') + '"}';
                                    break;
                                }
                        }
                        return template.output;
                    }

                    /**
                     * @function [插入返回参数集]
                     */
                    $scope.data.fun.confirm = function() { 
                        var template = {
                            input: '',
                            modal: {
                                method: $scope.importMethod
                            },
                            jsonToParamObject:{}
                        }
                        $rootScope.JsonToParamInputModal(template.modal, function(callback) {
                            if (callback) {
                                switch ($scope.importMethod) {
                                    case '1':
                                        {
                                            try {
                                                template.input = JSON.parse(data.fun.format.getParamDefault(callback.desc));
                                            } catch (e) {
                                                $rootScope.InfoModal('GET参数编写格式有误', 'error');
                                            }

                                            break;
                                        }
                                    case '2':
                                        {
                                            try {
                                                template.input = JSON.parse(data.fun.format.getHeaderDefault(callback.desc));
                                            } catch (e) {
                                                $rootScope.InfoModal('头部格式有误', 'error');
                                            }
                                            break;
                                        }
                                    default:
                                        {
                                            try {

                                                template.jsonToParamObject = {
                                                    origin: callback.desc.replace(/\/\/((?!").)*\n/g, ',"author-lethe":"author-riverLethe-double-slash-note",').replace(/(\s)*,(\s)*,/g, ',').replace(/(\s)*,(\s)*}/g, '}').replace(/(\s)*,(\s)*\]/g, ']').replace(/(\s)*\[(\s)*,"author-lethe":"author-riverLethe-double-slash-note"/g, '[{"author-lethe":"author-riverLethe-double-slash-note"}').replace(/(\s)*{(\s)*,/g, '{'),
                                                    matchList: [],
                                                    splitList: [],
                                                    result: ''
                                                }
                                                template.jsonToParamObject.matchList = callback.desc.match(/\/\/((?!").)*\n/g);
                                                template.jsonToParamObject.splitList = template.jsonToParamObject.origin.split('author-lethe');
                                                angular.forEach(template.jsonToParamObject.splitList, function(val, key) {
                                                    if (key == 0) {
                                                        template.jsonToParamObject.result = val;
                                                    } else {
                                                        template.jsonToParamObject.result = template.jsonToParamObject.result + template.jsonToParamObject.matchList[key - 1].replace(/\n/g, '').replace(/\/\//g, '') + val;
                                                    }
                                                })
                                                template.input = eval('(' + template.jsonToParamObject.result + ')');

                                            } catch (e) {
                                                $rootScope.InfoModal('JSON格式有误', 'error');
                                            }
                                            break;
                                        }
                                }
                                data.fun.format.default(template.input, 1);
                                data.output.push(JSON.parse($scope.item));
                                switch (callback.which) {
                                    case 0:
                                        { //插入
                                            $scope.resetResult.splice($scope.resetResult.length - 1, 1);
                                            $scope.resetResult = $scope.resetResult.concat(data.output);
                                            break;
                                        }
                                    case 1:
                                        { //替换

                                            $scope.resetResult = data.output;
                                            break;
                                        }
                                }
                                data.output = [];
                            }
                        });
                    }
                }
            };
        }]);
})();
