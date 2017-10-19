# eoLinker接口管理开源版本
eoLinker接口管理开源版本


```注意：3.x版本与2.x版本并不兼容，因此无法直接由2.x升级到3.x，也无法通过覆盖代码的方式进行升级，切勿随意尝试以防数据丢失```

```
如果需要进行数据的迁移，可以使用eoLinker接口管理系统中的【导出项目】功能
将项目导出为eoLinker专用格式（.export），然后在3.x版本中导入。
同时为了防止数据丢失，请在执行任何关键操作之前妥善备份数据库。
```
## 部署要求

* PHP 5.3+
* mysql  5.5+
* Apache / Nginx

## 安装
 [详细图文指南](https://www.eolinker.com/#/os/guide?point=require#require)


## 前端二次开发代码说明 
**如果无需进行二次开发，则可以完全忽略以下内容**

#### 快速开始
```bash
git clone https://github.com/eolinker/CHN-eoLinker-API-Management-System-OS-3.X/tree/master/frontend_resource
```
安装依赖
```bash
cd frontend_resource
#安装前端依赖
npm install
#安装运行依赖
bower install
```

#### 调试
开发模式
```bash
gulp serve 
````
编译模式（将项目文件输出为上线文件）
```bash
gulp build 
```
调试上线模式
```bash
gulp serve:dist 
```


#### 前端目录结构
##### Gulp
```
gulp
├─base.js |配置基本项目依赖
├─build.js |生成上线版本脚本
├─config.js |全局配置文件
└server.js |代理服务器/服务器启动脚本

#详细配置见文件注释
```

##### 框架目录

主要功能目录
```
eo-os
├─gulp |脚本管理
├─app.conf.json | Angular全部变量配置文件,通过[dev-config/prod-config任务编译]
├─config.rb |compass配置文件
├─config.js |全局配置文件
├─vendor.base.json   |前端启动依赖文件(打包会随源文件一同压缩)
├─vendor.json   |前端依赖库文件(通过Lazyload模块加载)
├─package.json |编译模块依赖文件以及项目配置--新增模块请注意加上 npm install --save 新安装模块
└bower.json   |前端依赖库json文件 bower install --save 新安装模块
```


##### 源文件

app目录主要文件
```
app
├─assets |存放静态文件
├─config|全局配置文件,包括路由配置模块routes,全局定义模块core,以及按需加载模块lazyload
├─directive |指令模块,页面所有的指令文件写在这里,模块位置为eo-shop(项目名).directive
├─service |服务模块,页面所有的服务文件写在这里,模块位置为eo-shop(项目名).service
├─filter |过滤器模块,页面所有的过滤器文件写在这里,模块位置为eo-shop(项目名).filter
├─constant |存放常量文件
├─resource |Api配置模块,全局的Api配置位置
├─app.module.js|全局模块依赖声明模块,如无需全局依赖更改,不要随意改动该文件内容.
├─app.conf.js |由app.conf.json编译而来的全局变量文件,配置当前开发模式DEV/PRODUCTION
├─vendor.js |前端依赖js库文件,随index.html注入文档
├─vendor.scss |前端依赖scss库文件,通过在index.scss中引入
└index.scss |全局的样式文件.


```
## 常见问题
## 关于我们
1. **eoLinker官方交流QQ群**： [284421832](http://shang.qq.com/wpa/qunwpa?idkey=208b23b73761039b9994d71378ccbf7c84c872d5577d557e45168b37fd290c12) 
2. **eolinker官网**：[eoLinker接口管理平台](https://www.eolinker.com/)

```线上以及开源的数据是可以互相导入导出的。```

## 证书
该开源网站由[eoLinker](https://www.eolinker.com/)提供技术支持，开源协议遵循[GNU General Public License v3.0](https://www.gnu.org/licenses/lgpl.html)

```
eoLinker开源版接口管理系统仅供用户下载试用、学习和交流，禁止一切公开使用于商业用途或者以eolinker开源版本为基础而开发的二次版本在互联网上流通。
一经发现违反上条规则，我们将立刻启用法律程序进行维权。
希望我们能够共同维护国内的互联网开源文明和正常商业秩序。
```
