(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function 账号管理内页相关指令js
     * @version  3.0.2
     * @service  $scope 注入作用域服务
     * @service  $rootScope 注入根作用域服务
     * @service  CommonResource 注入通用接口服务
     * @service  $state 注入路由服务
     * @service  md5 注入md5服务
     * @service  NavbarService 注入NavbarService服务
     * @constant CODE 注入状态码常量
     */
    angular.module('eolinker')
    .config(['$stateProvider', 'RouteHelpersProvider', function($stateProvider, helper) {
        $stateProvider
        .state('home.user.basic', {
            url: '/basic',
            template: '<user-basic></user-basic>',
        });
    }])
    .component('userBasic', {
        templateUrl: 'app/component/content/home/content/user/basic/index.html',
        controller: indexController
    })

    indexController.$inject = ['$scope', '$rootScope', 'CommonResource', '$state', 'md5', 'NavbarService', 'CODE'];

    function indexController($scope, $rootScope, CommonResource, $state, md5, NavbarService, CODE) {
        var vm = this;
        vm.data = {
            service: NavbarService,
            info: {
                timer: {
                    countdown: 60,
                    disable: false,
                    fun: null
                },
                phone: {
                    isDisable: false
                },
                password: {
                    confirm: '',
                    oldError: false
                },
                tips: {
                    user: '4~16位非纯数字，英文数字下划线组合，只能以英文开头',
                    phone: '请输入11位手机号码',
                    email: '最好使用国内邮箱，gmail可能无法及时收到邮件',
                    nameCheck: false,
                    phoneCheck: false,
                    emailCheck: false,
                    hadUserName: false
                }
            },
            interaction: {
                request: {
                    smsToken: '',
                    checkCode: '',
                    oldPassword: '',
                    newPassword: '',
                    userImage: ''
                },
                response: {
                    userInfo: {}
                }
            },
            fun: {
                check: null, //检测是否存在功能函数
                changePassword: null, //修改密码功能函数
                confirm: null, //确认功能函数
                getCode: null, //获取验证码
                init: null, //初始化功能函数
            }
        }
        vm.data.fun.init = function() {
            var template = {
                promise: null
            }
            $scope.$emit('$WindowTitleSet', { list: ['用户设置', '账户管理'] });
            template.promise = CommonResource.User.Info().$promise;
            template.promise.then(function(response) {
                switch (response.statusCode) {
                    case CODE.COMMON.SUCCESS:
                    {
                        vm.data.service.info.userInfo=vm.data.interaction.response.userInfo = response.userInfo;
                        $scope.$emit('$TransferStation', { state: '$EoNavbarSetUser', data: { userInfo: response.userInfo } });
                        vm.data.info.tips.hadUserName = !!response.userInfo.userName;
                        break;
                    }
                }
            })
            return template.promise;
        }
        vm.data.fun.confirm = function(arg) {
            CommonResource.User.Nickname({ nickName: vm.data.interaction.response.userInfo.userNickName }).$promise
            .then(function(response) {
                switch (response.statusCode) {
                    case CODE.COMMON.SUCCESS:
                    {
                        $scope.$emit('$TransferStation', { state: '$EoNavbarChangeUser', data: vm.data.interaction.response.userInfo.userNickName });
                    }
                    case '130009':
                    {
                        $rootScope.InfoModal('修改成功', 'success');
                        break;
                    }
                }
            })
        }
        vm.data.fun.changePassword = function() {
            var template = {
                request: {
                    oldPassword: md5.createHash(vm.data.interaction.request.oldPassword),
                    newPassword: md5.createHash(vm.data.interaction.request.newPassword)
                }
            }
            if ($scope.passwordForm.$valid) {
                CommonResource.User.Password(template.request).$promise
                .then(function(response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.SUCCESS:
                        case CODE.USER.UNCHANGE:
                        {
                            $rootScope.InfoModal('修改成功', 'success');
                            $state.reload();
                            break;
                        }
                        case CODE.USER.PASSWORD_ERROR:
                        {
                            vm.data.info.password.oldError = true;
                            $rootScope.InfoModal('旧密码错误', 'error');
                            break;
                        }
                    }
                })
            }
        }
        $scope.$on('$destory', function() {

            if (vm.data.info.timer.fun) {
                clearInterval(vm.data.info.timer.fun);
            }
        })
    }
})();
