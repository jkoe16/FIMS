import { useCallback, useEffect, useState } from 'react';
import Notice from '../components/common/Notice';
import MaintenanceForm from '../components/maintenance/MaintenanceForm';
import MaintenanceHistory from '../components/maintenance/MaintenanceHistory';
import { listEquipment } from '../services/equipmentService';
import { listFailures } from '../services/failureService';
import { listUsers } from '../services/settingsService';
import {
  listMaintenances, createMaintenance, updateMaintenanceStatus, subscribeMaintenances,
} from '../services/maintenanceService';

export default function MaintenancePage() {
  const [equipment, setEquipment] = useState([]);
  const [openFailures, setOpenFailures] = useState([]);
  const [managers, setManagers] = useState([]);
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
    // 보조 데이터: 실패해도 정비 등록은 가능하도록 오류 무시
    listFailures().then((rows) => setOpenFailures(rows.filter((f) => f.status !== 'completed'))).catch(() => {});
    listUsers({ activeOnly: true }).then(setManagers).catch(() => {});
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      setHistory(await listMaintenances({ status: filterStatus || undefined }));
    } catch (e) {
      setError(`정비 이력을 불러오지 못했습니다: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    loadHistory();
    return subscribeMaintenances(loadHistory);
  }, [loadHistory]);

  const handleSubmit = async (values) => {
    setSaving(true); setError(''); setMessage('');
    try {
      await createMaintenance(values);
      setMessage('정비가 등록되었습니다.');
      await loadHistory();
      return true;
    } catch (e) {
      setError(`정비 등록에 실패했습니다: ${e.message}`);
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (row, status) => {
    setUpdatingId(row.id); setError(''); setMessage('');
    try {
      await updateMaintenanceStatus(row, status);
      await loadHistory();
    } catch (e) {
      setError(`정비 상태 변경에 실패했습니다: ${e.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <Notice>{error}</Notice>
      <Notice type="success">{message}</Notice>
      <div className="grid gap-4 sm:gap-6 xl:grid-cols-5">
        <div className="xl:col-span-2">
          <MaintenanceForm equipment={equipment} openFailures={openFailures} managers={managers} onSubmit={handleSubmit} saving={saving} />
        </div>
        <div className="xl:col-span-3">
          <MaintenanceHistory items={history} loading={loading} filterStatus={filterStatus}
            onFilterChange={setFilterStatus} onStatusChange={handleStatusChange} updatingId={updatingId} />
        </div>
      </div>
    </div>
  );
}
