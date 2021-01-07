# ![Version](https://img.shields.io/badge/version-0.0.5-green.svg)

## 结构
* dist - 编译后的目录(js)
* node_modules - npm包目录
* src - 源代码
  * dp - 设计模式
    * cor - 责任链
  * io - io相关
    * os - 系统io
  * main - 入口
    * version - 修改版本(README.md\package-lock.json\package.json)
  * object - 对象相关
    * id-generator-base - id生成器接口
  * plugin - 插件(第三方)
    * db - 数据库相关
      * mongo - mongodb相关
        * id-generator - 用mongo.ObjectID实现IDGeneratorBase
        * ... - mongodb CRUD