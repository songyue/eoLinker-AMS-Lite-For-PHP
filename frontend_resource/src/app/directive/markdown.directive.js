(function() {
    "use strict";
    /**
     * @Author   广州银云信息科技有限公司
     * @function [markdown指令js]
     * @version  3.0.2
     * @service  $timeout [注入$timeout服务]
     * @param    resultHtml [markdown编译结果存储位置]
     */
    angular.module('eolinker.directive')

    .directive("markdown", editorFn);

    editorFn.$inject = ['$timeout']

    function editorFn($timeout) {

        return {
            restrict: 'AE',
            require: '?ngModel', //ng-model绑定markdown初始化数据
            scope: {
                resultHtml: '='
            },
            link: function($scope, element, attrs, ngModel) {
                var textarea = !!attrs.editId ? attrs.editId : 'editormd-js';
                var editor = null;
                var timer = null;

                /**
                 * @function [初始化markdown]
                 */
                $scope.$on('$changeNoteType', function(e, attr) { 
                    if (editor == null) {
                        editor = editormd(textarea, {
                            height: 445,
                            saveHTMLToTextarea: true,
                            autoFocus: false,
                            placeholder: '',
                            toolbarIcons: function() { //设置markdown导航栏标签功能
                                // Or return editormd.toolbarModes[name]; // full, simple, mini
                                // Using "||" set icons align right.
                                return ["undo", "redo", "|",
                                    "bold", "del", "italic", "quote", "|",
                                    "h1", "h2", "h3", "h4", "h5", "h6", "|",
                                    "list-ul", "list-ol", "|",
                                    "link", "code", "table", "|",
                                    "watch"
                                ]
                            },
                            path: "./libs/editor.md/lib/", // Autoload modules mode, codemirror, marked... dependents libs path
                            imageUpload: true,
                            imageFormats: ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
                            imageUploadURL: "",
                            onload: function() { //markdown初始化加载重置内容
                                try {
                                    if (!!ngModel.$viewValue) {
                                        editor.setMarkdown(ngModel.$viewValue);
                                    }
                                } catch (e) {

                                }
                            },
                            onchange: function() { //markdown内容改变执行函数
                                timer = $timeout(function() {
                                    //editor.getMarkdown();       // 获取 Markdown 源码
                                    //editor.getHTML();           // 获取 Textarea 保存的 HTML 源码
                                    //editor.getPreviewedHTML();  // 获取预览窗口里的 HTML，在开启 watch 且没有开启 saveHTMLToTextarea 时使用
                                    $scope.resultHtml = editor.getPreviewedHTML();
                                    ngModel.$setViewValue(editor.getMarkdown());
                                }, 0, true)
                            }
                        });
                    }
                })
                
                /**
                 * @function [重置markdown]
                 */
                $scope.$on('$resetMarkdown', function() { 
                    if (editor) {
                        editor.setMarkdown('');
                    }
                });

                /**
                 * @function [页面更改消除计时器]
                 */
                $scope.$on('$destroy', function() { 
                    if (timer) {
                        $timeout.cancel(timer);
                    }
                });
            }
        }

    };

})();
