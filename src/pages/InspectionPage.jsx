import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import InspectionForm from '../components/inspection/InspectionForm';
import InspectionHistory from '../components/inspection/InspectionHistory';
import { listEquipment } from '../services/equipmentService';
import { listInspections, createInspection, subscribeInspections } from '../services/inspectionService';

export default function InspectionPage() {
  const [equipment, setEquipment] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [filterId, setFilterId] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    listEquipment()
      .then((rows) => setEquipment([...rows].sort((a, b) => a.equipment_code.localeCompare(b.equipment_code))))
      .catch((e) => setError(`설비 목록을 불러오지 못했습니다: ${e.message}`));
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      setHistory(await listInspections({ equipmentId: filterId || undefined }));
    } catch (e) {
      setError(`점검 이력을 불러오지 못했습니다: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [filterId]);

  useEffect(() => {
    loadHistory();
    return subscribeInspections(loadHistory); // 다른 사용자의 점검 등록도 즉시 반영
  }, [loadHistory]);

  const handleSubmit = async (values) => {
    setSaving(true);
    setError('');
    setMessage('');
    try {
      await createInspection(values);
      setMessage('점검 결과가 저장되었습니다.');
      setSelectedId('');
      await loadHistory();
      return true;
    } catch (e) {
      setError(`점검 결과 저장에 실패했습니다: ${e.message}`);
      return false;
    } finally {
      setSaving(false);
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
          <InspectionForm
            equipment={equipment}
            selectedId={selectedId}
            onSelectEquipment={(id) => { setSelectedId(id); setMessage(''); }}
            onSubmit={handleSubmit}
            saving={saving}
          />
        </div>
        <div className="xl:col-span-3">
          <InspectionHistory items={history} loading={loading} equipment={equipment} filterId={filterId} onFilterChange={setFilterId} />
        </div>
      </div>
    </div>
  );
}
