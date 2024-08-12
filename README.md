# dialog

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

开源地址：

## 目录

- [介绍](#介绍)
- [安装](#安装)
- [快速开始](#快速开始)
- [属性说明](#属性说明)
- [事件](#事件)
- [方法](#方法)
- [自定义样式](#自定义样式)
- [示例](#示例)
- [发布](#发布)
- [贡献指南](#贡献指南)
- [维护者](#维护者)
- [许可证](#许可证)
- [致谢](#致谢)

## 介绍

简要介绍该组件的功能和用途。

## 安装

```bash
pnpm add dyn-components --save-dev
```

修改 vite.config.js

```ts
import { defineConfig } from "vite";
import DynComponents from "dyn-components";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [DynComponents()],
});
```

## 快速开始

```ts
// global import theme.css
import "dyn-components/theme.css";
```

```vue
<template>
  <dyn-web-dialog modal open draggable closeable width="300px">
    <div slot="header">标题</div>
    <div>
      Body Body Body BodyBody Body Body BodyBody Body Body Body Body Body Body
      BodyBody Body Body BodyBody Body Body Body
    </div>
    <div slot="footer">Footer</div>
  </dyn-web-dialog>
</template>
```

## 属性说明

## 属性（Props）

| 属性名     | 类型      | 默认值 | 必填 | 描述              |
| ---------- | --------- | ------ | ---- | ----------------- |
| modal      | `boolean` |        |      | 是否为模态框      |
| open       | `boolean` |        |      | 是否默认打开      |
| draggable  | `boolean` |        |      | 是否可拖拽        |
| closeable  | `boolean` |        |      | 是否显示关闭按钮  |
| fullscreen | `boolean` |        |      | 是否为全屏 Dialog |
| width      | `string`  |        |      | 对话框宽度        |
| min-width  | `string`  |        |      | 对话框最小宽度    |
| height     | `string`  |        |      | 对话框高度        |
| min-height | `string`  |        |      | 对话框最小高度    |

## 发布

```bash
dyn-components publish
```
