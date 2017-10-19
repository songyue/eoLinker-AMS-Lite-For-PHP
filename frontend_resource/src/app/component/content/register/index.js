(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function [注册外页相关指令js]
     * @version  3.0.2
     */
    angular.module('eolinker')
        .config(['$stateProvider', 'RouteHelpersProvider', function($stateProvider, helper) {
            $stateProvider
                .state('register', {
                    url: '/register',
                    template: '<div class="register-content-wrap" >' +
                        '<eo-navbar0></eo-navbar0>' +
                        '<div class="register">' +
                        '    <div ui-view></div>' +
                        '</div>' +
                        '</div>'
                });
        }])
})();
