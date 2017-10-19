(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function 项目信息相关服务js
     * @version  3.0.2
     */
    angular.module('eolinker')
        .factory('ProjectService', ProjectFactory);

    ProjectFactory.$inject = []

    function ProjectFactory() {
        var data = {
            info: {
                detail: null,//project详情存储变量
                list:null//project列表存储变量
            },
            fun: {
                detail:{
                    get:null,//获取project详情功能函数
                    set:null//设置project详情功能函数
                },
                list:{
                    get:null,//获取project list功能函数
                    set:null//设置project list功能函数
                }
            }
        }
        data.fun.detail.get=function(){
            return data.info.detail;
        }
        data.fun.detail.set=function(request){
            data.info.detail=request;
        }
        data.fun.list.get=function(){
            return data.info.list;
        }
        data.fun.list.set=function(request){
            data.info.list=request;
        }
        return data.fun;
    }
})();
