<?php

/**
 * @name eolinker ams open source，eolinker开源版本
 * @link https://www.eolinker.com/
 * @package eolinker
 * @author www.eolinker.com 广州银云信息科技有限公司 2015-2017
 * eoLinker是目前全球领先、国内最大的在线API接口管理平台，提供自动生成API文档、API自动化测试、Mock测试、团队协作等功能，旨在解决由于前后端分离导致的开发效率低下问题。
 * 如在使用的过程中有任何问题，欢迎加入用户讨论群进行反馈，我们将会以最快的速度，最好的服务态度为您解决问题。
 *
 * eoLinker AMS开源版的开源协议遵循Apache License 2.0，如需获取最新的eolinker开源版以及相关资讯，请访问:https://www.eolinker.com/#/os/download
 *
 * 官方网站：https://www.eolinker.com/
 * 官方博客以及社区：http://blog.eolinker.com/
 * 使用教程以及帮助：http://help.eolinker.com/
 * 商务合作邮箱：market@eolinker.com
 * 用户讨论QQ群：284421832
 */
class ImportModule
{
    function __construct()
    {
        @session_start();
    }

    /**
     * 导入eolinker导出的Json格式数据
     * @param $data string 从eolinker导出的Json格式数据
     * @return bool
     */
    public function eoapiImport(&$data)
    {
        $dao = new ImportDao;
        return $dao->importEoapi($data, $_SESSION['userID']);
    }

    /**
     * 导入DHC
     * @param $data string 从DHC导出的Json格式数据
     * @return bool
     */
    public function importDHC(&$data)
    {
        try {
            $projectInfo = array('projectName' => $data['nodes'][0]['name'], 'projectType' => 0, 'projectVersion' => 1.0);

            //生成分组信息
            $groupInfoList[] = array('groupName' => 'DHC导入', 'id' => $data['nodes'][0]['id']);
            if (is_array($data['nodes'])) {
                foreach ($data['nodes'] as $element) {
                    if ($element['type'] == 'Service') {
                        $groupInfoList[] = array('groupName' => $element['name'], 'id' => $element['id']);
                    }
                }
            }

            if (is_array($groupInfoList)) {
                foreach ($groupInfoList as &$groupInfo) {
                    $apiList = array();
                    if (is_array($data['nodes'])) {
                        foreach ($data['nodes'] as $element) {
                            if ($element['type'] != 'Request' || $element['parentId'] != $groupInfo['id']) {
                                continue;
                            }

                            $apiInfo['baseInfo']['apiName'] = $element['name'];
                            $apiInfo['baseInfo']['apiURI'] = $element['uri']['path'];
                            $apiInfo['baseInfo']['apiProtocol'] = ($element['uri']['scheme']['name'] == 'http') ? 0 : 1;
                            $apiInfo['baseInfo']['apiStatus'] = 0;
                            $apiInfo['baseInfo']['starred'] = 0;
                            $apiInfo['baseInfo']['apiSuccessMock'] = '';
                            $apiInfo['baseInfo']['apiFailureMock'] = '';
                            $apiInfo['baseInfo']['apiRequestParamType'] = 0;
                            $apiInfo['baseInfo']['apiRequestRaw'] = '';
                            $apiInfo['baseInfo']['apiNoteType'] = 0;
                            $apiInfo['baseInfo']['apiNote'] = '';
                            $apiInfo['baseInfo']['apiNoteRaw'] = '';
                            $apiInfo['baseInfo']['apiUpdateTime'] = date("Y-m-d H:i:s", time());
                            switch ($element['method']['name']) {
                                case 'POST' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 0;
                                    break;
                                case 'GET' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 1;
                                    break;
                                case 'PUT' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 2;
                                    break;
                                case 'DELETE' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 3;
                                    break;
                                case 'HEAD' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 4;
                                    break;
                                case 'OPTIONS' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 5;
                                    break;
                                case 'PATCH' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 6;
                                    break;
                            }

                            $headerInfo = array();

                            if (is_array($element['headers'])) {
                                foreach ($element['headers'] as $header) {
                                    $headerInfo[] = array('headerName' => $header['name'], 'headerValue' => $header['value']);
                                }
                            }
                            $apiInfo['headerInfo'] = $headerInfo;
                            unset($headerInfo);

                            $apiRequestParam = array();
                            if ($element['method']['requestBody']) {
                                $items = $element['body']['formBody']['items'];
                                if (is_array($items)) {
                                    foreach ($items as $item) {
                                        $param['paramKey'] = $item['name'];
                                        $param['paramValue'] = $item['value'];
                                        $param['paramType'] = ($item['type'] == 'Text') ? 0 : 1;
                                        $param['paramNotNull'] = $item['enabled'] ? 0 : 1;
                                        $param['paramName'] = '';
                                        $param['paramLimit'] = '';
                                        $param['paramValueList'] = array();
                                        $apiRequestParam[] = $param;
                                        unset($param);
                                    }
                                }
                            }
                            $apiInfo['requestInfo'] = $apiRequestParam;
                            unset($apiRequestParam);
                            $apiInfo['resultInfo'] = array();

                            $apiList[] = $apiInfo;
                            unset($apiInfo);
                        }
                    }
                    $groupInfo['apiList'] = $apiList;
                    unset($apiList);
                }
            }
            $dao = new ImportDao;
            return $dao->importOther($projectInfo, $groupInfoList, $_SESSION['userID']);
        } catch (\PDOException $e) {
            return FALSE;
        }
    }

    /**
     * 导入V1版本postman
     * @param $data string 从Postman V1版本导出的Json格式数据
     * @return bool
     */
    public function importPostmanV1(&$data)
    {
        try {
            $projectInfo = array('projectName' => $data['name'], 'projectType' => 0, 'projectVersion' => 1.0);

            $groupInfoList[] = array('groupName' => 'PostMan导入');

            $apiList = array();
            if (is_array($groupInfoList)) {
                foreach ($groupInfoList as &$groupInfo) {
                    if (is_array($data['requests'])) {
                        foreach ($data['requests'] as $request) {
                            $apiInfo['baseInfo']['apiName'] = $request['name'];
                            $apiInfo['baseInfo']['apiURI'] = $request['url'];
                            $apiInfo['baseInfo']['apiProtocol'] = (strpos($request['url'], 'https') !== 0) ? 0 : 1;
                            $apiInfo['baseInfo']['apiStatus'] = 0;
                            $apiInfo['baseInfo']['starred'] = 0;
                            $apiInfo['baseInfo']['apiSuccessMock'] = '';
                            $apiInfo['baseInfo']['apiFailureMock'] = '';
                            $apiInfo['baseInfo']['apiRequestParamType'] = 0;
                            $apiInfo['baseInfo']['apiRequestRaw'] = '';
                            $apiInfo['baseInfo']['apiNoteType'] = 0;
                            $apiInfo['baseInfo']['apiNote'] = '';
                            $apiInfo['baseInfo']['apiNoteRaw'] = '';
                            $apiInfo['baseInfo']['apiUpdateTime'] = date("Y-m-d H:i:s", time());
                            switch ($request['method']) {
                                case 'POST' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 0;
                                    break;
                                case 'GET' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 1;
                                    break;
                                case 'PUT' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 2;
                                    break;
                                case 'DELETE' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 3;
                                    break;
                                case 'HEAD' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 4;
                                    break;
                                case 'OPTIONS' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 5;
                                    break;
                                case 'PATCH' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 6;
                                    break;
                            }

                            $headerInfo = array();
                            $header_rows = array_filter(explode(chr(10), $request['headers']), "trim");

                            if (is_array($header_rows)) {
                                foreach ($header_rows as $row) {
                                    $keylen = strpos($row, ':');
                                    if ($keylen) {
                                        $headerInfo[] = array('headerName' => substr($row, 0, $keylen), 'headerValue' => trim(substr($row, $keylen + 1)));
                                    }
                                }
                            }
                            $apiInfo['headerInfo'] = $headerInfo;
                            unset($headerInfo);

                            $apiRequestParam = array();
                            $items = $request['data'];
                            if (is_array($items)) {
                                foreach ($items as $item) {
                                    $param['paramKey'] = $item['key'];
                                    $param['paramValue'] = $item['value'];
                                    $param['paramType'] = ($item['type'] == 'text') ? 0 : 1;
                                    $param['paramNotNull'] = $item['enabled'] ? 0 : 1;
                                    $param['paramName'] = '';
                                    $param['paramLimit'] = '';
                                    $param['paramValueList'] = array();
                                    $apiRequestParam[] = $param;
                                    unset($param);
                                }
                            }
                            $apiInfo['requestInfo'] = $apiRequestParam;
                            unset($apiRequestParam);
                            $apiInfo['resultInfo'] = array();

                            $apiList[] = $apiInfo;
                            unset($apiInfo);
                        }
                    }
                    $groupInfo['apiList'] = $apiList;
                    unset($apiList);
                }
            }
            $dao = new ImportDao;
            return $dao->importOther($projectInfo, $groupInfoList, $_SESSION['userID']);
        } catch (\PDOException $e) {
            return FALSE;
        }
    }

    /**
     * 导入V2版本postman
     * @param $data string 从Postman V2版本导出的Json格式数据
     * @return bool
     */
    public function importPostmanV2(&$data)
    {
        try {
            $projectInfo = array('projectName' => $data['info']['name'], 'projectType' => 0, 'projectVersion' => 1.0);

            $groupInfoList[] = array('groupName' => 'PostMan导入');

            $apiList = array();

            if (is_array($groupInfoList)) {
                foreach ($groupInfoList as &$groupInfo) {
                    if (is_array($data['item'])) {
                        foreach ($data['item'] as $item) {
                            $apiInfo['baseInfo']['apiName'] = $item['name'];
                            $apiInfo['baseInfo']['apiURI'] = $item['request']['url'];
                            $apiInfo['baseInfo']['apiProtocol'] = (strpos($item['request']['url'], 'https') !== 0) ? 0 : 1;
                            $apiInfo['baseInfo']['apiStatus'] = 0;
                            $apiInfo['baseInfo']['starred'] = 0;
                            $apiInfo['baseInfo']['apiSuccessMock'] = '';
                            $apiInfo['baseInfo']['apiFailureMock'] = '';
                            $apiInfo['baseInfo']['apiRequestParamType'] = 0;
                            $apiInfo['baseInfo']['apiRequestRaw'] = '';
                            $apiInfo['baseInfo']['apiNoteType'] = 0;
                            $apiInfo['baseInfo']['apiNote'] = '';
                            $apiInfo['baseInfo']['apiNoteRaw'] = '';
                            $apiInfo['baseInfo']['apiUpdateTime'] = date("Y-m-d H:i:s", time());
                            switch ($item['request']['method']) {
                                case 'POST' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 0;
                                    break;
                                case 'GET' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 1;
                                    break;
                                case 'PUT' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 2;
                                    break;
                                case 'DELETE' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 3;
                                    break;
                                case 'HEAD' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 4;
                                    break;
                                case 'OPTIONS' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 5;
                                    break;
                                case 'PATCH' :
                                    $apiInfo['baseInfo']['apiRequestType'] = 6;
                                    break;
                            }

                            $headerInfo = array();
                            if (is_array($item['request']['header'])) {
                                foreach ($item['request']['header'] as $header) {
                                    $headerInfo[] = array('headerName' => $header['key'], 'headerValue' => $header['value']);
                                }
                            }
                            $apiInfo['headerInfo'] = $headerInfo;
                            unset($headerInfo);

                            $apiRequestParam = array();
                            if ($item['request']['body']['mode'] == 'formdata') {
                                $parameters = $item['request']['body']['formdata'];
                                if (is_array($parameters)) {
                                    foreach ($parameters as $parameter) {
                                        $param['paramKey'] = $parameter['key'];
                                        $param['paramValue'] = $parameter['value'];
                                        $param['paramType'] = ($parameter['type'] == 'text') ? 0 : 1;
                                        $param['paramNotNull'] = $parameter['enabled'] ? 0 : 1;
                                        $param['paramName'] = '';
                                        $param['paramLimit'] = '';
                                        $param['paramValueList'] = array();
                                        $apiRequestParam[] = $param;
                                        unset($param);
                                    }
                                }
                            }
                            $apiInfo['requestInfo'] = $apiRequestParam;
                            unset($apiRequestParam);

                            $apiInfo['resultInfo'] = array();

                            $apiList[] = $apiInfo;
                            unset($apiInfo);
                        }
                    }
                    $groupInfo['apiList'] = $apiList;
                    unset($apiList);
                }
            }
            $dao = new ImportDao;
            return $dao->importOther($projectInfo, $groupInfoList, $_SESSION['userID']);
        } catch (\PDOException $e) {
            return FALSE;
        }
    }

    /**
     * 导入swagger
     * @param string $content 内容
     * @return bool
     */
    public function importSwagger(&$content)
    {
        $user_id = $_SESSION['userID'];
        $swagger = json_decode($content, TRUE);
        $project_info = $swagger['info'];
        // 项目类型默认web
        $project_type = '0';
        // 新建一个默认的状态码分组
        $group_info_list[] = array('groupName' => '默认分组');
        $request_type = array(
            'POST' => '0',
            'GET' => '1',
            'PUT' => '2',
            'DELETE' => '3',
            'HEAD' => '4',
            'OPTIONS' => '5',
            'PATCH' => '6'
        );
        // 请求协议数组
        $protocol = array(
            'HTTP' => 0,
            'HTTPS' => 1
        );
        // 请求参数类型数组
        $param_type = array(
            'string' => '0',
            'file' => '1',
            'json' => '2',
            'int' => '3',
            'float' => '4',
            'double' => '5',
            'date' => '6',
            'datetime' => '7',
            'boolean' => '8',
            'byte' => '9',
            'short' => '10',
            'long' => '11',
            'array' => '12',
            'object' => '13',
            'number' => '14'
        );
        // 获取请求协议
        $api_protocol = $protocol[strtoupper($swagger['schemes'][0])];
        if (empty($api_protocol)) {
            $api_protocol = 1;
        }
        // 如果项目描述为空，默认为title
        if (empty($project_info['description'])) {
            $project_info['description'] = $project_info['title'];
        }
        // 项目信息
        $project_info = array(
            'projectName' => $project_info['title'],
            'projectType' => $project_type,
            'projectVersion' => $project_info['version'],
            'projectDesc' => $project_info['description']
        );
        $apiList = $swagger['paths'];
        $api_list = array();
        if (is_array($group_info_list)) {
            foreach ($group_info_list as &$group_info) {
                if (is_array($apiList)) {
                    // 拆分多条api接口信息
                    foreach ($apiList as $api_uri => $api_info_list) {
                        // 拆分详细api接口信息
                        foreach ($api_info_list as $api_request_type => $api_info) {
                            if (empty($api_info['summary'])) {
                                // 如果接口名不存在跳过
                                $api_info['summary'] = $api_info['operationId'];
                            }
                            // 获取接口名称
                            $apiInfo['baseInfo']['apiName'] = $api_info['summary'];
                            // 获取请求路径
                            // if(strpos($uri, '{'))
                            // {
                            // $api_uri = preg_replace('/\{.*\}/', $api_info['operationId'], $uri);
                            // }
                            // else
                            // {
                            // $api_uri = $uri;
                            // }
                            // 获取路径
                            $apiInfo['baseInfo']['apiURI'] = $api_uri;
                            // 接口状态默认启用
                            $apiInfo['baseInfo']['apiStatus'] = 0;
                            // 接口请求参数的类型
                            $apiInfo['baseInfo']['apiRequestParamType'] = 0;
                            // 星标状态
                            $apiInfo['baseInfo']['starred'] = 0;
                            // 接口备注的类型
                            $apiInfo['baseInfo']['apiNoteType'] = 0;
                            // 获取请求方式
                            $apiInfo['baseInfo']['apiRequestType'] = $request_type[strtoupper($api_request_type)];
                            // 请求头部
                            $apiInfo['headerInfo'] = array();
                            if ($api_info['consumes']) {
                                for ($i = 0; $i < count($api_info['consumes']); $i++) {
                                    $apiInfo['headerInfo'][$i] = array(
                                        'headerName' => 'Content-Type',
                                        'headerValue' => $api_info['consumes'][$i]
                                    );
                                }
                            }
                            if ($api_info['produces']) {
                                for ($i = 0; $i < count($api_info['produces']); $i++) {
                                    $apiInfo['headerInfo'][] = array(
                                        'headerName' => 'Accept',
                                        'headerValue' => $api_info['produces'][$i]
                                    );
                                }
                            }
                            // 获取请求参数
                            $apiInfo['requestInfo'] = array();
                            if ($api_info['parameters']) {
                                $i = 0;
                                foreach ($api_info['parameters'] as $param) {
                                    // 获取请求参数名称
                                    $apiInfo['requestInfo'][$i]['paramKey'] = $param['name'];
                                    // 获取请求参数类型
                                    switch ($param['type']) {
                                        case "integer" :
                                            $apiInfo['requestInfo'][$i]['paramType'] = $param_type['int'];
                                            break;
                                        case "string" :
                                            $apiInfo['requestInfo'][$i]['paramType'] = $param_type['string'];
                                            break;
                                        case 'long' :
                                            $apiInfo['requestInfo'][$i]['paramType'] = $param_type['long'];
                                            break;
                                        case 'float' :
                                            $apiInfo['requestInfo'][$i]['paramType'] = $param_type['float'];
                                            break;
                                        case 'double' :
                                            $apiInfo['requestInfo'][$i]['paramType'] = $param_type['double'];
                                            break;
                                        case 'byte' :
                                            $apiInfo['requestInfo'][$i]['paramType'] = $param_type['byte'];
                                            break;
                                        case 'file' :
                                            $apiInfo['requestInfo'][$i]['paramType'] = $param_type['file'];
                                            break;
                                        case 'date' :
                                            $apiInfo['requestInfo'][$i]['paramType'] = $param_type['date'];
                                            break;
                                        case 'dateTime' :
                                            $apiInfo['requestInfo'][$i]['paramType'] = $param_type['dateTime'];
                                            break;
                                        case 'boolean' :
                                            $apiInfo['requestInfo'][$i]['paramType'] = $param_type['boolean'];
                                            break;
                                        case 'array' :
                                            $apiInfo['requestInfo'][$i]['paramType'] = $param_type['array'];
                                            break;
                                        case 'json' :
                                            $apiInfo['requestInfo'][$i]['paramType'] = $param_type['json'];
                                            break;
                                        case 'object' :
                                            $apiInfo['requestInfo'][$i]['paramType'] = $param_type['object'];
                                            break;
                                        case 'number' :
                                            $apiInfo['requestInfo'][$i]['paramType'] = $param_type['number'];
                                            break;
                                        default :
                                            $apiInfo['requestInfo'][$i]['paramType'] = $param_type['string'];
                                    }
                                    // 获取参数说明
                                    $apiInfo['requestInfo'][$i]['paramName'] = $param['description'];
                                    // 获取是否可以为空
                                    $apiInfo['requestInfo'][$i]['paramNotNull'] = $param['required'] ? 0 : 1;
                                    // 设置参数值示例
                                    $apiInfo['requestInfo'][$i]['paramValue'] = '';
                                    ++$i;
                                }
                            }

                            // 返回结果
                            $apiInfo['resultInfo'] = array();
                            if ($api_info['responses']) {
                                $k = 0;
                                foreach ($api_info['responses'] as $paramKey => $respon) {
                                    $apiInfo['resultInfo'][$k]['paramType'] = '';
                                    // 获取返回参数类型
                                    switch ($respon['schema']['type']) {
                                        case "integer" :
                                            $apiInfo['resultInfo'][$k]['paramType'] = $param_type['int'];
                                            break;
                                        case "string" :
                                            $apiInfo['resultInfo'][$k]['paramType'] = $param_type['string'];
                                            break;
                                        case 'long' :
                                            $apiInfo['resultInfo'][$k]['paramType'] = $param_type['long'];
                                            break;
                                        case 'float' :
                                            $apiInfo['resultInfo'][$k]['paramType'] = $param_type['float'];
                                            break;
                                        case 'double' :
                                            $apiInfo['resultInfo'][$k]['paramType'] = $param_type['double'];
                                            break;
                                        case 'byte' :
                                            $apiInfo['resultInfo'][$k]['paramType'] = $param_type['byte'];
                                            break;
                                        case 'file' :
                                            $apiInfo['resultInfo'][$k]['paramType'] = $param_type['file'];
                                            break;
                                        case 'date' :
                                            $apiInfo['resultInfo'][$k]['paramType'] = $param_type['date'];
                                            break;
                                        case 'dateTime' :
                                            $apiInfo['resultInfo'][$k]['paramType'] = $param_type['dateTime'];
                                            break;
                                        case 'boolean' :
                                            $apiInfo['resultInfo'][$k]['paramType'] = $param_type['boolean'];
                                            break;
                                        case 'array' :
                                            $apiInfo['resultInfo'][$k]['paramType'] = $param_type['array'];
                                            break;
                                        case 'json' :
                                            $apiInfo['resultInfo'][$k]['paramType'] = $param_type['json'];
                                            break;
                                        case 'object' :
                                            $apiInfo['resultInfo'][$k]['paramType'] = $param_type['object'];
                                            break;
                                        case 'number' :
                                            $apiInfo['resultInfo'][$k]['paramType'] = $param_type['number'];
                                            break;
                                        default :
                                            $apiInfo['resultInfo'][$k]['paramType'] = $param_type['string'];
                                    }
                                    // 获取返回参数名
                                    $apiInfo['resultInfo'][$k]['paramKey'] = $paramKey;
                                    // 获取返回参数说明
                                    $apiInfo['resultInfo'][$k]['paramName'] = $respon['description'];
                                    // 获取返回值
                                    $apiInfo['resultInfo'][$k]['paramNotNull'] = '0';
                                    ++$k;
                                }
                            }
                            $apiInfo['baseInfo']['apiSuccessMock'] = '';
                            $apiInfo['baseInfo']['apiFailureMock'] = '';
                            $apiInfo['baseInfo']['apiNoteRaw'] = '';
                            $apiInfo['baseInfo']['apiNote'] = '';
                            $apiInfo['baseInfo']['apiRequestRaw'] = '';
                            $apiInfo['baseInfo']['mockRule'] = '';
                            $apiInfo['baseInfo']['mockResult'] = '';
                            $apiInfo['baseInfo']['apiProtocol'] = $api_protocol;
                            $apiInfo['baseInfo']['apiUpdateTime'] = date('Y-m-d H:i:s', time());

                            $api_list[] = $apiInfo;
                            unset($apiInfo);
                        }
                    }
                }
                $group_info['apiList'] = $api_list;
                unset($api_list);
            }
        }

        $dao = new ImportDao;
        $result = $dao->importOther($project_info, $group_info_list, $user_id);
        if ($result) {
            return TRUE;
        } else {
            return FALSE;
        }
    }

    /**
     * 导入RAP
     * @param $data
     * @return bool
     */
    public function importRAP(&$data)
    {
        $user_id = $_SESSION['userID'];
        $param_type = array('string' => '0', 'file' => '1', 'json' => '2', 'int' => '3', 'float' => '4', 'double' => '5', 'date' => '6', 'datetime' => '7', 'boolean' => '8', 'byte' => '9', 'short' => '10', 'long' => '11', 'array' => '12', 'object' => '13', 'number' => '14');
        try {
            $project_info = array(
                'projectName' => $data['name'],
                'projectType' => 0,
                'projectVersion' => 1.0
            );

            $group_info_list = array();

            foreach ($data['moduleList'] as $module) {
                $group_info = array(
                    'groupName' => $module['name'],
                    'apiList' => array()
                );

                foreach ($module['pageList'] as $pageList) {
                    $api_list = array();
                    foreach ($pageList['actionList'] as $action) {
                        $api_info = array();
                        $api_info['baseInfo']['apiName'] = $action['name'];
                        $api_info['baseInfo']['apiURI'] = stripcslashes($action['requestUrl']);
                        $api_info['baseInfo']['apiProtocol'] = 1;
                        $api_info['baseInfo']['apiStatus'] = 0;
                        $api_info['baseInfo']['starred'] = 0;
                        $api_info['baseInfo']['apiSuccessMock'] = $action['responseTemplate'];
                        $api_info['baseInfo']['apiFailureMock'] = '';
                        $api_info['baseInfo']['apiRequestParamType'] = 0;
                        $api_info['baseInfo']['apiRequestRaw'] = '';
                        $api_info['baseInfo']['apiNoteType'] = 0;
                        $api_info['baseInfo']['apiNote'] = '&lt;p&gt;' . $action['description'] . '&lt;p&gt;';
                        $api_info['baseInfo']['apiNoteRaw'] = '';
                        $api_info['baseInfo']['apiUpdateTime'] = date("Y-m-d H:i:s", time());
                        switch ($action['requestType']) {
                            case '1' :
                                $api_info['baseInfo']['apiRequestType'] = 1;
                                //GET
                                break;
                            case '2' :
                                $api_info['baseInfo']['apiRequestType'] = 0;
                                //POST
                                break;
                            case '3' :
                                $api_info['baseInfo']['apiRequestType'] = 2;
                                //PUT
                                break;
                            case '4' :
                                $api_info['baseInfo']['apiRequestType'] = 3;
                                //DELETE
                                break;
                            default :
                                $api_info['baseInfo']['apiRequestType'] = 1;
                                //默认设置为GET
                                break;
                        }

                        $api_info['headerInfo'] = array();

                        $api_request_param = array();
                        foreach ($action['requestParameterList'] as $parameter) {
                            $param = array();
                            $param['paramKey'] = $parameter['identifier'];
                            $param['paramValue'] = $parameter['remark'];
                            //获取请求参数类型
                            switch ($parameter['dataType']) {
                                case "integer":
                                    $param['paramType'] = $param_type['int'];
                                    break;
                                case "string":
                                    $param['paramType'] = $param_type['string'];
                                    break;
                                case 'long':
                                    $param['paramType'] = $param_type['long'];
                                    break;
                                case 'float':
                                    $param['paramType'] = $param_type['float'];
                                    break;
                                case 'double':
                                    $param['paramType'] = $param_type['double'];
                                    break;
                                case 'byte':
                                    $param['paramType'] = $param_type['byte'];
                                    break;
                                case 'file':
                                    $param['paramType'] = $param_type['file'];
                                    break;
                                case 'date':
                                    $param['paramType'] = $param_type['date'];
                                    break;
                                case 'dateTime':
                                    $param['paramType'] = $param_type['dateTime'];
                                    break;
                                case 'boolean':
                                    $param['paramType'] = $param_type['boolean'];
                                    break;
                                case 'array':
                                    $param['paramType'] = $param_type['array'];
                                    break;
                                case 'json':
                                    $param['paramType'] = $param_type['json'];
                                    break;
                                case 'object':
                                    $param['paramType'] = $param_type['object'];
                                    break;
                                case 'number':
                                    $param['paramType'] = $param_type['number'];
                                    break;
                                default:
                                    $param['paramType'] = $param_type['array'];

                            }
                            $param['paramNotNull'] = 0;
                            $param['paramName'] = $parameter['name'];
                            $param['paramLimit'] = $parameter['dataType'];
                            $param['paramValueList'] = array();
                            foreach ($parameter['parameterList'] as $value) {
                                $param['paramValueList'][] = array(
                                    'value' => $value['identifier'],
                                    'valueDescription' => $value['name']
                                );
                            }
                            $api_request_param[] = $param;
                            unset($param);
                        }
                        $api_info['requestInfo'] = $api_request_param;
                        unset($api_request_param);

                        $api_result_param = array();
                        foreach ($action['responseParameterList'] as $parameter) {
                            $param['paramKey'] = $parameter['identifier'];
                            $param['paramNotNull'] = 0;
                            $param['paramName'] = $parameter['name'];
                            $param['paramValueList'] = array();
                            foreach ($parameter['parameterList'] as $value) {
                                $param['paramValueList'][] = array(
                                    'value' => $value['identifier'],
                                    'valueDescription' => $value['name']
                                );
                            }
                            //获取请求参数类型
                            switch ($parameter['dataType']) {
                                case "integer":
                                    $param['paramType'] = $param_type['int'];
                                    break;
                                case "string":
                                    $param['paramType'] = $param_type['string'];
                                    break;
                                case 'long':
                                    $param['paramType'] = $param_type['long'];
                                    break;
                                case 'float':
                                    $param['paramType'] = $param_type['float'];
                                    break;
                                case 'double':
                                    $param['paramType'] = $param_type['double'];
                                    break;
                                case 'byte':
                                    $param['paramType'] = $param_type['byte'];
                                    break;
                                case 'file':
                                    $param['paramType'] = $param_type['file'];
                                    break;
                                case 'date':
                                    $param['paramType'] = $param_type['date'];
                                    break;
                                case 'dateTime':
                                    $param['paramType'] = $param_type['dateTime'];
                                    break;
                                case 'boolean':
                                    $param['paramType'] = $param_type['boolean'];
                                    break;
                                case 'array':
                                    $param['paramType'] = $param_type['array'];
                                    break;
                                case 'json':
                                    $param['paramType'] = $param_type['json'];
                                    break;
                                case 'object':
                                    $param['paramType'] = $param_type['object'];
                                    break;
                                case 'number':
                                    $param['paramType'] = $param_type['number'];
                                    break;
                                default:
                                    $param['paramType'] = $param_type['array'];

                            }
                            $api_result_param[] = $param;
                            unset($param);
                        }
                        $api_info['resultInfo'] = $api_result_param;
                        unset($api_result_param);

                        $api_list[] = $api_info;
                        unset($api_info);
                    }
                    $group_info['apiList'] = array_merge($group_info['apiList'], $api_list);
                    unset($api_list);
                }
                $group_info_list[] = $group_info;
                unset($group_info);
            }
            $dao = new ImportDao();
            return $dao->importOther($project_info, $group_info_list, $user_id);
        } catch (\PDOException $e) {
            return FALSE;
        }
    }
}

?>