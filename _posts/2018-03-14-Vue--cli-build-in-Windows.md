---
layout: article
tags: Vue Node
---
### 环境搭建

#### 安装Node.js

从[Node.js官网](https://nodejs.org/en/)上下载 Node.js for Windows(x64)的文件，一路“下一步”安装完成。
<!--more-->
注：

- 使用Win+R输入cmd打开命令行输入`node -v`，出现版本号，则说明安装成功。

[![paste image](http://cdn.lisongqian.cn/1521005006159e7rgx9ki.png?imageslim)](http://cdn.lisongqian.cn/1521005006159e7rgx9ki.png?imageslim)

- 包管理工具`npm`在安装Node.js时会一起安装好。

#### 安装Webpack

在命令行中输入`npm install webpack -g`。

注：

- 安装完成后`webpack -v`，出现版本号，则说明安装成功。

  [![paste image](http://cdn.lisongqian.cn/1521005380201xio1rksy.png?imageslim)](http://cdn.lisongqian.cn/1521005380201xio1rksy.png?imageslim)

- 若出现如下报错，执行`npm install webpack-cli -D`，安装webpack-cli。

  [![paste image](http://cdn.lisongqian.cn/15210231558529exqakl5.png?imageslim)](http://cdn.lisongqian.cn/15210231558529exqakl5.png?imageslim)

#### 安装Vue-cli

在命令行中输入`npm install vue-cli -g`。

注：

- 安装完成后输入`vue -V`(大写V)，出现版本号，则说明安装成功。

### 项目准备

我的项目都是使用的Webstorm搭建的

我的工程地址在`C:\User\s5\WebstormProjects`，所以在命令行中执行：

```
cd WebstormProjects
vue init webpack projectname
```

注：

- projectname为项目名。

- `package.json`配置过程：

  （建议：除了`Use ESLint to lint your code?`选`no`，其他配置全部回车就好。）

```
$ vue init webpack exprice --------------------- 这个是那个安装vue脚手架的命令
This will install Vue 2.x version of the template. ---------------------这里说明将要创建一个vue 2.x版本的项目
For Vue 2.x use: vue init webpack
? Project name (projectname) ---------------------项目名称
? Project name projectname
? Project description (A Vue.js project) ---------------------项目描述
? Project description A Vue.js project
? Author Datura --------------------- 项目创建者
? Author Datura
? Vue build (Use arrow keys)
? Vue build standalone
? Install vue-router? (Y/n) --------------------- 是否安装Vue路由，也就是以后是spa（但页面应用需要的模块）
? Install vue-router? Yes
? Use ESLint to lint your code? (Y/n) n ---------------------是否启用eslint检测规则，这里个人建议选no
? Use ESLint to lint your code? No
? Setup unit tests with Karma + Mocha? (Y/n)
? Setup unit tests with Karma + Mocha? Yes
? Setup e2e tests with Nightwatch? (Y/n)
? Setup e2e tests with Nightwatch? Yes
vue-cli · Generated "projectname".
```

#### 目录结构：

[![paste image](http://cdn.lisongqian.cn/1521024612574rgfo9k0v.png?imageslim)](http://cdn.lisongqian.cn/1521024612574rgfo9k0v.png?imageslim)

## 项目运行

命令行进入刚才创建的项目目录，然后执行命令：

```
cd projectname
npm run dev
```

[![paste image](http://cdn.lisongqian.cn/15210244704930q2bnoj1.png?imageslim)](http://cdn.lisongqian.cn/15210244704930q2bnoj1.png?imageslim)

此时可以在浏览器中输入`localhost:8080` 查看到实例页面。

[![paste image](http://cdn.lisongqian.cn/1521024540357004pj7g9.png?imageslim)](http://cdn.lisongqian.cn/1521024540357004pj7g9.png?imageslim)

> 参考[Vue2.0史上最全入坑教程](https://www.jianshu.com/p/1626b8643676)