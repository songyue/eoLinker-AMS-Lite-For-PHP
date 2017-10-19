(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function 数据库内页侧边栏模块相关js
     * @version  3.0.2
     * @service  $scope 注入作用域服务
     * @service  $rootScope 注入根作用域服务
     * @service  DatabaseResource 注入数据库接口服务
     * @service  $state 注入路由服务
     * @service  GroupService 注入GroupService服务
     * @constant CODE 注入状态码常量
     */
    angular.module('eolinker')
        .component('databaseSidebar', {
            templateUrl: 'app/component/content/home/content/database/content/inside/sidebar/index.html',
            bindings: {
                powerObject: '<'
            },
            controller: databaseSidebarController
        })

    databaseSidebarController.$inject = ['$scope', '$rootScope', 'DatabaseResource', '$state', 'GroupService', 'CODE'];

    function databaseSidebarController($scope, $rootScope, DatabaseResource, $state, GroupService, CODE) {
        var vm = this;
        vm.data = {
            info: {
                sidebarShow: null
            },
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
                click: null, //table单击事件
                edit: null, //table 编辑事件
                delete: null, //table删除事件
                import: null, //导入表功能函数
                more: null, //更多功能函数
                dump: null //导出功能函数
            }
        }

        vm.data.fun.import = function($file) { //导入表函数
            var template = {
                modal: {
                    title: '导入表',
                    status: 0
                }
            }
            $rootScope.ImportDatabaseModal(template.modal, function(callback) {
                if (callback) {
                    $state.reload();
                }
            });
        }
        vm.data.fun.click = function(arg) {
            vm.data.interaction.request.tableID = arg.item.tableID;
            $state.go('home.database.inside.table.list', { tableID: arg.item.tableID });
        }
        vm.data.fun.more = function(arg) {
            arg.$event.stopPropagation();
            arg.item.listIsClick = true;
        }
        vm.data.fun.edit = function(arg) {
            arg = arg || {};
            var template = {
                modal: {
                    title: arg.item ? '修改表' : '新增表'
                },
                $index: null
            }
            $rootScope.TableModal(template.modal.title, arg.item, vm.data.interaction.request.databaseID, function(callback) {
                if (callback) {
                    if (arg.item) {
                        DatabaseResource.DatabaseTable.Update(callback).$promise.then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $rootScope.InfoModal(template.modal.title + '成功', 'success');
                                        arg.item.tableName = callback.tableName;
                                        arg.item.tableDescription = callback.tableDescription;
                                        GroupService.set(vm.data.interaction.response.query);
                                        break;
                                    }
                            }
                        });
                    } else {
                        DatabaseResource.DatabaseTable.Add(callback).$promise.then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $rootScope.InfoModal(template.modal.title + '成功', 'success');
                                        if (vm.data.interaction.response.query == 0) {
                                            var newItem = { tableID: parseInt(response.tableID), tableName: callback.tableName, tableDescription: callback.tableDescription, isClick: true };
                                            vm.data.interaction.response.query.push(newItem);
                                            vm.data.fun.click({ item: newItem });
                                        } else {
                                            vm.data.interaction.response.query.push({ tableID: parseInt(response.tableID), tableName: callback.tableName, tableDescription: callback.tableDescription });
                                        }
                                        GroupService.set(vm.data.interaction.response.query);
                                        break;
                                    }
                            }
                        });
                    }
                }
            });
        }
        vm.data.fun.delete = function(arg) {
            arg = arg || {};
            var template = {
                modal: {
                    title: '删除表',
                    message: '删除表后，该操作无法撤销，确认删除？'
                }
            }
            $rootScope.EnsureModal(template.modal.title, false, template.modal.message, {}, function(callback) {
                if (callback) {
                    DatabaseResource.DatabaseTable.Delete({ dbID: vm.data.interaction.request.databaseID, tableID: arg.item.tableID }).$promise.then(function(response) {
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    vm.data.interaction.response.query.splice(arg.$index, 1);
                                    $rootScope.InfoModal('表删除成功', 'success');
                                    if (vm.data.interaction.request.tableID == arg.item.tableID) {
                                        if (vm.data.interaction.response.query.length > 0) {
                                            vm.data.fun.click({ item: vm.data.interaction.response.query[0] });
                                        } else {
                                            $state.go('home.database.inside.table.list', { tableID: null });
                                        }
                                    }
                                    break;
                                }
                        }
                    })
                }
            });
        }
        vm.data.fun.dump = function() {
            var template={
                modal:{
                    title:'导出数据字典',
                    dbID:vm.data.interaction.request.databaseID
                }
            }
            $rootScope.ExportDatabaseModal(template.modal, function(callback) {});
        }
        vm.data.fun.init = (function() {
            var template = {
                request: {
                    dbID: vm.data.interaction.request.databaseID
                }
            }
            vm.data.info.sidebarShow = true;
            DatabaseResource.DatabaseTable.Query(template.request).$promise.then(function(response) {
                switch (response.statusCode) {
                    case CODE.COMMON.SUCCESS:
                        {
                            vm.data.interaction.response.query = response.tableList;
                            GroupService.set(vm.data.interaction.response.query);
                            if (!vm.data.interaction.request.tableID) {
                                vm.data.interaction.request.tableID = vm.data.interaction.response.query[0].tableID;
                                $scope.$emit('$TransferStation', { state: '$LoadingInit', data: { tableID: vm.data.interaction.request.tableID } });
                            }
                        }
                }
            })
        })()
    }

})();
