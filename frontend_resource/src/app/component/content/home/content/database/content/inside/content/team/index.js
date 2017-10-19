(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function 数据库协作页（list）模块相关js
     * @version  3.0.2
     * @service  $scope 注入作用域服务
     * @service  $rootScope 注入根作用域服务
     * @service  DatabaseResource 注入数据库接口服务
     * @service  $state 注入路由服务
     * @constant CODE 注入状态码常量
     */
    angular.module('eolinker')
        .config(['$stateProvider', 'RouteHelpersProvider', function($stateProvider, helper) {
            $stateProvider
                .state('home.database.inside.team', {
                    url: '/team',
                    template: '<database-team></database-team>'
                });
        }])
        .component('databaseTeam', {
            templateUrl: 'app/component/content/home/content/database/content/inside/content/team/index.html',
            controller: databaseTeam
        })

    databaseTeam.$inject = ['$scope', '$rootScope', 'DatabaseResource', '$state', 'CODE'];

    function databaseTeam($scope, $rootScope, DatabaseResource, $state, CODE) {

        var vm = this;
        vm.data = {
            info: {
                search: {
                    submited: false,
                    leave: true,
                    isDisable: false
                },
                power: 2, //0：管理员，1：协作管理员，2：普通成员
                timer: {
                    fun: null
                }
            },
            interaction: {
                request: {
                    dbID: $state.params.databaseID,
                    userName: ''
                },
                response: {
                    userInfo: null,
                    adminQuery: [],
                    query: []
                }
            },
            fun: {
                init: null, //初始化功能函数
                check: null, //text change功能函数
                closeSearch: null, //隐藏搜索框功能函数
                setNickName: null, //设置备注名
                add: null, //添加用户
                setType: null, //设置用户权限
                delete: null, //移除、退出项目
                search: null //searchUser搜索用户

            }
        }

        vm.data.fun.closeSearch = function() {
            if (vm.data.info.search.leave) {
                vm.data.info.search.submited = false;
                vm.data.interaction.response.userInfo = null;
            }
        }
        vm.data.fun.setNickName = function(arg) {
            arg.item.groupName = arg.item.partnerNickName;
            arg.item.required = true;
            $rootScope.GroupModal('修改备注名', arg.item, '备注名名称', null, function(callback) {
                if (callback) {
                    DatabaseResource.Partner.SetNickName({ dbID: vm.data.interaction.request.dbID, nickName: callback.groupName, connID: arg.item.connID }).$promise
                        .then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $rootScope.InfoModal('修改备注名成功', 'success');
                                        arg.item.partnerNickName = callback.groupName;
                                        break;
                                    }
                            }
                        });
                }
            });
        }
        vm.data.fun.setType = function(arg) {
            arg.item.listIsClick = false;
            var template = {
                request: {
                    dbID: vm.data.interaction.request.dbID,
                    connID: arg.item.connID,
                    userType: arg.userType
                }
            }
            DatabaseResource.Partner.SetType(template.request).$promise
                .then(function(response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.SUCCESS:
                            {
                                $rootScope.InfoModal('修改协作成员的类型成功！', 'success');
                                arg.item.listIsClick = false;
                                switch (arg.userType) {
                                    case 1:
                                        {
                                            vm.data.interaction.response.adminQuery.push(arg.item);
                                            vm.data.interaction.response.query.splice(arg.$index, 1);
                                            break;
                                        }
                                    case 2:
                                    case 3:
                                        {
                                            if (arg.item.userType < 2) {
                                                vm.data.interaction.response.query.push(arg.item);
                                                vm.data.interaction.response.adminQuery.splice(arg.$index, 1);
                                            }
                                            break;
                                        }
                                }
                                arg.item.userType = arg.userType;
                                break;
                            }
                    }
                });
        }
        vm.data.fun.add = function() {
            if (!vm.data.info.search.isDisable) {
                vm.data.info.search.isDisable = true;
                DatabaseResource.Partner.Add(vm.data.interaction.request).$promise
                    .then(function(response) {
                        vm.data.info.search.isDisable = false;
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    var info = vm.data.interaction.response.userInfo;
                                    vm.data.info.search.submited = false;
                                    vm.data.interaction.request.userName = '';
                                    info.isNow = 0;
                                    info.userType = 2;
                                    info.inviteCall = info.userName;
                                    info.connID = response.connID;
                                    vm.data.interaction.response.query.push(info);
                                    vm.data.interaction.response.userInfo = null;
                                    break;
                                }
                        }
                    });
            }

        }
        vm.data.fun.delete = function(arg) {
            var bol = arg.item.isNow == 1 ? true : false;
            var template = {
                request: {
                    dbID: vm.data.interaction.request.dbID
                }
            }
            if (bol) {
                $rootScope.EnsureModal('退出协作', false, '确认退出', {}, function(callback) {
                    if (callback) {
                        DatabaseResource.Partner.Quit(template.request).$promise
                            .then(function(response) {
                                switch (response.statusCode) {
                                    case CODE.COMMON.SUCCESS:
                                        {
                                            $state.go('home.database.list');
                                            break;
                                        }
                                }
                            });
                    }
                });

            } else {
                $rootScope.EnsureModal('移除协作', false, '确认移除', {}, function(callback) {
                    if (callback) {
                        DatabaseResource.Partner.Delete({ dbID: vm.data.interaction.request.dbID, connID: arg.item.connID }).$promise
                            .then(function(response) {
                                switch (response.statusCode) {
                                    case CODE.COMMON.SUCCESS:
                                        {
                                            if (arg.isAdmin) {
                                                vm.data.interaction.response.adminQuery.splice(arg.$index, 1);
                                            } else {
                                                vm.data.interaction.response.query.splice(arg.$index, 1);
                                            }
                                            $rootScope.InfoModal('移除成员成功！', 'success');
                                            break;
                                        }
                                }
                            });
                    }
                });
            }
        }
        vm.data.fun.search = function() {
            var template = {
                request: {
                    dbID: vm.data.interaction.request.dbID,
                    userName: vm.data.interaction.request.userName
                }
            }
            if (vm.data.info.timer.fun) {
                clearInterval(vm.data.info.timer.fun);
            }
            if (!!vm.data.interaction.request.userName) {
                DatabaseResource.Partner.Search(template.request).$promise
                    .then(function(response) {
                        vm.data.info.search.submited = true;
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    vm.data.interaction.response.userInfo = response.userInfo;
                                    if (vm.data.interaction.response.userInfo.isInvited == 1) {
                                        vm.data.info.search.isDisable = true;
                                    } else {
                                        vm.data.info.search.isDisable = false;
                                    }
                                    break;
                                }
                            default:
                                {
                                    vm.data.interaction.response.userInfo = null;
                                    break;
                                }
                        }
                    })
            }
        };
        vm.data.fun.check = function() {
            var template = {
                request: {
                    dbID: vm.data.interaction.request.dbID,
                    userName: vm.data.interaction.request.userName
                }
            }
            if (vm.data.info.timer.fun) {
                clearInterval(vm.data.info.timer.fun);
            }
            vm.data.info.search.submited = false;
            vm.data.info.timer.fun = setInterval(function() {
                if ($scope.sureForm.$valid) {
                    DatabaseResource.Partner.Search(template.request).$promise
                        .then(function(response) {
                            vm.data.info.search.submited = true;
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        vm.data.interaction.response.userInfo = response.userInfo;
                                        break;
                                    }
                                default:
                                    {
                                        vm.data.interaction.response.userInfo = null;
                                        break;
                                    }
                            }
                        })
                }
                clearInterval(vm.data.info.timer.fun);
            }, 1000);
        };
        vm.data.fun.init = (function() {
            var template = {
                request: { dbID: vm.data.interaction.request.dbID }
            }
            $scope.$emit('$WindowTitleSet', { list: ['协作管理', '数字字典'] });
            DatabaseResource.Partner.Query(template.request).$promise.then(function(response) {
                switch (response.statusCode) {
                    case CODE.COMMON.SUCCESS:
                        {
                            vm.data.interaction.response.query = response.partnerList;
                            for (var i = 0; i < vm.data.interaction.response.query.length; i++) {
                                switch (vm.data.interaction.response.query[i].userType) { /*0 项目管理员；1 协助管理员；2 普通成员[读写]；3 普通成员[只读]*/
                                    case 0:
                                        {
                                            vm.data.interaction.response.adminQuery.push(vm.data.interaction.response.query[i]);
                                            if (vm.data.interaction.response.query[i].isNow == 1) {
                                                vm.data.info.power = 0;
                                            }
                                            vm.data.interaction.response.query.splice(i, 1);
                                            i--;
                                            break;
                                        }
                                    case 1:
                                        {
                                            vm.data.interaction.response.adminQuery.push(vm.data.interaction.response.query[i]);
                                            if (vm.data.interaction.response.query[i].isNow == 1) {
                                                vm.data.info.power = 1;
                                            }
                                            vm.data.interaction.response.query.splice(i, 1);
                                            i--;
                                            break;
                                        }
                                    default:
                                        {
                                            if (vm.data.interaction.response.query[i].isNow == 1) {
                                                vm.data.info.power = 2;
                                            }
                                        }
                                }
                            }
                            break;
                        }
                    default:
                        {
                            vm.data.interaction.response.query = [];
                            break;
                        }
                }
            });
        })()
    }
})();
