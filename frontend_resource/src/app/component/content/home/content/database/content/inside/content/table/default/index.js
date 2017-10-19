(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function 数据库内页列表（list）模块相关js
     * @version  3.0.2
     * @service  $scope 注入作用域服务
     * @service  $rootScope 注入根作用域服务
     * @service  DatabaseResource 注入数据库接口服务
     * @service  $state 注入路由服务
     * @service  GroupService 注入GroupService服务
     * @constant CODE 注入状态码常量
     */
    angular.module('eolinker')
        .config(['$stateProvider', 'RouteHelpersProvider', function($stateProvider, helper) {
            $stateProvider
                .state('home.database.inside.table.list', {
                    url: '/?tableID',
                    template: '<database-table-list power-object="$ctrl.powerObject"></database-table-list>'
                });
        }])
        .component('databaseTableList', {
            templateUrl: 'app/component/content/home/content/database/content/inside/content/table/default/index.html',
            bindings: {
                powerObject: '<'
            },
            controller: databaseTableListCtroller
        })

    databaseTableListCtroller.$inject = ['$scope', '$rootScope', 'DatabaseResource', '$state', 'GroupService', 'CODE'];

    function databaseTableListCtroller($scope, $rootScope, DatabaseResource, $state, GroupService, CODE) {
        var vm = this;
        vm.data = {
            interaction: {
                request: {
                    databaseID: $state.params.databaseID,
                    tableID: $state.params.tableID
                },
                response: {
                    query: []
                }
            },
            fun: {
                init: null, //初始化功能函数
                delete: null, //删除字段功能函数
                value: null, //显示字段描述功能函数
                edit: null, //编辑功能函数
                
            }
        }
        vm.data.fun.init = function(arg) {
            var template = {
                promise: null,
                request: {
                    dbID: vm.data.interaction.request.databaseID,
                    tableID: vm.data.interaction.request.tableID || (arg ? arg.tableID : null)
                }
            }
            $scope.$emit('$WindowTitleSet', { list: ['表', '数据字典'] });
            if (template.request.tableID) {
                vm.data.interaction.request.tableID = template.request.tableID;
                template.promise = DatabaseResource.Field.Query(template.request).$promise;
                template.promise.then(function(response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.SUCCESS:
                            {
                                vm.data.interaction.response.query = response.fieldList;
                                break;
                            }
                    }
                })
                return template.promise;
            }
            return null;
        }
        vm.data.fun.edit = function(arg) { //字段编辑函数（false：新增字段：not null：修改字段）
            arg = arg || {};
            var template = {
                cache: GroupService.get(),
                modal: {
                    title: arg.item ? '修改字段' : '新增字段',
                    interaction:{
                        request: arg.item ? arg.item : { tableID: vm.data.interaction.request.tableID, databaseID: vm.data.interaction.request.databaseID }
                    }
                }
            }
            if (arg.item) {
                arg.item.databaseID = vm.data.interaction.request.databaseID;
                $rootScope.FieldModal(template.modal, function(callback) {
                    if (callback) {
                        $rootScope.InfoModal(template.modal.title + '成功', 'success');
                        vm.data.fun.init();
                    }
                });
            } else {
                if (template.cache && template.cache.length > 0) {
                    $rootScope.FieldModal(template.modal, function(callback) {
                        if (callback) {
                            if (callback.status != 1) { //1：为继续添加后点击关闭函数
                                $rootScope.InfoModal(template.modal.title + '成功', 'success');
                            }
                            vm.data.fun.init();
                        }
                    });
                } else {
                    $rootScope.InfoModal('请先建立表！', 'error');
                }
            }
        }
        vm.data.fun.value = function(info) {
            $rootScope.MessageModal(info.fieldName + '-字段描述', info.fieldDesc, function(data) {});
        }

        vm.data.fun.delete = function(arg) {
            $rootScope.EnsureModal('删除字段', false, '确认删除', {}, function(callback) {
                if (callback) {
                    DatabaseResource.Field.Delete({ fieldID: arg.item.fieldID, databaseID: vm.data.interaction.request.databaseID }).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        vm.data.interaction.response.query.splice(arg.$index, 1);
                                        $rootScope.InfoModal('字段删除成功！', 'success');
                                        break;
                                    }
                            }
                        })
                }
            });
        }
        

    }
})();
