---
layout: article
tags: Redis
description: 准备gcc,redis,tcl
---
## 准备

- CentOS Linux release 7.2

<!--more-->

- gcc编译器 `yum install gcc-c++`
- TCL `yum install -y tcl`
- redis安装包 [4.0.8版本](http://download.redis.io/releases/redis-4.0.8.tar.gz)



## 安装

#### 下载redis安装包

```
wget http://download.redis.io/releases/redis-4.0.8.tar.gz
```

#### 解压文件

```
tar zxvf redis-4.0.8.tar.gz
```

#### 将文件拷贝到公共目录

```
mv redis-4.0.8 /opt/redis-4.0.8
```

#### 编译代码

```
cd redis-4.0.8
make
```

#### 安装应用

```
cd src
make install
```

#### 启动Redis

```
./redis-server
```

#### 安装成功

[![paste image](http://cdn.lisongqian.cn/1521099902264vxj9b17w.png?imageslim)](http://cdn.lisongqian.cn/1521099902264vxj9b17w.png?imageslim)

## 使用

#### 启动Redis客户端

在`/opt/redis-4.0.8/src/`路径下，输入：

```
./redis-cli
```

进入Redis命令行，下图为使用测试。

[![paste image](http://cdn.lisongqian.cn/1521100328992ziaupsv0.png?imageslim)](http://cdn.lisongqian.cn/1521100328992ziaupsv0.png?imageslim)

#### Redis的命令

String & Integer

```
incr num //将num自增1
decrby num 2 //将num自减2
```

List(元素可重复)

```
lpush list1 12   //从左面添加一个“12”入list1
rpush list1 12   //从右面添加一个“12”入list1
lpop  list1 12   //从左面输出一个“12”出list1
rpop  list1 12   //从右面输出一个“12”出list1
llen  list       //输出list1的元素个数
```

Set(元素不可重复)

```
sadd      set1 12    //向set1中插入一个“12”
scard     set1       //查看set中有多少元素
sisnumber set1 12    //在set1中找“12”这个元素
srem      set1 12    //将“12”从set1中删除
```

Hash(key=>value)

```
hset hash1 key1 1    //向hash1中添加键值对 key1:1
hget hash1 key1      //从hash1中读取key1的值
hlen hash1           //获取hash1的键值对的个数（即key的个数）
hmget hash1 key1 key2//获取hash1中key1和key2的值
```

Sort set

```
zadd   zset1  12 val1 //向zset1中添加元素
zcard  zset1  //查看zset1中元素的个数
zrange zset1 0 2 withscores //查看排序后的0-2号元素
zrank  zset1 val1    //查看 val1元素的排名
```

## PHP的Redis扩展

#### 前提

**PHP有安装phpize和php-config扩展，可以执行which phpize和which php-config来查看有无该扩展。**

安装该扩展：

```
yum install php-devel
```

#### 下载Redis扩展

```
wget https://github.com/phpredis/phpredis/archive/develop.zip
```

#### 解压缩

```
unzip develop.zip
```

#### 生成configure工具

```
cd phpredis-develop
phpize
```

#### 进行编译和Check

```
./configure -with-php-config=/usr/bin/php-config
```

注：

- `-with-php-config`参数后面填写`php-config`扩展的路径

#### 编译

```
make
make install
```

#### 修改配置文件

查看php.ini文件目录`php --ini`

```
vi /etc/php.ini
```

在最后一行添加：

```
extension=redis.so
```

#### 检查是否安装成功

```
php -m
```

[![paste image](http://cdn.lisongqian.cn/1521106763202358gzkcc.png?imageslim)](http://cdn.lisongqian.cn/1521106763202358gzkcc.png?imageslim)