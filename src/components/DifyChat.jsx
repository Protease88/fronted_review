import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// token 从构建时环境变量注入（GitHub Actions Secrets / 本地 .env.local），不写入仓库
const DIFY_TOKEN = import.meta.env.VITE_DIFY_TOKEN;
const DIFY_BASE_URL = import.meta.env.VITE_DIFY_BASE_URL || 'https://udify.app';
const SCRIPT_ID = 'dify-embed-script';

// 由 embed.min.js 注入的两个元素
const BUBBLE_ID = 'dify-chatbot-bubble-button';
const WINDOW_ID = 'dify-chatbot-bubble-window';

const DRAG_THRESHOLD = 4; // px：位移小于此值仍算点击，不算拖动
const EDGE_PADDING = 8; // 距离视口边缘的最小留白

/**
 * 给气泡挂上拖拽能力。
 *
 * 气泡是第三方脚本注入的元素，样式由对方控制，所以这里不动它的
 * bottom/right（会和 !important 打架），而是叠加 transform 位移——
 * 这样既不影响原有定位，拖拽也只是相对偏移。
 */
function makeDraggable(btn) {
  let offsetX = 0; // 已应用的位移
  let offsetY = 0;
  let baseX = 0; // 本次按下时的起始位移
  let baseY = 0;
  let startX = 0; // 本次按下的指针坐标
  let startY = 0;
  let dragging = false;
  let moved = false;

  btn.style.touchAction = 'none'; // 触屏拖动时不要顺带滚页面
  btn.style.userSelect = 'none';
  btn.style.cursor = 'grab';

  // 聊天窗口与气泡是同级元素，跟着一起平移，否则拖走了按钮、窗口还留在右下角
  const windowEl = () => document.getElementById(WINDOW_ID);

  const apply = (x, y) => {
    offsetX = x;
    offsetY = y;
    const t = `translate(${x}px, ${y}px)`;
    btn.style.transform = t;
    const w = windowEl();
    if (w && !btn.contains(w)) w.style.transform = t;
  };

  // 限制在视口内：先还原出未加 transform 时的位置，再算允许的位移区间
  const clamp = (x, y) => {
    const r = btn.getBoundingClientRect();
    const left = r.left - offsetX;
    const top = r.top - offsetY;
    return {
      x: Math.min(
        Math.max(x, EDGE_PADDING - left),
        window.innerWidth - r.width - EDGE_PADDING - left
      ),
      y: Math.min(
        Math.max(y, EDGE_PADDING - top),
        window.innerHeight - r.height - EDGE_PADDING - top
      ),
    };
  };

  const onDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragging = true;
    moved = false;
    startX = e.clientX;
    startY = e.clientY;
    baseX = offsetX;
    baseY = offsetY;
    btn.style.transition = 'none'; // 拖拽期间关掉过渡，否则跟手有延迟
    btn.style.cursor = 'grabbing';
    btn.setPointerCapture?.(e.pointerId);
  };

  const onMove = (e) => {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (!moved && Math.abs(dx) + Math.abs(dy) < DRAG_THRESHOLD) return;
    moved = true;
    const next = clamp(baseX + dx, baseY + dy);
    apply(next.x, next.y);
  };

  const onUp = (e) => {
    if (!dragging) return;
    dragging = false;
    btn.style.transition = '';
    btn.style.cursor = 'grab';
    btn.releasePointerCapture?.(e.pointerId);
  };

  // 拖完松手会紧跟着触发 click，这里抢在第三方脚本前拦掉，否则一松手就弹出聊天窗口
  const onClick = (e) => {
    if (!moved) return;
    moved = false;
    e.stopPropagation();
    e.preventDefault();
  };

  // 缩窗口后气泡可能被挤到视口外，重新夹紧一次
  const onResize = () => {
    if (!offsetX && !offsetY) return;
    const next = clamp(offsetX, offsetY);
    apply(next.x, next.y);
  };

  btn.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);
  window.addEventListener('pointercancel', onUp);
  window.addEventListener('resize', onResize);
  btn.addEventListener('click', onClick, true); // 捕获阶段，先于第三方脚本

  return () => {
    btn.removeEventListener('pointerdown', onDown);
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
    window.removeEventListener('resize', onResize);
    btn.removeEventListener('click', onClick, true);
  };
}

/**
 * Dify 网页嵌入。挂载在 Layout 中，全站常驻。
 *
 * 注意：不能把 <script> 写进 JSX —— React 用 innerHTML 插入的脚本不会执行，
 * 必须手动创建 script 元素并追加到 DOM。
 *
 * 配置对象必须在 embed.min.js 加载前挂到 window 上，否则脚本读不到 token。
 * 嵌入脚本会向 body 注入悬浮气泡，是全局副作用，因此只用 id 做一次幂等保护。
 */
export default function DifyChat() {
  const location = useLocation();
  const onHome = location.pathname === '/';

  // 仅首页在气泡旁显示提示条；离开首页即移除
  useEffect(() => {
    if (!onHome) return;
    document.body.classList.add('dify-hint-home');
    return () => document.body.classList.remove('dify-hint-home');
  }, [onHome]);

  useEffect(() => {
    // 未配置 token（如本地未设环境变量）时静默跳过，不影响站点其他功能
    if (!DIFY_TOKEN || document.getElementById(SCRIPT_ID)) return;

    window.difyChatbotConfig = {
      token: DIFY_TOKEN,
      baseUrl: DIFY_BASE_URL,
      inputs: {},
      systemVariables: {},
      userVariables: {},
    };

    const script = document.createElement('script');
    script.src = `${DIFY_BASE_URL}/embed.min.js`;
    script.id = SCRIPT_ID;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  // 气泡由外部脚本异步注入，得等它出现在 DOM 里才能挂事件
  useEffect(() => {
    let detach = null;
    let observer = null;
    let hideHint = null;

    const tryAttach = () => {
      const btn = document.getElementById(BUBBLE_ID);
      if (!btn) return false;
      if (btn.dataset.difyDraggable) return true;
      btn.dataset.difyDraggable = '1';
      detach = makeDraggable(btn);
      // 点开聊天窗口后，提示条已完成使命，隐藏掉
      hideHint = () => document.body.classList.remove('dify-hint-home');
      btn.addEventListener('click', hideHint, true);
      return true;
    };

    if (!tryAttach()) {
      observer = new MutationObserver(() => {
        if (tryAttach()) {
          observer.disconnect();
          observer = null;
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      observer?.disconnect();
      detach?.();
      const btn = document.getElementById(BUBBLE_ID);
      if (btn && hideHint) btn.removeEventListener('click', hideHint, true);
    };
  }, []);

  return null;
}
