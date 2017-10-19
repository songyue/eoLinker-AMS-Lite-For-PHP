(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function api详情相关服务js
     * @version  3.0.2
     */
    angular.module('eolinker')
        .factory('ApiDetailService', ApiDetailFactory);

    ApiDetailFactory.$inject = []

    function ApiDetailFactory() {
        var data = {
            info: {
                apiDetail: null//api详情存储变量
            },
            fun: {
                get: null, //获取api详情功能函数
                set: null //设置api详情功能函数
            }
        }
        data.fun.get=function(){
            return data.info.apiDetail;
        }
        data.fun.set=function(request){
            data.info.apiDetail = request;
        }
        return data.fun;
    }
})();
