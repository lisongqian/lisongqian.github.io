---
layout: article
tags: Network
description: Remote Desktop Connection
---

### Prepare

- [frp客户端文件](http://pan.lisongqian.cn:20190/Softwares/frp_0.24.1_windows_winsw.zip)包括：frp客户端，winsw
- 局域网内可远程连接的Windows计算机

### 开始

#### 修改客户端配置

打开frpc.ini文件，将文件按照需求更改如下：

```ini
[common]
# 你的服务端IP地址
server_addr = ×.×.×.×
# 服务端设置的bind_port端口号
server_port = 5443
# 服务端设置的token
token = YourToken

## 本地管理页面

# 管理页地址
admin_addr = 127.0.0.1
# 管理页端口
admin_port = 7400
# 管理页用户名
admin_user = admin
# 管理页密码
admin_pwd = admin

# []内可自行设置名称
[slave]
type = tcp
#客户端所在内网的IP地址
local_ip = 192.168.×.×
local_port = 3389
#远程连接的端口号，可自行设置
remote_port = 7500

use_encryption = true
use_compression = true
```

#### 更改启动脚本

编辑frp.bat文件：（第三行需更改）

```bash
@echo off
start  "C:\Windows\System32\cmd.exe"
cd "文件所在目录地址，如C:\Users\name\Desktop\frp"
frpc -c frpc.ini
exit
```

#### 加入开机自动启动服务

管理员命令创建一个cmd窗口，切换到frp目录，执行：

```shell
winsw install
winsw start
```

### 注意

- 发现frpc进程没有运行或frp服务未启动时，请检查winsw的log文件，按照文件提示进行错误排查

### REFERENCES

https://www.eyuyun.com/173.html#cl-22