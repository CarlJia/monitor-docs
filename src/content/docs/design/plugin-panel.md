---
title: 面板页面协议
description: 插件在面板里画 UI —— 返回的 JSON 描述与表单字段规则。
---

manifest 声明 `[page]` 时，插件可以在面板里画一个自定义页面。

`render_page` 必须经 `host_resp_alloc` 拿一段缓冲、写入 JSON 描述、返回写入字节数。`on_action` 同样的协议：body 是 `{action, ...}` 的 JSON，返回新页面描述（操作完成后整页重渲染）。

`render_page` 允许带一次性副作用（例如尚无缓存时顺手拉一次汇率），但它每次打开页面和刷新都会被调用，所以这类工作必须**幂等且有界**。

## 返回 JSON 形如

```json
{
  "title": "财务统计",
  "toast": {"kind": "success", "text": "已保存"},
  "blocks": [
    {"type": "notice", "kind": "warning", "text": "汇率不可用……"},
    {"type": "stat", "items": [
      {"label": "展示币种", "select": {"value": "CNY", "action": "set_currency",
        "options": [{"value":"CNY","label":"¥ CNY"},{"value":"USD","label":"$ USD"}]}},
      {"label": "年化续费总成本", "value": "¥128.40"},
      {"label": "剩余总价值", "value": "¥64.20"}
    ]},
    {"type": "table", "title": "7 天内到期（3）",
     "columns": ["节点", "到期日", "剩余天数"],
     "rows": [["edge-1","2026-10-01",3]]},
    {"type": "form", "title": "节点财务数据", "action": "save_node",
     "fields": [
       {"name": "price", "label": "价格", "type": "money", "prefix_key": "price_symbol"},
       {"name": "currency", "label": "币种", "type": "select",
        "options": [{"value":"CNY","label":"¥ CNY"},{"value":"USD","label":"$ USD"}]},
       {"name": "expires_at", "label": "到期日", "type": "date"}
     ],
     "rows": [{"id":1,"name":"edge-1","price":12.5,"price_symbol":"$","currency":"USD",
               "expires_at":"2027-01-01"}]}
  ]
}
```

## 支持的 block type

- **`notice`** — `kind: warning` 高亮，其余中性背景。
- **`stat`** — `items: [{label,value}]`；某格写成 `{label, select}` 就是标签 + 下拉；格子数决定列数，1–4 格各自等宽分栏。
- **`select`** — 提交 `{action, value}`；`options` 与 form 字段同规则。
- **`table`** — `rows: unknown[][]`。
- **`form`** — `rows: {id, ...fields}`，提交 `{action, id, ...fields}`。

未知 `type` 被前端静默忽略，不报错。

## toast（操作回执）

顶层可选的 `toast` 是 `{"kind": …, "text": …}`，面板在 `on_action` 的响应到达时弹一次。`kind` 取 `success` / `error` / `info` / `warning`，省略或写别的按 `success`；`text` 为空就不弹。**初始 `render_page` 的响应不触发提示**——否则每次打开页面都会重播上一次操作的结果。失败分支也走这条路：把原因写进 `toast.text`（`kind: "error"`）比只塞状态码更直接。

## form 字段规则

`fields` 有两种形态，都接受：裸字符串数组，或 `{name, label, type, options, prefix_key}` 对象数组。

- `name`（必填）是提交载荷里的键，也是取值时的键；没有名字的条目被丢弃。
- `label` 是列头文案，缺省时用字段名。
- `type` 取 `text` / `number` / `date` / `money` / `select`。**声明优先**：写了 `type` 即按声明渲染与提交。
- `money` 是数字的展示形态：右对齐、两位小数，提交时仍按数字处理。
- `prefix_key` 让一列的值前面显示**同一行**里另一个键的文本（如币种符号），只当前缀、不多出一列。
- `select` 需一并给 `options`，没给会回退到字段名启发式。`options` 每项可以是裸字符串或 `{value, label}` 对象；**提交的永远是 `value`**。
- `type` 缺省或认不出时回退到旧式字段名启发式：名字含 `price`/`cost`/`amount` 用数字框，以 `at` 结尾用日期框，其余文本框。

数字字段清空表示「不改这个字段」，不会存成 0（`Number("")` 是 0，而 0 常有实际含义，如财务插件的 0 表示免费）。`select` 表达不了「清空」，需要可清空的字段应声明成文本字段。行内控件与「保存」共用一把锁：一次 action 在途时整表禁用。

## 原文链接

- 面板页面协议与表单字段：[`CarlJia/monitor` README](https://github.com/CarlJia/monitor/blob/main/README.md) 「面板页面协议」小节
