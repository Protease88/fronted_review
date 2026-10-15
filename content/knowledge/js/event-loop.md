# 事件循环与微任务

## 基础要点

JavaScript 是**单线程**的，依靠**事件循环（Event Loop）**调度异步任务，避免阻塞。任务分为两个队列：

- **宏任务（macrotask）**：`setTimeout`、`setInterval`、I/O、`requestAnimationFrame`、UI 渲染。
- **微任务（microtask）**：`Promise.then/catch/finally`、`queueMicrotask`、`MutationObserver`、`async` 函数里 `await` 之后的代码。

## 深入原理

### 一轮循环的执行顺序

1. 执行一个**宏任务**（最初是同步脚本）。
2. 清空**所有微任务**（微任务队列清空后，才进入下一步）。
3. 必要时执行 UI 渲染。
4. 取下一个宏任务，回到第 1 步。

> 关键：**每个宏任务之后，会先把当前所有微任务一次性清空**，再取下一个宏任务。

### async/await 的本质

`async` 函数返回 Promise；`await` 之后的代码等价于 `.then` 回调，属于**微任务**。

## 经典例题

```js
console.log('1');

setTimeout(() => console.log('2'), 0);

Promise.resolve()
  .then(() => console.log('3'))
  .then(() => console.log('4'));

console.log('5');
```

**输出顺序：`1 5 3 4 2`**

解析：
- 同步代码先跑：`1`、`5`。
- 微任务队列：`3`、`4`（`.then` 链连续入队，本轮清空）。
- 下一轮宏任务：`2`（`setTimeout`）。

### 微任务插队

```js
setTimeout(() => console.log('macro'), 0);

Promise.resolve().then(() => {
  console.log('micro-1');
  Promise.resolve().then(() => console.log('micro-2'));
});
```

**输出：`micro-1 micro-2 macro`** —— 微任务执行中新增的微任务，会在这次清空过程中继续处理，因此仍在宏任务之前。

## 面试要点

- 单线程靠事件循环实现"并发"；宏任务之间穿插微任务与渲染。
- 微任务优先级高于宏任务；Promise 回调是微任务。
- 警惕在微任务里无限 `.then` 入队，会阻塞渲染与宏任务。
