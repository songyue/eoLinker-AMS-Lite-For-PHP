(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function [公用弹窗controller js]
     * @version  3.0.2
     */
    angular.module('eolinker.modal')

    .directive('eoCommonModal', [function() {
        return {
            restrict: 'AE',
            templateUrl: 'app/modal/branch/common/index.html'
        }
    }])

    .controller('ExpressionBuilderModalCtrl', ExpressionBuilderModalCtrl)

    .controller('SingleSelectModalCtrl', SingleSelectModalCtrl)

    .controller('InfoModalCtrl', InfoModalCtrl)

    .controller('TipsModalCtrl', TipsModalCtrl)

    .controller('MessageModalCtrl', MessageModalCtrl)

    .controller('ImportModalCtrl', ImportModalCtrl)

    .controller('ImportDatabaseModalCtrl', ImportDatabaseModalCtrl)

    .controller('ExportModalCtrl', ExportModalCtrl)

    .controller('ExportDatabaseModalCtrl', ExportDatabaseModalCtrl)

    .controller('EnsureModalCtrl', EnsureModalCtrl)

    .controller('CommonSingleInputModalCtrl', CommonSingleInputModalCtrl)

    .controller('JsonToParamInputModalCtrl', JsonToParamInputModalCtrl)

    .controller('FieldModalCtrl', FieldModalCtrl)

    .controller('ProjectModalCtrl', ProjectModalCtrl)

    .controller('DatabaseModalCtrl', DatabaseModalCtrl)

    .controller('GroupModalCtrl', GroupModalCtrl)

    .controller('ApiRecoverModalCtrl', ApiRecoverModalCtrl)

    .controller('TableModalCtrl', TableModalCtrl)

    .controller('CodeModalCtrl', CodeModalCtrl)

    .controller('RequestParamDetailModalCtrl', RequestParamDetailModalCtrl)

    .controller('RequestParamEditModalCtrl', RequestParamEditModalCtrl)

    .controller('ResponseParamDetailModalCtrl', ResponseParamDetailModalCtrl)

    .controller('ResponseParamEditModalCtrl', ResponseParamEditModalCtrl)


    RequestParamDetailModalCtrl.$inject = ['$scope', '$uibModalInstance', 'input'];
    /**
     * @function [请求参数详情弹窗]
     * @service  $scope [注入作用域服务]
     * @service  $uibModalInstance [注入$uibModalInstance服务]
     * @param    {[obj]}   input [参数详情]
     */
    function RequestParamDetailModalCtrl($scope, $uibModalInstance, input) {
        $scope.data = {
            input: {},
            fun: {
                close: null, //关闭功能函数
            }
        }
        var data = {
            fun: {
                init: null, //初始化功能函数
            }
        }
        data.fun.init = (function() {
            angular.copy(input, $scope.data.input);
        })();
        $scope.data.fun.close = function() {
            $uibModalInstance.close(true);
        }
    }

    RequestParamEditModalCtrl.$inject = ['$scope', '$uibModalInstance', 'input'];
    /**
     * @function [请求参数编辑弹窗]
     * @service  $scope [注入作用域服务]
     * @service  $uibModalInstance [注入$uibModalInstance服务]
     * @param    {[obj]}   input [参数详情]
     */
    function RequestParamEditModalCtrl($scope, $uibModalInstance, input) {
        $scope.data = {
            input: {},
            fun: {
                close: null, //关闭功能函数
                ok: null, //确认功能函数
            }
        }
        var data = {
            fun: {
                init: null, //初始化功能函数
            }
        }
        data.fun.init = (function() {
            angular.copy(input, $scope.data.input);
        })();
        $scope.data.fun.close = function() {
            var template = {
                output: {}
            }
            angular.copy($scope.data.input.item, template.output);
            template.output.paramValueList.splice(template.output.paramValueList.length - 1, 1);
            $uibModalInstance.close({
                item: template.output
            });
        }
        $scope.data.fun.ok = function() {
            var template = {
                output: {}
            }
            angular.copy($scope.data.input.item, template.output);
            for (var key = 0; key < template.output.paramValueList.length; key++) {
                var val = template.output.paramValueList[key];
                if (val.valueDescription && !val.value) {
                    break;
                } else if (!val.valueDescription && !val.value) {
                    template.output.paramValueList.splice(key, 1);
                    key--;
                }
            }
            if (key == template.output.paramValueList.length) {
                $uibModalInstance.close({
                    item: template.output
                });
            }
        }
    }

    ResponseParamDetailModalCtrl.$inject = ['$scope', '$uibModalInstance', 'input'];
     /**
     * @function [请求参数编辑弹窗]
     * @service  $scope [注入作用域服务]
     * @service  $uibModalInstance [注入$uibModalInstance服务]
     * @param    {[obj]}   input [参数详情]
     */
    function ResponseParamDetailModalCtrl($scope, $uibModalInstance, input) {
        $scope.data = {
            input: {},
            fun: {
                close: null, //关闭功能函数
            }
        }
        var data = {
            fun: {
                init: null, //初始化功能函数
            }
        }
        data.fun.init = (function() {
            angular.copy(input, $scope.data.input);
        })();
        $scope.data.fun.close = function() {
            $uibModalInstance.close(true);
        }

    }

    ResponseParamEditModalCtrl.$inject = ['$scope', '$uibModalInstance', 'input'];
    /**
     * @function [返回参数编辑弹窗]
     * @service  $scope [注入作用域服务]
     * @service  $uibModalInstance [注入$uibModalInstance服务]
     * @param    {[obj]}   input [参数详情]
     */
    function ResponseParamEditModalCtrl($scope, $uibModalInstance, input) {
        $scope.data = {
            input: {},
            fun: {
                close: null, //关闭功能函数
                ok: null, //确认功能函数
            }
        }
        var data = {
            fun: {
                init: null, //初始化功能函数
            }
        }
        data.fun.init = (function() {
            angular.copy(input, $scope.data.input);
        })();
        $scope.data.fun.close = function() {
            var template = {
                output: {}
            }
            angular.copy($scope.data.input.item, template.output);
            template.output.paramValueList.splice(template.output.paramValueList.length - 1, 1);
            $uibModalInstance.close({
                item: template.output
            });
        }
        $scope.data.fun.ok = function() {
            var template = {
                output: {}
            }
            angular.copy($scope.data.input.item, template.output);
            for (var key = 0; key < template.output.paramValueList.length; key++) {
                var val = template.output.paramValueList[key];
                if (val.valueDescription && !val.value) {
                    break;
                } else if (!val.valueDescription && !val.value) {
                    template.output.paramValueList.splice(key, 1);
                    key--;
                }
            }
            if (key == template.output.paramValueList.length) {
                $uibModalInstance.close({
                    item: template.output
                });
            }
        }
    }

    ExpressionBuilderModalCtrl.$inject = ['$scope', '$uibModalInstance', 'data'];
    /**
     * @function [表达式构造器弹窗]
     * @service  $scope [注入作用域服务]
     * @service  $uibModalInstance [注入$uibModalInstance服务]
     * @param    {[obj]}   data [原始数据]
     */
    function ExpressionBuilderModalCtrl($scope, $uibModalInstance, data) {
        $scope.data = {
            interaction: {
                request: {
                    expressionBuilderObject: data || {
                        request: {},
                        response: {}
                    }
                }
            },
            fun: {
                init: null, //初始化功能函数
                callback: null //构造器回调函数
            }
        }
        $scope.data.fun.init = function(callback) {
            var template = {
                interaction: {}
            }
            angular.copy(data, template.interaction);
            $scope.data.interaction.request.expressionBuilderObject = template.interaction;
        };
        $scope.data.fun.init();
        $scope.data.fun.callback = function(callback) {
            console.log(callback)
            $uibModalInstance.close(callback);
        };
    }

    EnsureModalCtrl.$inject = ['$scope', '$uibModalInstance', 'title', 'necessity', 'info', 'btn'];
    /**
     * @function [确认弹窗]
     * @service  $scope [注入作用域服务]
     * @service  $uibModalInstance [注入$uibModalInstance服务]
     * @param    {[string]}   title [弹窗标题]
     * @param    {[boolean]}   necessity [是否需要键入yes]
     * @param    {[string]}   info [弹窗内容]
     * @param    {[number]}   btn [按钮类型]
     */
    function EnsureModalCtrl($scope, $uibModalInstance, title, necessity, info, btn) {

        $scope.title = title;
        $scope.necessity = necessity;
        $scope.info = {
            message: info || '确认删除？',
            btnType: btn.btnType || 0, //0：warning 1：info,2:success,
            btnMessage: btn.btnMessage || '删除'
        }
        $scope.ok = function() {
            if ($scope.sureForm.$valid || !$scope.necessity) {
                $uibModalInstance.close(true);
            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function() {
            //$uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };

    }

    JsonToParamInputModalCtrl.$inject = ['$scope', '$uibModalInstance', 'input'];

    function JsonToParamInputModalCtrl($scope, $uibModalInstance, input) {
        $scope.data={
            input:input
        }
        $scope.ok = function(which) {
            if ($scope.sureForm.$valid) {
                $uibModalInstance.close({
                    which: which,
                    desc: $scope.info.desc
                });
            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function() {
            $uibModalInstance.close(false);
        };
    }

    MessageModalCtrl.$inject = ['$scope', '$sce', '$uibModalInstance', 'title', 'info'];

    function MessageModalCtrl($scope, $sce, $uibModalInstance, title, info) {

        $scope.title = title;
        $scope.info = $sce.trustAsHtml(info);

        $scope.cancel = function() {
            //$uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };

    }

    TipsModalCtrl.$inject = ['$scope', '$sce', '$uibModalInstance', 'info'];

    function TipsModalCtrl($scope, $sce, $uibModalInstance, info) {
        $scope.info = {
            html: $sce.trustAsHtml(info.html),
            background: info.background,
            type: info.type
        }
        $scope.cancel = function() {
            $uibModalInstance.close(false);
        };
    }

    ImportModalCtrl.$inject = ['$scope', '$uibModalInstance', 'ApiManagementResource', 'CODE', '$rootScope', 'input'];

    function ImportModalCtrl($scope, $uibModalInstance, ApiManagementResource, CODE, $rootScope, input) {
        $scope.data = {
            input: input,
            fun: {
                import: null //导入按钮功能函数
            }
        }
        $scope.importFile = function(arg) {
            var file = arg.$file[0];
            switch ($scope.data.input.status) {
                case 1:
                    {
                        var reader = new FileReader();
                        reader.readAsText(file);
                        reader.onloadend = function(evt) {
                            $scope.$broadcast('$LoadingInit', {
                                companyID: input.companyID,
                                status: arg.status,
                                result: this.result
                            });
                        }
                        break;
                    }
                default:
                    {
                        if (file.name.indexOf('.json') > -1 || file.name.indexOf('.txt') > -1 || file.name.indexOf('.export') > -1) {
                            var reader = new FileReader();
                            reader.readAsText(file);
                            reader.onloadend = function(evt) {
                                $scope.$broadcast('$LoadingInit', {
                                    companyID: input.companyID,
                                    status: arg.status,
                                    result: this.result
                                });
                            }
                        } else {
                            $rootScope.InfoModal('格式需为json,txt,export其中一种', 'error');
                        }
                    }
            }

        }
        $scope.data.fun.import = function(arg) {
            var template = {
                promise: null
            }
            switch (arg.status) {
                case 0:
                    {
                        template.promise = ApiManagementResource.Import.Eoapi({
                            data: arg.result
                        }).$promise;
                        template.promise.then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $uibModalInstance.close(true);
                                        break;
                                    }
                                case CODE.IMPORT_EXPORT.ILLEGAL_IMPORT:
                                    {
                                        $rootScope.InfoModal('数据格式错误', 'error');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal('导入失败', 'error');
                                        break;
                                    }
                            }
                        });
                        break;
                    }
                case 1:
                case 2:
                    {
                        template.promise = ApiManagementResource.Import.Postman({
                            data: arg.result,
                            version: arg.status
                        }).$promise;
                        template.promise.then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {

                                        $uibModalInstance.close(true);
                                        break;
                                    }
                                case CODE.IMPORT_EXPORT.ILLEGAL_VERSION:
                                    {
                                        $rootScope.InfoModal('版本错误', 'error');
                                        break;
                                    }
                                case CODE.IMPORT_EXPORT.ILLEGAL_IMPORT:
                                    {
                                        $rootScope.InfoModal('数据格式错误', 'error');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal('导入失败', 'error');
                                        break;
                                    }
                            }
                        });
                        break;
                    }
                case 3:
                    {
                        template.promise = ApiManagementResource.Import.Dhc({
                            data: arg.result
                        }).$promise;
                        template.promise.then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $uibModalInstance.close(true);
                                        break;
                                    }
                                case CODE.IMPORT_EXPORT.ILLEGAL_IMPORT:
                                    {
                                        $rootScope.InfoModal('数据格式错误', 'error');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal('导入失败', 'error');
                                        break;
                                    }
                            }
                        });
                        break;
                    }
                case 4:
                    {
                        template.promise = ApiManagementResource.Import.Rap({
                            data: arg.result
                        }).$promise;
                        template.promise.then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $uibModalInstance.close(true);
                                        break;
                                    }
                                case CODE.IMPORT_EXPORT.ILLEGAL_IMPORT:
                                    {
                                        $rootScope.InfoModal('解析数据中的modelJSON失败', 'error');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal('导入失败', 'error');
                                        break;
                                    }
                            }
                        });
                        break;
                    }
                case 5:
                    {
                        template.promise = ApiManagementResource.Import.Swagger({
                            data: arg.result
                        }).$promise;
                        template.promise.then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $uibModalInstance.close(true);
                                        break;
                                    }
                                case CODE.IMPORT_EXPORT.ILLEGAL_IMPORT:
                                    {
                                        $rootScope.InfoModal('解析数据中的modelJSON失败', 'error');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal('导入失败', 'error');
                                        break;
                                    }
                            }
                        });
                        break;
                    }
                case 6:
                    {
                        template.promise = ApiManagementResource.Api.Import({
                            projectID: $scope.data.input.request.projectID,
                            groupID: $scope.data.input.request.groupID,
                            data: arg.result
                        }).$promise;
                        template.promise.then(function(response) {
                            switch (response.statusCode) {
                                case CODE.COMMON.SUCCESS:
                                    {
                                        $uibModalInstance.close(true);
                                        break;
                                    }
                                case '160006':
                                    {
                                        $rootScope.InfoModal('文件内容格式非法', 'error');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal('导入失败', 'error');
                                        break;
                                    }
                            }
                        });
                        break;
                    }
            }
            return template.promise;
        }
        $scope.cancel = function() {
            //$uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };

    }

    ImportDatabaseModalCtrl.$inject = ['$scope', '$state', '$uibModalInstance', 'input', 'DatabaseResource', 'CODE', '$rootScope'];

    function ImportDatabaseModalCtrl($scope, $state, $uibModalInstance, input, DatabaseResource, CODE, $rootScope) {
        var code = CODE.COMMON.SUCCESS;
        $scope.title = input.title;
        $scope.data = {
            input: {
                status: input.status || 0,
            },
            fun: {
                import: null //导入按钮功能函数
            }
        }
        $scope.importFile = function(arg) {
            var file = arg.$file[0];
            if (/(.sql)|(.export)/.test(file.name)) {
                var reader = new FileReader();
                reader.readAsText(file);
                reader.onloadend = function(evt) {
                    $scope.$broadcast('$LoadingInit', {
                        status: arg.status,
                        result: this.result
                    });
                };
            } else {
                $rootScope.InfoModal('文件格式错误，只能使用.sql及.export其中一种', 'error');
            }
        }
        $scope.data.fun.import = function(arg) {
            var template = {
                promise: null
            }
            switch (arg.status) {
                case 0:
                    {
                        template.promise = DatabaseResource.Database.Import({
                            dbID: $state.params.databaseID,
                            dumpSql: arg.result
                        }).$promise;
                        template.promise.then(function(data) {
                            switch (data.statusCode) {
                                case code:
                                    {
                                        $uibModalInstance.close(true);
                                        break;
                                    }
                                case '310004':
                                    {
                                        $rootScope.InfoModal('数据格式错误', 'error');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal('导入失败', 'error');
                                        break;
                                    }
                            }
                        });
                        break;
                    }
                case 1:
                    {
                        template.promise = DatabaseResource.Database.ImportByJson({
                            data: arg.result
                        }).$promise;
                        template.promise.then(function(data) {
                            switch (data.statusCode) {
                                case code:
                                    {
                                        $uibModalInstance.close(true);
                                        break;
                                    }
                                case '220010':
                                    {
                                        $rootScope.InfoModal('数据格式错误', 'error');
                                        break;
                                    }
                                default:
                                    {
                                        $rootScope.InfoModal('导入失败', 'error');
                                        break;
                                    }
                            }
                        });
                        break;
                    }
            }
            return template.promise;
        }
        $scope.cancel = function() {
            //$uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }

    ExportModalCtrl.$inject = ['$scope', '$uibModalInstance', 'ApiManagementResource', 'CODE', '$rootScope', 'input'];

    function ExportModalCtrl($scope, $uibModalInstance, ApiManagementResource, CODE, $rootScope, input) {
        $scope.data = {
            input: input,
            fun: {
                dumpDirective: null //dumpDirective绑定指令
            }
        }
        var data = {
            assistantFun: {
                response: null
            }
        }
        data.assistantFun.response = function(arg) {
            switch (arg.response.statusCode) {
                case CODE.COMMON.SUCCESS:
                    {
                        $scope.$broadcast('$DumpDirective_Click_' + arg.switch, {
                            response: arg.response
                        });
                        $rootScope.InfoModal('导出成功', 'success');
                        $uibModalInstance.close(false);
                        break;
                    }
                default:
                    {
                        $rootScope.InfoModal('导出失败', 'error');
                        break;
                    }
            }
        }
        $scope.data.fun.dumpDirective = function(arg) {
            var template = {
                promise: null,
                request: {
                    projectID: $scope.data.input.projectID
                }
            }
            template.promise = ApiManagementResource.Project.Dump(template.request).$promise;
            template.promise.then(function(response) {
                data.assistantFun.response({
                    response: response,
                    switch: arg.switch
                });
            })
            return template.promise;
        }
        $scope.cancel = function() {
            //$uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };

    }

    ExportDatabaseModalCtrl.$inject = ['$scope', '$uibModalInstance', 'DatabaseResource', 'CODE', '$rootScope', 'input'];

    function ExportDatabaseModalCtrl($scope, $uibModalInstance, DatabaseResource, CODE, $rootScope, input) {
        $scope.title = input.title;
        $scope.info = {
            dbID: input.dbID
        }
        $scope.data = {
            fun: {
                dumpDirective: null //dumpDirective绑定指令
            }
        }
        var data = {
            assistantFun: {
                response: null
            }
        }
        data.assistantFun.response = function(arg) {
            switch (arg.response.statusCode) {
                case CODE.COMMON.SUCCESS:
                    {
                        $scope.$broadcast('$DumpDirective_Click_' + arg.switch, {
                            response: arg.response
                        });
                        $rootScope.InfoModal('导出成功', 'success');
                        $uibModalInstance.close(false);
                        break;
                    }
                default:
                    {
                        $rootScope.InfoModal('导出失败', 'error');
                        break;
                    }
            }
        }
        $scope.data.fun.dumpDirective = function(arg) {
            var template = {
                promise: null,
                request: {
                    dbID: $scope.info.dbID
                }
            }

            switch (arg.switch) {
                case "0":
                    {
                        template.promise = DatabaseResource.Database.Dump(template.request).$promise;
                        template.promise.then(function(response) {
                            data.assistantFun.response({
                                response: response,
                                switch: arg.switch
                            });
                        })
                        break;
                    }
            }
            return template.promise;
        }
        $scope.cancel = function() {
            //$uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };

    }

    InfoModalCtrl.$inject = ['$scope', '$uibModalInstance', '$timeout', 'info', 'type'];

    function InfoModalCtrl($scope, $uibModalInstance, $timeout, info, type) {

        $scope.type = type || 'info';
        $scope.info = info;
        var timer = $timeout(function() {
            $uibModalInstance.close(true);
        }, 1500, true);
        $scope.$on('$destroy', function() {
            if (timer) {
                $timeout.cancel(timer);
            }
        });
    }

    FieldModalCtrl.$inject = ['$state', '$scope', '$uibModalInstance', 'DATABASE', 'DatabaseResource', '$rootScope', 'CODE', 'input'];

    function FieldModalCtrl($state, $scope, $uibModalInstance, DATABASE, DatabaseResource, $rootScope, CODE, input) {

        var code = CODE.COMMON.SUCCESS;
        var vm = this;
        $scope.title = input.title;
        $scope.info = {
            companyID: $state.params.companyID,
            databaseID: input.interaction.request.databaseID,
            tableID: input.interaction.request.tableID,
            fieldID: '',
            fieldName: '',
            fieldType: '',
            fieldLength: '',
            isNotNull: false,
            isPrimaryKey: false,
            fieldDesc: '',
            defaultValue: '',
            isAdd: true
        }
        $scope.template = {
            isKeep: false //是否成功单击过继续添加按钮
        }
        $scope.isDisable = false;
        $scope.query = [];
        $scope.typeList = DATABASE.TYPE;

        function init() {
            if (input.interaction.request.fieldID) {
                $scope.info = {
                    companyID: $state.params.companyID,
                    databaseID: input.interaction.request.databaseID,
                    tableID: input.interaction.request.tableID,
                    fieldID: input.interaction.request.fieldID,
                    fieldName: input.interaction.request.fieldName,
                    fieldType: '' + input.interaction.request.fieldType,
                    fieldLength: input.interaction.request.fieldLength,
                    isNotNull: input.interaction.request.isNotNull == 1,
                    isPrimaryKey: input.interaction.request.isPrimaryKey == 1,
                    defaultValue: input.interaction.request.defaultValue,
                    fieldDesc: input.interaction.request.fieldDesc,
                    isAdd: false
                }
            }
        }
        init();


        $scope.changeKey = function() {
            if ($scope.info.isPrimaryKey) {
                $scope.info.isNotNull = true;
            }
        }
        $scope.keep = function() {
            var template = {
                promise: null,
                request: {}
            }
            $scope.isType = false;
            angular.forEach($scope.typeList, function(val, key) {
                if ($scope.info.fieldType == val) {
                    $scope.isType = true;
                }
            })
            if ($scope.editFieldForm.$valid && $scope.isType) {
                if (!$scope.isDisable) {
                    $scope.isDisable = true;
                    angular.copy($scope.info, template.request);
                    template.request.isNotNull = template.request.isNotNull ? 1 : 0;
                    template.request.isPrimaryKey = template.request.isPrimaryKey ? 1 : 0;
                    template.promise = DatabaseResource.Field.Add(template.request).$promise;
                    template.promise.then(function(data) {
                        $scope.isDisable = false;
                        if (code == data.statusCode) {
                            $rootScope.InfoModal("添加成功！", 'success');
                            $scope.submited = false;
                            $scope.template.isKeep = true;
                            $scope.info = {
                                companyID: $state.params.companyID,
                                databaseID: input.interaction.request.databaseID,
                                tableID: input.interaction.request.tableID,
                                fieldID: '',
                                fieldName: '',
                                fieldType: '',
                                fieldLength: '',
                                isNotNull: false,
                                isPrimaryKey: false,
                                defaultValue: '',
                                fieldDesc: '',
                                isAdd: true
                            }
                            $scope.isType = false;
                        } else {
                            $scope.submited = true;
                        }
                    });
                }
            } else {
                $scope.submited = true;
            }
        }
        $scope.ok = function() {
            var template = {
                promise: null,
                request: {}
            }
            $scope.isType = false;
            angular.forEach($scope.typeList, function(val, key) {
                if ($scope.info.fieldType == val) {
                    $scope.isType = true;
                }
            })
            if ($scope.editFieldForm.$valid && $scope.isType) {
                if (!$scope.isDisable) {
                    $scope.isDisable = true;
                    angular.copy($scope.info, template.request);
                    template.request.isNotNull = template.request.isNotNull ? 1 : 0;
                    template.request.isPrimaryKey = template.request.isPrimaryKey ? 1 : 0;
                    if ($scope.info.isAdd) {
                        template.promise = DatabaseResource.Field.Add(template.request).$promise;
                        template.promise.then(function(data) {
                            $scope.isDisable = false;
                            if (code == data.statusCode) {
                                $uibModalInstance.close(true);
                            } else {
                                $scope.submited = true;
                            }
                        });
                    } else {
                        template.promise = DatabaseResource.Field.Update(template.request).$promise;
                        template.promise.then(function(data) {
                            $scope.isDisable = false;
                            if (code == data.statusCode || data.statusCode == '190009') {
                                $uibModalInstance.close($scope.info);
                            } else {
                                $scope.submited = true;
                            }
                        });
                    }
                }

            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function() {
            //$uibModalInstance.dismiss(false);
            if ($scope.template.isKeep) {
                $uibModalInstance.close({
                    status: 1
                });
            } else {
                $uibModalInstance.close(false);
            }
        };
    }

    ProjectModalCtrl.$inject = ['$scope', '$uibModalInstance', 'ApiManagementResource', 'CODE', 'input'];

    function ProjectModalCtrl($scope, $uibModalInstance, ApiManagementResource, CODE, input) {
        var code = CODE.COMMON.SUCCESS;
        var vm = this;
        $scope.title = input.title;
        $scope.info = {
            projectID: '',
            projectName: '',
            projectVersion: '1.0',
            projectType: '0',
            projectDesc: '',
            isAdd: input.isAdd
        }

        function init() {
            if (!$scope.info.isAdd) {
                $scope.info = {
                    projectID: input.item.projectID,
                    projectName: input.item.projectName,
                    projectVersion: input.item.projectVersion,
                    projectType: "" + input.item.projectType + "",
                    projectDesc: input.item.projectDesc,
                    isAdd: false
                }
            }
        }
        init();
        $scope.ok = function() {
            if ($scope.editProjectForm.$valid) {
                if ($scope.info.isAdd) {
                    ApiManagementResource.Project.Add($scope.info).$promise.then(function(data) {
                        if (code == data.statusCode) {
                            $scope.info.projectID = data.projectInfo.projectID;
                            $uibModalInstance.close($scope.info);
                        } else {
                            $scope.submited = true;
                        }
                    });
                } else {
                    ApiManagementResource.Project.Update($scope.info).$promise.then(function(data) {
                        if (code == data.statusCode) {
                            $uibModalInstance.close($scope.info);
                        } else {
                            $scope.submited = true;
                        }
                    });
                }
            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function() {
            //$uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }
    
    DatabaseModalCtrl.$inject = ['$scope', '$uibModalInstance', 'DatabaseResource', 'CODE', 'input'];

    function DatabaseModalCtrl($scope, $uibModalInstance, DatabaseResource, CODE, input) {
        var code = CODE.COMMON.SUCCESS;
        var vm = this;
        $scope.title = input.title;
        $scope.info = {
            dbID: '',
            dbName: '',
            dbVersion: '1.0',
            isAdd: true
        }
        function init() {
            if (input.interaction.request) {
                $scope.info = {
                    dbID: input.interaction.request.dbID,
                    dbName: input.interaction.request.dbName,
                    dbVersion: input.interaction.request.dbVersion,
                    isAdd: false
                }
            }
        }
        init();
        $scope.ok = function() {
            var template = {
                promise: null
            }
            if ($scope.editDatabaseForm.$valid) {
                if ($scope.info.isAdd) {
                    template.promise = DatabaseResource.Database.Add($scope.info).$promise;
                    template.promise.then(function(data) {
                        if (code == data.statusCode) {
                            $scope.info.dbID = data.dbID;
                            $uibModalInstance.close($scope.info);
                        } else {
                            $scope.submited = true;
                        }
                    });
                } else {
                    template.promise = DatabaseResource.Database.Update($scope.info).$promise;
                    template.promise.then(function(data) {
                        if (code == data.statusCode) {
                            $uibModalInstance.close($scope.info);
                        } else {
                            $scope.submited = true;
                        }
                    });
                }
            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function() {
            //$uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }

    GroupModalCtrl.$inject = ['$scope', '$uibModalInstance', 'title', 'info', 'secondTitle', 'query'];

    function GroupModalCtrl($scope, $uibModalInstance, title, info, secondTitle, query) {
        var vm = this;
        $scope.title = title;
        $scope.secondTitle = secondTitle || '分组';
        $scope.required = info ? (info.required ? true : false) : false;
        $scope.info = {
            groupName: '',
            groupID: '',
            $index: '0',
            isAdd: true
        }
        $scope.params = {
            query: [{
                groupName: '--不设置父分组--',
                groupID: '0'
            }].concat(query),
            hadSelected: query ? true : false
        }

        function init() {
            if (info) {
                $scope.info = {
                    groupName: info.groupName,
                    groupID: info.groupID,
                    $index: info.$index ? '' + info.$index : '0',
                    isAdd: false
                }
            }
        }
        init();
        $scope.ok = function() {
            if ($scope.editGroupForm.$valid) {
                $uibModalInstance.close($scope.info);
            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function() {
            //$uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }

    ApiRecoverModalCtrl.$inject = ['$scope', '$uibModalInstance', 'input'];

    function ApiRecoverModalCtrl($scope, $uibModalInstance, input) {
        $scope.data = {
            input: input, //group：分组
            output: {
                groupID: '',
                childGroupID: ''
            },
            fun: {
                change: null, //切换父分组功能函数
            }
        }
        var data = {
            fun: {
                init: null, //初始化功能函数
            }
        }
        $scope.data.fun.change = function() {
            for (var i = 0; i < $scope.data.input.group.parent.length; i++) {
                var val = $scope.data.input.group.parent[i];
                if (val.groupID == $scope.data.output.groupID) {
                    $scope.data.input.group.child = [{
                        groupID: -1,
                        groupName: '可选[二级菜单]'
                    }].concat(val.childGroupList);
                    $scope.data.output.childGroupID = -1;
                    break;
                }
            }
        }
        data.fun.init = (function() {
            $scope.data.output.groupID = $scope.data.input.group.parent[0].groupID;
            $scope.data.input.group.child = [{
                groupID: -1,
                groupName: '可选[二级菜单]'
            }].concat($scope.data.input.group.parent[0].childGroupList);
            $scope.data.output.childGroupID = -1;
        })()
        $scope.ok = function() {
            var template = {
                callback: {
                    groupID: $scope.data.output.childGroupID == -1 ? $scope.data.output.groupID : $scope.data.output.childGroupID
                }
            }
            $uibModalInstance.close(template.callback);
        };

        $scope.cancel = function() {
            //$uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }

    TableModalCtrl.$inject = ['$scope', '$uibModalInstance', 'title', 'info', 'databaseID'];

    function TableModalCtrl($scope, $uibModalInstance, title, info, databaseID) {
        var code = CODE.COMMON.SUCCESS;
        var vm = this;
        $scope.title = title;
        $scope.info = {
            dbID: databaseID,
            tableID: '',
            tableName: '',
            tableDescription: '',
            isAdd: true
        }

        function init() {
            if (info) {
                $scope.info = {
                    dbID: databaseID,
                    tableID: info.tableID,
                    tableName: info.tableName,
                    tableDescription: info.tableDescription,
                    isAdd: false
                }
            }
        }
        init();
        $scope.ok = function() {
            if ($scope.editTableForm.$valid) {
                $uibModalInstance.close($scope.info);
            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function() {
            //$uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }

    CodeModalCtrl.$inject = ['$scope', '$uibModalInstance', 'ApiManagementResource', '$rootScope', 'CODE', 'title', 'info', 'GroupService'];

    function CodeModalCtrl($scope, $uibModalInstance, ApiManagementResource, $rootScope, CODE, title, info, GroupService) {
        var code = CODE.COMMON.SUCCESS;
        var codeGroup = GroupService.get();
        $scope.title = title;
        var data = {
            interaction: {
                version: info.version || 0 
            }
        }
        $scope.info = {
            projectID: info.projectID,
            groupID: parseInt(info.groupID),
            childGroupID: parseInt(info.childGroupID) || -1,
            code: '',
            codeDesc: '',
            isAdd: true
        }
        $scope.query = [];
        $scope.childGroup = [{
            groupID: -1,
            groupName: '可选[二级菜单]'
        }];
        var initChildGroup = [{
            groupID: -1,
            groupName: '可选[二级菜单]'
        }];

        function init() {
            $scope.query = codeGroup;
            if (info.groupID == -1) {
                $scope.info.groupID = $scope.query[0].groupID;
                $scope.childGroup = initChildGroup.concat($scope.query[0].childGroupList);
                $scope.info.childGroupID = -1;
            } else {
                if (!!info.parentGroupID) {
                    $scope.info.groupID = parseInt(info.parentGroupID);
                }
                for (var i = 0; i < $scope.query.length; i++) {
                    var val = $scope.query[i];
                    if (val.groupID == $scope.info.groupID) {
                        $scope.childGroup = initChildGroup.concat(val.childGroupList);
                        break;
                    }
                }
            }
            if (info.codeID) {
                $scope.info = {
                    companyID: info.companyID,
                    projectID: info.projectID,
                    groupID: !!info.parentGroupID ? parseInt(info.parentGroupID) : parseInt(info.groupID),
                    childGroupID: !!info.parentGroupID ? parseInt(info.groupID) : -1,
                    codeID: info.codeID,
                    code: info.code,
                    codeDesc: info.codeDescription,
                    isAdd: false
                }
            }

        }
        init();
        $scope.changeChildGroup = function() {
            for (var i = 0; i < $scope.query.length; i++) {
                var val = $scope.query[i];
                if (val.groupID == $scope.info.groupID) {
                    $scope.childGroup = initChildGroup.concat(val.childGroupList);
                    $scope.info.childGroupID = -1;
                    break;
                }
            }
        }
        $scope.keep = function() {
            var template = {
                request: {
                    companyID: $scope.info.companyID,
                    projectID: $scope.info.projectID,
                    groupID: $scope.info.childGroupID > 0 ? $scope.info.childGroupID : $scope.info.groupID,
                    codeDesc: $scope.info.codeDesc,
                    code: $scope.info.code
                },
                promise: null
            }
            if ($scope.editProjectForm.$valid) {
                template.promise = ApiManagementResource.Code.Add(template.request).$promise;
                template.promise.then(function(data) {
                    if (code == data.statusCode) {
                        $rootScope.InfoModal("添加成功！", 'success');
                        $scope.submited = false;
                        $scope.info = {
                            projectID: $scope.info.projectID,
                            groupID: info.groupID == -1 ? $scope.query[0].groupID : parseInt(info.groupID),
                            childGroupID: info.childGroupID ? parseInt(info.childGroupID) : -1,
                            code: '',
                            codeDesc: '',
                            isAdd: true
                        }
                        for (var i = 0; i < $scope.query.length; i++) {
                            var val = $scope.query[i];
                            if (val.groupID == info.groupID) {
                                $scope.childGroup = initChildGroup.concat(val.childGroupList);
                                break;
                            }
                        }
                    } else {
                        $scope.submited = true;
                    }
                });
            } else {
                $scope.submited = true;
            }
        }
        $scope.ok = function() {
            var template = {
                request: {
                    companyID: $scope.info.companyID,
                    projectID: $scope.info.projectID,
                    groupID: $scope.info.childGroupID > 0 ? $scope.info.childGroupID : $scope.info.groupID,
                    codeID: $scope.info.codeID,
                    codeDesc: $scope.info.codeDesc,
                    code: $scope.info.code
                },
                promise: null
            }
            if ($scope.editProjectForm.$valid) {
                if ($scope.info.isAdd) {
                    template.promise = ApiManagementResource.Code.Add(template.request).$promise;
                    template.promise.then(function(data) {
                        if (code == data.statusCode) {
                            $uibModalInstance.close(true);
                        } else {
                            $scope.submited = true;
                        }
                    });
                } else {
                    template.promise = ApiManagementResource.Code.Update(template.request).$promise;
                    template.promise.then(function(data) {
                        if (code == data.statusCode || data.statusCode == CODE.STATUS_CODE.ERROR) {
                            $uibModalInstance.close(true);
                        } else {
                            $scope.submited = true;
                        }
                    });
                }
            } else {
                $scope.submited = true;
            }
        };

        $scope.cancel = function() {
            //$uibModalInstance.dismiss(false);
            $uibModalInstance.close(false);
        };
    }


})();
