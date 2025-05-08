import { useCallback, useEffect, useRef, useState } from "react";

export interface IBulkSync {
  tag: string;
  url: string;
  module: any;
  formdata?: (record: any) => Record<string, any>;
  cleanup?: (record: any) => any;
  force?: boolean; // Optional: if true, sync all records, ignoring 'push_status_id' check
  onSyncRecordResult?: (
    record: any,
    result: { success: boolean; response?: any; error?: string }
  ) => void;
}

export interface ISummary {
  state: "idle" | "in progress" | "completed" | `error: ${string}`;
  tasks: {
    tag: string;
    url: string;
    synced: number;
    unsynced: number;
    total: number;
    percentage: number;
    errors: number; // just count of errors
  }[];
  totalSynced: number;
  totalUnsynced: number;
  totalRecords: number;
  totalErrors: number;
  errorList: {
    tag: string;
    record_id: number | string;
    error_message: string;
  }[];
  overallPercentage: string;
}

type BulkCallbacks = {
  onStart?: () => void;
  onComplete?: (summary: ISummary) => void;
};

export function useBulkSync() {
  const [state, setState] = useState<ISummary["state"]>("idle");
  const [summary, setSummary] = useState<ISummary>({
    state: "idle",
    tasks: [],
    totalSynced: 0,
    totalUnsynced: 0,
    totalRecords: 0,
    totalErrors: 0,
    errorList: [],
    overallPercentage: "···",
  });

  const tasksRef = useRef<IBulkSync[]>([]);
  const callbacksRef = useRef<BulkCallbacks>({});
  const errorListMap = useRef<
    Map<
      string,
      { tag: string; record_id: number | string; error_message: string }[]
    >
  >(new Map());

  const statusCheck = useCallback(async (): Promise<ISummary> => {
    const tasks = tasksRef.current;
    let totalSynced = 0;
    let totalUnsynced = 0;
    let totalRecords = 0;
    let totalErrors = 0;
    const allErrors: ISummary["errorList"] = [];

    const tasksSummary = [];

    for (const task of tasks) {
      const all = await task.module.toArray();
      const synced = all.filter((r: any) => r.push_status_id === 1).length;
      const unsynced = all.length - synced;
      const total = all.length;
      const percentage = total > 0 ? (synced / total) * 100 : 100;

      const taskErrors = errorListMap.current.get(task.tag) || [];
      allErrors.push(...taskErrors);

      tasksSummary.push({
        tag: task.tag,
        url: task.url,
        synced,
        unsynced,
        total,
        percentage: parseFloat(percentage.toFixed(2)),
        errors: taskErrors.length,
      });

      totalSynced += synced;
      totalUnsynced += unsynced;
      totalRecords += total;
      totalErrors += taskErrors.length;
    }

    const overallPercentage =
      totalRecords > 0 ? (totalSynced / totalRecords) * 100 : 100;

    const result: ISummary = {
      state,
      tasks: tasksSummary,
      totalSynced,
      totalUnsynced,
      totalRecords,
      totalErrors,
      errorList: allErrors,
      overallPercentage: parseFloat(overallPercentage.toFixed(2)) + "%",
    };

    setSummary(result);
    return result;
  }, [state]);

  const setTasks = useCallback(
    async (tasks: IBulkSync[]) => {
      tasksRef.current = tasks;
      await statusCheck();
    },
    [statusCheck]
  );

  const setCallbacks = useCallback((callbacks: BulkCallbacks) => {
    callbacksRef.current = callbacks;
  }, []);

  const addError = (
    tag: string,
    record_id: number | string,
    message: string
  ) => {
    if (!errorListMap.current.has(tag)) {
      errorListMap.current.set(tag, []);
    }
    errorListMap.current
      .get(tag)!
      .push({ tag, record_id, error_message: message });
  };

  const startSync = useCallback(
    async (force = false) => {
      if (!force && state === "in progress") {
        const existing = await statusCheck();
        return {
          success: existing.totalSynced,
          failed: existing.totalUnsynced,
          state,
        };
      }

      setState("in progress");
      callbacksRef.current.onStart?.();

      const tasks = tasksRef.current;
      errorListMap.current.clear();

      let success = 0;
      let failed = 0;

      for (const task of tasks) {
        try {
          const records = task.force
            ? await task.module.toArray()
            : await task.module.where("push_status_id").notEqual(1).toArray();

          if (records.length === 0) continue;

          const prepared = task.cleanup ? records.map(task.cleanup) : records;

          for (const record of prepared) {
            try {
              let body: BodyInit;
              let headers: HeadersInit | undefined = undefined;

              if (task.formdata) {
                const form = new FormData();
                const formValues = task.formdata(record);
                Object.entries(formValues).forEach(([key, value]) => {
                  form.append(key, value);
                });
                body = form;
              } else {
                body = JSON.stringify(record);
                headers = { "Content-Type": "application/json" };
              }

              const response = await fetch(task.url, {
                method: "POST",
                body,
                headers,
              });

              if ([200, 201].includes(response.status)) {
                const resultValue = await response.clone().json();
                await task.module.update(record.id, {
                  push_status_id: 1,
                  push_date: new Date().toISOString(),
                });
                success++;
                task.onSyncRecordResult?.(record, {
                  success: true,
                  response: resultValue,
                });
              } else {
                const message = `HTTP ${response.status}`;
                addError(task.tag, record.id, message);
                failed++;
                task.onSyncRecordResult?.(record, {
                  success: false,
                  error: message,
                });
              }
            } catch (err: any) {
              const message = err?.message || "Unknown error";
              addError(task.tag, record.id, message);
              failed++;
              task.onSyncRecordResult?.(record, {
                success: false,
                error: message,
              });
            }
          }
        } catch (err: any) {
          const message = err?.message || "Task error";
          addError(task.tag, "task-level", message);
          failed++;
        }
      }

      const newState: ISummary["state"] = "completed";
      setState(newState);
      const finalSummary = await statusCheck();
      callbacksRef.current.onComplete?.(finalSummary);

      return {
        success,
        failed,
        state: newState,
      };
    },
    [statusCheck, state]
  );

  return {
    setTasks,
    setCallbacks,
    startSync,
    state,
    summary,
    refreshSummary: statusCheck,
  };
}
