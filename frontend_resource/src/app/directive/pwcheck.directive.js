(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function {检测确认密码以及原密码是否相同指令js}
     * @version  3.0.2
     */
    angular.module('eolinker.directive')

    .directive('passwordConfirmDirective', [function() {
        return {
            restrict: 'A',
            require: "ngModel",
            link: function(scope, elem, attrs, ngModel) {
                var data = {
                    info:{
                        origin:elem.inheritedData("$formController")[attrs.passwordConfirmDirective]
                    },
                    fun: {
                        init: null, 
                        origin: null, 
                        current: null 
                    }
                }

                /**
                 * @function [当前密码监听函数]
                 * @param    {[type]}   _default [当前输入密码]
                 * @return   {[type]}            [当前输入密码]
                 */
                data.fun.current = function(_default) {
                    ngModel.$setValidity("passwordConfirmDirective", _default === data.info.origin.$viewValue);
                    return _default;
                }

                /**
                 * @function [原始密码监听函数]
                 * @param    {[type]}   _default [当前输入密码]
                 * @return   {[type]}            [当前输入密码]
                 */
                data.fun.origin = function(_default) {
                    ngModel.$setValidity("passwordConfirmDirective", _default === ngModel.$viewValue);
                    return _default;
                }

                /**
                 * @function [初始化功能函数]
                 */
                data.fun.init = (function() {
                    ngModel.$parsers.push(data.fun.current);
                    data.info.origin.$parsers.push(data.fun.origin);
                })()

            }
        };
    }]);
})();
