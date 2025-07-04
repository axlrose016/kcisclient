import { IAttachments } from "@/components/interfaces/general/attachments";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { IBulkSync } from "./state/bulksync-store";
import { format } from "date-fns";
export const syncTask: IBulkSync[] = [
  {
    tag: "Person Profile",
    url: process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + `person_profile/create/`,
    module: () => dexieDb.person_profile,
    force: false,
  },
  {
    tag: "Person Profile > CFW attendance log",
    url: process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + `cfwtimelogs/create/`,
    module: () => dexieDb.cfwtimelogs,
    force: false,
  },
  {
    tag: "Person Profile > person_profile_disability",
    url:
      process.env.NEXT_PUBLIC_API_BASE_URL_KCIS +
      `person_profile_disability/create/`,
    module: () => dexieDb.person_profile_disability,
    force: false,
  },
  {
    tag: "Person Profile > person_profile_family_composition",
    url:
      process.env.NEXT_PUBLIC_API_BASE_URL_KCIS +
      `person_profile_family_composition/create/`,
    module: () => dexieDb.person_profile_family_composition,
    force: false,
  },
  {
    tag: "Person Profile > person_profile_sector",
    url:
      process.env.NEXT_PUBLIC_API_BASE_URL_KCIS +
      `person_profile_sector/create/`,
    module: () => dexieDb.person_profile_sector,
    force: false,
  },
  {
    tag: "Person Profile > person_profile_cfw_fam_program_details",
    url:
      process.env.NEXT_PUBLIC_API_BASE_URL_KCIS +
      `person_profile_engagement_history/create/`,
    module: () => dexieDb.person_profile_cfw_fam_program_details,
    force: false,
  },
  {
    tag: "Person Profile > attachments",
    url: process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + `attachments/create/`,
    module: () => dexieDb.attachments,
    force: false,
    formdata: (record) => {
      const name = `${record.id}##${record.record_id}##${record.file_id}##${record.module_path}##${record.user_id == "" ? record.record_id : record.user_id}##${record.created_by == "" ? "error" : record.created_by}##${record.created_date}##${record.remarks}##${record.file_type}`
      console.log("Person Profile > attachments > keyname", name);
      if (!(record.file_path instanceof Blob) && record.file_path) {
        // Skip this record by returning empty object, it will be counted as success
        return {};
      } else { 
        return {
          [name]:record.file_path, // should be a File or Blob
        };
      }
    },
    onSyncRecordResult: (record, result) => {
      if (result.success) {
        console.log("✅ attachments synced:", { record, result });

        if (result.response.length !== 0) {
          (result.response as []).forEach((file: any) => {
            (async () => {
              const newRecord = {
                ...(record as IAttachments),
                file_id: file.file_id,
                file_path: file.file_path,
                push_status_id: 1,
                push_date: format(new Date(),'yyyy-MM-dd HH:mm:ss'),
              };
              console.log("✅ attachments synced:", { record, result });
              await dexieDb.attachments.put(newRecord, "id");
            })();
          });
        }
      } else {
        console.error("❌ Order failed:", record.id, "-", result.error);
      }
    },
  },
  {
    tag: "Person Profile > Accomplishment Report",
    url:
      process.env.NEXT_PUBLIC_API_BASE_URL_KCIS +
      `accomplishment_report/create/`,
    module: () => dexieDb.accomplishment_report,
    force: false,
  },
  {
    tag: "Person Profile > Accomplishment Report Task",
    url:
      process.env.NEXT_PUBLIC_API_BASE_URL_KCIS +
      `accomplishment_report_task/create/`,
    module: () => dexieDb.accomplishment_actual_task,
    force: false,
  },
  {
    tag: "CFW Immediate Supervisor > Work Plan",
    url: process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + `work_plan/create/`,
    module: () => dexieDb.work_plan,
    force: false,
  },
  {
    tag: "CFW Immediate Supervisor > Work Plan Tasks",
    url: process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + `work_plan_task/create/`,
    module: () => dexieDb.work_plan_tasks,
    force: false,
  },
  {
    tag: "CFW Immediate Supervisor > Work Plan Selected Beneficiaries",
    url:
      process.env.NEXT_PUBLIC_API_BASE_URL_KCIS +
      `cfw_assessment/update/`,
    module: () => dexieDb.cfwassessment,
    force: false,
  },
  {
    tag: "Submission Logs",
    url:
      process.env.NEXT_PUBLIC_API_BASE_URL_KCIS +
      `submission_logs/create/`,
    module: () => dexieDb.submission_log,
    force: false,
  },
  {
    tag: "CFW > Payroll Bene",
    url:process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + `/cfw_payroll_beneficiary/create/`,
    module: () => dexieDb.cfwpayroll_bene, 
  },
  {
    tag: "CFW Person Profile > Update User Role",
    url:
      process.env.NEXT_PUBLIC_API_BASE_URL_KCIS +
      `/auth_users/update/user_bulk/`,
    module: () => dexieDb.users,
    force: false,
  },
  {
    tag: "CFW Person Profile > Update User Access",
    url:
      process.env.NEXT_PUBLIC_API_BASE_URL_KCIS +
      `auth_user_access/update/`,
    module: () => dexieDb.useraccess,
    force: false,
  },

];
