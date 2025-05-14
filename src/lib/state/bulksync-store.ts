import { create } from "zustand";
import { SessionPayload } from "@/types/globals";
import { toast } from "@/hooks/use-toast";
import { syncTask } from "../bulksync";

export interface ISummary {
  state: "idle" | "in progress" | "completed" | `error: ${string}`;
  tasks: {
    tag: string;
    url: string;
    synced: number;
    unsynced: number;
    total: number;
    percentage: number;
    errors: number;
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
  lastSyncedAt: string;
}

export interface IBulkSync {
  tag: string;
  url: string;
  module: any;
  postAs?: "array" | "object";
  formdata?: (record: any) => Record<string, any>;
  cleanup?: (record: any) => any;
  force?: boolean;
  onSyncRecordResult?: (
    record: any,
    result: { success: boolean; response?: any; error?: string }
  ) => void;
}

export interface ProgressStatus {
  [tag: string]: {
    tag: string;
    success: number;
    failed: number;
    errors: { record_id: number | string; error_message: string }[];
    state: "in progress" | "completed";
  };
}

interface BulkSyncStore {
  state: "idle" | "in progress" | "completed";
  tasks: IBulkSync[];
  progressStatus: ProgressStatus;
  summary: ISummary;
  setTasks: (tasks: IBulkSync[]) => void;
  setProgressStatus: (tag: string, data: Partial<ProgressStatus[string]>) => void;
  updateTaskProgress: (tag: string, data: Partial<ProgressStatus[string]>) => void;
  resetAllTasks: () => void;
  resetSummary: () => void;
  startSync: (
    session: SessionPayload,
    tags?: string | string[],
    progressUpdate?: (progress: ProgressStatus[string]) => void
  ) => Promise<void>;
}

export const useBulkSyncStore = create<BulkSyncStore>((set, get) => ({
  state: "idle",
  tasks: syncTask,
  progressStatus: {},
  summary: {
    state: "idle",
    tasks: [],
    totalSynced: 0,
    totalUnsynced: 0,
    totalRecords: 0,
    totalErrors: 0,
    errorList: [],
    overallPercentage: "0%",
    lastSyncedAt: "",
  },

  setTasks: (tasks) => set({ tasks }),

  setProgressStatus: (tag, data) =>
    set((state) => ({
      progressStatus: {
        ...state.progressStatus,
        [tag]: {
          ...state.progressStatus[tag],
          ...data,
          tag,
        },
      },
    })),

  updateTaskProgress: (tag, data) =>
    set((state) => ({
      progressStatus: {
        ...state.progressStatus,
        [tag]: {
          ...state.progressStatus[tag],
          ...data,
          tag,
        },
      },
    })),

  resetAllTasks: () => {
    const progressReset: ProgressStatus = {};
    for (const task of get().tasks) {
      progressReset[task.tag] = {
        tag: task.tag,
        success: 0,
        failed: 0,
        errors: [],
        state: "in progress",
      };
    }
    set({ progressStatus: progressReset });
  },

  resetSummary: () =>
    set({
      state: "idle",
      summary: {
        state: "idle",
        tasks: [],
        totalSynced: 0,
        totalUnsynced: 0,
        totalRecords: 0,
        totalErrors: 0,
        errorList: [],
        overallPercentage: "0%",
        lastSyncedAt: "",
      },
      progressStatus: {},
    }),

  startSync: async (session, tags, progressUpdate) => {
    if (!session?.token) return;

    const { tasks, setProgressStatus } = get();
    const filteredTasks = tags
      ? tasks.filter((task) =>
          Array.isArray(tags) ? tags.includes(task.tag) : task.tag === tags
        )
      : tasks;

    // Reset state
    set({
      state: "in progress",
      summary: {
        ...get().summary,
        state: "in progress",
        overallPercentage: "0%",
      },
    });

    if (!tags) get().resetAllTasks(); // Only when full sync is triggered

    let totalRecords = 0;
    const taskRecordMap: Record<string, any[]> = {};

    for (const task of filteredTasks) {
      const records = task.force
        ? await task.module.toArray()
        : await task.module.where("push_status_id").notEqual(1).toArray();
      taskRecordMap[task.tag] = task.cleanup ? records.map(task.cleanup) : records;
      totalRecords += records.length;
    }

    let processedCount = 0;
    const progressMap: ProgressStatus = {};
    const finalTasks: ISummary["tasks"] = [];
    const errorList: ISummary["errorList"] = [];

    for (const task of filteredTasks) {
      const records = taskRecordMap[task.tag] || [];
      let success = 0;
      let failed = 0;
      let errors: ProgressStatus[string]["errors"] = [];

      setProgressStatus(task.tag, {
        state: "in progress",
        success: 0,
        failed: 0,
        errors: [],
      });

      for (const record of records) {
        try {
          let body: BodyInit;
          let headers: HeadersInit = {
            Authorization: `bearer ${session.token}`,
          };

          if (task.formdata) {
            const form = new FormData();
            const data = task.formdata(record);
            Object.entries(data).forEach(([key, value]) => form.append(key, value));
            body = form;
          } else {
            const payload = task.postAs === "object" ? record : [record];
            body = JSON.stringify(payload);
            headers["Content-Type"] = "application/json";
          }

          const res = await fetch(task.url, {
            method: "POST",
            body,
            headers,
          });

          if (res.ok) {
            const json = await res.clone().json();
            await task.module.update(record.id, {
              push_status_id: 1,
              push_date: new Date().toISOString(),
            });
            success++;
            task.onSyncRecordResult?.(record, { success: true, response: json });
          } else {
            const msg = `HTTP ${res.status}`;
            failed++;
            errors.push({ record_id: record.id, error_message: msg });
            task.onSyncRecordResult?.(record, { success: false, error: msg });
          }
        } catch (err: any) {
          const msg = err?.message || "Unknown error";
          failed++;
          errors.push({ record_id: record.id, error_message: msg });
          task.onSyncRecordResult?.(record, { success: false, error: msg });
        }

        processedCount++;
        const percent = totalRecords
          ? `${Math.round((processedCount / totalRecords) * 100)}%`
          : "0%";

        const taskProgress: ProgressStatus[string] = {
          tag: task.tag,
          success,
          failed,
          errors,
          state: "in progress",
        };

        setProgressStatus(task.tag, taskProgress);
        progressUpdate?.(taskProgress);

        set((state) => ({
          summary: {
            ...state.summary,
            overallPercentage: percent,
            lastSyncedAt: new Date().toISOString(),
          },
        }));
      }

      setProgressStatus(task.tag, { state: "completed" });

      finalTasks.push({
        tag: task.tag,
        url: task.url,
        synced: success,
        unsynced: failed,
        total: records.length,
        percentage: records.length
          ? Math.round((success / records.length) * 100)
          : 0,
        errors: errors.length,
      });

      progressMap[task.tag] = {
        tag: task.tag,
        success,
        failed,
        errors,
        state: "completed",
      };

      errorList.push(...errors.map((e) => ({ ...e, tag: task.tag })));
    }

    const totalSynced = finalTasks.reduce((a, b) => a + b.synced, 0);
    const totalUnsynced = finalTasks.reduce((a, b) => a + b.unsynced, 0);
    const totalErrors = finalTasks.reduce((a, b) => a + b.errors, 0);
    const overallPercentage = totalRecords
      ? `${Math.round((totalSynced / totalRecords) * 100)}%`
      : "0%";

    set({
      state: "completed",
      progressStatus: progressMap,
      summary: {
        state: "completed",
        tasks: finalTasks,
        totalSynced,
        totalUnsynced,
        totalRecords,
        totalErrors,
        errorList,
        overallPercentage,
        lastSyncedAt: new Date().toISOString(),
      },
    });

    toast({
      title: "Sync finished",
      description: `Overall: ${overallPercentage}`,
      duration: 1500,
    });
  },
}));