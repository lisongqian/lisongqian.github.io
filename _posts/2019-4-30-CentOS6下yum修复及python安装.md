---
layout: article
tags: Server
description: Server
---

CentOS6中自带的yum依赖的python版本是2.6.6版本，而python core team已不再提供支持，且pip至少要求2.7版本,因此系统上应该有2.6,2.7两个版本的python并存。

### 一. python2.6及yum安装（仅供yum出问题用户使用）

#### 查看Linux发行版

```bash
lsb_release -a
```

#### 卸载Python

```bash
rpm -qa|grep python|xargs rpm -e --allmatches --nodeps
whereis python|xargs rm -fr
```

#### 卸载yum

```bash
rpm -qa|grep yum|xargs rpm -e --allmatches --nodeps
rm -rf /etc/yum.repos.d/*
whereis yum|xargs rm -fr
```

#### 创建python目录

```bash
mkdir /usr/local/src/python
```

#### 下载python的rpm包

```bash
cd /usr/local/src/python

wget http://mirrors.ustc.edu.cn/centos/6/os/x86_64/Packages/python-2.6.6-66.el6_8.x86_64.rpm
wget http://mirrors.ustc.edu.cn/centos/6/os/x86_64/Packages/python-iniparse-0.3.1-2.1.el6.noarch.rpm
wget http://mirrors.ustc.edu.cn/centos/6/os/x86_64/Packages/python-pycurl-7.19.0-9.el6.x86_64.rpm
wget  http://mirrors.ustc.edu.cn/centos/6/os/x86_64/Packages/python-devel-2.6.6-66.el6_8.x86_64.rpm
wget  http://mirrors.ustc.edu.cn/centos/6/os/x86_64/Packages/python-libs-2.6.6-66.el6_8.x86_64.rpm
wget  http://mirrors.ustc.edu.cn/centos/6/os/x86_64/Packages/python-urlgrabber-3.9.1-11.el6.noarch.rpm
wget  http://mirrors.ustc.edu.cn/centos/6/os/x86_64/Packages/rpm-python-4.8.0-59.el6.x86_64.rpm
```

#### 安装python

```bash
cd /usr/local/src/python
rpm -ivh python-*   rpm-python-*  #--nodeps --force为不考虑依赖包，强制安装
```

#### 创建yum目录

```bash
mkdir /usr/local/src/yum
```

#### 下载yum的rpm包

```bash
cd /usr/local/src/yum

wget http://mirrors.ustc.edu.cn/centos/6/os/x86_64/Packages/yum-3.2.29-81.el6.centos.noarch.rpm
wget http://mirrors.ustc.edu.cn/centos/6/os/x86_64/Packages/yum-metadata-parser-1.1.2-16.el6.x86_64.rpm
wget http://mirrors.ustc.edu.cn/centos/6/os/x86_64/Packages/yum-plugin-fastestmirror-1.1.30-41.el6.noarch.rpm
```

#### 安装yum

```bash
cd /usr/local/src/yum
rpm -ivh yum-*
```

#### 更新yum源

```bash
cd /etc/yum.repos.d/

//更新为阿里云的源 二选一
wget -O CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo

//更新为163的源
wget -O CentOS-Base.repo http://mirrors.163.com/.help/CentOS6-Base-163.repo
```

#### 生成yum缓存

```
yum clean all
yum update
yum makecache
```



### 二 安装python2.7

#### 配置环境

```bash
yum -y update
yum groupinstall 'Development Tools'
yum install -y zlib-devel bzip2-devel openssl-devel ncurses-devel sqlite-devel readline-devel tk-devel gdbm-devel db4-devel libpcap-devel xz-devel expat-devel
```

#### 安装python

python最新版本下载地址：https://www.python.org/downloads/

```bash
wget https://www.python.org/ftp/python/2.7.15/Python-2.7.15.tgz
tar -zxvf Python-2.7.15.tgz 
cd Python-2.7.15
./configure --prefix=/usr/local
make all
make altinstall
make clean
```

#### 创建软连接

```bash
ln -s /usr/local/bin/python2.7 /usr/bin/python
```

#### 修改yum

```
vi /usr/bin/yum
```

将第一行  #!/usr/bin/python  改为 #!/usr/bin/python2.6

#### 安装setuptools

```bash
wget https://files.pythonhosted.org/packages/1d/64/a18a487b4391a05b9c7f938b94a16d80305bf0369c6b0b9509e86165e1d3/setuptools-41.0.1.zip
unzip setuptools-41.0.1.zip
cd setuptools-41.0.1
python setup.py  install
```

#### 安装pip

```bash
wget https://files.pythonhosted.org/packages/51/5f/802a04274843f634469ef299fcd273de4438386deb7b8681dd059f0ee3b7/pip-19.1.tar.gz
tar -xvf pip-19.1.tar.gz
cd pip-19.1
python setup.py  install
```

#### 修改pip

```
  File "/usr/bin/pip", line 7, in <module>
    from pip import main
ImportError: cannot import name main
```



#### 更新pip

```
vi /usr/bin/pip
```

将`from pip import main`改为`from pip import __main__`,

`sys.exit(_main())`改为`sys.exit(__main__._main())`

最终得到：

```python
#!/usr/bin/python

import sys
from pip import __main__

if __name__ == '__main__':
    sys.exit(__main__._main())
```

### 三. 宝塔面板相关问题

出现`您请求的页面因发生异常而中断!`，按照下述处理：

#### 宝塔日志

```bash
cat /tmp/panelBoot.pl
```

#### 宝塔需要的启动环境

```bash
pip install psutil
pip install web.py
```

#### 挂载硬盘

```
fdisk -l # 查看硬盘信息
mount /dev/vdb5 /storage
```

#### 定时任务需要的python环境

```
 pip install mysql-python
```

#### 启动xxl定时任务

```
cd /storage/admin.lisongqian.cn
java -jar xxl-job-admin-2.0.1.jar &
java -jar xxl-job-executor-sample-springboot-2.0.1.jar &
```

