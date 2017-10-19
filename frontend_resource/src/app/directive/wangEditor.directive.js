(function() {
    "use strict";
    /**
     * @Author   广州银云信息科技有限公司
     * @function [wangEditor相关函数js]
     * @version  3.0.2
     * @service  $timeout [注入$timeout服务]
     * @service  $filter [注入过滤器服务]
     */
    angular.module('eolinker.directive')

    .directive("wangEditor", editorFn);

    editorFn.$inject = ['$timeout', '$filter']

    function editorFn($timeout, $filter) {

        return {
            restrict: 'AE',
            require: '?ngModel', //ng-model绑定wangEditor初始化数据
            link: function($scope, element, attrs, ngModel) {
                var token = {
                    uptoken: '',
                    key: ''
                };
                var timer = null;

                function printLog(title, info) {
                    window.console && console.log(title, info);
                }

                var textarea = !!attrs.editId ? document.getElementById(attrs.editId) : document.getElementById('editor-js');
                var editor = new wangEditor(textarea); //初始化wangEditor
                editor.config.menus = [
                    'source',
                    '|',
                    'bold',
                    'underline',
                    'italic',
                    'strikethrough',
                    'eraser',
                    //'forecolor',
                    //'bgcolor',
                    '|',
                    'quote',
                    //'fontfamily',
                    'fontsize',
                    'head',
                    'unorderlist',
                    'orderlist',
                    'alignleft',
                    'aligncenter',
                    'alignright',
                    '|',
                    'link',
                    'unlink',
                    'table',
                    '|',
                    // 'img',
                    'insertcode',
                    '|',
                    'undo',
                    'redo'
                ];
                editor.config.menuFixed = false;
                editor.create();

                /**
                 * @function [页面更改消除wangEditor]
                 */
                $scope.$on('$stateChangeStart', function() { 
                    editor.destroy();
                })
                if (ngModel) {

                    /**
                     * @function [ngModel.$render ng-model值发生变化时执行函数]
                     */
                    ngModel.$render = function() { 
                        try {
                            if (!!ngModel.$viewValue) {
                                editor.$txt.html($filter('XssFilter')(ngModel.$viewValue));
                            } else {
                                ngModel.$setViewValue("");
                            }
                        } catch (e) {

                        }
                    };

                    /**
                     * @function [wangEditor 内容更改执行功能函数]
                     */
                    editor.onchange = function() { 
                        timer = $timeout(function() {
                            ngModel.$setViewValue(editor.$txt.html());
                        }, 0, true)
                    };
                }

                /**
                 * @function [页面更改消除计时器]
                 */
                $scope.$on('$destroy', function() { 
                    if (timer) {
                        $timeout.cancel(timer);
                    }
                });

                /**
                 * @function [重置wangEditor]
                 */
                $scope.$on('$resetWangEditor', function() { 
                    if (editor) {
                        editor.$txt.html('');
                    }
                });
            }
        }

    };

})();
