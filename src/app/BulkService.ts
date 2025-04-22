import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';

const _session = await getSession() as SessionPayload;

interface IBulkService {
  tag: string;
  url: string;
  module: any;
  cleanup?: (record: any) => any;
}

export interface ISummary {
    tasks: { tag: string; url: string; synced: number; unsynced: number; total: number; percentage: number }[];
    totalSynced: number;
    totalUnsynced: number;
    totalRecords: number;
    overallPercentage: number;
  }

class BulkService {
  private tasks: IBulkService[] = [];

  setTasks(tasks: IBulkService[]) {
    this.tasks = tasks;
  }

  async start(): Promise<{ success: number; failed: number }> {
    return this.sync(this.tasks);
  }

  private async sync(tasks: IBulkService[]): Promise<{ success: number; failed: number }> {
    let success = 0;
    let failed = 0;

    for (const task of tasks) {
      try {
        const records = await task.module.where('push_status_id').notEqual(1).toArray();
        if (records.length === 0) continue;

        const preparedRecords = task.cleanup ? records.map(task.cleanup) : records;

        try {
          const response = await fetch(task.url, {
            headers: {
              Authorization: `bearer ${_session.token}`,
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(preparedRecords),
          });

          if (response.status === 200 || response.status === 201) {
            const ids = records.map((r: any) => r.id);
            await Promise.all(ids.map((id: any) => task.module.update(id, { push_status_id: 1 })));
            success += records.length;
          } else {
            console.warn(`[${task.tag}] Bulk sync failed:`, response.status);
            failed += records.length;
          }
        } catch (err) {
          console.error(`[${task.tag}] Sync error:`, JSON.stringify(err));
          failed += records.length;
        }
      } catch (err) {
        console.error(`[${task.tag}] Error loading records:`, JSON.stringify(err));
        failed++;
      }
    }

    console.log(`Bulk Sync Summary: ${success} success, ${failed} failed`);
    return { success, failed };
  }

  async status(): Promise<ISummary> {
    const tasksSummary = [];
    let totalSynced = 0;
    let totalUnsynced = 0;
    let totalRecords = 0;

    for (const task of this.tasks) {
      const all = await task.module.toArray();
      const synced = all.filter((r: any) => r.push_status_id === 1).length;
      const unsynced = all.length - synced;

      const total = all.length;
      const percentage = total > 0 ? (synced / total) * 100 : 100;

      tasksSummary.push({
        tag: task.tag,
        url: task.url,
        synced,
        unsynced,
        total,
        percentage: parseFloat(percentage.toFixed(2)),
      });

      totalSynced += synced;
      totalUnsynced += unsynced;
      totalRecords += total;
    }

    const overallPercentage = totalRecords > 0 ? (totalSynced / totalRecords) * 100 : 100;

    return {
      tasks: tasksSummary,
      totalSynced,
      totalUnsynced,
      totalRecords,
      overallPercentage: parseFloat(overallPercentage.toFixed(2)),
    };
  }
}

export default new BulkService();