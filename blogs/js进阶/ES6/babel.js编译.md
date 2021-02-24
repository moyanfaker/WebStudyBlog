---
title: babel.js编译
date: 2020-12-14
sidebar: "auto"
categories:
  - ES6
tags:
  - Babel
  - js
publish: True
---

# babel.js 编译

## 方式 1--引入 JS 文件（知道有就行 糊弄人用的）

1.引入 browser

2.type="text/babel"

```js
<script src="browser.min.js" charset ="utf-8"></script>
  <script type = "text/babel">
    let a = 1;
    alert(a);
  </script>
```

## 方式 2---编译 JS 文件

1.安装 Node.js、初始化项目

> npm init -y

2.安装 babel-cli

> npm i @babel/core@babel/cli@babel/preset-env -D
>
> npm i @babel/polyfill-S <!--添加该行可以兼容ie7以下-->

3.在 package.json 中添加执行脚本

```json
"scripts":{
"build":"babel src -d dest"
}
```

4.添加.babelrc 配置文件

```json
{
  "presets": ["@babel/preset-env"]
}
```

5.执行编译

> npm run build
