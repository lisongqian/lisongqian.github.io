---
layout: article
tags: DelayedTask
---
### 前言

#### 什么是RPC协议

> RPC，全称Remote Procedure Call，远程过程调用，它是一种通过[网络](https://baike.baidu.com/item/%E7%BD%91%E7%BB%9C/143243)从远程计算机程序上请求服务。RPC采用客户机/服务器模式。请求程序就是一个客户机，而服务提供程序就是一个服务器。

<!--more-->

#### 什么是Dubbo

> Apache Dubbo™ (incubating)是一款高性能Java RPC框架,它提供了三大核心能力：面向接口的远程方法调用，智能容错和负载均衡，以及服务自动注册和发现。

![/user-guide/images/zookeeper.jpg](http://dubbo.apache.org/docs/zh-cn/user/sources/images/zookeeper.jpg)

流程说明：

- 服务提供者启动时: 向 `/dubbo/com.foo.BarService/providers` 目录下写入自己的 URL 地址
- 服务消费者启动时: 订阅 `/dubbo/com.foo.BarService/providers` 目录下的提供者 URL 地址。并向 `/dubbo/com.foo.BarService/consumers` 目录下写入自己的 URL 地址
- 监控中心启动时: 订阅 `/dubbo/com.foo.BarService` 目录下的所有提供者和消费者 URL 地址。

支持以下功能：

- 当提供者出现断电等异常停机时，注册中心能自动删除提供者信息
- 当注册中心重启时，能自动恢复注册数据，以及订阅请求
- 当会话过期时，能自动恢复注册数据，以及订阅请求
- 当设置 `<dubbo:registry check="false" />` 时，记录失败注册和订阅请求，后台定时重试
- 可通过 `<dubbo:registry username="admin" password="1234" />` 设置 zookeeper 登录信息
- 可通过 `<dubbo:registry group="dubbo" />` 设置 zookeeper 的根节点，不设置将使用无根树
- 支持 `*` 号通配符 `<dubbo:reference group="*" version="*" />`，可订阅服务的所有分组和所有版本的提供者

#### 任务瓶颈

- 网络通信的开销
- 磁盘IO

#### REFERENCES

- [RPC协议简述](https://www.cnblogs.com/guoximing/articles/6030334.html)