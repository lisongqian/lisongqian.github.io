---
layout: article
tags: Python
---

### 引言

正学着`scrapy`呢，偶然发现模拟登录知乎的教程跟实际不同，这才发觉知乎改版后在登录上添加了很多的反爬字段，于是便诞生了这篇文章。
<!--more-->

### 开始

### I.分析登录的request head

[![paste image](http://cdn.lisongqian.cn/1518177943916gw5e4ym5.png?imageslim)](http://cdn.lisongqian.cn/1518177943916gw5e4ym5.png?imageslim)
发现几个不同的信息头：

#### 1.aurhorization

多测试了几次，发现这个的值没有发生变化
​
c3cef7c66a1843f8b3a9e6a1e3160e20

#### 2.Content-Type

感觉像js生成的加密字段，先往后看

#### 3.X-UDID

Ctrl+Shift+F全局搜索发现：
[![paste image](http://cdn.lisongqian.cn/1518262225842rrtqr2sv.png?imageslim)](http://cdn.lisongqian.cn/1518262225842rrtqr2sv.png?imageslim)
可以用css、xpath、正则表达式来提取出来了

#### 4.X-Xsrftoken

全局搜索发现该字段紧跟在UDID后面,这时候恍然发现，这是个json字符串，一格式化：

```
{
	"loading": {
		"global": {
			"count": 0
		},
		"local": {
			"token/": false,
			"env/getExperiments/": false,
			"config/getAppConfig/": false
		}
	},
	"entities": {
		"users": {},
		"questions": {},
		"answers": {},
		"articles": {},
		"columns": {},
		"topics": {},
		"roundtables": {},
		"favlists": {},
		"comments": {},
		"notifications": {},
		"ebooks": {},
		"activities": {},
		"feeds": {},
		"pins": {},
		"promotions": {}
	},
	"currentUser": "",
	"token": {
		"xsrf": "2164a9cc-e7da-400b-a2cb-2e456d189680",
		"xUDID": "AAACBxCF7guPTkkPXGTN-jrD3cd7krlcxoA="
	},
	
 ······（有些长后面省略了）
}
```



发现该字段在`json_data['token']['xsrf']`

#### II. 分析表单字段

```
------WebKitFormBoundaryBcTuMAttnsBhtQPT
Content-Disposition: form-data; name="client_id"

c3cef7c66a1843f8b3a9e6a1e3160e20
------WebKitFormBoundaryBcTuMAttnsBhtQPT
Content-Disposition: form-data; name="grant_type"

password
------WebKitFormBoundaryBcTuMAttnsBhtQPT
Content-Disposition: form-data; name="timestamp"

1514945556611
------WebKitFormBoundaryBcTuMAttnsBhtQPT
Content-Disposition: form-data; name="source"

com.zhihu.web
------WebKitFormBoundaryBcTuMAttnsBhtQPT
Content-Disposition: form-data; name="signature"

5e2ca2d664e45e4a6ab34f31a87dcdf8937a4149
------WebKitFormBoundaryBcTuMAttnsBhtQPT
Content-Disposition: form-data; name="username"

+8612345678899
------WebKitFormBoundaryBcTuMAttnsBhtQPT
Content-Disposition: form-data; name="password"

hahahahaha
------WebKitFormBoundaryBcTuMAttnsBhtQPT
Content-Disposition: form-data; name="captcha"


------WebKitFormBoundaryBcTuMAttnsBhtQPT
Content-Disposition: form-data; name="lang"

en
------WebKitFormBoundaryBcTuMAttnsBhtQPT
Content-Disposition: form-data; name="ref_source"

homepage
------WebKitFormBoundaryBcTuMAttnsBhtQPT
Content-Disposition: form-data; name="utm_source"

 
------WebKitFormBoundaryBcTuMAttnsBhtQPT--
```

可以看到参数是以payload的形式出现的，这个时候就要结合请求头`Content-Type`看

```
Content-Type:multipart/form-data; boundary=----WebKitFormBoundaryBcTuMAttnsBhtQPT
```

multipart/form-data 是一种表单提交的方式，后面的boundary=xxx 是表单分割的方式
用k-v方式表示就是：

```
data = {
        'client_id': 'c3cef7c66a1843f8b3a9e6a1e3160e20',
    'grant_type': 'password',
    'timestamp': 1514945556611,
    'source': 'com.zhihu.web',
    'signature':5e2ca2d664e45e4a6ab34f31a87dcdf8937a4149,
    'username': +8612345678899,
    'password': hahahahaha,
    'captcha': "",
    'lang': 'en',
    'ref_source': 'homepage',
    'utm_source': ''
}
```



发现表单里除了`signature`字段，其他都是用户名，密码，时间戳，验证码等固定字段。

##### 查找`signature`字段

> From [python模拟登陆知乎（最新版)](https://zhuanlan.zhihu.com/p/32898234)

有先人经过辛苦调试找到了生成该字段值的js代码，现在就可以使用Python执行下js代码来生成。

### III.代码编写

```
本文由于只实现登录的功能，所以就使用requests库来进行数据爬取。
```

#### 1.定制request head

定义全局变量：

```
s = requests.session() #用来发起请求的requests对象
s.cookies = cookielib.LWPCookieJar(filename="cookie.txt") #使用cookielib库来保存cookie
content_type = "multipart/form-data; boundary=----WebKitFormBoundaryW1NyxWWwr7BAQ5e6" #加密字符串 boundary后面值为随机值

agent = "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.32 Mobile Safari/537.36"
header = { #通用header
    "HOST": "www.zhihu.com",
    "Referer": "https://www.zhihu.com",
    "User-Agent": agent
}
```



获取和设置特殊字段值：

```
res = s.get("https://www.zhihu.com", headers=header)
    match_obj = re.match('.*id="data".*data-state="(.*?)".*', res.text, re.DOTALL)  #正则表达式获取json字符串
    json_data = {}
    if match_obj:
        data_state = match_obj.group(1).replace("&quot;", '"')
        json_data = json.loads(data_state) #字符串转json对象 
    headers = header
    headers['X-UDID'] = json_data['token']['xUDID']
    headers['X-Xsrftoken'] = json_data['token']['xsrf']
    headers['authorization'] = "oauth c3cef7c66a1843f8b3a9e6a1e3160e20"
```



#### 2.定制form-data

主要是获取`signature`字段，直接执行js代码，具体见文章尾的源码吧

#### 3.获取登录验证码

```
正常来讲，知乎很少会验证验证码，这里是为了以防万一从而添加了英文验证码，中文验证码不考虑
```

验证码的验证一是需要在登录的表单里通过`captha`字段提交,
二是需要向验证码端口`https://www.zhihu.com/api/v3/oauth/captcha?lang=en`的`input_text`字段提交。

```
def checkcapthca(headers, cn=False):
    # 检查是否需要验证码,无论需不需要，必须要发一个请求
    if cn:
        url = 'https://www.zhihu.com/api/v3/oauth/captcha?lang=cn'
    else:
        url = 'https://www.zhihu.com/api/v3/oauth/captcha?lang=en'
    show_captcha = s.get(url, headers=headers)
    if show_captcha.json()['show_captcha']:
        req = s.put(url, headers=headers)
        print(req)
        with open('captcha.jpg', 'wb') as f:
            img_data = base64.b64decode(req.json()['img_base64'])
            # img_src = "data:image/jpg;base64," + req.json()['img_base64']
            f.write(img_data)
            f.close()
            try:
                im = Image.open('captcha.jpg')
                im.show()
                im.close()
            except:
                print(u'请到 %s 目录找到captcha.jpg 手动输入' % os.path.abspath('captcha.jpg'))
            captcha = input("请输入验证码：\n>")
    else:
        captcha = ''
    data = {
        'input_text': captcha
    }
    encoder = MultipartEncoder(data, boundary="----WebKitFormBoundarycGPN1xiTi2hCSKKZ")
    headers['Content-Type'] = encoder.content_type
    res = s.post(url, data=encoder.to_string(), headers=headers)
    return captcha
```



**整个的判断过程是：**

（1）知乎首先向验证码端口发送`get`请求，用来确认是否需要验证验证码

（2）如果需要验证码，则向验证码端口发起`put`请求，获取`base64`编码的图片地址

（3）最后向验证码端口发起`post`请求，用`input_text`字段来第一次验证验证码是否正确。

（4）将当前输入的验证码答案加到登录表单的`captha`表单中通过`post`请求提交。

（5）登陆成功。返回用户数据。

#### 4.发起登录请求

```
post_url = "https://www.zhihu.com/api/v3/oauth/sign_in"
    data = getdata(account, password)
    data['captcha'] = checkcapthca(headers)
    encoder = MultipartEncoder(data, boundary="----WebKitFormBoundarycGPN1xiTi2hCSKKZ")#将数据转换成multipart/form-data;格式
    headers['Content-Type'] = encoder.content_type #添加请求头字段
    res = s.post(post_url, data=encoder.to_string(), headers=headers)
    s.cookies.save()//保存cookie，登录时需验证，必需
```

### IV.总结

#### 1.几个重要的Python类库安装

##### 执行js代码

```
 pip install PyExecJS
```



##### 利用requests上传multipart/form-data格式文件

```
pip install requests_toolbelt
```

##### 用于base64编码图片数据的解析

[(什么是base64编码图片)](http://blog.csdn.net/webxiaoma/article/details/70053444)

```
import base64  #python自带类库
```

##### 用于显示图片的PIL或pillow

```
pip install pillow
```

#### 源码地址

[<http://www.github.com/lisongqian/file/zhihu_login.py>]