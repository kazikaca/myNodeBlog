# laravel+vue实践猜想

---

laravel在5.x版本的[官方文档](https://laravel.com/docs/5.4/frontend)中推荐使用vue2.x

但具体怎么配合laravel使用vue，应该从业务需求出发，结合现行系统结构和技术栈进行考虑，并且多做试验以为参考。

像socialbet，产品已经上线，功能已经较为完善，但是有涌现大量新需求，并面临系统建构重组的可能(新增安卓端将提升这样的可能性)，需要考虑重构现有代码的工作量，（生产环境下新旧代码共存的）兼容性和拓展性，生产环境下的部署成本以及新技术的学习成本。

假设我接到你的工作任务，我会从四个方面陈述昨日的工作成果。

 - laravel+vue带来怎样的好处，其实就是vue带来的好处
 - socialbet现有的业务需求适不适合使用vue
 - 假若使用vue，将面临什么样的问题或者是否存在未知因素
 - 有什么解决方案

我觉得，

1.略
 
2.适合，因为socialbet并不是一个信息门户，更像是一个(社交?)应用。使用php后端渲染socialbet的官网(产品介绍，活动页)静态输出将利于socialbet的SEO，而其余的功能页面则可以使用vue前端渲染全部放到一个SPA中，更像一个轻应用。

3.对于socialbet来说，烦人的就是现有代码是否全部重构，以及新技术栈会带来什么样的学习成本和开发成本。我更倾向于全重构，因为后面会增加安卓端，web使用前后端分离的形式，会极大的减轻后端的工作量（无论是php还是java），对于php程序员来说vue应该是蛮简单的。但目前socialbet的运营状况好像并不能支持这样的重构工作。

4.要确定大家都理解vue的功能以及风险才能谈及解决方案，因为解决方案不过是权衡和妥协而已。

要分情况，
a.全重构，spa，使用vue+vue-route+vuex。那需要考虑的就是什么时候开始重构，什么时候停止现有架构的新需求开发。
b.部分重构，以熟悉新技术栈为目的开展的实验性质的重构工作，或者是为组件化作准备。此时需要考虑怎么组件化，重构顺序是如何的。
c.不重构，只用作新功能开发。这样的话，祝你们好运(?)，因为感觉会带来大量的冗余代码，兼容性也不能保障，像vue中怎么调用原有jquery组件(消息栏)的方法...

a.解决方案.等投资到位...然后从后端入手，重写大量的api。值得注意的是权限模块，前后端分离之后一般是返回一个token作为身份验证手段。然后前端需要去了解vuex，数据流，是个很棒的理念。

b.解决方案.只重构高复用的组件或者足够简单的组件（像alert,loading）。其实a和b都需要组件的划分，原则就是职责单一，像众图中，“分页”就是职责清晰的组件，而妄想将一个弹窗以及其业务逻辑抽离作为组件就是傻瓜的行为，而“弹窗”却可以是一个组件。

c.解决方案.只能将功能独立的功能使用vue来写了，像表单之类的。

另外,如果不适用spa结构（不使用vue-route）的话，需要注意laravel-mix中webpack的打包问题。
可以有两种情况，
A.单入口单文件输出，也就是只有一个app.js，在所用页面中都引入app.js
B.多入口多文件输出，也就是每个页面都有它自己的js打包文件，代码目录结构如下：

```
resources/                              *静态文件
 ├── views/                             *页面的vue文件
 │    ├── index.vue
 │    ├── users.vue
 ├── components/                        *组件的vue文件
 │    ├── btn.vue
 │    ├── loading.vue
 ├── index.js
 ├── users.js
 ├── ...
```

在index.blade.php中引入index.js
```
#index.js

import App from 'path/to/index.vue';
new Vue({
  el: '#app',
  render: h => h(App)
});
```

在index.vue中写index的业务逻辑
```
<template>
  <div id="app">
    <example></example>
    <el-button>Hello Element</el-button>
  </div>
</template>
<script>
  import Btn from 'path/to/components/btn.vue';
  export default {
    name: 'app',
    components: {
      Btn
    }
  };
</script>
```

而需要输出多文件的话需要配置webpack.config.js，参考[laravel-mix](https://laravel.com/docs/5.4/mix)和webpack[[1]](http://react-china.org/t/webpack/1870)，[[2]](https://segmentfault.com/a/1190000006808865)

最后，还有看到一个想法很有趣的，很适合结合blade后端输出数据使用，就是，
使用props接口传递数据[跳转→](https://www.zhihu.com/question/54904403/answer/150168629)，按我的理解是这样的：
```
#user.blade.php

<vue-loading data-show="${isShow}"></vue-loading>

...
```
将后端数据用blade直接传到html上，vue组件通过props接口获取数据进行渲染。

所以，今天的汇报任务其实就是讲解配置过程，简要介绍vue，暴露问题，以及给出你的看法。
这很重要，看你的了。
