import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import FailureForm from '../components/failure/FailureForm';
import FailureHistory from '../components/failure/FailureHistory';
import { listEquipment } from '../services/equipmentService';
import { listFailures, createFailure, updateFailureStatus, subscribeFailures } from '../services/failureService';

export default function FailurePage() {
  const [equipment, setEquipment] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    listEquipment()
      .then((rows) => setEquipment([...rows].sort((a, b) => a.equipment_code.localeCompare(b.equipment_code))))
      .catch((e) => setError(`설비 목록을 불러오지 못했습니다: ${e.message}`));
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      setHistory(await listFailures({ status: filterStatus || undefined }));
    } catch (e) {
      setError(`고장 이력을 불러오지 못했습니다: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    loadHistory();
    return subscribeFailures(loadHistory, 'page'); // 다른 사용자의 신고·상태 변경도 즉시 반영
  }, [loadHistory]);

  const handleSubmit = async (values) => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await createFailure(values);
      setMessage('고장 신고가 접수되었습니다.');
      await loadHistory();
      return true;
    } catch (e) {
      setError(`고장 신고 저장에 실패했습니다: ${e.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (row, status) => {
    setUpdatingId(row.id);
    setError('');
    setMessage('');
    try {
      await updateFailureStatus(row.id, status);
      await loadHistory();
    } catch (e) {
      setError(`처리 상태 변경에 실패했습니다: ${e.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {error && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}
      {message && (
        <div className="flex items-start gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {message}
        </div>
      )}
      <div className="grid gap-4 sm:gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <FailureForm equipment={equipment} onSubmit={handleSubmit} saving={saving} />
        </div>
        <div className="xl:col-span-3">
          <FailureHistory
            items={history}
            loading={loading}
            filterStatus={filterStatus}
            onFilterChange={setFilterStatus}
            onStatusChange={handleStatusChange}
            updatingId={updatingId}
          />
        </div>
      </div>
    </div>
  );
}
