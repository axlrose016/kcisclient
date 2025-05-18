"use client";

import React, { ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { CalendarIcon, Download, Edit, Plus, Printer, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { addDays, endOfMonth, format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { useParams } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { cn, removeItemAtIndex, replaceItemAtIndex, sanitizeHTML } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import DropAttachments from './DropAttachments';
import { SessionPayload } from '@/types/globals';
import { getSession } from '@/lib/sessions-client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { IAccomplishmentActualTask, IAccomplishmentReport, IPersonProfile, IWorkPlan, IWorkPlanTasks } from '@/components/interfaces/personprofile';
import { ILibSchoolProfiles } from '@/components/interfaces/library-interface';
import { v4 as uuidv4 } from 'uuid';
import { IUser } from '@/components/interfaces/iuser';
import { DatePickerWithRange } from '@/components/app-daterange';
import debounce from "lodash.debounce";
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';


type UserTypes = IPersonProfile & ILibSchoolProfiles;

type EditableCellProps = {
    placeholder?: string;
    value: string;
    onDebouncedChange: (value: string) => void;
    className?: string
    element?: ReactNode
};

const EditableCell: React.FC<EditableCellProps> = ({ value, onDebouncedChange, className = cn(
    "align-top border-r p-1 w-full px-2 py-1 h-full bg-blue-100/40 ring-0",
    "focus:outline-none focus:ring-1"
), placeholder = "", element }) => {
    const divRef = useRef<HTMLDivElement>(null);

    const debouncedChange = useMemo(
        () =>
            debounce((text: string) => {
                onDebouncedChange(text);
            }, 900),
        [onDebouncedChange]
    );

    const handleInput = (e: any) => {
        debouncedChange(e.target.innerText || "");
    };

    return (
        <>
            <TableCell
                className={className}>
                <div className='flex items-center'>
                    <div className='flex-1' id="editable"
                        contentEditable
                        suppressContentEditableWarning
                        onInput={handleInput}
                        data-placeholder={placeholder}>
                        {value}
                    </div>
                    {element}
                </div>
            </TableCell>

        </>
    );
};

export default function AccomplishmentReportUser() {

    const router = useRouter();
    const { toast } = useToast()

    const params = useParams<{ 'accomplishment-userid': string; id: string }>()
    const [user, setUser] = useState<UserTypes>();

    const [workplan, setWorkPlan] = useState<IWorkPlan>()
    const [generalTasks, setGeneralTask] = useState<IWorkPlanTasks[]>([])
    const [specificTask, setSpecificTask] = useState<IWorkPlanTasks[]>([])
    const [otherTask, setOtherTask] = useState<IAccomplishmentActualTask[]>([])
    const [supervisor, setSupervisor] = useState<IUser>()
    const [alternateSupervisor, setAlternateSupervisor] = useState<IUser>()

    const [ar, setAR] = useState<IAccomplishmentReport>()
    const [tasks, setTasks] = useState<IAccomplishmentActualTask[]>([])

    const getInitialDateRange = (): DateRange => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        const isAfter15th = today.getDate() >= 16;
        const from = isAfter15th
            ? new Date(year, month, 16)
            : new Date(year, month, 1);

        const to = isAfter15th
            ? endOfMonth(today)
            : addDays(from, 15);

        return { from, to };
    };


    const [date, setDate] = React.useState<DateRange | undefined>(getInitialDateRange())
    const [session, setSession] = useState<SessionPayload>();


    useEffect(() => {
        (async () => {
            const _session = await getSession() as SessionPayload;
            try {
                if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setSession(_session)
            await getResults(_session)
        })();
    }, [])


    const getResults = async (session: SessionPayload) => {

        const wp = await dexieDb.work_plan.where("id").equals("6ae189ed-eec7-4c38-a9fa-da8a00b01f21").first()
        if (wp) {
            setWorkPlan(wp)
            setSupervisor(await dexieDb.users.where("id").equals(wp.immediate_supervisor_id).first())
            setAlternateSupervisor(await dexieDb.users.where("id").equals(wp.alternate_supervisor_id).first())
            const alltask = await dexieDb.work_plan_tasks.where("work_plan_id").equals("6ae189ed-eec7-4c38-a9fa-da8a00b01f21").toArray()
            setGeneralTask(alltask.filter(i => i.category_id == 1))
            setSpecificTask(alltask.filter(i => i.category_id == 2))

            const acutals = await dexieDb.accomplishment_actual_task.toArray()
            console.log('acutals', acutals)

            setOtherTask(await dexieDb.accomplishment_actual_task.where("category_id").equals("99").toArray())
        }

        await dexieDb.work_plan.put({
            id: '6ae189ed-eec7-4c38-a9fa-da8a00b01f21',
            immediate_supervisor_id: "23db4fc3-038d-4ebc-8688-f35a1cf5f24a",
            alternate_supervisor_id: "35c1f7f3-03be-4277-99cd-3b78dad9722a",
            objectives: "Sample",
            area_focal_person_id: "35c1f7f3-03be-4277-99cd-3b78dad9722a",
            no_of_days_program_engagement: 50,
            approved_work_schedule_from: "8AN - 12PM, 1PM - 5PM",
            approved_work_schedule_date: "June/1/2025",
            status_id: 0,
            created_date: new Date().toString(),
            created_by: session.userData.email!,
            last_modified_date: "",
            last_modified_by: "",
            push_status_id: 1,
            push_date: "",
            deleted_date: "",
            deleted_by: "",
            is_deleted: false,
            remarks: "",
        })

        if ((await dexieDb.work_plan_tasks.toArray()).length == 0) {
            await dexieDb.work_plan_tasks.bulkPut([
                {
                    id: uuidv4(),
                    category_id: 1,
                    work_plan_id: "6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
                    activities_tasks: "Attend to KC-CFW related activities",
                    expected_output: "Document and comply with the KC-CFW instructions",
                    timeline_from: new Date(),
                    timeline_to: new Date(),
                    assigned_person_id: "",
                    status_id: 0,
                    created_date: new Date().toString(),
                    created_by: session.userData.email!,
                    last_modified_date: "",
                    last_modified_by: "",
                    push_status_id: 1,
                    push_date: "",
                    deleted_date: "",
                    deleted_by: "",
                    is_deleted: false,
                    remarks: "",
                },
                {
                    id: uuidv4(),
                    category_id: 1,
                    work_plan_id: "6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
                    activities_tasks: "Encoding of the served CFW beneficiary profile in the database",
                    expected_output: "Encoded list of served beneficiaries and updaated database",
                    timeline_from: new Date(),
                    timeline_to: new Date(),
                    assigned_person_id: "",
                    status_id: 0,
                    created_date: new Date().toString(),
                    created_by: session.userData.email!,
                    last_modified_date: "",
                    last_modified_by: "",
                    push_status_id: 1,
                    push_date: "",
                    deleted_date: "",
                    deleted_by: "",
                    is_deleted: false,
                    remarks: "",
                },
                {
                    id: uuidv4(),
                    category_id: 1,
                    work_plan_id: "6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
                    activities_tasks: "Assist in the review and validation of the beneficaires submitted documents ",
                    expected_output: "Validated and reviewed payment requirements of the beneficiaries and generate the list of beneficiaries with compliances ",
                    timeline_from: new Date(),
                    timeline_to: new Date(),
                    assigned_person_id: "",
                    status_id: 0,
                    created_date: new Date().toString(),
                    created_by: session.userData.email!,
                    last_modified_date: "",
                    last_modified_by: "",
                    push_status_id: 1,
                    push_date: "",
                    deleted_date: "",
                    deleted_by: "",
                    is_deleted: false,
                    remarks: "",
                },
                {
                    id: uuidv4(),
                    category_id: 1,
                    work_plan_id: "6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
                    activities_tasks: "Assist in the computation of payroll assistance",
                    expected_output: "Accurate computation of the beneficiaries assistance and included on the payroll",
                    timeline_from: new Date(),
                    timeline_to: new Date(),
                    assigned_person_id: "",
                    status_id: 0,
                    created_date: new Date().toString(),
                    created_by: session.userData.email!,
                    last_modified_date: "",
                    last_modified_by: "",
                    push_status_id: 1,
                    push_date: "",
                    deleted_date: "",
                    deleted_by: "",
                    is_deleted: false,
                    remarks: "",
                },
                {
                    id: uuidv4(),
                    category_id: 1,
                    work_plan_id: "6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
                    activities_tasks: "Data recording of the actual day rendered of the beneficiaries based on their submitted payment requirements in the database",
                    expected_output: "Updated monitoring tool ",
                    timeline_from: new Date(),
                    timeline_to: new Date(),
                    assigned_person_id: "",
                    status_id: 0,
                    created_date: new Date().toString(),
                    created_by: session.userData.email!,
                    last_modified_date: "",
                    last_modified_by: "",
                    push_status_id: 1,
                    push_date: "",
                    deleted_date: "",
                    deleted_by: "",
                    is_deleted: false,
                    remarks: "",
                },
                {
                    id: uuidv4(),
                    category_id: 1,
                    work_plan_id: "6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
                    activities_tasks: "Assist during payout activity.",
                    expected_output: "Payout report.",
                    timeline_from: new Date(),
                    timeline_to: new Date(),
                    assigned_person_id: "",
                    status_id: 0,
                    created_date: new Date().toString(),
                    created_by: session.userData.email!,
                    last_modified_date: "",
                    last_modified_by: "",
                    push_status_id: 1,
                    push_date: "",
                    deleted_date: "",
                    deleted_by: "",
                    is_deleted: false,
                    remarks: "",
                },
                {
                    id: uuidv4(),
                    category_id: 1,
                    work_plan_id: "6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
                    activities_tasks: "Sorting and filing of CFW documents such as but not limited to their profile forms, payment requirements and other liquidation documents ",
                    expected_output: "Sorted and compiled the liquidation documents",
                    timeline_from: new Date(),
                    timeline_to: new Date(),
                    assigned_person_id: "",
                    status_id: 0,
                    created_date: new Date().toString(),
                    created_by: session.userData.email!,
                    last_modified_date: "",
                    last_modified_by: "",
                    push_status_id: 1,
                    push_date: "",
                    deleted_date: "",
                    deleted_by: "",
                    is_deleted: false,
                    remarks: "",
                },
                {
                    id: uuidv4(),
                    category_id: 1,
                    work_plan_id: "6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
                    activities_tasks: "Scanning of the liquidation payment requirements",
                    expected_output: "Scanned the liquidation documents",
                    timeline_from: new Date(),
                    timeline_to: new Date(),
                    assigned_person_id: "",
                    status_id: 0,
                    created_date: new Date().toString(),
                    created_by: session.userData.email!,
                    last_modified_date: "",
                    last_modified_by: "",
                    push_status_id: 1,
                    push_date: "",
                    deleted_date: "",
                    deleted_by: "",
                    is_deleted: false,
                    remarks: "",
                },
                {
                    id: uuidv4(),
                    category_id: 2,
                    work_plan_id: "6ae189ed-eec7-4c38-a9fa-da8a00b01f21",
                    activities_tasks: "Generate payroll list for the month period of February and March.",
                    expected_output: "Generated the payroll list covered the months of February and March. ",
                    timeline_from: new Date(),
                    timeline_to: new Date(),
                    assigned_person_id: "8d148ae3-83d9-4caf-84c2-39238db6a4cc",
                    status_id: 0,
                    created_date: new Date().toString(),
                    created_by: session.userData.email!,
                    last_modified_date: "",
                    last_modified_by: "",
                    push_status_id: 1,
                    push_date: "",
                    deleted_date: "",
                    deleted_by: "",
                    is_deleted: false,
                    remarks: "",
                },
            ])
        }


        const user = await dexieDb.person_profile.where('user_id')
            .equals(params!['accomplishment-userid']).first();

        const merge = {
            ...await dexieDb.lib_school_profiles.where("id").equals(user!.school_id!).first(),
            ...user
        };

        console.log('getResults', { session, merge, params });
        setUser(merge as any);


        const arId = params?.id == "new" ? uuidv4() : params!.id

        const ar = await dexieDb.accomplishment_report.where("id").equals(arId).first()
        setTasks(await dexieDb.accomplishment_actual_task.where("accomplishment_report_id").equals(arId).toArray())
        console.log('ar', { arId, params, ar })

        setAR({
            id: arId,
            person_id: user!.user_id,
            period_cover_from: ar?.period_cover_from ?? date!.from!,
            period_cover_to: ar?.period_cover_to ?? date!.to!,
            work_plan_id: wp?.id || "",
            accomplishment_actual_task: "",
            status_id: ar ? ar.status_id : 0,
            created_date: ar?.created_date ?? new Date().toISOString(),
            created_by: ar?.created_by ?? user!.email!,
            last_modified_by: ar?.last_modified_by ?? user!.email!,
            last_modified_date: new Date().toISOString(),
            push_status_id: 0,
            push_date: "",
            deleted_date: "",
            deleted_by: "",
            is_deleted: false,
            remarks: "",
        })

        const results = await dexieDb.cfwtimelogs.where('created_by')
            .equals(user?.email ?? "")
            .sortBy("created_date"); // Ascending: oldest → latest 
        return results;
    };

    const handleContentEdit = (task: IAccomplishmentActualTask, value: string, type: string) => {
        (async () => {
            const sanitizedValue = sanitizeHTML(value);
            const index = tasks.findIndex(i => i.id == task.id)

            console.log('handleContentEdit > index', { tasks, sanitizedValue, index })
            if (index > -1) {
                const item = tasks[index]
                const updates = {
                    ...item,
                    category_id: task.category_id,
                    accomplishment: type == "accomplishment" ? sanitizedValue : item.accomplishment,
                    mov: type == "movs" ? sanitizedValue : item.mov,
                    task: type == "task" ? sanitizedValue : item.task,
                }
                console.log('handleContentEdit > item', { item, updates })
                setTasks(replaceItemAtIndex(tasks, index, updates))
            } else {

                tasks.push({
                    id: task.id,
                    category_id: task.category_id.toString(),
                    accomplishment_report_id: ar?.id || "",
                    accomplishment: type == "accomplishment" ? sanitizedValue : "",
                    mov: type == "movs" ? sanitizedValue : "",
                    task: type == "task" ? sanitizedValue : "",
                    status_id: 0,
                    created_date: new Date().toString(),
                    created_by: session!.userData!.email!,
                    last_modified_date: "",
                    last_modified_by: "",
                    push_status_id: 0,
                    push_date: "",
                    deleted_date: "",
                    deleted_by: "",
                    is_deleted: false,
                    remarks: "",
                })
                setTasks(tasks)
            }

            console.log('handleContentEdit', { task, sanitizedValue })
            //   updateTask(id, { [field]: sanitizedValue });
        })();
    };

    const isCategory = (task: any): boolean => {
        return task.task === "General Activities/Tasks" || task.task === "Specific Activities/Tasks";
    };

    const handleSaveAccomplishmentReport = () => {
        (async () => {

            const id = `${ar?.id}`
            const raw = {
                ...ar!,
                status_id: 0,
                created_date: ar?.created_date ?? new Date().toISOString(),
                created_by: ar?.created_by ?? user!.email!,
                last_modified_by: ar?.last_modified_by ?? user!.email!,
                last_modified_date: new Date().toISOString(),
                push_status_id: 0,
                remarks: "",
            }
            console.log('handleSaveAccomplishmentReport > workplan', { workplan, raw, id, tasks })
            if (id) {

                await dexieDb.accomplishment_report.put(raw, id)
                await dexieDb.accomplishment_actual_task.bulkPut(tasks,)
                console.log('handleSaveAccomplishmentReport')
                toast({
                    variant: "green",
                    title: "Accomplishment Report",
                    description: "Your update has been saved!",

                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Accomplishment Report",
                    description: "AR Id or user session is not yet ready",

                });
            }
        })();
    }

    const handleOtherTask = () => {
        setOtherTask([...otherTask, {
            id: uuidv4(),
            category_id: "99",
            accomplishment_report_id: ar?.id || "",
            accomplishment: "",
            mov: "",
            task: "",
            status_id: 0,
            created_date: new Date().toString(),
            created_by: session!.userData!.email!,
            last_modified_date: "",
            last_modified_by: "",
            push_status_id: 0,
            push_date: "",
            deleted_date: "",
            deleted_by: "",
            is_deleted: false,
            remarks: "",
        }])
        console.log('handleOtherTask', null)
    }

    const handleDeleteOtherTask = (task: any, idx: number) => {
        console.log('handleDeleteOtherTask', { task, idx })
        setOtherTask(removeItemAtIndex(otherTask, idx))
    }

    return (
        <>
            <Card>
                <div id="print-section" className='print-small'>
                    <CardHeader>
                        <CardTitle className="mb-2 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
                            <div className="flex-shrink-0">
                                <Image src="/images/logos.png" width={300} height={300} alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto" />
                            </div>
                            <div className="text-lg font-semibold mt-2 md:mt-0">
                                Accomplishment Report
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className='flex flex-col gap-2 mb-8 mt-3'>
                            <div className="grid grid-cols-1 sm:grid-cols-4  gap-2 md:grid-cols-4">
                                <div className="col-span-1 font-bold leading-none">FULL NAME (Last Name, First Name, Middle Name, Ext)</div>
                                <div className="col-span-1 text-gray-900 leading-none">{user?.first_name} {user?.last_name}</div>
                                <div className="col-span-1 font-bold leading-none">Period Cover:<span className='text-red-600'>*</span></div>
                                <div className="col-span-1 text-gray-900 leading-none">
                                    <DatePickerWithRange value={date} onChange={setDate} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 md:grid-cols-4">
                                <div className="col-span-1 font-bold leading-none">SCHOOL GRADUATED/ENROLLED:</div>
                                <div className="col-span-1 text-gray-900 leading-none">{user?.school_name}</div>
                                <div className="col-span-1 font-bold leading-none">CFWP ID NO.</div>
                                <div className="col-span-1 text-gray-900 leading-none">0000-0000-000</div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 md:grid-cols-4">
                                <div className="col-span-1 font-bold leading-none">AREA OF ASSIGNMENT (Office and Address):</div>
                                <div className="col-span-1 text-gray-900 leading-none">{user?.school_address}</div>
                                <div className="col-span-1 font-bold leading-none"></div>
                                <div className="col-span-1 text-gray-900 leading-none"></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 md:grid-cols-4">
                                <div className="col-span-1 font-bold leading-none">NAME OF IMMEDIATE SUPERVISOR:</div>
                                <div className="col-span-1 text-gray-900 leading-none">{supervisor?.username}</div>
                                <div className="col-span-1 font-bold leading-none"></div>
                                <div className="col-span-1 text-gray-900 leading-none"></div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 md:grid-cols-4">
                                <div className="col-span-1 font-bold leading-none">NAME OF ALTERNATE IMMEDIATE SUPERVISOR:</div>
                                <div className="col-span-1 text-gray-900 leading-none">{alternateSupervisor?.username}</div>
                                <div className="col-span-1 font-bold leading-none"></div>
                                <div className="col-span-1 text-gray-900 leading-none"></div>
                            </div>
                        </div>


                        <div className="mb-6">
                            <div
                                className="relative rounded-md border shadow-sm overflow-x-auto max-w-full"
                            >
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[400px] border-r min-w-[420px] font-bold text-black">Task/Deliverables based on the approved Work Plan</TableHead>
                                            <TableHead className="w-[250px] border-r min-w-[250px] text-center font-bold text-black">Accomplishments</TableHead>
                                            <TableHead className="w-[250px]  min-w-[250px] text-center font-bold text-black">MOVs (if any)</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>

                                        {generalTasks.length !== 0 ? <>
                                            <TableRow
                                                key={"general"}
                                                className={cn({
                                                    "bg-muted/50 font-semibold": true,
                                                })}
                                            >
                                                <TableCell className={cn("align-top w-[400px]", {
                                                    "text-primary font-semibold": true,
                                                    "text-muted-foreground": false,
                                                })}>
                                                    General Activities/Tasks
                                                </TableCell>
                                                <TableCell
                                                    className="align-top"
                                                    contentEditable={false}
                                                    suppressContentEditableWarning={true}
                                                />
                                                <TableCell
                                                    className="align-top"
                                                    contentEditable={false}
                                                    suppressContentEditableWarning={true}
                                                />
                                            </TableRow>

                                            {generalTasks.map((task, idx) => (
                                                <TableRow
                                                    key={task.id}
                                                    className={cn({
                                                        "bg-muted/50 font-semibold": false,
                                                    })}
                                                >
                                                    <TableCell
                                                        className={cn("align-top border-r w-[400px]", {
                                                            "text-primary font-semibold": isCategory(task),
                                                            "text-muted-foreground": false,
                                                        })}>
                                                        {task.activities_tasks}
                                                    </TableCell>

                                                    <EditableCell
                                                        key={tasks.find(i => i.id == task.id)?.accomplishment ?? "genAccom" + idx}
                                                        placeholder={"Write Actual Tasks..."}
                                                        value={tasks.find(i => i.id == task.id)?.accomplishment ?? ""}
                                                        onDebouncedChange={(val) => handleContentEdit(task, val || "", "accomplishment")}
                                                    />

                                                    <EditableCell
                                                        key={tasks.find(i => i.id == task.id)?.mov ?? "genMov" + idx}
                                                        placeholder={"Attachments Link here..."}
                                                        value={tasks.find(i => i.id == task.id)?.mov ?? ""}
                                                        onDebouncedChange={(val) => handleContentEdit(task, val || "", "movs")}
                                                    />
                                                </TableRow>
                                            ))}
                                        </> : null}

                                        {specificTask.length !== 0 ? <>
                                            <TableRow
                                                key={"general"}
                                                className={cn({
                                                    "bg-muted/50 font-semibold": true,
                                                })}
                                            >
                                                <TableCell className={cn("align-top w-[400px]", {
                                                    "text-primary font-semibold": true,
                                                    "text-muted-foreground": false,
                                                })}>
                                                    Specific Activities/Tasks
                                                </TableCell>
                                                <TableCell
                                                    className="align-top"
                                                    contentEditable={false}
                                                    suppressContentEditableWarning={true}
                                                />
                                                <TableCell
                                                    className="align-top"
                                                    contentEditable={false}
                                                    suppressContentEditableWarning={true}
                                                />
                                            </TableRow>

                                            {specificTask.map((task, idx) => (
                                                <TableRow
                                                    key={task.id}
                                                    className={cn({
                                                        "bg-muted/50 font-semibold": false,
                                                    })}
                                                >
                                                    <TableCell className={cn("align-top border-r w-[400px]", {
                                                        "text-primary font-semibold": isCategory(task),
                                                        "text-muted-foreground": false,
                                                    })}>
                                                        {task.activities_tasks}
                                                    </TableCell>
                                                    <EditableCell
                                                        key={tasks.find(i => i.id == task.id)?.accomplishment ?? "specAccom" + idx}
                                                        placeholder={"Write Actual Tasks..."}
                                                        value={tasks.find(i => i.id == task.id)?.accomplishment ?? ""}
                                                        onDebouncedChange={(val) => handleContentEdit(task, val || "", "accomplishment")}
                                                    />

                                                    <EditableCell
                                                        key={tasks.find(i => i.id == task.id)?.mov ?? "specMov" + idx}
                                                        placeholder={"Attachments Link here..."}
                                                        value={tasks.find(i => i.id == task.id)?.mov ?? ""}
                                                        onDebouncedChange={(val) => handleContentEdit(task, val || "", "movs")}
                                                    />
                                                </TableRow>
                                            ))}
                                        </> : null}


                                        {otherTask.length !== 0 ? <>
                                            <TableRow
                                                key={"general"}
                                                className={cn({
                                                    "bg-muted/50 font-semibold": true,
                                                })}
                                            >
                                                <TableCell className={cn("align-top w-[400px]", {
                                                    "text-primary font-semibold": true,
                                                    "text-muted-foreground": false,
                                                })}>
                                                    Other Tasks
                                                </TableCell>
                                                <TableCell

                                                    className="align-top"
                                                    contentEditable={false}
                                                    suppressContentEditableWarning={true}
                                                />
                                                <TableCell
                                                    className="align-top"
                                                    contentEditable={false}
                                                    suppressContentEditableWarning={true}
                                                />
                                            </TableRow>

                                            {otherTask.map((task, idx) => (
                                                <TableRow
                                                    key={task.id}
                                                    className={cn({
                                                        "bg-muted/50 font-semibold": false,
                                                    })}
                                                >
                                                    <EditableCell
                                                        key={tasks.find(i => i.id == task.id)?.task ?? "task" + idx}
                                                        placeholder={"Write Activity or Task title"} className={cn("align-top border-r w-[400px]", {
                                                            "text-primary font-semibold": isCategory(task),
                                                            "text-muted-foreground": false,
                                                        })}
                                                        value={tasks.find(i => i.id == task.id)?.task ?? ""}
                                                        onDebouncedChange={(val) => handleContentEdit(task, val || "", "task")}
                                                    />

                                                    <EditableCell
                                                        key={tasks.find(i => i.id == task.id)?.accomplishment ?? "accomTask" + idx}
                                                        placeholder={"Write Actual Tasks..."}
                                                        value={tasks.find(i => i.id == task.id)?.accomplishment ?? ""}
                                                        onDebouncedChange={(val) => handleContentEdit(task, val || "", "accomplishment")}
                                                    />

                                                    <EditableCell
                                                        key={tasks.find(i => i.id == task.id)?.mov ?? "movTask" + idx}
                                                        placeholder={"Attachments Link here..."}
                                                        value={tasks.find(i => i.id == task.id)?.mov ?? ""}
                                                        onDebouncedChange={(val) => handleContentEdit(task, val || "", "movs")}
                                                        element={<div id="no-print" className={"text-right flex justify-right items-end"}>
                                                            <div onClick={() => handleDeleteOtherTask(task, idx)} className="mt-[10px] mr-[10px]">
                                                                <Button
                                                                    variant="outline"
                                                                    size="lg"
                                                                    className="h-10 w-10 p-0 text-destructive hover:text-destructive/90"
                                                                >
                                                                    <Trash2 className="h-6 w-6" />
                                                                    <span className="sr-only">Del</span>
                                                                </Button>
                                                            </div>
                                                        </div>}
                                                    />
                                                </TableRow>
                                            ))}
                                        </> : null}

                                        <TableRow
                                            id="no-print"
                                            key={"others"}
                                            className={cn({
                                                "bg-muted/50 font-semibold h-6 cursor-pointer": true,
                                            })}
                                        >
                                            <TableCell className={cn("align-top w-[400px] text-center flex justify-center items-center", {
                                                "text-primary font-semibold": true,
                                                "text-muted-foreground": false,
                                            })}
                                                colSpan={3} >
                                                <div onClick={() => handleOtherTask()} className="left-0 right-0 absolute">
                                                    <span>Click to Add Other Task</span>
                                                </div>
                                            </TableCell>
                                            <TableCell
                                                className="align-top"
                                                contentEditable={false}
                                                suppressContentEditableWarning={true}
                                            />
                                            <TableCell
                                                className="align-top"
                                                contentEditable={false}
                                                suppressContentEditableWarning={true}
                                            />
                                        </TableRow>


                                    </TableBody>
                                </Table>
                            </div>
                        </div>


                        <div className='flex flex-col my-6'>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div className="col-span-1">
                                    <p className='font-bold'>Prepared by:</p>
                                    <p className='mt-8'>{user?.first_name} {user?.last_name}</p>
                                    <p className='font-bold'>Beneficiary</p>
                                </div>
                                <div className="col-span-1 ">
                                    <p className='font-bold'>Signed and Approved by:</p>
                                    <p className='mt-8'>{supervisor?.username}</p>
                                    <p className='font-bold'>Immediate Supervisor/Alternate</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </div>

                <div className="flex justify-start gap-2 m-5 no-print">
                    <Button onClick={handleSaveAccomplishmentReport}>
                        <Edit className="mr-1 h-4 w-4" /> Save
                    </Button>
                    <Button variant="outline" onClick={() => {
                        const content = document.getElementById('print-section');
                        if (!content) return;
                        const style = document.createElement('style');
                        style.innerHTML = `
                         @media print { 
                           @page {
                             size: A4;
                             margin: 0.8mm; /* Reduced margin for fitting the content */
                           } 
                           body {
                              zoom: 69%;
                             margin: 0;
                             padding: 0;
                             font-size: 12px; /* Keep the font-size consistent */
                           } 
                           #no-print{
                            display: none;
                           }
                           #editable:empty:before {
                              content: none;
                            }
                           /* This ensures the printed content scales without changing the original layout */
                           .print-small {
                             padding: 5px; /* Reduce padding to fit more content */
                           } 
                           /* Hide non-printable elements */
                           .no-print {
                             display: none;
                           } 
                           /* Scale content without affecting the original layout */
                           .no-scale {
                             transform: scale(0.45);
                             transform-origin: top left;
                             width: 100%; /* Use full width */
                             overflow: hidden;
                           }
                         }
                       `;
                        document.head.appendChild(style);
                        const clone = content.cloneNode(true) as HTMLElement;
                        const originalContents = document.body.innerHTML;
                        document.body.innerHTML = '';
                        document.body.appendChild(clone);
                        window.print();
                        document.body.innerHTML = originalContents;
                        window.location.reload(); // Rebind React
                    }}>
                        <Printer className="mr-1 h-4 w-4" /> Print
                    </Button>
                    <Button variant="outline" onClick={() => console.log('Downloading PDF...')}>
                        <Download className="mr-1 h-4 w-4" /> Download
                    </Button>
                </div>

            </Card>

        </>
    );
}