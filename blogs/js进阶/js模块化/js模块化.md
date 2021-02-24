---
title: 模块化规范
date: 2020-12-08
sidebar: "auto"
categories:
  - 数组
tags:
  - 模块化
  - js
publish: True
---

# 模块化规范

## CommonJS

### 规范

#### 说明

- 每个文件都可以当作一个模块
- 服务器端：模块的加载是运行时同步加载的（阻塞）
- 在浏览器端：模块需要提前编译打包处理(等待时间长 用户体验差)

#### 基本语法

- 暴露模块

  - module.exports = value
  - exports.xxx = value
  - 问题：暴露的模块到底是什么？---exports 对象（exports 默认为{}）

- 引入模块

  - ​ require(xxx)

    ​ 第三方模块：xxx 为模块名

    ​ 自定义模块：xxx 为模块文件路径

### 实现

#### 服务器端实现---node.js

#### 浏览器端实现 ---Browserify

## AMD

### 规范

#### 说明

- 专门用于浏览器端，模块加载是异步的
- https://github.com/amdjs/amdjs-api/wiki/AMD
- Asynchronous Module Definition（异步模块定义）

#### 基本语法

- 定义暴露模块

  - 定义没有依赖的模块

    ```js
    define(function() {
      return 模块;
    });
    ```

  - 定义有依赖的模块

    ```js
    define(["module1", "module2"], function(m1, m2) {
      return 模块;
    });
    ```

* 引入使用模块

  ```js
  require(["module1", "module2"], function(m1, m2) {
    使用m1 / m2;
  });
  ```

### 实现（浏览器端）

- Require.js
- https://requirejs.org/
- https://github.com/requirejs/requirejs

## CMD（不重要）

### 规范

#### 说明

- Common Module Definition(通用模块定义)
- https://github.com/seajs/seajs/issues/242
- 专门用于浏览器端，模块加载是异步的
- 模块使用时才会加载执行

#### 基本语法

- 定义暴露模块

  - 定义没有依赖的模块

  ```javascript
  define(function(require, exports, module) {
    exports.xxx = value;
    module.exports = value;
  });
  ```

  - 定义有依赖的模块

  ```js
  define(function(require, exports, module) {
    //引入依赖模块（同步）
    var module2 = require("./module2");
    //引入依赖模块（异步）
    require.async("./module3", function(m3) {});
    //暴露模块
    exports.xxx = value;
  });
  ```

- 引入使用模块

  ```js
  define(function(require) {
    let m1 = require("./module1");
    let m4 = require("./module4");
    m1.show();
    m4.show();
  });
  ```

### 实现（浏览器端）

- #### Sea.js（已经被出售）

## ES6

### 规范

#### 说明

- 依赖模块需要编译打包处理

#### 语法

- 导出模块：export
- 引入模块：import

### 实现(浏览器端)

- 使用 Babel 将 ES6 编译为 ES5 代码
- 使用 Browserify 编译打包 js

### ES6-Babel-Browserify 具体使用教程：

1. 定义 package.json 文件

   ```json
   {
     "name": "es6_babel-browserify",
     "version": "1.0.0"
   }
   ```

2. 安装 babel-cli,babel-preset-es2015 和 browserify <!--cli:command line interface-->

   ```sh
   npm install babel-cli browserify -g
   npm install babel-preset-es2015 --save-dev
   preset 预设
   ```

3. 定义.babelrc 文件 rc---run control

   ```json
   {
     "presets": ["es2015"]
   }
   ```

4. 编码

   - <u>js/src/module1.js</u>

     ```js
     // 暴露模块 分别暴露
     export function foo() {
       console.log("foo() module1");
     }

     export function bar() {
       console.log("bar() module1");
     }
     export let arr = [1, 23, 5, 6, 88];
     ```

   - <u>js/src/module2.js</u>

     ```js
     // 统一暴露
     function fun() {
       console.log("fun() module2");
     }
     function fun2() {
       console.log("fun2() module2");
     }
     export { fun, fun2 };
     ```

5) 编译

   - 使用 Babel 将 ES6 编译为 ES5 代码（但包含 CommonJS 语法）：

     ```
     babel js/src -d js/dist
     ```

   - 使用 Browserify 编译 js：

     ```
     browserify js/dist/main.js -o js/dist/bundle.js
     ```

6) 页面中引入测试

   ```js
   <script src="js/dist/bundle.js"></script>
   ```

7)
