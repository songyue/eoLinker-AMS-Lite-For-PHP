(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function api sidebar模块相关js
     * @version  3.0.2
     * @service  $scope 注入作用域服务
     * @service  $rootScope 注入根作用域服务
     * @service  ApiManagementResource 注入接口管理接口服务
     * @service  $state 注入路由服务
     * @service  GroupService 注入GroupService服务
     * @service  HomeProjectSidebarService 注入HomeProjectSidebarService服务
     * @constant CODE 注入状态码常量
     */
    angular.module('eolinker')
        .component('homeProjectInsideApiSidebar', {
            templateUrl: 'app/component/content/home/content/project/content/inside/sidebar/api/index.html',
            bindings: {
                powerObject: '<'
            },
            controller: homeProjectInsideApiSidebarController
        })

    homeProjectInsideApiSidebarController.$inject = ['$scope', '$rootScope', 'ApiManagementResource', '$state', 'GroupService', 'HomeProjectSidebarService', 'CODE'];

    function homeProjectInsideApiSidebarController($scope, $rootScope, ApiManagementResource, $state, GroupService, HomeProjectSidebarService, CODE) {
        var vm = this;
        vm.data = {
            service:HomeProjectSidebarService,
            static: {
                query: [{ groupID: -1, groupName: "所有接口" }, { groupID: -2, groupName: "接口回收站" }]
            },
            info: {
                sidebarShow: null,
                sort: {
                    isDisable: false,
                    originQuery: [],
                    groupForm: {
                        containment: '.group-form-ul',
                        child: {
                            containment: '.child-group-form-ul'
                        }
                    }
                }
            },
            interaction: {
                request: {
                    projectID: $state.params.projectID,
                    groupID: $state.params.groupID || -1,
                    childGroupID: $state.params.childGroupID,
                    apiID: $state.params.apiID,
                    orderList: []
                },
                response: {
                    query: []
                }
            },
            fun: {
                init: null, //初始化功能函数
                more: null, //更多功能函数
                spreed:null,//展开收缩功能函数
                sort: {
                    copy: null, //复制相应原数组功能函数
                    confirm: null, //排序确认功能函数
                    cancle: null, //取消排序功能函数
                }, //排序功能函数
                click: {
                    parent: null, //父分组单击事件
                    child: null //子分组单击事件
                },
                edit: {
                    parent: null, //父分组编辑事件
                    child: null //子分组编辑事件
                },
                delete: {
                    parent: null, //父分组删除事件
                    child: null //子分组删除事件
                }
            }
        }

        vm.data.fun.init = function() {
            var template = {
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    groupID: vm.data.interaction.request.groupID,
                    childGroupID: vm.data.interaction.request.childGroupID,
                    apiID: vm.data.interaction.request.apiID
                },
                query: [],
                sort: {
                    _default: [],
                    array: [],
                    childArray: []
                }
            }
            vm.data.service.fun.clear();
            angular.copy(vm.data.static.query, vm.data.interaction.response.query);
            if ($state.current.name.indexOf('edit') > -1) {
                vm.data.info.sidebarShow = false;
            } else {
                vm.data.info.sidebarShow = true;
            }
            ApiManagementResource.ApiGroup.Query(template.request).$promise.then(function(response) {
                switch (response.statusCode) {
                    case CODE.COMMON.SUCCESS:
                        {

                            try {
                                template.sort._default = JSON.parse(response.groupOrder);
                                angular.forEach(response.groupList, function(val, key) {
                                    template.sort.childArray=[];
                                    angular.forEach(val.childGroupList, function(childVal, childKey) {
                                        if (template.sort._default[childVal.groupID] >= 0) {
                                            template.sort.childArray.splice(template.sort._default[childVal.groupID],0, childVal);
                                        }else{
                                            template.sort.childArray.push(childVal);
                                        }
                                    })
                                    val.childGroupList=template.sort.childArray;
                                    if (template.sort._default[val.groupID] >= 0) {
                                        console.log(template.sort._default[val.groupID],val)
                                        template.sort.array.splice(template.sort._default[val.groupID], 0, val);
                                    } else {
                                        template.sort.array.push(val);
                                    }
                                })
                            } catch (e) {
                                template.sort.array = response.groupList;
                            } finally {
                                vm.data.interaction.response.groupOrder = response.groupOrder;
                                vm.data.interaction.response.query = vm.data.interaction.response.query.concat(template.sort.array);
                                if ($state.current.name.indexOf('edit') > -1) {
                                    GroupService.set(template.sort.array, true);
                                } else {
                                    GroupService.set(template.sort.array);
                                }
                            }
                        }
                }
            })
        }
        vm.data.fun.init();
        vm.data.fun.more = function(arg) {
            arg.$event.stopPropagation();
            arg.item.listIsClick = true;
        }
        vm.data.fun.spreed=function(arg){
            if (arg.$event) {
                arg.$event.stopPropagation();
            }
            arg.item.isSpreed=!arg.item.isSpreed;
        }
        vm.data.fun.sort.copy = function() {
            angular.copy(vm.data.interaction.response.query.slice(2), vm.data.info.sort.originQuery);
            if(vm.data.info.sort.originQuery.length>0){
                vm.data.info.sort.isDisable = true;
            }
        }
        vm.data.fun.sort.cancle = function() {
            vm.data.info.sort.isDisable = false;
        }
        vm.data.fun.sort.confirm = function() {
            var template = {
                request: {
                    projectID: vm.data.interaction.request.projectID,
                    orderList: {}
                }
            }
            angular.forEach(vm.data.info.sort.originQuery, function(val, key) {
                template.request.orderList[val.groupID] = key;
                angular.forEach(val.childGroupList, function(childVal, childKey) {
                    template.request.orderList[childVal.groupID] = childKey;
                })

            })
            template.request.orderList = JSON.stringify(template.request.orderList);
            ApiManagementResource.ApiGroup.Sort(template.request).$promise
                .then(function(response) {
                    switch (response.statusCode) {
                        case CODE.COMMON.SUCCESS:
                            {
                                $rootScope.InfoModal('排序成功', 'success');
                                vm.data.interaction.response.query.splice(2);
                                vm.data.interaction.response.query = vm.data.interaction.response.query.concat(vm.data.info.sort.originQuery)
                                vm.data.info.sort.isDisable = false;
                                GroupService.set(vm.data.info.sort.originQuery);
                                break;
                            }
                        default:
                            {
                                $rootScope.InfoModal('排序失败，请稍候再试或到论坛提交bug', 'error');
                                break;
                            }
                    }
                })
        }
        vm.data.fun.click.child = function(arg) {
            vm.data.interaction.request.childGroupID = arg.item.groupID;
            $state.go('home.project.inside.api.list', { groupID: vm.data.interaction.request.groupID, childGroupID: arg.item.groupID, apiID: null, search: null });
        }
        vm.data.fun.click.parent = function(arg) {
            vm.data.interaction.request.groupID = arg.item.groupID || -1;
            vm.data.interaction.request.childGroupID = null;
            arg.item.isSpreed=true;
            $state.go('home.project.inside.api.list', { 'groupID': arg.item.groupID, childGroupID: null, search: null });
        }
        vm.data.fun.edit.parent = function(arg) {
            arg = arg || {};
            var template = {
                modal: {
                    title: arg.item ? '修改分组' : '新增分组',
                    secondTitle: '分组名称',
                    group: arg.item ? null : vm.data.interaction.response.query.slice(2)
                },
                $index: null
            }
            $rootScope.GroupModal(template.modal.title, arg.item, template.modal.secondTitle, template.modal.group, function(callback) {
                if (callback) {
                    callback.projectID = vm.data.interaction.request.projectID;
                    template.$index = parseInt(callback.$index) - 1;
                    if (arg.item) {
                        ApiManagementResource.ApiGroup.Update(callback).$promise.then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $rootScope.InfoModal(template.modal.title + '成功', 'success');
                                        vm.data.fun.init();
                                        break;
                                    }
                            }
                        });
                    } else {
                        if (template.$index > -1) {
                            callback.parentGroupID = vm.data.interaction.response.query[template.$index + 2].groupID;
                        }
                        ApiManagementResource.ApiGroup.Add({ projectID: callback.projectID, groupName: callback.groupName, parentGroupID: callback.parentGroupID }).$promise.then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $rootScope.InfoModal(template.modal.title + '成功', 'success');
                                        vm.data.fun.init();
                                        break;
                                    }
                            }
                        });
                    }
                }
            });
        }
        vm.data.fun.edit.child = function(arg) {
            arg.item = arg.item || {};
            var template = {
                modal: {
                    title: arg.isEdit ? '修改子分组' : '新增子分组',
                    group: vm.data.interaction.response.query.slice(2)
                },
                $index: null
            }
            arg.item.$index = arg.$outerIndex - 1;
            console.log(arg.$outerIndex)
            $rootScope.GroupModal(template.modal.title, arg.item, '分组名称', template.modal.group, function(callback) {
                if (callback) {
                    callback.projectID = vm.data.interaction.request.projectID;
                    template.$index = parseInt(callback.$index) - 1;
                    if (template.$index > -1) {
                        callback.parentGroupID = vm.data.interaction.response.query[template.$index + 2].groupID;
                    } else {
                        callback.parentGroupID = 0;
                    }
                    if (arg.isEdit) {
                        ApiManagementResource.ApiGroup.Update(callback).$promise.then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $rootScope.InfoModal(template.modal.title + '成功', 'success');
                                        vm.data.fun.init();
                                        break;
                                    }
                            }
                        });
                    } else {
                        ApiManagementResource.ApiGroup.Add({ parentGroupID: callback.parentGroupID, projectID: vm.data.interaction.request.projectID, groupName: callback.groupName }).$promise.then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $rootScope.InfoModal(template.modal.title + '成功', 'success');
                                        vm.data.fun.init();
                                        break;
                                    }
                            }
                        });
                    }
                }
            });
        }
        vm.data.fun.delete.child = function(arg) {
            arg = arg || {};
            var template = {
                modal: {
                    title: '删除分组',
                    message: '删除分组后，该分组下的api将全部移入接口回收站，该操作无法撤销，确认删除？'
                }
            }
            $rootScope.EnsureModal(template.modal.title, false, template.modal.message, {}, function(callback) {
                if (callback) {
                    ApiManagementResource.ApiGroup.Delete({ projectID: vm.data.interaction.request.projectID, groupID: arg.childItem.groupID }).$promise.then(function(response) {
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    arg.item.childGroupList.splice(arg.$index, 1);
                                    $rootScope.InfoModal('分组删除成功', 'success');
                                    if (vm.data.interaction.request.childGroupID == arg.childItem.groupID) {
                                        vm.data.fun.click.parent({ item: arg.item });
                                    }
                                    break;
                                }
                        }
                    })
                }
            });
        }
        vm.data.fun.delete.parent = function(arg) {
            arg = arg || {};
            var template = {
                modal: {
                    title: '删除分组',
                    message: '删除分组后，该分组下的api将全部移入接口回收站，该操作无法撤销，确认删除？'
                }
            }
            $rootScope.EnsureModal(template.modal.title, false, template.modal.message, {}, function(callback) {
                if (callback) {
                    ApiManagementResource.ApiGroup.Delete({ projectID: vm.data.interaction.request.projectID, groupID: arg.item.groupID }).$promise.then(function(response) {
                        switch (response.statusCode) {
                            case CODE.COMMON.SUCCESS:
                                {
                                    vm.data.interaction.response.query.splice(arg.$index, 1);
                                    $rootScope.InfoModal('分组删除成功', 'success');
                                    if (vm.data.interaction.response.query.length > 2) {
                                        GroupService.set(vm.data.interaction.response.query.slice(2));
                                    } else {
                                        GroupService.set(null);
                                    }
                                    if ($state.params.groupID == -1) {
                                        vm.data.fun.click.parent({ item: {} });
                                    } else if (vm.data.interaction.request.groupID == arg.item.groupID) {
                                        vm.data.fun.click.parent({ item: vm.data.interaction.response.query[0] });
                                    } else if ($state.params.groupID == -2) {
                                        vm.data.fun.click.child({ item: { groupID: -1 } })
                                    }
                                    break;
                                }
                        }
                    })
                }
            });
        }
        $scope.$on('$stateChangeSuccess', function() { //路由更改函数
            if ($state.current.name.indexOf('edit') > -1) {
                vm.data.info.sidebarShow = false;
            } else {
                vm.data.info.sidebarShow = true;
            }
        })
        $scope.$on('$changeSidebar', function(data, attr) { //inside tab 转换时更改group选中状态
            angular.forEach(vm.data.interaction.response.query, function(val, key) {
                if (val.groupID == attr.groupID) {
                    if (attr.childGroupID && attr.groupID > 0) {
                        for (var i = 0; i < val.childGroupList.length; i++) {
                            if (val.childGroupList[i].groupID == attr.childGroupID) {
                                val.childGroupList[i].isClick = true;
                                if (attr.isList) {
                                    $scope.$emit('$windowTitle', { groupName: val.childGroupList[i].groupName });
                                }
                                break;
                            }
                        }
                    } else {
                        if (attr.isList) {
                            $scope.$emit('$windowTitle', { groupName: val.groupName });
                        }
                    }
                }
            })
        });
    }

})();
