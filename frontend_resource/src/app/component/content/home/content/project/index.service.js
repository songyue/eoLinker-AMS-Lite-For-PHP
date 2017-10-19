(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function api详情相关服务js
     * @version  3.0.2
     */
    angular.module('eolinker')
        .factory('HomeProject_Service', index);

    index.$inject = []

    function index() {
        var data = {
            apiTestObject: {
                testInfo: null,
                fun: {
                    set: null,
                    clear: null
                }
            },
            envObject: {
                object: {
                    model: {},
                    param: [],
                    fun: null
                },
                query: null,
                fun: {
                    resetObject: null, //重置变量双向绑定数据
                    clear: null, //清缓存功能函数
                }
            }
        }
        data.apiTestObject.fun.set = function(arg) {
            var template = {
                object: {}
            }
            angular.copy(arg.object, template.object);
            data.apiTestObject.testInfo = template.object;
        }
        data.apiTestObject.fun.clear = function() {
            data.apiTestObject.testInfo = null;
        }
        data.envObject.fun.resetObject = function() {
            data.envObject.object = {
                model: {},
                param: [],
                fun: null
            };
        }
        data.envObject.fun.clear = function() {
            data.envObject.query = null;
        }
        return data;
    }
})();
