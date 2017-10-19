(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function [所有弹窗模块定义js]
     * @version  3.0.2
     * @service  ui.bootstrap.modal [注入第三方bootstrap modal插件]
     */
    angular.module('eolinker.modal', ['ui.bootstrap.modal'])

    .directive('eoModal', [function() {
        return {
            restrict: 'AE',
            templateUrl: 'app/modal/index.html',
            controller: eoModalController
        }
    }])
    eoModalController.$inject = ['$scope', '$uibModal', '$rootScope']

    function eoModalController($scope, $uibModal, $rootScope) {
        //弹窗引用
        //开放平台相关定义
        $rootScope.ApiDevelopment_ProjectOpenModal = function openModel(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ApiDevelopment_ProjectOpenModal',
                controller: 'ApiDevelopment_ProjectOpenModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        //企业模板相关定义
        
        $rootScope.ApiManagementPro_MoveProjectModal = function openModel(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ApiManagementPro_MoveProjectModal',
                controller: 'ApiManagementPro_MoveProjectModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.ApiManagementPro_InviteModal = function openModel(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ApiManagementPro_InviteModal',
                controller: 'ApiManagementPro_InviteModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.ApiManagementPro_PeopleAdminModal = function openModel(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ApiManagementPro_PeopleAdminModal',
                controller: 'ApiManagementPro_PeopleAdminModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.ApiManagementPro_TestExampleModal = function openModel(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ApiManagementPro_TestExampleModal',
                controller: 'ApiManagementPro_TestExampleModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.ApiManagementPro_PowerMemberModal = function openModel(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ApiManagementPro_PowerMemberModal',
                controller: 'ApiManagementPro_PowerMemberModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.ApiManagementPro_PowerGroupModal = function openModel(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ApiManagementPro_PowerGroupModal',
                controller: 'ApiManagementPro_PowerGroupModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.ApiManagementPro_BusinessModal = function openModel(info, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ApiManagementPro_BusinessModal',
                controller: 'ApiManagementPro_BusinessModalCtrl',
                resolve: {
                    info: function() {
                        return info;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        //公用相关定义
        
        $rootScope.CropModal = function openModal(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'CropModal',
                controller: 'CropModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.RequestParamDetailModal = function openModal(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'RequestParamDetailModal',
                controller: 'RequestParamDetailModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.RequestParamEditModal = function openModal(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'RequestParamEditModal',
                controller: 'RequestParamEditModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.ResponseParamEditModal = function openModal(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ResponseParamEditModal',
                controller: 'ResponseParamEditModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.ResponseParamDetailModal = function openModal(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ResponseParamDetailModal',
                controller: 'ResponseParamDetailModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.VideoModal = function openModal(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'VideoModal',
                controller: 'VideoModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.ExpressionBuilderModal = function openModel(data, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ExpressionBuilderModal',
                controller: 'ExpressionBuilderModalCtrl',
                resolve: {
                    data: function() {
                        return data;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.InfoModal = function openModel(info, type, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'InfoModal',
                controller: 'InfoModalCtrl',
                resolve: {
                    info: function() {
                        return info;
                    },
                    type: function() {
                        return type;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.TipsModal = function openModel(info, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'TipsModal',
                controller: 'TipsModalCtrl',
                resolve: {
                    info: function() {
                        return info;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.SingleSelectModal = function openModel(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'SingleSelectModal',
                controller: 'SingleSelectModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.JsonToParamInputModal = function openModel(input,callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'JsonToParamInputModal',
                controller: 'JsonToParamInputModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.ImportDatabaseModal = function openModel(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ImportDatabaseModal',
                controller: 'ImportDatabaseModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.EnsureModal = function openModel(title, necessity, info, btn, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'EnsureModal',
                controller: 'EnsureModalCtrl',
                resolve: {
                    title: function() {
                        return title;
                    },
                    necessity: function() {
                        return necessity;
                    },
                    info: function() {
                        return info;
                    },
                    btn: function() {
                        return btn;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.MessageModal = function openModel(title, info, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'MessageModal',
                controller: 'MessageModalCtrl',
                resolve: {
                    title: function() {
                        return title;
                    },
                    info: function() {
                        return info;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.DatabaseModal = function openModel(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'DatabaseModal',
                controller: 'DatabaseModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.FieldModal = function openModel(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'FieldModal',
                controller: 'FieldModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.TableModal = function openModel(title, info, databaseID, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'TableModal',
                controller: 'TableModalCtrl',
                resolve: {
                    title: function() {
                        return title;
                    },
                    info: function() {
                        return info;
                    },
                    databaseID: function() {
                        return databaseID;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.GroupModal = function openModel(title, info, secondTitle, query, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'GroupModal',
                controller: 'GroupModalCtrl',
                resolve: {
                    title: function() {
                        return title;
                    },
                    info: function() {
                        return info;
                    },
                    secondTitle: function() {
                        return secondTitle;
                    },
                    query: function() {
                        return query;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.ApiRecoverModal = function openModel(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ApiRecoverModal',
                controller: 'ApiRecoverModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.GatewayRateLimitModal = function openModel(title, info, secondTitle, query, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'GatewayRateLimitModal',
                controller: 'GatewayRateLimitModalCtrl',
                resolve: {
                    title: function() {
                        return title;
                    },
                    info: function() {
                        return info;
                    },
                    secondTitle: function() {
                        return secondTitle;
                    },
                    query: function() {
                        return query;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.GatewayModal = function openModel(title, info, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'GatewayModal',
                controller: 'GatewayModalCtrl',
                resolve: {
                    title: function() {
                        return title;
                    },
                    info: function() {
                        return info;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.GatewayBackendModal = function openModel(title, info, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'GatewayBackendModal',
                controller: 'GatewayBackendModalCtrl',
                resolve: {
                    title: function() {
                        return title;
                    },
                    info: function() {
                        return info;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.ImportModal = function openModel(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ImportModal',
                controller: 'ImportModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.ProjectModal = function openModel(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ProjectModal',
                controller: 'ProjectModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        
        $rootScope.ExportModal = function openModel(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ExportModal',
                controller: 'ExportModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.ExportDatabaseModal = function openModel(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ExportDatabaseModal',
                controller: 'ExportDatabaseModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.ShareProjectModal = function openModel(input, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'ShareProjectModal',
                controller: 'ShareProjectModalCtrl',
                resolve: {
                    input: function() {
                        return input;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.InviteModal = function openModel(interaction, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'InviteModal',
                controller: 'InviteModalCtrl',
                resolve: {
                    interaction: function() {
                        return interaction;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.CommonSingleInputModal = function openModel(title, desc, info, btn, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'CommonSingleInputModal',
                controller: 'CommonSingleInputModalCtrl',
                resolve: {
                    title: function() {
                        return title;
                    },
                    desc: function() {
                        return desc;
                    },
                    info: function() {
                        return info;
                    },
                    btn: function() {
                        return btn;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
        $rootScope.CodeModal = function openModel(title, info, callback) {
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'CodeModal',
                controller: 'CodeModalCtrl',
                resolve: {
                    title: function() {
                        return title;
                    },
                    info: function() {
                        return info;
                    }
                }
            });
            modalInstance.result.then(callback);
        }
    }

})();
