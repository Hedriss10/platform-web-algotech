import { useCallback, useEffect, useMemo, useState } from "react";
import { HiTrash } from "react-icons/hi2";
import { Button, ConfirmDeleteModal, Select } from "../../components/ui";
import { fetchEmployees } from "../../service/employees";
import {
  fetchRoomEmployees,
  linkRoomEmployee,
  unlinkRoomEmployee,
} from "../../service/rooms";
import type { Employee } from "../../types/employee";
import type { Room as RoomModel, RoomEmployeeListItem } from "../../types/room";
import { getApiErrorMessage } from "../../utils/api-error";
import { Toastify } from "../../utils/toastify";

export type RoomEmployeesModalProps = {
  room: RoomModel;
  onClose: () => void;
  onChanged?: () => void;
};

export default function RoomEmployeesModal({
  room,
  onClose,
  onChanged,
}: RoomEmployeesModalProps) {
  const [linked, setLinked] = useState<RoomEmployeeListItem[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [linking, setLinking] = useState(false);
  const [unlinkTarget, setUnlinkTarget] = useState<RoomEmployeeListItem | null>(
    null
  );

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [linkedList, employeeList] = await Promise.all([
        fetchRoomEmployees(room.id),
        fetchEmployees(),
      ]);
      setLinked(linkedList);
      setEmployees(employeeList);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setLinked([]);
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, [room.id]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  const linkedEmployeeIds = useMemo(
    () => new Set(linked.map((row) => row.employee_id)),
    [linked]
  );

  const availableEmployees = useMemo(
    () => employees.filter((e) => !linkedEmployeeIds.has(e.id)),
    [employees, linkedEmployeeIds]
  );

  const handleLink = async () => {
    const id = selectedEmployeeId.trim();
    if (!id) {
      Toastify("Escolha um funcionário para vincular.", {
        type: "warning",
        position: "top-right",
      });
      return;
    }
    setLinking(true);
    try {
      await linkRoomEmployee(room.id, { employee_id: id });
      Toastify("Funcionário vinculado à sala.", {
        type: "success",
        position: "top-right",
      });
      setSelectedEmployeeId("");
      await loadAll();
      onChanged?.();
    } catch (err) {
      Toastify(getApiErrorMessage(err), {
        type: "error",
        position: "top-right",
        autoClose: 5000,
      });
    } finally {
      setLinking(false);
    }
  };

  const runUnlink = async () => {
    if (!unlinkTarget) return;
    const row = unlinkTarget;
    try {
      await unlinkRoomEmployee(room.id, row.employee_id);
      Toastify("Funcionário desvinculado da sala.", {
        type: "success",
        position: "top-right",
      });
      await loadAll();
      onChanged?.();
    } catch (err) {
      Toastify(getApiErrorMessage(err), {
        type: "error",
        position: "top-right",
        autoClose: 5000,
      });
      throw err;
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="room-employees-title"
      >
        <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/15">
          <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2
                id="room-employees-title"
                className="text-lg font-bold text-slate-900"
              >
                Funcionários da sala
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                <span className="font-semibold text-slate-800">
                  {room.name}
                </span>
              </p>
            </div>
            <Button type="button" variant="secondary" onClick={onClose}>
              Fechar
            </Button>
          </div>

          {loading ? (
            <p className="mt-8 text-center text-sm text-slate-500">
              A carregar vínculos…
            </p>
          ) : error ? (
            <div
              className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              role="alert"
            >
              {error}
            </div>
          ) : (
            <>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
                <div className="min-w-0 flex-1">
                  <Select
                    label="Adicionar funcionário"
                    value={selectedEmployeeId}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  >
                    <option value="">— Selecionar —</option>
                    {availableEmployees.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.first_name} {e.last_name} ({e.email})
                      </option>
                    ))}
                  </Select>
                  {availableEmployees.length === 0 ? (
                    <p className="mt-1 text-xs text-slate-500">
                      Não há funcionários disponíveis para vincular (todos já
                      estão nesta sala ou não existem funcionários activos).
                    </p>
                  ) : null}
                </div>
                <Button
                  type="button"
                  variant="primary"
                  loading={linking}
                  disabled={!selectedEmployeeId.trim()}
                  className="sm:shrink-0"
                  onClick={() => void handleLink()}
                >
                  Vincular
                </Button>
              </div>

              <section className="mt-8">
                <h3 className="text-sm font-semibold text-slate-800">
                  Vinculados ({linked.length})
                </h3>
                {linked.length === 0 ? (
                  <p className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center text-sm text-slate-600">
                    Nenhum funcionário vinculado a esta sala.
                  </p>
                ) : (
                  <div className="mt-3 overflow-x-auto rounded-xl border border-slate-200/80">
                    <table className="w-full min-w-[480px] border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50/90">
                          <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                            Nome
                          </th>
                          <th className="whitespace-nowrap px-4 py-3 font-semibold text-slate-700">
                            ID funcionário
                          </th>
                          <th className="whitespace-nowrap px-4 py-3 text-right font-semibold text-slate-700">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {linked.map((row) => (
                          <tr
                            key={row.id}
                            className="border-b border-slate-100 last:border-0 hover:bg-blue-50/40"
                          >
                            <td className="px-4 py-3 font-medium text-slate-900">
                              {row.first_name} {row.last_name}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-slate-600">
                              {row.employee_id}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-right">
                              <button
                                type="button"
                                className="rounded-lg p-2 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
                                title="Desvincular"
                                onClick={() => setUnlinkTarget(row)}
                              >
                                <HiTrash className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </div>

      <ConfirmDeleteModal
        open={unlinkTarget !== null}
        title="Desvincular funcionário?"
        confirmLabel="Desvincular"
        description={
          <>
            Remover{" "}
            <span className="font-semibold text-slate-800">
              {unlinkTarget?.first_name ?? ""} {unlinkTarget?.last_name ?? ""}
            </span>{" "}
            desta sala? O vínculo será marcado como removido (soft delete).
          </>
        }
        onCancel={() => setUnlinkTarget(null)}
        onConfirm={runUnlink}
      />
    </>
  );
}
