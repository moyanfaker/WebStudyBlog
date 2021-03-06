---
title: javaScript函数式编程（一）
date: 2020-12-04
sidebar: "auto"
categories:
  - 函数式编程
tags:
  - 函数式编程
  - js
publish: True
---

# JavaScript 函数式编程（一）

一、引言

说到函数式编程，大家可能第一印象都是学院派的那些晦涩难懂的代码，充满了一大堆抽象的不知所云的符号，似乎只有大学里的计算机教授才会使用这些东西。在曾经的某个时代可能确实如此，但是近年来随着技术的发展，函数式编程已经在实际生产中发挥巨大的作用了，越来越多的语言开始加入闭包，匿名函数等非常典型的函数式编程的特性，从某种程度上来讲，函数式编程正在逐步“同化”命令式编程。

JavaScript 作为一种典型的多范式编程语言，这两年随着 React 的火热，函数式编程的概念也开始流行起来，RxJS、cycleJS、lodashJS、underscoreJS 等多种开源库都使用了函数式的特性。所以下面介绍一些函数式编程的知识和概念。

## 二、纯函数

如果你还记得一些初中的数学知识的话，函数 **f** 的概念就是，对于输入 **x** 产生一个输出 **y = f(x)**。这便是一种最简单的纯函数。**纯函数的定义是，对于相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用，也不依赖外部环境的状态。**

下面来举个栗子，比如在 Javascript 中对于数组的操作，有些是纯的，有些就不是纯的：

```js
var arr = [1, 2, 3, 4, 5];

// Array.slice是纯函数，因为它没有副作用，对于固定的输入，输出总是固定的
// 可以，这很函数式
xs.slice(0, 3);
//=> [1,2,3]
xs.slice(0, 3);
//=> [1,2,3]

// Array.splice是不纯的，它有副作用，对于固定的输入，输出不是固定的
// 这不函数式
xs.splice(0, 3);
//=> [1,2,3]
xs.splice(0, 3);
//=> [4,5]
xs.splice(0, 3);
//=> []
```

在函数式编程中，我们想要的是 **slice** 这样的纯函数，而不是 **splice**这种每次调用后都会把数据弄得一团乱的函数。

为什么函数式编程会排斥不纯的函数呢？下面再看一个例子：

```js
//不纯的
var min = 18;
var checkage = (age) => age > min;

//纯的，这很函数式
var checkage = (age) => age > 18;
```

在不纯的版本中，**checkage** 这个函数的行为不仅取决于输入的参数 age，还取决于一个外部的变量 **min**，换句话说，这个函数的行为需要由外部的系统环境决定。对于大型系统来说，这种对于外部状态的依赖是造成系统复杂性大大提高的主要原因。

可以注意到，纯的 **checkage** 把关键数字 18 硬编码在函数内部，扩展性比较差，我们可以在后面的**柯里化**中看到如何用优雅的函数式解决这种问题。

纯函数不仅可以有效降低系统的复杂度，还有很多很棒的特性，比如可缓存性：

```js
import _ from "lodash";
var sin = _.memorize((x) => Math.sin(x));

//第一次计算的时候会稍慢一点
var a = sin(1);

//第二次有了缓存，速度极快
var b = sin(1);
```

## 三、函数的柯里化

函数柯里化（curry）的定义很简单：传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

比如对于加法函数 **var add = (x, y) =>　 x + y** ，我们可以这样进行柯里化：

```js
//比较容易读懂的ES5写法
var add = function(x) {
  return function(y) {
    return x + y;
  };
};

//ES6写法，也是比较正统的函数式写法
var add = (x) => (y) => x + y;

//试试看
var add2 = add(2);
var add200 = add(200);

add2(2); // =>4
add200(50); // =>250
```

对于加法这种极其简单的函数来说，柯里化并没有什么大用处。

还记得上面那个 **checkage** 的函数吗？我们可以这样柯里化它：

```text
var checkage = min => (age => age > min);
var checkage18 = checkage(18);
checkage18(20);
// =>true
```

**事实上柯里化是一种“预加载”函数的方法，通过传递较少的参数，得到一个已经记住了这些参数的新函数，某种意义上讲，这是一种对参数的“缓存”，是一种非常高效的编写函数的方法：**

```js
import { curry } from "lodash";

//首先柯里化两个纯函数
var match = curry((reg, str) => str.match(reg));
var filter = curry((f, arr) => arr.filter(f));

//判断字符串里有没有空格
var haveSpace = match(/\s+/g);

haveSpace("ffffffff");
//=>null

haveSpace("a b");
//=>[" "]

filter(haveSpace, ["abcdefg", "Hello World"]);
//=>["Hello world"]
```

## 四、函数组合

学会了使用纯函数以及如何把它柯里化之后，我们会很容易写出这样的“包菜式”代码：

```text
h(g(f(x)));
```

虽然这也是函数式的代码，但它依然存在某种意义上的“不优雅”。为了解决函数嵌套的问题，我们需要用到“函数组合”：

```js
//两个函数的组合
var compose = function(f, g) {
  return function(x) {
    return f(g(x));
  };
};

//或者
var compose = (f, g) => (x) => f(g(x));

var add1 = (x) => x + 1;
var mul5 = (x) => x * 5;

compose(mul5, add1)(2);
// =>15
```

我们定义的 compose 就像双面胶一样，可以把任何两个纯函数结合到一起。当然你也可以扩展出组合三个函数的“三面胶”，甚至“四面胶”“N 面胶”。

这种灵活的组合可以让我们像拼积木一样来组合函数式的代码：

```js
var first = (arr) => arr[0];
var reverse = (arr) => arr.reverse();

var last = compose(first, reverse);

last([1, 2, 3, 4, 5]);
// =>5
```

## 五、Point Free

有了柯里化和函数组合的基础知识，下面介绍一下 Point Free 这种代码风格。

细心的话你可能会注意到，之前的代码中我们总是喜欢把一些对象自带的方法转化成纯函数：

```js
var map = (f, arr) => arr.map(f);

var toUpperCase = (word) => word.toUpperCase();
```

这种做法是有原因的。

Point Free 这种模式现在还暂且没有中文的翻译，有兴趣的话可以看看这里的英文解释：

[https://en.wikipedia.org/wiki/Tacit_programming](https://link.zhihu.com/?target=https%3A//en.wikipedia.org/wiki/Tacit_programming)

用中文解释的话大概就是，不要命名转瞬即逝的中间变量，比如：

```js
//这不Piont free
var f = (str) => str.toUpperCase().split(" ");
```

这个函数中，我们使用了 str 作为我们的中间变量，但这个中间变量除了让代码变得长了一点以外是毫无意义的。下面改造一下这段代码：

```js
var toUpperCase = (word) => word.toUpperCase();
var split = (x) => (str) => str.split(x);

var f = compose(split(" "), toUpperCase);

f("abcd efgh");
// =>["ABCD", "EFGH"]
```

这种风格能够帮助我们减少不必要的命名，让代码保持简洁和通用。当然，为了在一些函数中写出 Point Free 的风格，在代码的其它地方必然是不那么 Point Free 的，这个地方需要自己取舍。

## 六、声明式与命令式代码

命令式代码的意思就是，我们通过编写一条又一条指令去让计算机执行一些动作，这其中一般都会涉及到很多繁杂的细节。

而声明式就要优雅很多了，我们通过写表达式的方式来声明我们想干什么，而不是通过一步一步的指示。

```js
//命令式
var CEOs = [];
for (var i = 0; i < companies.length; i++) {
  CEOs.push(companies[i].CEO);
}

//声明式
var CEOs = companies.map((c) => c.CEO);
```

命令式的写法要先实例化一个数组，然后再对 companies 数组进行 for 循环遍历，手动命名、判断、增加计数器，就好像你开了一辆零件全部暴露在外的汽车一样，虽然很机械朋克风，但这并不是优雅的程序员应该做的。

声明式的写法是一个表达式，如何进行计数器迭代，返回的数组如何收集，这些细节都隐藏了起来。它指明的是做什么，而不是怎么做。除了更加清晰和简洁之外，map 函数还可以进一步独立优化，甚至用解释器内置的速度极快的 map 函数，这么一来我们主要的业务代码就无须改动了。

函数式编程的一个明显的好处就是这种声明式的代码，对于无副作用的纯函数，我们完全可以不考虑函数内部是如何实现的，专注于编写业务代码。优化代码时，目光只需要集中在这些稳定坚固的函数内部即可。

相反，不纯的不函数式的代码会产生副作用或者依赖外部系统环境，使用它们的时候总是要考虑这些不干净的副作用。在复杂的系统中，这对于程序员的心智来说是极大的负担。

## 七、尾声

任何代码都是要有实际用处才有意义，对于 JS 来说也是如此。然而现实的编程世界显然不如范例中的函数式世界那么美好，实际应用中的 JS 是要接触到 ajax、DOM 操作，NodeJS 环境中读写文件、网络操作这些对于外部环境强依赖，有明显副作用的“很脏”的工作。

这对于函数式编程来说也是很大的挑战，所以我们也需要更强大的技术去解决这些“脏问题”。我会在下一篇文章中介绍函数式编程的更加高阶一些的知识，例如 Functor、Monad 等等概念。

## 八、参考

1、[https://github.com/MostlyAdequate/mostly-adequate-guide](https://link.zhihu.com/?target=https%3A//github.com/MostlyAdequate/mostly-adequate-guide)

2、[http://www.ibm.com/developerworks/cn/web/1006_qiujt_jsfunctional/](https://link.zhihu.com/?target=http%3A//www.ibm.com/developerworks/cn/web/1006_qiujt_jsfunctional/)

3、《JavaScript 函数式编程》【美】迈克尔·佛格斯
