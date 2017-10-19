(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function [复制input值到剪贴板js]
     * @version  3.0.2
     * @service  $compile [注入$compile服务]
     * @service  $filter [注入过滤器服务]
     * @service  $rootScope [注入根作用域服务]
     * @param    copyModel [copy的内容]
     */
    angular.module('eolinker.directive')

    .directive('copyDirective', ['$rootScope', '$compile', '$filter', function($rootScope, $compile, $filter) {
        return {
            restrict: 'A',
            transclude: true,
            scope: {
                copyModel: '=' 
            },
            link: function($scope, elem, attrs, ngModel) {
                var data = {
                    info: {
                        templet: {
                            button: '<button class="{{\'eo-button-default \'+data.info.timestamp}}" data-clipboard-text="{{copyModel}}"><span class=\"iconfont icon-copy\" ><\/span>{{data.info.clipboard.text}}</button>',
                            input: '<input type="text" id="{{data.info.timestamp}}" name="link" value="{{copyModel}}" class="{{\'eo-input \'+data.info.timestamp}}" data-clipboard-action="copy" data-clipboard-target="{{\'#\'+data.info.timestamp}}" ng-class="{\'eo-copy\':(data.info.clipboard.success)&&(data.info.clipboard.isClick)}" data-ng-click="data.fun.click()" readonly>' + '<label for="{{data.info.timestamp}}" class="pull-right copy-tips " ng-class="{\'copy-success\':(data.info.clipboard.success)&&(data.info.clipboard.isClick),\'copy-error\':(!data.info.clipboard.success)&&(data.info.clipboard.isClick)}">' + '{{data.info.clipboard.text}}' + '</label>',
                            textarea: '<textarea id="{{data.info.timestamp}}" readonly>{{copyModel}}</textarea><button data-clipboard-action="copy" data-clipboard-target="{{\'#\'+data.info.timestamp}}">{{data.info.clipboard.text}}</button>'
                        }
                    },
                    fun: {
                        init: null, 
                        reset: null, 
                        $destory: null, 
                    }
                }
                $scope.data = {
                    info: {
                        timestamp: 'copy-' + $filter('timestampFilter')(),
                        clipboard: {
                            isClick: false,
                            success: false,
                            fun: '',
                            text:attrs.buttonHtml || '点击复制'//显示button文本（默认文本'点击复制'）
                        }
                    },
                    fun: {
                        click: null, 
                    }
                }

                /**
                 * @function [重置功能函数]
                 * @param    {[obj]}   arg [{class:html相应class}]
                 */
                data.fun.reset = function(arg) {
                    $scope.data.info.clipboard.fun = new Clipboard(arg.class);
                    $scope.data.info.clipboard.fun.on('success', function(_default) {
                        $scope.data.info.clipboard.success = true;
                        $scope.data.info.clipboard.isClick = true;
                        console.info('Text:', _default.text);
                        if (attrs.isPopup) {//成功或者失败是否以弹窗形式提醒
                            $rootScope.InfoModal("已复制到剪贴板", 'success');
                        } else {
                            $scope.data.info.clipboard.text = '复制成功';
                        }
                        $scope.$digest();
                        _default.clearSelection();
                    });

                    $scope.data.info.clipboard.fun.on('error', function(_default) {
                        $scope.data.info.clipboard.success = false;
                        $scope.data.info.clipboard.isClick = true;
                        console.info('Text:', _default.text);
                        if (attrs.isPopup) {
                            $rootScope.InfoModal("复制到剪贴板失败", 'error');
                        } else {
                            $scope.data.info.clipboard.text = '复制失败';
                        }
                        $scope.$digest();
                    });
                }

                /**
                 * @function [单击功能函数]
                 */
                $scope.data.fun.click = function() {
                    $scope.data.info.clipboard.isClick = false;
                }

                /**
                 * @function [页面销毁功能函数]
                 */
                data.fun.$destroy = function() {
                    $scope.data.info.clipboard.fun.destroy();
                }

                /**
                 * @function [初始化功能函数]
                 */
                data.fun.init = (function() {
                    var template = {
                        html: ''
                    }
                    switch (attrs.switchTemplet) {//选择模板（0：button模板，1：input模板，2：textarea模板，默认input模板）
                        case '0':
                            {
                                template.html = data.info.templet.button;
                                break;
                            }
                        case '1':
                            {
                                template.html = data.info.templet.input;
                                break;
                            }
                        case '2':
                            {
                                template.html = data.info.templet.textarea;
                                break;
                            }
                        default:
                            {
                                template.html = data.info.templet.input;
                                break;
                            }
                    }
                    angular.element(elem).append($compile(template.html)($scope));
                    $scope.$on('$destroy', data.fun.$destroy);
                    data.fun.reset({ class: ('.' + $scope.data.info.timestamp) });
                })()
            }
        };
    }]);
})();
