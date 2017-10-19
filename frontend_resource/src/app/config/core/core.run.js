(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function [核心配置模块]
     * @version  3.0.2
     * @service  $rootScope [注入根作用域]
     * @service  $state [注入路由服务]
     * @service  CommonResource [注入通用接口服务]
     * @constant AUTH_EVENTS [注入权限事件常量]
     * @constant CODE [注入状态码常量]
     */
    angular
        .module('eolinker')
        .run(appRun);

    appRun.$inject = ['$rootScope', '$state', 'CommonResource', 'AUTH_EVENTS', 'CODE'];

    function appRun($rootScope, $state, CommonResource, AUTH_EVENTS, CODE) {
        var data = {
            info: {
                title: {
                    root: $rootScope.title
                },
                _hmt:[]
            },
            fun: {}
        };

        /**
         * @function [监听路由改变功能函数]
         * @param    {[obj]}   _default [原生传参]
         * @param    {[obj]}   arg [{auth:值为真时表示该页面在未登录状态下可以访问}]
         */
        $rootScope.$on('$stateChangeStart', function(_default, arg) {
            window.scrollTo(0, 0);
            if (!arg.auth) {
                CommonResource.Guest.Check().$promise.then(function(response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.UNLOGIN:
                            {
                                if ($state.current.name.indexOf('transaction') > -1) {
                                    $state.go('login', { type: 2 });
                                } else {
                                    $rootScope.$broadcast(AUTH_EVENTS.UNAUTHENTICATED);
                                }
                                break;
                            }
                        case CODE.COMMON.UNAUTH:
                            {
                                $rootScope.$broadcast(AUTH_EVENTS.UNAUTHORIZED);
                                break;
                            }
                    }
                })
            }
        });

        /**
         * @function [转换交互功能函数]
         * @param    {[obj]}   _default [原生传参]
         * @param    {[obj]}   arg [{auth:自定义传参}]
         */
        $rootScope.$on('$TransferStation', function(_default, arg) { 
            $rootScope.$broadcast(arg.state, arg.data);
        });

        /**
         * @function [设置title功能函数]
         * @param    {[obj]}   _default [原生传参]
         * @param    {[obj]}   arg [{list:title列表项}]
         */
        $rootScope.$on('$WindowTitleSet', function(_default, arg) { 
            arg = arg || { list: [] };
            if (arg.list.length > 0) {
                window.document.title = arg.list.join('-') + (arg.list.length >= 1 ? '-' : '') +$rootScope.title;
            } else {
                window.document.title = $rootScope.title;
            }
        });

        /**
         * @function [监听服务器出错功能函数]
         * @param    {[obj]}   _default [原生传参]
         */
        $rootScope.$on(AUTH_EVENTS.SYSTEM_ERROR, function(_default) {
            console.log("error");
        })

        /**
         * @function [监听未认证权限功能函数]
         * @param    {[obj]}   _default [原生传参]
         */
        $rootScope.$on(AUTH_EVENTS.UNAUTHENTICATED, function(_default) {
            $state.go('login');
        })

        /**
         * @function [监听未登录功能函数]
         * @param    {[obj]}   _default [原生传参]
         */
        $rootScope.$on(AUTH_EVENTS.UNAUTHORIZED, function(_default) {
            $state.go('login');
        })
    }

})();
