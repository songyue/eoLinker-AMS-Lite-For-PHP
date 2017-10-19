(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function 数据库列表页相关指令js
     * @version  3.0.2
     * @service  $scope 注入作用域服务
     * @service  $rootScope 注入根作用域服务
     * @service  DatabaseResource 注入数据库接口服务
     * @service  $state 注入路由服务
     * @service  NavbarService 注入NavbarService服务
     * @service  $filter 注入过滤器服务
     * @constant CODE 注入状态码常量
     */
    angular.module('eolinker')
        .config(['$stateProvider', 'RouteHelpersProvider', function($stateProvider, helper) {
            $stateProvider
                .state('home.database.list', {
                    url: '/',
                    template: '<home-database-list></home-database-list>'
                });
        }])
        .component('homeDatabaseList', {
            templateUrl: 'app/component/content/home/content/database/content/default/index.html',
            controller: homeDatabaseListController
        })

    homeDatabaseListController.$inject = ['$scope', '$rootScope', 'DatabaseResource', '$state', 'NavbarService', '$filter', 'CODE'];

    function homeDatabaseListController($scope, $rootScope, DatabaseResource, $state, NavbarService, $filter, CODE) {
        var vm = this;
        vm.data = {
            service: {
                navbar: NavbarService,
            },
            interaction: {
                request: {
                    databaseType: -1
                },
                response: {
                    query: null
                }
            },
            fun: {
                import: null, //导入数据字典
                enter: null, //进入内页功能函数
                edit: null, //编辑功能函数
                delete: null, //删除功能函数
                init: null //初始化功能函数
            }
        }
        vm.data.fun.init = function() {
            var template = {
                promise: null,
                request: {
                    databaseType: vm.data.interaction.request.databaseType,
                }
            }
            $scope.$emit('$WindowTitleSet', { list: ['数据库列表'] });
            template.promise = DatabaseResource.Database.Query(template.request).$promise;
            template.promise.then(function(response) {
                vm.data.interaction.response.query = response.databaseList||[];
            })
            return template.promise;
        }
        vm.data.fun.edit = function(arg) {
            arg = arg || {};
            if(arg.$event){
                arg.$event.stopPropagation();
            }
            var template = {
                modal: {
                    title: arg.item ? '修改数据库' : '新增数据库',
                    interaction:{
                        request:arg.item
                    }
                },
                response: null
            }
            $rootScope.DatabaseModal(template.modal, function(callback) {
                if (callback) {
                    template.response = {
                        dbID: callback.dbID,
                        dbName: callback.dbName,
                        dbVersion: callback.dbVersion,
                        dbUpdateTime: $filter('currentTimeFilter')(),
                        userType: callback.userType || 0
                    }
                    if (arg.item) {
                        vm.data.interaction.response.query.splice(arg.$index, 1);
                    }
                    vm.data.interaction.response.query.splice(0, 0, template.response);
                    $rootScope.InfoModal(template.modal.title + '成功', 'success');
                }
            });
        }
        vm.data.fun.delete = function(arg) {
            arg = arg || {};
            arg.$event.stopPropagation();
            var template = {
                request: {
                    dbID: arg.item.dbID
                }
            }
            $rootScope.EnsureModal('删除数据库', true, '确认删除？', {}, function(callback) {
                if (callback) {
                    DatabaseResource.Database.Delete(template.request).$promise.then(function(response) {
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    vm.data.interaction.response.query.splice(arg.$index, 1);
                                    $rootScope.InfoModal('数据库删除成功', 'success');
                                    break;
                                }
                        }
                    })
                }
            });
        }
        vm.data.fun.enter = function(arg) {
            $state.go('home.database.inside.table.list', { databaseID: arg.item.dbID, userType: arg.item.userType });
        }
        vm.data.fun.import = function() {
            var template = {
                modal: {
                    title: '导入数据字典',
                    status: 1
                }
            }
            $rootScope.ImportDatabaseModal(template.modal, function(callback) {
                if (callback) {
                    $scope.$broadcast('$LoadingInit');
                }
            });
        }
    }
})();
