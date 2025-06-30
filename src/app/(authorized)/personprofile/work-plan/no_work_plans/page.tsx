/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { AppTable } from "@/components/app-table";
import { formatDistanceToNow, format } from "date-fns";
import {
    ICFWAssessment,
    IPersonProfileCfwFamProgramDetails,
    IPersonProfileDisability,
    IPersonProfileFamilyComposition,
    IPersonProfileSector,
    IWorkPlan,
} from "@/components/interfaces/personprofile";
import LoadingScreen from "@/components/general/loading-screen";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import { useRouter } from "next/navigation";
// import router, { useRouter } from "next/router";
import { useEffect, useState } from "react";
const baseUrl = "/personprofile/work-plan";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import { IAttachments } from "@/components/interfaces/general/attachments";

const _session = (await getSession()) as SessionPayload;

// "raw_id": 0,
// "created_date": "2025-05-06T07:51:31.946Z", ✅
// "created_by": "string",
// "last_modified_date": "2025-05-06T07:51:31.946Z",
// "last_modified_by": "string",
// "deleted_date": "2025-05-06T07:51:31.946Z",
// "deleted_by": "string",
// "remarks": "string",
// "synced_date": "2025-05-06T07:51:31.946Z",
// "is_deleted": true,
// "_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
// "immedidiate_supervisor_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",✅
// "alternative_supervisor_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",✅
// "area_focal_person_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",✅
// "objectives": "string",✅
// "no_of_days_program_engagement": 2147483647, ✅
// "approved_work_schedule_from": "2025-05-06",✅
// "approved_work_schedule_to": "2025-05-06",✅
// "status_id": 2147483647, ✅
// "push_status_id": 2147483647,
const columnsWorkPlan = [
    {
        id: "status",
        header: "Status",
        accessorKey: "status_id",
        filterType: "select",
        filterOptions: [null, 2, 15, 10],
        sortable: true,
        align: "center",
        cell: (value: any) => (
            <Badge
                variant={"destructive"}
            >
                No Work Plans
            </Badge>
        ), //for change
    },
    {
        id: "full_name",
        header: "Name",
        accessorKey: "full_name",
        sortable: true,
        align: "left",
    },
    {
        id: "deployment_name",
        header: "Deployment Area Name",
        accessorKey: "deployment_name",
        sortable: true,
        align: "left",
    },
    {
        id: "email",
        header: "Email",
        accessorKey: "email",
        filterType: "text",
        sortable: true,
        align: "left",
        cell: null,
    },
    // {
    //     id: "no_of_days_program_engagement",
    //     header: "# of Days Program Engagement",
    //     accessorKey: "no_of_days_program_engagement",
    //     filterType: "text",
    //     sortable: true,
    //     align: "center",
    //     cell: null,
    // },
    // {
    //     id: "approved_work_schedule_from",
    //     header: "Approved Work Schedule From",
    //     accessorKey: "approved_work_schedule_from",
    //     filterType: "text",
    //     sortable: true,
    //     align: "center",
    //     cell: null,
    // },
    // {
    //     id: "approved_work_schedule_to",
    //     header: "Approved Work Schedule To",
    //     accessorKey: "approved_work_schedule_to",
    //     filterType: "text",
    //     sortable: true,
    //     align: "center",
    //     cell: null,
    // },
    // {
    //     id: "no_of_beneficiaries",
    //     header: "Number of Beneficiaries",
    //     accessorKey: "no_of_beneficiaries",
    //     filterType: "text",
    //     sortable: true,
    //     align: "center",
    //     cell: null,
    // },
    // {
    //     id: "immediate_supervisor_name",
    //     header: "Author",
    //     accessorKey: "immediate_supervisor_name",
    //     filterType: "text",
    //     sortable: true,
    //     align: "left",
    //     cell: null,
    // },
    // {
    //     id: "created_date",
    //     header: "Created At",
    //     accessorKey: "created_date",
    //     filterType: "text",
    //     sortable: true,
    //     align: "left",
    //     cell: null,
    // },
    // {
    //     id: 'area_focal_person_id',
    //     header: 'Focal Person',
    //     accessorKey: 'area_focal_person_id',
    //     filterType: 'text',
    //     sortable: true,
    //     align: "left",
    //     cell: null,
    // },
    // {
    //     id: 'immedidiate_supervisor_id',
    //     header: 'Immediate Supervisor',
    //     accessorKey: 'immedidiate_supervisor_id',
    //     filterType: 'text',
    //     sortable: true,
    //     align: "left",
    //     cell: null,
    // },
    // {
    //     id: 'alternative_supervisor_id',
    //     header: 'Alternate Supervisor',
    //     accessorKey: 'alternative_supervisor_id',
    //     filterType: 'text',
    //     sortable: true,
    //     align: "left",
    //     cell: null,
    // },
];
import { getParsedLocalStorage } from "@/components/utils/utils";

import { Ban, FileText } from "lucide-react";
import PageHeader from "@/components/forms/page-header";
// import WorkPlansDashboard from "./dashboard/page";
export default function WorkPlanPending() {
    const [dataWorkPlan, setDataWorkPlan] = useState<IWorkPlan[]>([]);
    const [selectedPWorkPlan, setSelectedWorkPlan] = useState<IWorkPlan[]>([]);

    const [profilesSector, setProfilesSector] = useState<IPersonProfileSector[]>(
        []
    );
    const [profilesFamCom, setProfilesFamCom] = useState<
        IPersonProfileFamilyComposition[]
    >([]);
    const [profilesAttachments, setProfilesAttachments] = useState<
        IAttachments[]
    >([]);
    const [profilesCfwFamProgramDetails, setProfileCfwFamProgramDetails] =
        useState<IPersonProfileCfwFamProgramDetails[]>([]);
    const [profilesDisabilities, setProfileCfwDisabilities] = useState<
        IPersonProfileDisability[]
    >([]);
    const [assessmentDetails, setAssessmentDetials] = useState<ICFWAssessment[]>(
        []
    );

    const [reviewApproveDecline, setReviewApproveDecline] = useState([]);
    const [approvalStatuses, setApprovalStatus] = useState<{
        [key: string]: string;
    }>({});
    const [loading, setLoading] = useState(true);
    const [forReviewApprove, setForReviewApprove] = useState(false);
    const [selectedCFWID, setSetSelectedCFWID] = useState("");
    const [pageNo, setPageNo] = useState(1);
    const router = useRouter();
    // const [data, setData] = useState([]);
    const handleEligible = (selectedCFWID?: string) => { };

    const handleCreateNewWorkPlan = () => {
        localStorage.removeItem("work_plan_tasks")
        localStorage.removeItem("selectedBeneficiaries")
        router.push(baseUrl + "/new");
    };

    function mapApiToDexieWorkPlan(data: any): IWorkPlan {
        debugger
        return {
            id: data.id,
            work_plan_title: data.work_plan_title,
            immediate_supervisor_id: data.immediate_supervisor_id,
            office_name: data.division_office_name ?? "",
            objectives: data.objectives,
            no_of_days_program_engagement: data.no_of_days_program_engagement,
            approved_work_schedule_from: data.approved_work_schedule_from,
            approved_work_schedule_to: data.approved_work_schedule_to,
            status_id: data.status_id ?? null,
            created_date: data.created_date,
            created_by: data.created_by,
            last_modified_date: data.last_modified_date ?? null,
            last_modified_by: data.last_modified_by ?? null,
            push_status_id: data.push_status_id,
            push_date: data.push_date ?? null,
            deleted_date: data.deleted_date ?? null,
            deleted_by: data.deleted_by ?? null,
            is_deleted: data.is_deleted ?? null,
            remarks: data.remarks ?? null,
            alternate_supervisor_id: data.alternate_supervisor_id,
            area_focal_person_id: data.area_focal_person_id,
            user_id: data.user_id
            // total_number_of_bene: data.total_of_beneficiaries ?? 0,
        }
    }



    const loadWorkPlan = async () => {
        setLoading(false);
        debugger
        const ls = getParsedLocalStorage("work_plan_extended")
        const filtered = (ls || []).filter(
            (item: any) =>
                item.status_id === 10 &&
                (item.is_deleted === false || item.is_deleted === null)
        );
        console.log("Work Plans", filtered)
        setDataWorkPlan(filtered)

    };


    useEffect(() => {
        debugger
        setLoading(false);
        const ls = getParsedLocalStorage("no_work_plans")

        // const filtered = (ls || []).filter(
        //     (item: any) =>
        //         item.status_id === 10 &&
        //         (item.is_deleted === false || item.is_deleted === null)
        // );
        // console.log("Work Plans", filtered)
        setDataWorkPlan(ls)
    }, []);

    if (loading) {
        return (
            <>
                <LoadingScreen
                    isLoading={loading}
                    text={"Loading... Please wait."}
                    style={"dots"}
                    fullScreen={true}
                    progress={0}
                    timeout={0}
                    onTimeout={() => console.log("Loading timed out")}
                />
            </>
        );
    }
    const handleRefresh = async () => {
        loadWorkPlan()
    }
    const handleRowClick = (row: any) => {
        // check if mayroon sa dexiedb n record ng supervisor
        // if yes, load it
        // if no then get from api
        console.log("Row clicked:", row);
        localStorage.setItem("work_plan_mode", "reviewing")
        const res = getParsedLocalStorage("work_plan_extended")

        const result = res.find((item: any) => item.id === row.id);
        localStorage.setItem("work_plan", JSON.stringify(result))
        localStorage.setItem("work_plan_tasks", JSON.stringify(result.work_plan_tasks))
        // const fetchDataFromDexieDb = async () => {

        //     const workPlan = await dexieDb.work_plan.get(row.id);
        //     localStorage.setItem("work_plan", JSON.stringify(workPlan))
        // }
        // fetchDataFromDexieDb()
        const workPlanId = row.id;
        if (row.status_id == 10) {
            // 0=edit (url: url: /personprofile/workplan/uuid), 1=approved (viewing - url: /personprofile/workplan/uuid)

            router.push("/personprofile/work-plan/" + workPlanId + "/reviewing  ");
        } else if (row.status_id == 1) {
            // viewing 1=approved (viewing - url: /personprofile/workplan/uuid)
            router.push("/personprofile/work-plan/" + workPlanId);
        }

    };

    return (
        <div className="p-2">
            {/* Person Profile ID{_session.id}  */}
            {/* //02af6e24-1bec-4568-b9bf-8133e7faa3dc */}
            {/* Work Plans: {JSON.stringify(dataWorkPlan)} */}
            <Dialog open={forReviewApprove} onOpenChange={setForReviewApprove}>
                <DialogContent className="w-[400px] shadow-lg z-50 pb-[50px]">
                    <DialogTitle>Approval Confirmation</DialogTitle>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Approval Confirmation</DialogTitle>
                        </DialogHeader>
                        <Textarea placeholder="Input Assessment" className="mt-5" />
                        {/* <p>Record ID: { } has been approved.</p> */}
                        <DialogFooter>
                            <Button variant={"outline"}>Close</Button>
                            <Button
                                onClick={() => handleEligible(selectedCFWID)}
                                variant={"default"}
                            >
                                Eligible
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </DialogContent>
            </Dialog>
            <div className="min-h-screen">
                {/* Page Header */}
                {/* <div className="mb-6 px-6 pt-6">
                    <h1 className="text-3xl font-bold text-gray-900">No Work Plans</h1>
                </div> */}

                <PageHeader
                    title="No Work Plans"
                    mode=""
                    lastModified=""
                    modifiedBy=""
                    role=""
                    description="This page lists supervisors without work plan submissions."
               
                />


                {/* Content Area */}
                <div className="px-6">
                    <AppTable
                        // data={[]}
                        data={dataWorkPlan != undefined ? dataWorkPlan : []}
                        columns={columnsWorkPlan}
                        // onEditRecord={handleEdit}
                        onClickAddNew={handleCreateNewWorkPlan}
                        onRowClick={handleRowClick}
                        onRefresh={handleRefresh}
                    />


                </div>
            </div>



        </div>
    );
}
