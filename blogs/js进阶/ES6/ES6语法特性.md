---
title: ES6语法特性
date: 2020-12-15
sidebar: "auto"
categories:
  - ES6
tags:
  - 语法
  - js
publish: True
---

# ES6 语法特性

## 变量

### 新的声明方法

#### 1.重复声明

```javascript
var a = 12;
var a =  5;
var 重复声明 不能限制修改，函数级
```

#### 2 控制修改

```js
var GIT_HOST = 'github.com';
if(GIT_HOST = 'git')
```

#### 3.块级作用域

```javascript
let 防止重复声明，变量，块级
const 防止重复声明，常量，块级
```

```js和html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <script>
    window.onload = function () {
      let abtn = document.getElementsByTagName("input");

      //   for (let i = 0; i < abtn.length; i++) {
      //     abtn[i].onclick = function () {
      //       console.log(i);
      //     };
      //   }//0,1,2
      //   for (var i = 0; i < abtn.length; i++) {
      //     abtn[i].onclick = function () {
      //       console.log(i);
      //     };
      //   } // 3,3,3
      for (var i = 0; i < abtn.length; i++) {
        (function (i) {
          abtn[i].onclick = function () {
            console.log(i);
          };
        })(i); //0,1,2
      }
    };
  </script>
  <body>
    <input type="button" value="a" />
    <input type="button" value="b" />
    <input type="button" value="c" />
  </body>
</html>
```

### 解构赋值

```js
json={a:12,b:5};
let{a,b}=json;
arr=[12,5,8];
let [a,b,c] = arr;
$.ajax('xxx')=>
{
	code:xx,
	data:xx
	msg:123,
	xxx
}

let {code,data}=$.ajax('xxx')
```

注意：

1. "=" 两边结构必须一样

2. 右边必须得是个东西

3. 赋值和解构必须同时完成

   ```js
   let {a,b} = [12,6];//error
   let {a,b} = {12,5};//error

   let {a,b};
   {a,b}={a:12,b:5};
   ```

### 块级作用域

- 是什么
- 替代闭包

## 函数

### 箭头函数和 this

```js
let arr = [12, 45, 66, 33, 7, 8, 3, 9];
// arr.sort(function (a, b) {
//   return a - b;
// });
// arr.sort((a, b) => a - b);
arr.sort((a, b) => {
  return a - b;
});
alert(arr);
```

#### 简写：

1. 如果有且仅有一个参数，()也可以不写
2. 如果有且仅有一个语句并且是 return，{}也可以不写

#### 修正 this

### ...

### 参数展开

- 收集
- 展开

### 数组展开

### json 展开

## 原生对象扩展

### Array 扩展:

- #### <u>map 映射:一一对应</u>

- 如:[23,67,98,45,67]=>[不及格, 及格, 及格, 不及格, 及格]

- #### <u>reduce n=>1</u>

- #### <u>filter 过滤</u>

- #### <u>forEach 遍历</u>

### 模板字符串

```js
let arr = [23, 4, 5, 67, 88, 99];

arr.forEach((item, index) => {
  // console.log("第" + index + "是:" + item);
  console.log(`第${index + 1}是：${item}`);
});
```

### JSON:

```js
let str = '{"a":12,"name":"blue"}';
let json = JSON.parse(str);
console.log(json);

let json = { a: 12, name: "blue" };
alert(JSON.stringify(json));
```
