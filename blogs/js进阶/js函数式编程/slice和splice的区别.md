---
title: slice 和 splice 的区别
date: 2020-12-04
sidebar: "auto"
categories:
  - 数组
tags:
  - 数组处理
  - js
publish: True
---

## slice 和 splice 的区别

### 1、slice

slice 是指定在一个数组中的元素创建一个新的数组，即原数组不会变

```
var color = new Array('red','blue','yellow','black');
var color2 = color.slice(1,2);
alert(color); 　　//输出   red,blue,yellow,black
alert(color2);   //输出   blue;注意：这里只有第二项一个值
```

### 　　 2、splice

splice 是 JS 中数组功能最强大的方法，它能够实现对数组元素的删除、插入、替换操作，**返回值为被操作的值**。

splice 删除：　　**color.splice(1,2)** （删除 color 中的 1、2 两项）；

splice 插入：　　**color.splice(1,0,'brown','pink')** （在 color 键值为 1 的元素前插入两个值）；

splice 替换：　　**color.splice(1,2,'brown','pink')** （在 color 中替换 1、2 元素）；

```javascript
var color = new Array("red", "blue", "yellow", "black");
var color2 = color.splice(2, 3, "brown", "pink");
alert(color); //  red,blue,brown,pink
alert(color2); //  yellow,black
```
