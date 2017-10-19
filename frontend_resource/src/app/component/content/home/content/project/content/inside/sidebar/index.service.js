(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function 顶部栏（navbar）相关服务js
     * @version  3.0.2
     * @service  GroupService 注入GroupService服务
     */
    angular.module('eolinker')
        .factory('HomeProjectSidebarService', HomeProjectSidebarService);

    HomeProjectSidebarService.$inject = ['GroupService']

    function HomeProjectSidebarService(GroupService) {
        var data = {
            service: GroupService,
            fun: {
                clear: null, //初始化功能函数
            }
        }
        data.fun.clear = function() {
            data.service.clear();
        };
        return data;
    }
})();
