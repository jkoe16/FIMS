import { useCallback, useEffect, useState } from 'react';
import { Plus, RefreshCw, AlertCircle } from 'lucide-react';
import EquipmentTable from '../components/equipment/EquipmentTable';
import EquipmentForm from '../components/equipment/EquipmentForm';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
  listEquipment, createEquipment, updateEquipment, deleteEquipment, subscribeEquipment,
} from '../services/equipmentService';

export default function EquipmentPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // null: 닫힘, {}: 등록, row: 수정
  const [deleting, setDeleting] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setItems(await listEquipment());
      setError('');
    } catch (e) {
      setError(`설비 목록을 불러오지 못했습니다: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    return subscribeEquipment(load); // DB 변경 시 즉시 재조회
  }, [load]);

  const handleSave = async (values) => {
    setSaving(true);
    try {
      if (editing?.id) await updateEquipment(editing.id, values);
      else await createEquipment(values);
      setEditing(null);
      await load();
    } catch (e) {
      setError(`저장에 실패했습니다: ${e.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setSaving(true);
    try {
      await deleteEquipment(deleting.id);
      setDeleting(null);
      await load();
    } catch (e) {
      setError(`삭제에 실패했습니다: ${e.message}`);
      setDeleting(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3 sm:px-5">
        <h2 className="font-semibold text-navy-900">설비 목록 <span className="text-sm font-normal text-slate-500">({items.length})</span></h2>
        <div className="flex gap-2">
          <button onClick={load} className="rounded-md border border-slate-300 p-2 text-slate-600 hover:bg-slate-50" aria-label="새로고침">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button onClick={() => setEditing({})} className="flex items-center gap-1 rounded-md bg-navy-700 px-3 py-2 text-sm font-semibold text-white hover:bg-navy-800">
            <Plus className="h-4 w-4" /> 설비 등록
          </button>
        </div>
      </div>

      {error && (
        <div className="m-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      {loading ? (
        <p className="px-5 py-12 text-center text-sm text-slate-500">불러오는 중...</p>
      ) : (
        <EquipmentTable items={items} onEdit={setEditing} onDelete={setDeleting} />
      )}

      {editing && <EquipmentForm initial={editing} saving={saving} onSubmit={handleSave} onClose={() => setEditing(null)} />}
      <ConfirmDialog
        open={Boolean(deleting)}
        title="설비 삭제"
        message={`'${deleting?.equipment_name}' 설비를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmLabel="삭제"
        loading={saving}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </section>
  );
}
