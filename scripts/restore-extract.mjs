/**
 * 还原脚本：从 CodeBuddy 本地留存数据中提取「前端面试复习网站」源码。
 *
 * 背景：原项目 d:/myproject/student/day2 已被删除且回收站无副本，
 * 唯一来源是 CodeBuddy 的本地会话记录（JSONL）与文件快照（file-history）。
 *
 * 数据来源优先级：
 *   1) file-history 快照 —— 通过 JSONL 中 type=file-history-snapshot 记录
 *      的 snapshot.trackedFileBackups 反查「原始路径 → backupFileName」，
 *      取到的即是该文件最后一次被写入/编辑后的完整内容（含 Edit 叠加结果）。
 *   2) Write / Edit 回放 —— 解析 type=function_call 的 arguments（JSON 字符串，
 *      需二次 parse），按时间顺序回放，作为快照缺失时的兜底。
 *
 * 用法：node scripts/restore-extract.mjs
 */
import fs from 'node:fs';
import path from 'node:path';

const BUDDY_DIR = 'C:/Users/lenovo/.codebuddy';
const SESSION_FILES = [
  'projects/d-myproject-student-day2/7c57efcc-0cb2-41a3-8dc3-eaeaefb004a4.jsonl',
  'projects/d-myproject-student-day2/877fee01-07df-4474-8fb0-b58d6dbcb0dd.jsonl',
  'projects/d-myproject-student-day2/eb70f1d4-f358-49b4-b960-2264847924e5.jsonl',
];
const OLD_ROOT = 'd:/myproject/student/day2';
const NEW_ROOT = 'd:/myproject/frontend-review';

/** 不还原的目录：openspec 是变更管理文档，与本网站运行无关 */
const EXCLUDE_PREFIXES = [
  'openspec/',
  'node_modules/',
  '.codebuddy/',
  'dist/',
];

const norm = (p) => String(p).replace(/\\/g, '/');
const versionOf = (backupFileName) => {
  const m = /@v(\d+)$/.exec(backupFileName || '');
  return m ? Number(m[1]) : 0;
};
const isProjectFile = (relPath) =>
  relPath && !EXCLUDE_PREFIXES.some((p) => relPath === p.slice(0, -1) || relPath.startsWith(p));

/**
 * 归一化成相对 OLD_ROOT 的路径。
 * trackedFileBackups 的 key 有两种形态：
 *   - 绝对路径：d:/myproject/student/day2/src/App.jsx
 *   - 相对 cwd 的路径：openspec\changes\add-todo-cli\proposal.md
 * 不属于该项目的（如 .codebuddy 下的 memory）返回 null。
 */
function toRelPath(rawPath) {
  const p = norm(rawPath);
  const root = norm(OLD_ROOT);
  if (p.toLowerCase().startsWith(root.toLowerCase())) {
    return p.slice(root.length).replace(/^\/+/, '');
  }
  if (/^[a-z]:/i.test(p)) return null; // 其它盘的绝对路径
  return p.replace(/^\.\//, '');
}

/** 读取 JSONL 全部行，容错跳过解析失败的行 */
function readLines(file) {
  const raw = fs.readFileSync(file, 'utf8');
  return raw
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line, i) => {
      try {
        return { line: i + 1, obj: JSON.parse(line) };
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function parseArguments(obj) {
  if (!obj || typeof obj.arguments !== 'string') return null;
  try {
    return JSON.parse(obj.arguments);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// 第一遍：收集快照映射（路径 → {sessionDir, backupFileName, version}）
//         同时收集 Write / Edit 调用，按时间排序后回放
// ---------------------------------------------------------------------------
const snapshotMap = new Map(); // relPath -> {sessionDir, backupFileName, version}
const ops = []; // 按时间顺序回放的写操作：{kind:'write'|'edit', ts, rel, ...}
const stats = { snapshots: 0, writeCalls: 0, editCalls: 0 };

for (const relSession of SESSION_FILES) {
  const sessionFile = path.join(BUDDY_DIR, relSession);
  if (!fs.existsSync(sessionFile)) {
    console.warn(`[跳过] 会话文件不存在：${sessionFile}`);
    continue;
  }
  const sessionDir = path.basename(relSession, '.jsonl');
  const sessionIdx = SESSION_FILES.indexOf(relSession); // 会话按时间先后排列，后一个会话的文件状态更新
  const rows = readLines(sessionFile);

  for (const { line, obj } of rows) {
    // 1) 快照映射
    if (obj.type === 'file-history-snapshot' && obj.snapshot?.trackedFileBackups) {
      for (const [absPath, meta] of Object.entries(obj.snapshot.trackedFileBackups)) {
        const rel = toRelPath(absPath);
        if (!isProjectFile(rel)) continue;
        // isSnapshotUpdate 的中间态只带 version，没有备份文件，跳过
        if (!meta?.backupFileName) continue;
        const version = versionOf(meta.backupFileName);
        const prev = snapshotMap.get(rel);
        // 后一个会话的状态一定更新（会话按时间排序），故会话优先于版本号；
        // 同一会话内则取版本号更大的。若仅按版本号比较，旧会话的高版本会误覆盖新会话的低版本。
        if (
          !prev ||
          sessionIdx > prev.sessionIdx ||
          (sessionIdx === prev.sessionIdx && version >= prev.version)
        ) {
          snapshotMap.set(rel, {
            sessionDir,
            sessionIdx,
            backupFileName: meta.backupFileName,
            version,
          });
          stats.snapshots++;
        }
      }
      continue;
    }

    // 2) 工具调用
    if (obj.type !== 'function_call') continue;
    const args = parseArguments(obj);
    if (!args || typeof args.file_path !== 'string') continue;
    const rel = toRelPath(args.file_path);
    if (!isProjectFile(rel)) continue;

    if (obj.name === 'Write' && typeof args.content === 'string') {
      ops.push({ kind: 'write', ts: obj.timestamp ?? line, rel, content: args.content });
      stats.writeCalls++;
    } else if (
      obj.name === 'Edit' &&
      typeof args.old_string === 'string' &&
      typeof args.new_string === 'string'
    ) {
      ops.push({
        kind: 'edit',
        ts: obj.timestamp ?? line,
        rel,
        oldString: args.old_string,
        newString: args.new_string,
      });
      stats.editCalls++;
    }
  }
}

console.log('=== 扫描结果 ===');
console.log(`快照记录命中：${stats.snapshots} 条（去重后文件 ${snapshotMap.size} 个）`);
console.log(`Write 调用：${stats.writeCalls} 次，Edit 调用：${stats.editCalls} 次`);

// ---------------------------------------------------------------------------
// 第二遍：Write + Edit 回放，得到每个文件的最终内容（兜底来源）
// ---------------------------------------------------------------------------
// 关键：Write 与 Edit 必须按真实时间顺序混合回放。
// 若先把所有 Write 排完再统一叠加 Edit，则「Write v2 已包含某次 Edit」的情况会重复叠加或匹配失败。
const replay = new Map();
const history = new Map(); // rel -> 每次写操作后的内容快照，用于判定备份语义
let editApplied = 0;
let editSkipped = 0;
for (const op of [...ops].sort((a, b) => a.ts - b.ts)) {
  let next = null;
  if (op.kind === 'write') {
    next = op.content;
  } else {
    const base = replay.get(op.rel);
    if (base === undefined) continue;
    if (!base.includes(op.oldString)) {
      // 历史上有一次失败的 Edit（String not found），以及已被后续 Write 覆盖的 Edit，均属正常
      console.warn(`[跳过 Edit] ${op.rel}：未匹配到 old_string`);
      editSkipped++;
      continue;
    }
    next = base.replace(op.oldString, op.newString);
    editApplied++;
  }
  replay.set(op.rel, next);
  if (!history.has(op.rel)) history.set(op.rel, []);
  history.get(op.rel).push(next);
}
console.log(`Edit 回放：成功叠加 ${editApplied} 次，跳过 ${editSkipped} 次`);

// ---------------------------------------------------------------------------
// 第三遍：合并两个来源并落盘
// 实证结论：file-history 的备份拍摄于「修改前」。判据是
//   - src/quiz/Wrong.jsx 快照只渲染 w.stem、无选项，而最后一次 Edit 正是补上选项；
//   - src/App.jsx 快照没有 /interview 路由，而那是 Phase 3 最后接入的。
// 因此最高版本的快照反而缺少最后一次修改，必须以 Write/Edit 回放为准，快照仅作补缺。
// ---------------------------------------------------------------------------
const HISTORY_DIR = path.join(BUDDY_DIR, 'file-history');
const relations = { exactFinal: 0, preModify: 0, unknown: 0, snapshotOnly: 0 };
const manifest = [];
let written = 0;

const allRels = new Set([...snapshotMap.keys(), ...replay.keys()]);

for (const rel of [...allRels].sort()) {
  const snap = snapshotMap.get(rel);
  let content = null;
  let source = '';

  if (replay.has(rel)) {
    content = replay.get(rel);
    source = 'replay:write+edit';
  }

  if (content === null && snap) {
    const snapFile = path.join(HISTORY_DIR, snap.sessionDir, snap.backupFileName);
    if (fs.existsSync(snapFile)) {
      content = fs.readFileSync(snapFile, 'utf8');
      source = `snapshot:${snap.sessionDir}/${snap.backupFileName}`;
    } else {
      console.warn(`[快照缺失] ${rel} -> ${snapFile}`);
    }
  }

  if (content === null) {
    console.warn(`[无法还原] ${rel}`);
    continue;
  }

  const outPath = path.join(NEW_ROOT, rel.split('/').join(path.sep));
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, content, 'utf8');
  written++;

  // 交叉校验：快照内容与回放结果比对，用于确认还原结果可靠
  let note = '';
  if (snap) {
    const snapFile = path.join(HISTORY_DIR, snap.sessionDir, snap.backupFileName);
    if (fs.existsSync(snapFile)) {
      const snapContent = fs.readFileSync(snapFile, 'utf8');
      const fin = replay.get(rel);
      const states = history.get(rel) || [];
      if (fin === undefined) {
        note = '仅快照可得（回放无记录）';
        relations.snapshotOnly++;
      } else if (snapContent === fin) {
        note = '快照与回放一致';
        relations.exactFinal++;
      } else if (states.includes(snapContent)) {
        note = '快照落后于最终态（备份拍于修改前），已采用回放';
        relations.preModify++;
      } else {
        note = '快照与回放各版本均不匹配，需人工核对';
        relations.unknown++;
      }
    }
  }
  manifest.push({ file: rel, bytes: Buffer.byteLength(content, 'utf8'), source, note });
}

console.log('\n=== 备份语义判定（快照 vs 回放）===');
console.log(`  快照 == 回放最终态：      ${relations.exactFinal} 个`);
console.log(`  快照落后（备份拍于修改前）：${relations.preModify} 个`);
console.log(`  仅快照可得：              ${relations.snapshotOnly} 个`);
console.log(`  无法匹配：                ${relations.unknown} 个`);

console.log(`\n=== 落盘完成：${written} 个文件 -> ${NEW_ROOT} ===`);
for (const m of manifest) {
  console.log(
    `  ${String(m.bytes).padStart(7)} B  ${m.file}${m.note ? '  <' + m.note + '>' : ''}`
  );
}

// 额外输出：被排除的文件，便于核对是否遗漏
const excluded = [];
for (const relSession of SESSION_FILES) {
  const sessionFile = path.join(BUDDY_DIR, relSession);
  if (!fs.existsSync(sessionFile)) continue;
  for (const { obj } of readLines(sessionFile)) {
    if (obj.type === 'file-history-snapshot' && obj.snapshot?.trackedFileBackups) {
      for (const absPath of Object.keys(obj.snapshot.trackedFileBackups)) {
        const rel = toRelPath(absPath);
        if (rel && !isProjectFile(rel)) excluded.push(rel);
      }
    }
  }
}
if (excluded.length) {
  console.log(`\n=== 已排除（非网站源码）${[...new Set(excluded)].length} 个 ===`);
  for (const e of [...new Set(excluded)].sort()) console.log(`  ${e}`);
}

fs.mkdirSync(path.join(NEW_ROOT, 'scripts'), { recursive: true });
fs.writeFileSync(
  path.join(NEW_ROOT, 'scripts', 'restore-manifest.json'),
  JSON.stringify({ generatedAt: new Date().toISOString(), root: NEW_ROOT, files: manifest }, null, 2),
  'utf8'
);
console.log('\n清单已写入 scripts/restore-manifest.json');
