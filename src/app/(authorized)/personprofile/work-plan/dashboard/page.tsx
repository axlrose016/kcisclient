"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Ban, BookMarkedIcon, CheckCircle, Clock, FileEditIcon, FileMinus, FileMinus2, HelpCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow, format } from "date-fns";
// Mock data or replace with props/state/fetch
const workPlans = [
    { id: 1, status_id: "2" },
    { id: 2, status_id: "0" },
    { id: 3, status_id: "15" },
];
import { useEffect, useState } from "react";
import LoadingScreen from "@/components/general/loading-screen";
import { getSession } from "@/lib/sessions-client";
import { SessionPayload } from "@/types/globals";
import { IWorkPlan } from "@/components/interfaces/personprofile";
import { dexieDb } from "@/db/offline/Dexie/databases/dexieDb";
import LoginService from "@/components/services/LoginService";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from 'uuid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AppTable } from "@/components/app-table";
import { Badge } from "@/components/ui/badge";
import PageHeader from "@/components/forms/page-header";
interface IWorkPlanWithSupervisor extends IWorkPlan {
    immediate_supervisor_name: string;
}
const _session = (await getSession()) as SessionPayload;
const columnsWorkPlan = [
    {
        id: "status",
        header: "Status",
        accessorKey: "status_id",
        filterType: "select",
        filterOptions: [null, 0, 2, 15, 10],
        sortable: true,
        align: "center",
        cell: (value: any) => {
            let icon: JSX.Element;
            let variant: "green" | "warning" | "secondary" | "destructive" | "default" | "outline";

            if (value === 2) {
                icon = <CheckCircle className="w-4 h-4 mr-1" />;
                variant = "green";
            } else if (value === null || value === 0) {
                icon = <Clock className="w-4 h-4 mr-1" />;
                variant = "warning";
            } else if (value === 10) {
                icon = <AlertCircle className="w-4 h-4 mr-1" />;
                variant = "secondary";
            } else if (value === 15) {
                icon = <Ban className="w-4 h-4 mr-1" />;
                variant = "destructive";
            }
            else if (value === 22) {
                icon = <BookMarkedIcon className="w-4 h-4 mr-1" />;
                variant = "outline";
            } else {
                icon = <HelpCircle className="w-4 h-4 mr-1" />;
                variant = "default";
            }

            return (
                <Badge variant={variant} className="flex items-center gap-1">
                    {icon}
                    {value === 2
                        ? "Approved"
                        : value === null || value === 0
                            ? "Pending"
                            : value === 10
                                ? "For Compliance"
                                : value === 15
                                    ? "Rejected"
                                    : value == 22
                                        ? "Draft"
                                        : "Unknown"}
                </Badge>
            );
        }
    },
    {
        id: "work_plan_title",
        header: "Title",
        accessorKey: "work_plan_title",
        sortable: true,
        align: "left",
    },
    {
        id: "objectives",
        header: "Objectives",
        accessorKey: "objectives",
        filterType: "text",
        sortable: true,
        align: "left",
        cell: null,
    },
    {
        id: "no_of_days_program_engagement",
        header: "# of Days Program Engagement",
        accessorKey: "no_of_days_program_engagement",
        filterType: "text",
        sortable: true,
        align: "center",
        cell: null,
    },
    {
        id: "approved_work_schedule_from",
        header: "Approved Work Schedule From",
        accessorKey: "approved_work_schedule_from",
        filterType: "text",
        sortable: true,
        align: "center",
        cell: null,
    },
    {
        id: "approved_work_schedule_to",
        header: "Approved Work Schedule To",
        accessorKey: "approved_work_schedule_to",
        filterType: "text",
        sortable: true,
        align: "center",
        cell: null,
    },
    {
        id: "no_of_beneficiaries",
        header: "Number of Beneficiaries",
        accessorKey: "no_of_beneficiaries",
        filterType: "text",
        sortable: true,
        align: "center",
        cell: null,
    },
    {
        id: "created_date",
        header: "Created At",
        accessorKey: "created_date",
        filterType: "text",
        sortable: true,
        align: "left",
        cell: null,
    },
    {
        id: "last_modified_date",
        header: "Modified At",
        accessorKey: "last_modified_date",
        filterType: "text",
        sortable: true,
        align: "left",
        cell: null,
    },

];
export default function WorkPlansDashboard() {
    const baseUrl = "/personprofile/work-plan";
    const [isLoadingCounts, setIsLoadingCounts] = useState(true);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const [WPs, setWPs] = useState<IWorkPlan[]>([])
    const [WPwithSup, setWPWithSupervisor] = useState<IWorkPlanWithSupervisor[]>([])
    const [noWorkPlanCount, setNoWorkPlanCount] = useState<number>(0);
    const [dataWorkPlan, setDataWorkPlan] = useState<IWorkPlan[]>([]);

    const countByStatuses = (status_ids: (string | number | null)[]) =>
        WPs.filter((wp) => status_ids.includes(wp.status_id?.toString() ?? null)).length;

    // const countByStatus = (status_id: string) => WPs.filter((wp) => wp.status_id?.toString() === status_id.toString()).length;
    // const countByStatus = (status_id: string) => workPlans.filter((plan) => plan.status_id.toString() === status_id.toString()).length;
    const getNumberOfNoWorkPlans = async () => {
        setLoading(true); // Start loading early

        try {
            const onlinePayload = await LoginService.onlineLogin(
                "dsentico@dswd.gov.ph",
                "Dswd@123"
            );

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}work_plan/view/no_of_supervisor_with_no_workplan/`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `bearer ${onlinePayload.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (!response.ok) {
                console.error("Response not OK:", response.statusText);
                return 0;
            }

            const data = await response.json();
            localStorage.setItem("no_work_plans", JSON.stringify(data))
            console.log("⛔No work plans", data[0])
            return data?.length || 0;
        } catch (error: any) {
            if (error.name === "AbortError") {
                console.warn("Request canceled:", error.message);
                alert("Request canceled: " + error.message);
            } else {
                console.error("Error fetching data:", error);
                alert("Error fetching data: " + error.message || error);
            }
            return 0;
        } finally {
            setLoading(false); // Stop loading no matter what
        }
    };

    const statusInfo = {
        approved: {
            label: "Approved Work Plans",
            icon: <CheckCircle className="h-4 w-4 text-green-600" />,
            color: "text-green-600",
            description: "Ready for implementation",
            count: countByStatuses(["2", 2])
        },
        pending: {
            label: "Pending Work Plans",
            icon: <Clock className="h-4 w-4 text-yellow-600" />,
            color: "text-yellow-600",
            description: "Awaiting review",

            // count: countByStatuses([14]) //0 
            // count: countByStatuses([0])  //0
            count: countByStatuses([null]) //10 but in pending its 16
            // count: countByStatuses(["0", "22", 0, 22, 14, "14", null])
        },
        rejected: {
            label: "Rejected Work Plans",
            icon: <XCircle className="h-4 w-4 text-red-600" />,
            color: "text-red-600",
            description: "Needs work plan recreation",
            count: countByStatuses(["15", 15])
        },
        "for_compliance": {
            label: "For Compliance Work Plans",
            icon: <FileEditIcon className="h-4 w-4 text-orange-600" />,
            color: "text-orange-600",
            description: "Needs revision",
            count: countByStatuses(["10", 10])
        },
        "no_work_plans": {
            label: "No Work Plans",
            icon: <FileMinus2 className="h-4 w-4 text-blue-600" />,
            color: "text-blue-600",
            description: "Needs to approach",
            count: noWorkPlanCount   // 0 //countByStatuses(["10", 10])
        },
        
    };


    const statuses = ["approved", "pending", "rejected", "for_compliance", "no_work_plans"];


    const fetchDataWorkPan = async () => {
        try {




            const fetchData = async (endpoint: string) => {
                try {
                    debugger;
                    const onlinePayload = await LoginService.onlineLogin(
                        "dsentico@dswd.gov.ph",
                        "Dswd@123"
                    );

                    const response = await fetch(endpoint, {
                        method: "GET",
                        headers: {
                            Authorization: `bearer ${onlinePayload.token}`,
                            "Content-Type": "application/json",
                        },
                    });

                    if (!response.ok) {
                        console.log(response);
                    } else {
                        debugger;
                        const data = await response.json();

                        const formatted = data.map((item: any) => ({
                            ...item,
                            created_date: item.created_date
                                ? format(new Date(item.created_date), "MMMM d, yyyy") + " (" + formatDistanceToNow(new Date(item.created_date), { addSuffix: true }) + ")"
                                : null,

                            last_modified_date: item.last_modified_date
                                ? format(new Date(item.last_modified_date), "MMMM d, yyyy")
                                : null,

                            approved_work_schedule_from: item.approved_work_schedule_from
                                ? format(new Date(item.approved_work_schedule_from), "MMMM d, yyyy")
                                : null,

                            approved_work_schedule_to: item.approved_work_schedule_to
                                ? format(new Date(item.approved_work_schedule_to), "MMMM d, yyyy")
                                : null,

                            push_date: item.push_date
                                ? format(new Date(item.push_date), "MMMM d, yyyy")
                                : null,
                        }));


                        setWPWithSupervisor(formatted);


                        // setWPWithSup(data)
                        localStorage.setItem("work_plan_extended", JSON.stringify(formatted))
                        console.log("Work Plans", data)

                        const workPlans: IWorkPlan[] = data
                            .filter((item: any) => (item.is_deleted === false || item.is_deleted === null))
                            .map((item: any) => ({

                                id: item.id,
                                alternate_supervisor_id: item.alternate_supervisor_id ?? null, // ✔️
                                approved_work_schedule_from: item.approved_work_schedule_from, //format(new Date(item.approved_work_schedule_from), "MMMM d, yyyy"), //item.approved_work_schedule_from, // ✔️
                                approved_work_schedule_to: item.approved_work_schedule_to, //format(new Date(item.approved_work_schedule_to), "MMMM d, yyyy"), //item.approved_work_schedule_to, // ✔️
                                area_focal_person_id: item.area_focal_person_id ?? null, // ✔️
                                created_by: item.created_by,     // ✔️
                                created_date: item.created_date, // format(new Date(item.created_date), "MMMM d, yyyy"), //item.created_date, // ✔️
                                deleted_by: item.deleted_by ?? null,
                                deleted_date: item.deleted_date ?? null,
                                immediate_supervisor_id: item.immediate_supervisor_id, // ✔️
                                is_deleted: item.is_deleted ?? false, // ✔️
                                last_modified_by: item.last_modified_by ?? null, // ✔️
                                last_modified_date: item.last_modified_date ?? null, // ✔️
                                no_of_days_program_engagement: item.no_of_days_program_engagement, // ✔️
                                objectives: item.objectives, // ✔️
                                push_date: item.push_date ?? null, // ✔️
                                push_status_id: item.push_status_id ?? null, // ✔️
                                remarks: item.remarks ?? null, // ✔️
                                status_id: item.status_id ?? null, // ✔️
                                work_plan_title: item.work_plan_title, // ✔️

                            }));

                        setWPs(workPlans)
                        console.log("💨Work Plans for Dashboard", workPlans)
                        await dexieDb.work_plan.bulkPut(workPlans)


                    }
                } catch (error: any) {
                    if (error.name === "AbortError") {
                        console.log("Request canceled", error.message);
                        alert("Request canceled" + error.message);
                    } else {
                        console.error("Error fetching data:", error);
                        alert("Error fetching data:" + error);
                    }
                }

            };

            // alert(_session.id)

            fetchData(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + "work_plan/view/");
            setLoading(false)
            setIsLoadingCounts(false)
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }


    useEffect(() => {
        const fetchCount = async () => {
            const count = await getNumberOfNoWorkPlans();
            setNoWorkPlanCount(count);
        };

        fetchCount();
    }, []);

    useEffect(() => {
        fetchDataWorkPan()
        const fetchWPOfAdmin = async () => {
            try {

                const WorkPlanAdmin = await dexieDb.work_plan
                    .where('immediate_supervisor_id')
                    .equals(_session.id)
                    .toArray()

                setDataWorkPlan(WorkPlanAdmin)
                // setIsLoadingCounts(false)
                return WorkPlanAdmin
            } catch (error) {
                console.error("Failed to fetch work plans", error)
                return []
            }
        }
        fetchWPOfAdmin()
    }, [])

    const handleCreateANewWorkPlan = () => {
        localStorage.removeItem("work_plan")
        localStorage.removeItem("selectedBeneficiaries")
        const wpIdDraft = uuidv4()
        const work_plan_details = {
            "id": wpIdDraft,
            "work_plan_title": "",
            "immediate_supervisor_id": _session.id,
            "deployment_area_name": "",
            "office_name": "",
            "no_of_days_program_engagement": "",
            "approved_work_schedule_from": "",
            "approved_work_schedule_to": "",
            "objectives": ""
        }

        localStorage.setItem("work_plan", JSON.stringify(work_plan_details))

        // save to work_plan table then reroute to edit
        const createDraftWorkPlan = async () => {
            debugger
            try {
                const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}work_plan/create/`, {
                    method: "POST",
                    headers: {
                        Authorization: `bearer ${onlinePayload.token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify([
                        {
                            id: wpIdDraft,
                            created_date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                            created_by: _session.userData.email,
                            remarks: "Work Plan Drafted",
                            immediate_supervisor_id: _session.id,
                            status_id: 22,
                            push_status_id: 1,
                            push_date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                        },
                    ]),
                });

                if (!res.ok) {
                    console.error("Error creating draft work plan", await res.text());
                } else {
                    const data = await res.json();
                    console.log("Draft work plan created:", data);
                    router.push(baseUrl + "/" + wpIdDraft + "/draft");

                }
            } catch (error) {
                console.error("Draft creation error:", error);
            }
        };

        createDraftWorkPlan();

    };


    const handleCreateNewWorkPlan = () => {
        localStorage.removeItem("work_plan")
        localStorage.removeItem("selectedBeneficiaries")
        const wpIdDraft = uuidv4()
        const work_plan_details = {
            "id": wpIdDraft,
            "work_plan_title": "",
            "immediate_supervisor_id": _session.id,
            "deployment_area_name": "",
            "office_name": "",
            "no_of_days_program_engagement": "",
            "approved_work_schedule_from": "",
            "approved_work_schedule_to": "",
            "objectives": ""
        }

        localStorage.setItem("work_plan", JSON.stringify(work_plan_details))

        // save to work_plan table then reroute to edit
        const createDraftWorkPlan = async () => {
            debugger
            try {
                const onlinePayload = await LoginService.onlineLogin("dsentico@dswd.gov.ph", "Dswd@123");
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL_KCIS}work_plan/create/`, {
                    method: "POST",
                    headers: {
                        Authorization: `bearer ${onlinePayload.token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify([
                        {
                            id: wpIdDraft,
                            created_date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                            created_by: _session.userData.email,
                            remarks: "Work Plan Drafted",
                            immediate_supervisor_id: _session.id,
                            status_id: 22,
                            push_status_id: 1,
                            push_date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                        },
                    ]),
                });

                if (!res.ok) {
                    console.error("Error creating draft work plan", await res.text());
                } else {
                    const data = await res.json();
                    console.log("Draft work plan created:", data);
                    router.push(baseUrl + "/" + wpIdDraft + "/draft");

                }
            } catch (error) {
                console.error("Draft creation error:", error);
            }
        };

        createDraftWorkPlan();

    };
    const handleRowClick = (row: any) => {
        // check if mayroon sa dexiedb n record ng supervisor
        // if yes, load it
        // if no then get from api
        localStorage.removeItem("selectedBeneficiaries")
        console.log("Row clicked:", row);

        const workPlanId = row.id;
        // alert(workPlanId)
        if (row.status_id == 0 || row.status_id == 10 || row.status_id == 22 || row.status_id == null) {
            // 0=edit (url: url: /personprofile/workplan/uuid), 1=approved (viewing - url: /personprofile/workplan/uuid)
            const index = dataWorkPlan.findIndex((item) => item.id === workPlanId);

            console.log("🥰Data of the work plan", dataWorkPlan)
            console.log("🥰selected work plan", dataWorkPlan[index])
            localStorage.setItem("work_plan", JSON.stringify(dataWorkPlan[index]))

            router.push("/personprofile/work-plan/" + workPlanId + "/draft");
        } else if (row.status_id == 1) {
            // viewing 1=approved (viewing - url: /personprofile/workplan/uuid)
            router.push("/personprofile/work-plan/" + workPlanId);
        }
        return;

    };
    return (
        <div className="min-h-screen p-6">
                <PageHeader
                    title="Work Plans Dashboard"
                    mode=""
                    lastModified=""
                    modifiedBy=""
                    role=""
                    description="Manage and track all work plan submissions and their approval status."

                />
            <div className="mb-8 flex items-center justify-between">


                {/* <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                        Work Plans Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Manage and track all work plan submissions and their approval status
                    </p>
                </div> */}

                <Button
                    className="inline-flex items-center px-4 py-2 font-mediumhover:bg-blue-700 transition hidden"
                    variant={"default"}
                    onClick={() => {
                        handleCreateANewWorkPlan()
                        // navigate or open modal
                        // console.log("Add new work plan clicked")
                    }}
                >
                    Add New Work Plan
                </Button>
            </div>

            {/* <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8 w-full mx-auto"> */}
            <div className="w-full mb-8">
                <div className="flex flex-col gap-6">
                    <Tabs defaultValue="all_work_plans">
                        {/* Tab buttons are not full width */}
                        <TabsList className="gap-2">
                            <TabsTrigger value="all_work_plans">All Work Plans</TabsTrigger>
                            <TabsTrigger value="my_work_plan">My Work Plans</TabsTrigger>
                        </TabsList>

                        {/* Full-width content */}
                        <TabsContent value="all_work_plans" className="w-full">
                            <Card className="w-full">
                                <CardHeader className="">
                                    <CardTitle>All Work Plans</CardTitle>
                                    <CardDescription>
                                        View and manage all submitted work plans.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6">
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8 w-full mx-auto">

                                        {statuses.map((status) => {
                                            const info = statusInfo[status as keyof typeof statusInfo];
                                            return (
                                                <Card
                                                    key={status}
                                                    className="cursor-pointer hover:shadow-lg transition"
                                                    onClick={() => router.push(`/personprofile/work-plan/${status}`)}
                                                // onClick={() => router.push(`/personprofile/work-plan/${status}`)}
                                                >
                                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                                        <CardTitle className={`text-sm font-medium ${info.color}`}>{info.label.toUpperCase()}</CardTitle>
                                                        {info.icon}
                                                    </CardHeader>
                                                    <CardContent>
                                                        <div className={`text-2xl font-bold mb-3 ${info.color}`}>
                                                            {isLoadingCounts ? (
                                                                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse"></div>
                                                            ) : (
                                                                <div className={`text-2xl font-bold mb-3 ${info.color}`}>
                                                                    {info.count}
                                                                </div>
                                                            )}
                                                            {/* {info.count} */}
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{info.description}</p>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="my_work_plan" className="w-full">
                            <Card className="w-full">
                                <CardHeader>
                                    <CardTitle>My Work Plans</CardTitle>
                                    <CardDescription>

                                        View and manage your personal work plans.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="grid gap-6 w-full">
                                    {/* User-specific work plans */}
                                    <div className="w-full  overflow-x-auto">
                                        <AppTable
                                            data={dataWorkPlan ?? []}
                                            columns={columnsWorkPlan}
                                            onClickAddNew={handleCreateNewWorkPlan}
                                            onRowClick={handleRowClick}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>

        </div>
    );
}
