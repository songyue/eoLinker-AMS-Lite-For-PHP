(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function 消息内页相关指令js
     * @version  3.0.2
     * @service  $scope 注入作用域服务
     * @service  $rootScope 注入根作用域服务
     * @service  CommonResource 注入通用接口服务
     * @service  $state 注入路由服务
     * @service  $sce 注入$sce服务
     * @service  $filter 注入过滤器服务
     * @constant CODE 注入状态码常量
     */
    angular.module('eolinker')
        .config(['$stateProvider', 'RouteHelpersProvider', function($stateProvider, helper) {
            $stateProvider
                .state('home.news.default', {
                    url: '/',
                    template: '<news-default></news-default>'
                });
        }])
        .component('newsDefault', {
            templateUrl: 'app/component/content/home/content/news/default/index.html',
            controller: indexController
        })

    indexController.$inject = ['$scope', '$rootScope', 'CommonResource', '$state', '$sce', '$filter', 'CODE'];

    function indexController($scope, $rootScope, CommonResource, $state, $sce, $filter, CODE) {
        var vm = this;
        vm.data = {
            info: {
                pagination: {
                    pages: '',
                    maxSize: 5,
                    pageSize: 15,
                    page: 1,
                    msgCount: 0,
                    jumpPage: ""
                }
            },
            interaction: {
                request: {},
                response: {
                    query: []
                }
            },
            fun: {
                delete: null, //删除功能函数
                read: null, //阅读功能函数
                clean: null, //清空消息功能函数
                pageChanged: null, //页数更改
                init: null //初始化功能函数
            }
        }
        vm.data.fun.init = function() {
            $scope.$emit('$WindowTitleSet', { list: ['用户消息'] });
            var template = {
                request: { page: vm.data.info.pagination.page },
                promise: null
            }
            template.promise = CommonResource.Message.Query(template.request).$promise;
            template.promise.then(function(response) {
                switch (response.statusCode) {
                    case CODE.COMMON.SUCCESS:
                        {
                            vm.data.interaction.response.query = response.messageList;
                            angular.forEach(vm.data.interaction.response.query, function(val, key) {
                                val.msg = $sce.trustAsHtml($filter('XssFilter')(val.msg, { whiteList: { b: ['style'], p: [], a: ['style', 'href'], br: [] } }));
                            });
                            vm.data.info.pagination.pages = response.pageCount;
                            vm.data.info.pagination.msgCount = response.msgCount;
                            break;
                        }
                    default:
                        {
                            vm.data.interaction.response.query = [];
                            break;
                        }
                }
            })
            return template.promise;
        }
        vm.data.fun.pageChanged = function() {
            vm.data.fun.init();
        }
        vm.data.fun.clean = function() {
            $rootScope.EnsureModal('清空消息', false, '确认清空？', {}, function(callback) {
                if (callback) {
                    CommonResource.Message.Clean().$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $rootScope.InfoModal('消息清空成功', 'success');
                                        $scope.$emit('$TransferStation', { state: '$EoNavbarNewsRead', data: true });
                                        vm.data.fun.init();
                                        break;
                                    }
                            }
                        })
                }
            });
        }
        vm.data.fun.read = function(arg) {
            var template = {
                request: { msgID: arg.item.msgID }
            }
            arg.item.isClick = !arg.item.isClick;
            if (arg.item.isRead != 1) {
                CommonResource.Message.Read(template.request).$promise
                    .then(function(response) {
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    arg.item.isRead = 1;
                                    $scope.$emit('$TransferStation', { state: '$EoNavbarNewsRead', data: false });
                                    break;
                                }
                        }
                    })
            }
        }
        vm.data.fun.delete = function(arg) {
            var template = {
                request: {
                    msgID: arg.item.msgID
                }
            }
            $rootScope.EnsureModal('删除消息', false, '确认删除？', {}, function(callback) {
                if (callback) {
                    CommonResource.Message.Delete(template.request).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        vm.data.interaction.response.query.splice(arg.$index, 1);
                                        $rootScope.InfoModal('消息删除成功', 'success');
                                        break;
                                    }
                            }
                        })
                }
            });
        }
    }
})();
