# mktmp
>个人工作项目需求，比较多重复的工作，于是自己做了这么个东西给自己用，减少自己的工作量以及工作重复性

目前支持三种命令格式

1.  default
    ```shell
        mktmp -f <filename>
    ```
    会在执行命令的子目录components创建\<filename\>.vue及子目录styles创建\<filename\>.scss文件，文件模板在目录/tmp下

2.  mult

    功能同default，用于批量创建
3.  init
    初始化项目模板
    ```shell
        mktmp init
    ```
    可选项：
        -t \<template url\>
    可传入自定义的模板url
