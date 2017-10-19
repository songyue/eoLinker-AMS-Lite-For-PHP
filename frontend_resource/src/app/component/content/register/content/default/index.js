(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function [注册页相关指令js]
     * @version  3.0.2
     * @service  $scope [注入作用域服务]
     * @service  $rootScope [注入根作用域服务]
     * @service  CommonResource [注入通用接口服务]
     * @service  $state [注入路由服务]
     * @service  md5 [注入md5服务]
     * @constant CODE [注入状态码常量]
     */
    angular.module('eolinker')
        .config(['$stateProvider', 'RouteHelpersProvider', function($stateProvider, helper) {
            $stateProvider
                .state('register.default', {
                    url: '/',
                    auth: true,
                    template: '<register-default></register-default>'
                });
        }])
        .component('registerDefault', {
            templateUrl: 'app/component/content/register/content/default/index.html',
            controller: registerDefaultController
        })

    registerDefaultController.$inject = ['$scope', '$rootScope', 'CommonResource', '$state', 'md5', 'CODE'];

    function registerDefaultController($scope, $rootScope, CommonResource, $state, md5, CODE) {

        var vm = this;
        var code = CODE.COMMON.SUCCESS;
        vm.data = {
            info: {
                submited: false,
                eye: false,
                alert:'4~64位非纯数字，英文数字下划线组合，只能以英文开头'
            },
            interaction: {
                request: {
                    userName: '',
                    userPassword: '',
                    userNickName: '',
                }
            },
            fun: {
                check: null, 
                init: null, 
                $destory: null, 
                confirm: null, 
                changeView: null, 
            }
        }

        /**
         * @function [查重功能函数]
         */
        vm.data.fun.check = function() {
            var template = {
                request: {
                    userName: vm.data.interaction.request.userName
                }
            }
            if (template.request.userName != '') {
                CommonResource.GuestRegister.Check(template.request)
                    .$promise.then(function(response) {
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    vm.data.info.unavailable = false;
                                    vm.data.info.alert = '用户名可用';
                                    break;
                                }
                            case CODE.USER.EXIST:
                                {
                                    vm.data.info.unavailable = true;
                                    vm.data.info.alert = '用户名已存在';
                                    break;
                                }
                            default:
                                {
                                    vm.data.info.unavailable = true;
                                    vm.data.info.alert = '4~64位非纯数字，英文数字下划线组合，只能以英文开头';
                                    break;
                                }
                        }
                    })
            } else {
                vm.data.info.unavailable = false;
            }
        }

        /**
         * @function [是否显示密码功能函数]
         */
        vm.data.fun.changeView = function() {
            vm.data.info.eye = !vm.data.info.eye;
        }

        /**
         * @function [确认注册功能函数]
         */
        vm.data.fun.confirm = function() {
            var template = {}
            if (!vm.data.info.unavailable) {
                template.request = {
                    userName: vm.data.interaction.request.userName,
                    userPassword: md5.createHash(vm.data.interaction.request.userPassword),
                    userNickName: vm.data.interaction.request.userNickName,
                }
                if ($scope.registerForm.$valid) {
                    CommonResource.GuestRegister.Name(template.request).$promise.then(function(response) {
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    $rootScope.InfoModal('注册成功', 'success', function(data) {
                                        $state.go('index');
                                    });
                                    break;
                                }
                            case CODE.USER.ILLIGLE_PASSWORD:
                                {
                                    $scope.registerPhoneForm.phonePassword.$invalid = true;
                                    $rootScope.InfoModal('注册失败,密码格式非法！', 'error');
                                    break;
                                }
                            default:
                                {
                                    vm.data.info.submited = true;
                                    $rootScope.InfoModal('注册失败,请检查信息是否填写完整！', 'error');
                                    break;
                                }
                        }
                    })
                } else {
                    vm.data.info.submited = true;
                }
            }
        }

        /**
         * @function [初始化功能函数]
         */
        vm.data.fun.init = (function() {
            $scope.$emit('$WindowTitleSet', { list: ['用户注册'] });
            $scope.$on('$stateChangeStart', vm.data.fun.$destory);
        })();
    }
})();
