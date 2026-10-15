# 盒模型与 BFC

## 基础要点

每个元素在页面中都被表示为一个**矩形盒子**，由内到外为：`content` → `padding` → `border` → `margin`。

```css
.box {
  width: 200px;        /* 内容区宽度 */
  padding: 20px;
  border: 2px solid #333;
  margin: 10px;
}
```

### 两种盒模型

| 模式 | 设置 | `width` 包含范围 |
|------|------|------------------|
| 标准盒模型（content-box） | 默认 | 仅 content |
| 替代/IE 盒模型（border-box） | `box-sizing: border-box` | content + padding + border |

> 实际工程中几乎都会全局设置 `*{ box-sizing: border-box; }`，让 `width` 直观代表元素总占用宽度。

## 深入原理：BFC

**BFC（Block Formatting Context，块级格式化上下文）** 是页面的一块独立渲染区域，内部布局不影响外部。

### 触发 BFC 的常见条件

- `overflow` 不为 `visible`（如 `overflow: hidden`）
- `display: flow-root`（最干净、无副作用的触发方式）
- `float` 不为 `none`
- `position: absolute / fixed`
- `display: flex / grid` 的直接子项

### BFC 解决的问题

1. **清除浮动**：父元素触发 BFC 后可包含浮动的子元素，避免高度塌陷。
2. **阻止外边距塌陷**：相邻块级元素的垂直 `margin` 会合并，BFC 之间不会。
3. **隔离布局**：内部浮动、margin 不影响外部。

```css
.card {
  display: flow-root; /* 触发 BFC，干净地包含内部浮动 */
}
```

## 外边距塌陷（Margin Collapsing）

相邻兄弟元素、父子元素（无 border/padding 间隔时）的垂直外边距会**取较大值而非相加**。触发 BFC 或插入 `border`/`padding` 可阻止。

## 面试要点

- `box-sizing: border-box` 让宽度计算符合直觉，工程默认。
- BFC 是独立渲染上下文，可清除浮动、隔离 margin、阻止塌陷。
- 首选 `display: flow-root` 触发 BFC，副作用最小。
