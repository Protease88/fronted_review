import { useRef, useState } from 'react';
import { downloadBackup, importBackup } from './storage';
import Button from '../components/ui/Button';

// 数据备份入口：导出为 JSON 文件 / 从 JSON 文件覆盖式恢复
// onImported：导入成功后由页面回调刷新自身状态
export default function BackupButtons({ onImported }) {
  const inputRef = useRef(null);
  const [msg, setMsg] = useState(null);

  function handleExport() {
    downloadBackup();
    setMsg({ type: 'ok', text: '备份已下载' });
  }

  function handlePick() {
    setMsg(null);
    inputRef.current?.click();
  }

  async function handleFile(e) {
    const file = e.target.files?.[0];
    // 清空 value，保证重复选择同一文件仍会触发 change
    e.target.value = '';
    if (!file) return;

    if (!window.confirm('导入将覆盖当前浏览器里的错题本与答题统计，确定继续？')) return;

    try {
      const text = await file.text();
      const { wrongCount } = importBackup(text);
      setMsg({ type: 'ok', text: `已导入 ${wrongCount} 道错题与统计` });
      onImported?.();
    } catch (err) {
      setMsg({ type: 'err', text: `导入失败：${err.message}` });
    }
  }

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-2">
        <Button variant="secondary" size="sm" onClick={handleExport}>
          导出备份
        </Button>
        <Button variant="secondary" size="sm" onClick={handlePick}>
          导入备份
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleFile}
        />
      </div>
      {msg && (
        <p
          className={`text-[13px] ${msg.type === 'ok' ? 'text-tone-success' : 'text-tone-danger'}`}
          role="status"
        >
          {msg.text}
        </p>
      )}
    </div>
  );
}
