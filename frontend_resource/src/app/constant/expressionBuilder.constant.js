(function() {
    'use strict';
    /**
     * @Author   广州银云信息科技有限公司
     * @function 表达式构造器相关常量集
     * @version  3.0.2
     */
    angular
        .module('eolinker.constant')
        .constant('EXPRESSION_BUILDER_CONSTANT', {
            CIPHER: [
                'SHA1',
                'SHA224',
                'SHA256',
                'SHA384',
                'SHA512'
            ],
            OUTPUT: [
                'Base64',
                'Hex'
            ],
            QUOTES: [
                '"',
                "`"
            ]
        })
})();
