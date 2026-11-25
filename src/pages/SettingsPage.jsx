import { useCallback, useEffect, useState } from 'react';
import Notice from '../components/common/Notice';
import SystemSettingsForm from '../components/settings/SystemSettingsForm';
import UserManagement from '../components/settings/UserManagement';
import { getSettings, updateSettings, listUsers, createUser, updateUser } from '../services/settingsService';

export const SETTINGS_UPDATED_EVENT = 'fims:settings-updated';

export default function SettingsPage() {
  const [settings, setSettings] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // 초기 조회 오류는 덮어쓰지 않고 함께 표시
  const addError = (msg) => setError((prev) => (prev && !prev.includes(msg) ? `${prev} / ${msg}` : msg));

  const loadUsers = useCallback(async () => {
    try {
      setUsers(await listUsers());
    } catch (e) {
      addError(`사용자 목록을 불러오지 못했습니다: ${e.message}`);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    getSettings()
      .then((s) => (s ? setSettings(s) : addError('시스템 설정 행이 없습니다. supabase/settings.sql을 실행하세요.')))
      .catch((e) => addError(`시스템 설정을 불러오지 못했습니다: ${e.message}`));
    loadUsers();
  }, [loadUsers]);

  const run = async (fn, okMessage) => {
    setError(''); setMessage('');
    try {
      await fn();
      if (okMessage) setMessage(okMessage);
      return true;
    } catch (e) {
      setError(`저장에 실패했습니다: ${e.message}`);
      return false;
    }
  };

  const handleSettings = async (values) => {
    setSaving(true);
    await run(async () => {
      setSettings(await updateSettings(values));
      window.dispatchEvent(new Event(SETTINGS_UPDATED_EVENT)); // 사이드바 공장명 갱신
    }, '시스템 설정이 저장되었습니다.');
    setSaving(false);
  };

  const handleCreate = async (values) => {
    setBusyId('new');
    const ok = await run(async () => { await createUser(values); await loadUsers(); }, '사용자가 추가되었습니다.');
    setBusyId(null);
    return ok;
  };

  const handleUpdate = async (id, values) => {
    setBusyId(id);
    await run(async () => { await updateUser(id, values); await loadUsers(); });
    setBusyId(null);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Notice>{error}</Notice>
      <Notice type="success">{message}</Notice>
      <div className="grid gap-4 sm:gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <SystemSettingsForm settings={settings} onSubmit={handleSettings} saving={saving} />
        </div>
        <div className="xl:col-span-3">
          <UserManagement users={users} loading={loadingUsers} onCreate={handleCreate} onUpdate={handleUpdate} busyId={busyId} />
        </div>
      </div>
      <p className="text-xs text-slate-500">
        ※ 로그인 기능은 아직 구현되지 않았습니다. 사용자 관리는 담당자 명부이며, 정비 등록 시 담당자 추천 목록으로 사용됩니다.
      </p>
    </div>
  );
}
