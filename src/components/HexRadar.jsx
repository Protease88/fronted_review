// 首页装饰用：六边形能力雷达图（游戏化属性面板风格）
// 六个维度的值代表各知识方向的掌握强度，形状越饱满越强。

const AXES = [
  { key: 'js', label: 'JavaScript', value: 88, color: '#B4721F' },
  { key: 'css', label: 'CSS', value: 70, color: '#3D7A75' },
  { key: 'net', label: '网络 / HTTP', value: 64, color: '#14654F' },
  { key: 'eng', label: '工程化', value: 76, color: '#C0562F' },
  { key: 'browser', label: '浏览器', value: 56, color: '#8C8579' },
  { key: 'frame', label: '框架', value: 82, color: '#2E7D5B' },
];

const CX = 200;
const CY = 168;
const R = 100;

const RINGS = [0.25, 0.5, 0.75, 1];
const TICKS = [0.25, 0.5, 0.75];
const LABEL_ANCHOR = ['middle', 'start', 'start', 'middle', 'end', 'end'];

function pointAt(index, ratio) {
  const angle = ((-90 + 60 * index) * Math.PI) / 180;
  return [CX + R * ratio * Math.cos(angle), CY + R * ratio * Math.sin(angle)];
}

function toPoly(ratios) {
  return ratios.map((ratio, i) => pointAt(i, ratio).map((n) => n.toFixed(1)).join(' ')).join(' ');
}

const SCORE = Math.round(AXES.reduce((sum, a) => sum + a.value, 0) / AXES.length);

// 扫描扇形：从中心出发的 60° 渐变扇面，缓慢绕中心旋转
const sweepStart = pointAt(0, 1);
const sweepEnd = pointAt(1, 1);
const SWEEP_PATH = `M${CX} ${CY} L${sweepStart[0].toFixed(1)} ${sweepStart[1].toFixed(
  1,
)} A${R} ${R} 0 0 1 ${sweepEnd[0].toFixed(1)} ${sweepEnd[1].toFixed(1)} Z`;

export default function HexRadar() {
  return (
    <svg
      viewBox="0 0 400 340"
      role="img"
      aria-label={`六维能力雷达图：${AXES.map((a) => `${a.label} ${a.value}`).join('，')}，综合 ${SCORE} 分`}
      className="hidden h-[290px] w-[340px] shrink-0 animate-drift sm:block lg:h-[326px] lg:w-[384px]"
      fill="none"
    >
      <defs>
        <linearGradient id="radarArea" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14654F" stopOpacity="0.44" />
          <stop offset="55%" stopColor="#3D7A75" stopOpacity="0.30" />
          <stop offset="100%" stopColor="#C0562F" stopOpacity="0.36" />
        </linearGradient>
        <linearGradient id="radarEdge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#14654F" />
          <stop offset="60%" stopColor="#3D7A75" />
          <stop offset="100%" stopColor="#C0562F" />
        </linearGradient>
        <radialGradient id="radarCore" cx="50%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#1F7A61" />
          <stop offset="100%" stopColor="#0A3629" />
        </radialGradient>
        <linearGradient id="radarSweep" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#14654F" stopOpacity="0.20" />
          <stop offset="100%" stopColor="#C0562F" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* 雷达扫描扇面 */}
      <g className="radar-sweep">
        <path d={SWEEP_PATH} fill="url(#radarSweep)" />
      </g>

      {/* 同心六边形网格 */}
      {RINGS.map((ratio) => (
        <polygon
          key={ratio}
          points={toPoly(AXES.map(() => ratio))}
          fill={ratio === 1 ? 'rgba(255,255,255,0.5)' : 'none'}
          stroke={ratio === 1 ? '#D8D0C2' : '#E3DCCF'}
          strokeWidth={ratio === 1 ? 1.3 : 0.9}
          strokeDasharray={ratio === 1 ? undefined : '3 5'}
        />
      ))}

      {/* 轴线 */}
      {AXES.map((axis, i) => {
        const [x, y] = pointAt(i, 1);
        return <line key={axis.key} x1={CX} y1={CY} x2={x} y2={y} stroke="#E3DCCF" strokeWidth="1" />;
      })}

      {/* 轴刻度 */}
      {AXES.map((axis, i) =>
        TICKS.map((ratio) => {
          const [x, y] = pointAt(i, ratio);
          return <circle key={`${axis.key}-${ratio}`} cx={x} cy={y} r="1.8" fill="#CDC5B7" />;
        }),
      )}

      {/* 能力面：形状随各维度强弱起伏 */}
      <polygon
        className="radar-area"
        points={toPoly(AXES.map((a) => a.value / 100))}
        fill="url(#radarArea)"
        stroke="url(#radarEdge)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* 顶点：光晕脉冲 + 实心节点 */}
      {AXES.map((axis, i) => {
        const [x, y] = pointAt(i, axis.value / 100);
        return (
          <g key={axis.key}>
            <circle cx={x} cy={y} r="8" fill={axis.color} opacity="0.2">
              <animate
                attributeName="r"
                values="7;11.5;7"
                dur="2.8s"
                begin={`${i * 0.4}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.24;0.05;0.24"
                dur="2.8s"
                begin={`${i * 0.4}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle cx={x} cy={y} r="4.8" fill={axis.color} stroke="#FFFFFF" strokeWidth="2" />
          </g>
        );
      })}

      {/* 维度标签 */}
      {AXES.map((axis, i) => {
        const [x, y] = pointAt(i, 1.29);
        return (
          <g key={axis.key}>
            <text
              x={x}
              y={y - 2}
              textAnchor={LABEL_ANCHOR[i]}
              fontSize="14"
              fontWeight="600"
              fill={axis.color}
              fontFamily="inherit"
            >
              {axis.label}
            </text>
            <text
              x={x}
              y={y + 14}
              textAnchor={LABEL_ANCHOR[i]}
              fontSize="12"
              fill="#8C8579"
              fontFamily="inherit"
            >
              {axis.value} / 100
            </text>
          </g>
        );
      })}

      {/* 中心枢纽：综合分 */}
      <circle cx={CX} cy={CY} r="36" fill="#FFFFFF" opacity="0.7" />
      <circle cx={CX} cy={CY} r="31" fill="url(#radarCore)" />
      <circle cx={CX} cy={CY} r="31" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.5" />
      <text
        x={CX}
        y={CY + 1}
        textAnchor="middle"
        fontSize="21"
        fontWeight="700"
        fill="#FFFFFF"
        fontFamily="inherit"
      >
        {SCORE}
      </text>
      <text
        x={CX}
        y={CY + 15}
        textAnchor="middle"
        fontSize="9.5"
        letterSpacing="2"
        fill="rgba(255,255,255,0.75)"
        fontFamily="inherit"
      >
        综合
      </text>
    </svg>
  );
}
