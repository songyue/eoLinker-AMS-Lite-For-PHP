(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function 侧边栏（sidebar）相关服务js
     * @version  3.0.2
     * @service  $state 注入路由服务
     */
    angular.module('eolinker')
        .factory('SavbarService', SavbarService);

    SavbarService.$inject = ['$state']

    function SavbarService($state) {
        var data = {
            fun: {
                menu: null, //菜单功能函数
                shrink:null,//收缩功能函数
                init: null, //初始化功能函数
            }
        }

        vm.data.fun.menu = function(arg) {
            if (arg.item.childSref) {
                $state.go(arg.item.childSref);
            } else if (arg.item.sref) {
                $state.go(arg.item.sref);
            } else {
                window.open(arg.item.href);
            }
        }
        vm.data.fun.shrink = function(arg) {
            arg.shrinkObject.isShrink = !arg.shrinkObject.isShrink;
        }
        data.fun.init = (function() {
            
        })();
        return data;
    }
})();
