(function() {
    /**
     * @Author   广州银云信息科技有限公司
     * @function [全局navbar指令相关js]
     * @version  3.0.2
     * @service  $scope [注入作用域服务]
     * @service  NavbarService [注入NavbarService服务]
     */
     angular.module('eolinker')
     .component('eoNavbar1', {
        templateUrl: 'app/component/navbar/nav1/index.html',
        controller: navbar
    })

     navbar.$inject = ['$scope', 'NavbarService'];

     function navbar($scope, NavbarService) {
        var vm = this;
        vm.data = {
            service: NavbarService,
            info: {
                registerShow: allowRegister
            },
            fun: {
                init:null
            }
        }
        /**
         * @function [初始化功能函数，当路由改变时重新加载路由]
         */
        vm.data.fun.init = function(){
            vm.data.service.fun.$router();
            $scope.$on('$stateChangeSuccess', function() {
                vm.data.service.fun.$router();
            });
        }
        vm.data.fun.init();
    }

})();
