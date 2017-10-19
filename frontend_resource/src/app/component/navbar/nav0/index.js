(function() {
    /**
     * @Author   广州银云信息科技有限公司
     * @function [全局navbar指令相关js]
     * @version  3.0.2
     */
    angular.module('eolinker')
        .component('eoNavbar0', {
            templateUrl: 'app/component/navbar/nav0/index.html',
            controller: navbar
        })

    navbar.$inject = [];

    function navbar() {
        var vm = this;
    }

})();
