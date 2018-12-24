---
layout: article
---
## Context-Free Grammar

上下文无关语法，简称CFG，G定义为四元组

$$G=\{N,\sum,P,S\}$$

- $N$ 是非终极符号的集合
- $\sum$ 是终极符号的集合
- $S$ 是初始符号
- $P$ 是重写规则

规则的形式为：$A\to \beta$ ,$A$为单独的`非终极符号`，$\beta$ 是`符号串`，它可以由`终极符号`,`非终极符号`,`终极符号和非终极符号混合`组成。

<!--more-->
Ex:

有如下的上下文无关语法{N,Σ, P, S}：
$N = \{S, NP, VP, PP, Prep, Verb, Noun\}$
$Σ = \{like, swat, flies, ants\}$
$S =\{S\}$
$P:$
$S \to NP\quad VP$
$S \to VP$
$NP \to Noun$
$NP \to Noun\quad PP$
$NP \to Noun\quad NP$
$VP \to Verb$
$VP \to Verb\quad NP$
$VP \to Verb\quad PP$
$VP \to Verb\quad NP\quad PP$
$PP \to Prep\quad NP$
$Prep \to like$（含义是“如,像”）
$Verb \to swat $（含义是“猛击”）
$Verb \to flies $（含义是“飞”，单数第三人称现在时）
$Verb \to likes$（含义是“喜欢”）
$Noun \to swat $（专有名词，苍蝇的名字）
$Noun \to flies$（含义是“苍蝇”，复数）
$Noun \to ants$ （含义是“蚂蚁”，复数）

使用上下文无关语法的剖析技术来剖析"swat flies like ants"，可以得到三个结构不同的树形图：
![paste image](http://cdn.lisongqian.cn/1524193538758b1ftjcld.png?imageslim)
具有这个树形图结构 T1 的句子的含义是“像猛击蚂蚁一样地猛击苍蝇”。
![paste image](http://cdn.lisongqian.cn/1524193568947310sxdch.png?imageslim)
具有这个树形图结构 T2 的句子的含义是“Swat 像蚂蚁一样地飞”。
![paste image](http://cdn.lisongqian.cn/15241935885453rpi5jv0.png?imageslim)
具有这个树形图结构 T3 的句子的含义是“叫做 Swat 的一些苍蝇喜欢蚂蚁”。

