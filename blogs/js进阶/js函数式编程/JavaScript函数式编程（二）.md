---
title: javaScript函数式编程（二）
date: 2020-12-04
sidebar: "auto"
categories:
  - 函数式编程
tags:
  - 函数式编程
  - js
publish: True
---

# JavaScript 函数式编程（二）

上一篇文章里我们提到了纯函数的概念，所谓的纯函数就是，**对于相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用，也不依赖外部环境的状态**（我偷懒复制过来的）。

但是实际的编程中，特别是前端的编程范畴里，“不依赖外部环境”这个条件是根本不可能的，我们总是不可避免地接触到 DOM、AJAX 这些状态随时都在变化的东西。所以我们需要用更强大的技术来干这些脏活。

## 一、容器、Functor

如果你熟悉 jQuery 的话，应该还记得，**\$(...)** 返回的对象并不是一个原生的 DOM 对象，而是对于原生对象的一种封装：

```js
var foo = $("#foo");
foo == document.getElementById("foo");
//=> false

foo[0] == document.getElementById("foo");
//=> true
```

这在某种意义上就是一个“容器”（但它并不函数式）。

接下类我们会看到，容器为函数式编程里普通的变量、对象、函数提供了一层极其强大的外衣，赋予了它们一些很惊艳的特性，就好像 Tony Stark 的钢铁外衣，Dva 的机甲，明日香的 2 号机一样。

下面我们就来写一个最简单的容器吧：

```js
var Container = function(x) {
  this.__value = x;
};
Container.of = (x) => new Container(x);

//试试看
Container.of(1);
//=> Container(1)

Container.of("abcd");
//=> Container('abcd')
```

我们调用 **Container.of** 把东西装进容器里之后，由于这一层外壳的阻挡，普通的函数就对他们不再起作用了，所以我们需要加一个接口来让外部的函数也能作用到容器里面的值：

```js
Container.prototype.map = function(f) {
  return Container.of(f(this.__value));
};
```

我们可以这样使用它：

```js
Container.of(3)
  .map((x) => x + 1) //=> Container(4)
  .map((x) => "Result is " + x); //=> Container('Result is 4')
```

没错！我们仅花了 7 行代码就实现了很炫的『**链式调用』**，这也是我们的第一个 **Functor**。

**Functor（函子）是实现了 map 并遵守一些特定规则的容器类型。**

也就是说，如果我们要将普通函数应用到一个被容器包裹的值，那么我们首先需要定义一个叫 **Functor** 的数据类型，在这个数据类型中需要定义如何使用 **map** 来应用这个普通函数。

把东西装进一个容器，只留出一个接口 **map** 给容器外的函数，这么做有什么好处呢？

本质上，**Functor** 是一个对于函数调用的抽象，我们赋予容器自己去调用函数的能力。当 **map** 一个函数时，我们让容器自己来运行这个函数，这样容器就可以自由地选择何时何地如何操作这个函数，以致于拥有惰性求值、错误处理、异步调用等等非常牛掰的特性。

举个例子，我们现在为 **map** 函数添加一个检查空值的特性，这个新的容器我们称之为 **Maybe**（原型来自于 Haskell）：

```js
var Maybe = function(x) {
  this.__value = x;
};

Maybe.of = function(x) {
  return new Maybe(x);
};

Maybe.prototype.map = function(f) {
  return this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
};

Maybe.prototype.isNothing = function() {
  return this.__value === null || this.__value === undefined;
};

//试试看
import _ from "lodash";
var add = _.curry(_.add);

Maybe.of({ name: "Stark" })
  .map(_.prop("age"))
  .map(add(10));
//=> Maybe(null)

Maybe.of({ name: "Stark", age: 21 })
  .map(_.prop("age"))
  .map(add(10));
//=> Maybe(31)
```

看了这些代码，觉得链式调用总是要输入一堆 **.map(...)** 很烦对吧？这个问题很好解决，还记得我们上一篇文章里介绍的**柯里化**吗？

有了柯里化这个强大的工具，我们可以这样写：

```js
import _ from "lodash";
var compose = _.flowRight;
var add = _.curry(_.add);

// 创造一个柯里化的 map
var map = _.curry((f, functor) => functor.map(f));

var doEverything = map(compose(add(10), _.property("age")));

var functor = Maybe.of({ name: "Stark", age: 21 });
doEverything(functor);
//=> Maybe(31)
```

## 二、错误处理、Either

现在我们的容器能做的事情太少了，它甚至连做简单的错误处理都做不到，现在我们只能类似这样处理错误：

```js
try {
  doSomething();
} catch (e) {
  // 错误处理
}
```

**try/catch/throw** 并不是“纯”的，因为它从外部接管了我们的函数，并且在这个函数出错时抛弃了它的返回值。这不是我们期望的函数式的行为。

如果你对 **Promise** 熟悉的话应该还记得，**Promise** 是可以调用 **catch** 来集中处理错误的：

```js
doSomething()
  .then(async1)
  .then(async2)
  .catch((e) => console.log(e));
```

对于函数式编程我们也可以做同样的操作，如果运行正确，那么就返回正确的结果；如果错误，就返回一个用于描述错误的结果。这个概念在 Haskell 中称之为 **Either** 类，**Left** 和 **Right** 是它的两个子类。我们用 JS 来实现一下：

```js
// 这里是一样的=。=
var Left = function(x) {
  this.__value = x;
};
var Right = function(x) {
  this.__value = x;
};

// 这里也是一样的=。=
Left.of = function(x) {
  return new Left(x);
};
Right.of = function(x) {
  return new Right(x);
};

// 这里不同！！！
Left.prototype.map = function(f) {
  return this;
};
Right.prototype.map = function(f) {
  return Right.of(f(this.__value));
};
```

下面来看看 **Left** 和 **Right** 的区别吧：

```js
Right.of("Hello").map((str) => str + " World!");
// Right("Hello World!")

Left.of("Hello").map((str) => str + " World!");
// Left("Hello")
```

**Left** 和 **Right** 唯一的区别就在于 **map** 方法的实现，**Right.map** 的行为和我们之前提到的 **map** 函数一样。但是 **Left.map** 就很不同了：**它不会对容器做任何事情，只是很简单地把这个容器拿进来又扔出去。这个特性意味着，Left 可以用来传递一个错误消息。**

```js
var getAge = (user) => (user.age ? Right.of(user.age) : Left.of("ERROR!"));

//试试
getAge({ name: "stark", age: "21" }).map((age) => "Age is " + age);
//=> Right('Age is 21')

getAge({ name: "stark" }).map((age) => "Age is " + age);
//=> Left('ERROR!')
```

是的，**Left** 可以让调用链中任意一环的错误立刻返回到调用链的尾部，这给我们错误处理带来了很大的方便，再也不用一层又一层的 **try/catch**。

**Left** 和 **Right** 是 **Either** 类的两个子类，事实上 Either 并不只是用来做错误处理的，它表示了逻辑或，范畴学里的 **coproduct**。但这些超出了我们的讨论范围。

## 三、IO

下面我们的程序要走出象牙塔，去接触外面“肮脏”的世界了，在这个世界里，很多事情都是有副作用的或者依赖于外部环境的，比如下面这样：

```js
function readLocalStorage() {
  return window.localStorage;
}
```

这个函数显然不是纯函数，因为它强依赖外部的 **window.localStorage** 这个对象，它的返回值会随着环境的变化而变化。为了让它“纯”起来，我们可以把它包裹在一个函数内部，延迟执行它：

```js
function readLocalStorage() {
  return function() {
    return window.localStorage;
  };
}
```

这样 **readLocalStorage** 就变成了一个真正的纯函数！ OvO 为机智的程序员鼓掌！

额……好吧……好像确实没什么卵用……我们只是（像大多数拖延症晚期患者那样）把讨厌做的事情暂时搁置了而已。为了能彻底解决这些讨厌的事情，我们需要一个叫 **IO** 的新的 **Functor**：

```js
import _ from "lodash";
var compose = _.flowRight;

var IO = function(f) {
  this.__value = f;
};

IO.of = (x) => new IO((_) => x);

IO.prototype.map = function(f) {
  return new IO(compose(f, this.__value));
};
```

**IO** 跟前面那几个 **Functor** 不同的地方在于，它的 \_\_value 是一个函数。它把不纯的操作（比如 IO、网络请求、DOM）包裹到一个函数内，从而延迟这个操作的执行。所以我们认为，**IO 包含的是被包裹的操作的返回值**。

```js
var io_document = new IO((_) => window.document);

io_document.map(function(doc) {
  return doc.title;
});
//=> IO(document.title)
```

注意我们这里虽然感觉上返回了一个实际的值 **IO(document.title)**，但事实上只是一个对象：**{ \_\_value: [Function] }**，它并没有执行，而是简单地把我们想要的操作存了起来，只有当我们在真的需要这个值得时候，**IO** 才会真的开始求值，这个特性我们称之为『**惰性求值』**。（培提尔其乌斯：“这是怠惰啊！”）

是的，我们依然需要某种方法让 **IO** 开始求值，并且把它返回给我们。它可能因为 **map** 的调用链积累了很多很多不纯的操作，一旦开始求值，就可能会把本来很干净的程序给“弄脏”。但是去直接执行这些“脏”操作不同，我们把这些不纯的操作带来的复杂性和不可维护性推到了 **IO** 的调用者身上（嗯就是这么不负责任）。

下面我们来做稍微复杂点的事情，编写一个函数，从当前 url 中解析出对应的参数。

```js
import _ from "lodash";

// 先来几个基础函数：
// 字符串
var split = _.curry((char, str) => str.split(char));
// 数组
var first = (arr) => arr[0];
var last = (arr) => arr[arr.length - 1];
var filter = _.curry((f, arr) => arr.filter(f));
//注意这里的 x 既可以是数组，也可以是 functor
var map = _.curry((f, x) => x.map(f));
// 判断
var eq = _.curry((x, y) => x == y);
// 结合
var compose = _.flowRight;

var toPairs = compose(map(split("=")), split("&"));
// toPairs('a=1&b=2')
//=> [['a', '1'], ['b', '2']]

var params = compose(toPairs, last, split("?"));
// params('http://xxx.com?a=1&b=2')
//=> [['a', '1'], ['b', '2']]

// 这里会有些难懂=。= 慢慢看
// 1.首先，getParam是一个接受IO(url)，返回一个新的接受 key 的函数；
// 2.我们先对 url 调用 params 函数，得到类似[['a', '1'], ['b', '2']]
//   这样的数组；
// 3.然后调用 filter(compose(eq(key), first))，这是一个过滤器，过滤的
//   条件是 compose(eq(key), first) 为真，它的意思就是只留下首项为 key
//   的数组；
// 4.最后调用 Maybe.of，把它包装起来。
// 5.这一系列的调用是针对 IO 的，所以我们用 map 把这些调用封装起来。
var getParam = (url) => (key) =>
  map(compose(Maybe.of, filter(compose(eq(key), first)), params))(url);

// 创建充满了洪荒之力的 IO！！！
var url = new IO((_) => window.location.href);
// 最终的调用函数！！！
var findParam = getParam(url);

// 上面的代码都是很干净的纯函数，下面我们来对它求值，求值的过程是非纯的。
// 假设现在的 url 是 http://xxx.com?a=1&b=2
// 调用 __value() 来运行它！
findParam("a").__value();
//=> Maybe(['a', '1'])
```

## 四、总结

如果你还能坚持看到这里的话，不管看没看懂，已经是勇士了。在这篇文章里，我们先后提到了 **Maybe**、**Either**、**IO** 这三种强大的 **Functor**，在链式调用、惰性求值、错误捕获、输入输出中都发挥着巨大的作用。事实上 **Functor** 远不止这三种，但由于篇幅的问题就不再继续介绍了（哼才不告诉你其实是因为我还没看懂其它 **Functor** 的原理）

但依然有问题困扰着我们：

\1. 如何处理嵌套的 **Functor** 呢？（比如 **Maybe(IO(42))**）

\2. 如何处理一个由非纯的或者异步的操作序列呢？

在这个充满了容器和 **Functor** 的世界里，我们手上的工具还不够多，函数式编程的学习还远远没有结束，在下一篇文章里会讲到 **Monad** 这个神奇的东西（然而我也不知道啥时候写下一篇，估计等到实习考核后吧 OvO）。

## 五、参考

1、[https://github.com/MostlyAdequate/mostly-adequate-guide](https://link.zhihu.com/?target=https%3A//github.com/MostlyAdequate/mostly-adequate-guide)

2、[http://www.ibm.com/developerworks/cn/web/1006_qiujt_jsfunctional/](https://link.zhihu.com/?target=http%3A//www.ibm.com/developerworks/cn/web/1006_qiujt_jsfunctional/)

3、《JavaScript 函数式编程》【美】迈克尔·佛格斯
