---
layout: article
tags: Python
---

### I.引言

> 值此情人节之际，祝天下有情人终成眷属。

```
The knowledage of this article is shallow. Please read it in an ornamental angle.
```
<!--more-->
本文使用的是python3下的pandas,matplotlib,PIL,numpy等库。由于本次的源码太乱（好吧是我懒的整理了），本文将只说明过程，不展示代码。

### II.开始

#### 数据预处理

首先从QQ电脑版的消息管理器中导出了txt和mht两种格式的聊天记录，打开txt文件发现消息记录一共`78755`行。
[![paste image](http://cdn.lisongqian.cn/151851498837862dtysly.png?imageslim)](http://cdn.lisongqian.cn/151851498837862dtysly.png?imageslim)
看起来消息记录的格式很规范，于是便想先用`正则表达式`把txt文件保存成csv文件。

```
time_patten = ".*([0-9]{4}[-/][0-9]{1,2}[/-][0-9]{1,2}?)[\s]*([\d]*:[\d]*:[\d]{2}?)[\s]*(.*)?" #时间正则表达式
article_patten = "[\n\r\f\t\s]*(.*)" # 内容正则表达式
```

整理成如下格式：
[![paste image](http://cdn.lisongqian.cn/1518515390676pwzxt4ln.png?imageslim)](http://cdn.lisongqian.cn/1518515390676pwzxt4ln.png?imageslim)
然后对无效数据和非法数据进行了过滤，开始正式`数据分析(WordCount)`。

```
Probably the following word is dog food.
```

#### 聊天次数

[![img](http://cdn.lisongqian.cn/lisongqian_count.png)](http://cdn.lisongqian.cn/lisongqian_count.png)
从数据上来看，我在`7月16日`竟然发了`350`多条消息。我们的感情或许就是从这天开始的吧。
[![img](http://cdn.lisongqian.cn/women.png)](http://cdn.lisongqian.cn/women.png)
哦我的上帝！我的小姐儿竟然跟我在同一天发消息最多，竟然达`500`多条。或许这就是话lao吧（哈哈）。
[![img](http://cdn.lisongqian.cn/%E6%AF%8F%E6%9C%88%E7%9A%84%E6%B6%88%E6%81%AF%E6%95%B0%E9%87%8F.png)](http://cdn.lisongqian.cn/%E6%AF%8F%E6%9C%88%E7%9A%84%E6%B6%88%E6%81%AF%E6%95%B0%E9%87%8F.png)
这张图是每个月的聊天数量，原来我们在QQ上还发了这么多消息，平均都在`2000`多条，最高竟然近`6000`条，要谈成网恋了哈哈。

#### 聊天时间

[![img](http://cdn.lisongqian.cn/%E6%B6%88%E6%81%AF%E6%95%B0%E9%87%8F.png)](http://cdn.lisongqian.cn/%E6%B6%88%E6%81%AF%E6%95%B0%E9%87%8F.png)
柱状图似乎只能看出来每晚睡九个小时啊，换种图：
[![img](http://cdn.lisongqian.cn/%E5%B0%8F%E6%8F%90%E7%90%B4%E5%9B%BE.png)](http://cdn.lisongqian.cn/%E5%B0%8F%E6%8F%90%E7%90%B4%E5%9B%BE.png)
小提琴图似乎能够看出来聊天密度集中在下午和晚上，可能某人的生活中没有上午吧。
[![img](http://cdn.lisongqian.cn/%E7%83%AD%E7%82%B9%E5%9B%BE.png)](http://cdn.lisongqian.cn/%E7%83%AD%E7%82%B9%E5%9B%BE.png)原以为热点图可以显示我们在什么时间上聊天最多，结果就成了这样全是黑点了。

#### 聊天关键词

[![img](http://cdn.lisongqian.cn/men_keywords.png)](http://cdn.lisongqian.cn/men_keywords.png)
这是我的聊天关键词
[![img](http://cdn.lisongqian.cn/women_keywords.png)](http://cdn.lisongqian.cn/women_keywords.png)
这是小姐儿的

不知道为啥子哦，`不`字为啥子出现的频度这么高哦

**来一张词云！**
[![img](http://cdn.lisongqian.cn/wordcloud.png)](http://cdn.lisongqian.cn/wordcloud.png)
哇，不行，这不够优雅！过滤重来！

[![img](http://cdn.lisongqian.cn/wordcloud2.png)](http://cdn.lisongqian.cn/wordcloud2.png)
啊，我尽力了。。。这我感觉可以组个句子！

```
感觉我喜欢和学姐在宿舍玩手机。
```

#### 心情分析

好了，前面都是盲目分析，这个地方应该认真起来了。在一起呢，重要的是要开心！

[![img](http://cdn.lisongqian.cn/women_emotion.png)](http://cdn.lisongqian.cn/women_emotion.png)
这个是小姐儿的心情分析曲线，我，的，天！这个类似的正弦曲线是什么鬼！不过的确最近的心情不是很好，嗯，应该多陪陪猪佩奇了。

[![img](http://cdn.lisongqian.cn/men_emotion.png)](http://cdn.lisongqian.cn/men_emotion.png)
我的心情曲线说明了我的情绪波动比较大，或许我应该沉稳点了。。。

### 总结

When you finish reading this article, you will know the love with us ，Happy Valentine’s Day！