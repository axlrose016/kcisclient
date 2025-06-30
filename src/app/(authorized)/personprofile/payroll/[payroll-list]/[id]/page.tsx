"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ILibSchoolProfiles } from '@/components/interfaces/library-interface';
import { ICFWAssessment, IPersonProfile } from '@/components/interfaces/personprofile';
import { SessionPayload } from '@/types/globals';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { getSession } from '@/lib/sessions-client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import AppSubmitReview, { LibraryOption } from '@/components/app-submit-review';
import { ICFWPayrollBene, ISubmissionLog } from '@/components/interfaces/cfw-payroll';
import { getOfflineLibStatuses } from '@/components/_dal/offline-options';
import Image from 'next/image';
import { AppTable } from '@/components/app-table';
import { ICFWTimeLogs } from '@/components/interfaces/iuser';
import { DTRcolumns } from '../../../daily-time-record/[id]/page';
import { AccomplishmentUser } from '@/components/accomplishment-user';
import { toast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent } from '@/components/ui/tooltip';
import { TooltipTrigger } from '@radix-ui/react-tooltip';
import { libDb } from '@/db/offline/Dexie/databases/libraryDb';
import { uuidv5 } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { DTRService } from '@/components/services/DTRServices';
import { ARService } from '@/components/services/ARservice';

export interface dataI {
    id: string;
    date: string;
    hours: number;
    status: string;
}

type UserTypes = IPersonProfile & ILibSchoolProfiles;
type IPayrollBene = ICFWPayrollBene & IPersonProfile & { no_hours: number, rate: number, amount: number };

export default function PayrollUser() {

    const router = useRouter();
    const params = useParams<{ 'payroll-list': string; id: string }>()


    const [user, setUser] = useState<UserTypes>();
    const [session, setSession] = useState<SessionPayload>();

    const [assessment, setAssessment] = useState<ICFWAssessment>()

    const [dtrlist, setDTRList] = useState<ICFWTimeLogs[]>([]);
    const [bene, setPayrollBeneData] = useState<IPayrollBene>()
    const [statusesOptions, setStatusesOptions] = useState<LibraryOption[]>([]);
    const [submissionLogs, setSubmissionLogs] = useState<ISubmissionLog[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<ISubmissionLog>({
        id: "",
        record_id: "",
        person_profile_id: "",
        role: "",
        module: "",
        comment: "",
        status_id: undefined,
        status_date: "",
        created_date: "",
        created_by: ""
    });

    const [period_cover_from, period_cover_to] = params!['payroll-list']!.split('-').map(dateStr => {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return new Date(`${year}-${month}-${day}`);
    });

    const StatusBadge = ({ status }: { status: string }) => (
        <span className={`
        px-2 py-1 rounded-full text-xs font-semibold
        ${status === 'completed'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-400'
            }
      `}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );


    useEffect(() => {
        (async () => {
            const _session = await getSession() as SessionPayload;
            setSession(_session)

            await getResults(_session)

            const statuses = await getOfflineLibStatuses();
            const filteredStatuses = statuses.filter(status => [2, 10, 11, 10, 5, 17].includes(status.id));
            setStatusesOptions(filteredStatuses);

            console.log('period_cover_from', { period_cover_from, period_cover_to })

            const pbd = await dexieDb.cfwpayroll_bene
                .where({
                    period_cover_from: format(period_cover_from, 'yyyy-MM-dd'),
                    period_cover_to: format(period_cover_to, 'yyyy-MM-dd')
                })
                .and(i => i.person_profile_id == params?.id).first()

            const userid = uuidv5(params!['payroll-list'], pbd!.person_profile_id)
            console.log('pbd', { pbd, userid })
            setPayrollBeneData(pbd as IPayrollBene)

            const logsQuery = await dexieDb.submission_log.where("record_id").equals(userid)
            const logs = await logsQuery.sortBy("created_date")
            setSubmissionLogs(logs)


        })();
    }, [])

    const getResults = async (session: SessionPayload) => {
        const user = await dexieDb.person_profile.where('id')
            .equals(params!.id).first();

        const merge = {
            ...await libDb.lib_school_profiles.where("id").equals(user!.school_id!).first(),
            ...user
        };

        // console.log('getResults > user', { user, dtr, id: params!.id })
        setUser(merge as UserTypes);

        console.log('payroll > user', { user, merge })

        const dtr = await new DTRService().syncDLTimeLogs('cfwtimelogs/view/multiple/', {
            "person_profile_id": user!.user_id!
        });
        console.log('payroll > dtr', dtr)

        const dtrlogs = await dexieDb.cfwtimelogs
            .where('record_id')
            .equals(user?.user_id ?? "")
            .and(log => {
                const logDate = format(new Date(log.log_in), 'yyyy-MM-dd');
                return logDate >= format(period_cover_from, 'yyyy-MM-dd') && logDate <= format(period_cover_to, 'yyyy-MM-dd');
            })
            .sortBy("created_date"); // Ascending: oldest → latest  

        console.log('payroll > dtrlogs', dtrlogs, user?.email, period_cover_from, period_cover_to)

        setDTRList(dtrlogs as ICFWTimeLogs[])

        const ar = await new ARService().syncDLARs(`accomplishment_report/view/${user!.id}/`);
        console.log('payroll > ar', ar)

        const assessment = await dexieDb.cfwassessment.where("person_profile_id").equals(merge?.id || "").first();
        setAssessment(assessment)

        if (!assessment) {
            toast({
                variant: "destructive",
                title: "Assessment not found",
                description: "Please create an assessment first",
            });
        }
    }


    const handleSubmitReview = (review: ISubmissionLog) => {
        (async () => {
            console.log('handleSubmitReview > review', { review, session: session?.userData })
            const raw = {
                ...review!,
                id: uuidv4(),
                record_id: uuidv5(params!['payroll-list'], user!.id),
                person_profile_id: params!.id,
                role: session?.userData.role ?? "",
                module: "payroll",
                created_date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                created_by: session!.userData!.email!,
                push_status_id: 0,
            }
            // console.log('handleSubmitReview > rev', raw)
            await dexieDb.submission_log.put(raw)

            const rev = {
                ...bene,
                [session?.userData.role == 'CFW Administrator' ? 'operation_status' :
                    session?.userData.role == 'Finance' ? "finance_status" : "odnpm_status"]: raw.status_id,
                [session?.userData.role == 'CFW Administrator' ? 'operation_status_date' :
                    session?.userData.role == 'Finance' ? "finance_status_date" : "odnpm_status_date"]: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                [session?.userData.role == 'CFW Administrator' ? 'operation_reviewed_by' :
                    session?.userData.role == 'Finance' ? "finance_reviewed_by" : "odnpm_reviewed_by"]: session!.userData.email,
                last_modified_by: session!.userData.email,
                last_modified_date: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                push_status_id: 0,
            } as IPayrollBene
            console.log('handleSubmitReview > rev', rev)
            await dexieDb.cfwpayroll_bene.put(rev)

            toast({
                variant: "green",
                title: "Submit Review",
                description: "Your review has been submitted!",
            });
        })();
    }


    return (

        <Card className='min-h-screen'>
            <CardHeader>
                <CardTitle className="flex flex-col mb-2 md:flex-row items-center md:justify-between text-center md:text-left">
                    {/* Logo Section */}
                    <div className="flex-shrink-0">
                        <Image src="/images/logos.png" width={300} height={300} alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto" />
                    </div>
                    {/* Title Section */}
                    <div className="flex gap-2 items-center">
                        <div className="flex flex-col text-lg font-semibold mt-3 leading-none">
                            <p>Payroll Period</p>
                            <small>{format(period_cover_from, 'MMM d')} - {format(period_cover_to, 'd, yyyy')}</small>
                            {/* Checklist for 3 important roles */}
                        </div>
                        <div className="flex flex-row gap-4 mt-2">
                            {[
                                { label: "OPERATIONS", key: "CFW Administrator" },
                                { label: "FINANCE", key: "Finance" },
                                { label: "ODNPM", key: "ONDPM" }
                            ].map((role) => {
                                // Find if this role has a submission log
                                const found = submissionLogs.some(
                                    log =>
                                        log.created_by &&
                                        (
                                            (role.key === "CFW Administrator" && log.created_by.toLowerCase().includes("cfw administrator")) ||
                                            (role.key === "Finance" && log.created_by.toLowerCase().includes("finance")) ||
                                            (role.key === "ONDPM" && log.created_by.toLowerCase().includes("ondpm"))
                                        )
                                ) ||
                                    // Fallback: check if the log's comment or module or status_id is associated with the role
                                    submissionLogs.some(log =>
                                        (role.key === "CFW Administrator" && (log.module?.toLowerCase().includes("payroll") && log.status_id === 2)) ||
                                        (role.key === "Finance" && (log.module?.toLowerCase().includes("payroll") && log.status_id === 10)) ||
                                        (role.key === "ONDPM" && (log.module?.toLowerCase().includes("payroll") && log.status_id === 11))
                                    );

                                // If not found by created_by, try to infer by status_id (2: CFW Admin, 10: Finance, 11: ONDPM)
                                let isChecked = false;
                                if (role.key === "CFW Administrator") {
                                    isChecked = submissionLogs.some(log => log.status_id === 2);
                                } else if (role.key === "Finance") {
                                    isChecked = submissionLogs.some(log => log.status_id === 10);
                                } else if (role.key === "ONDPM") {
                                    isChecked = submissionLogs.some(log => log.status_id === 11);
                                }
                                // Prefer found, fallback to isChecked
                                const checked = found || isChecked;

                                return (
                                    <div key={role.key} className="flex flex-col items-center">
                                        <span
                                            className={`
                                            flex items-center justify-center w-6 h-6 rounded-full border-2
                                            ${checked
                                                    ? "bg-green-100 border-green-500 text-green-600"
                                                    : "bg-gray-100 border-gray-300 text-gray-400"
                                                }
                                        `}
                                        >
                                            <CheckCircle
                                                className={checked ? "text-green-600" : "text-gray-400"}
                                                size={21}
                                                strokeWidth={2}
                                                fill={checked ? "#22c55e" : "none"}
                                            />
                                        </span>
                                        <span className="text-[10px] mt-1 font-medium">{role.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>


                </CardTitle>



            </CardHeader>
            <CardContent>
                <div className="flex flex-col">

                    <div className="flex items-center space-x-4">
                        <Avatar>
                            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" alt="User name" />
                            <AvatarFallback>{user?.first_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                            <h2 className="text-lg font-semibold uppercase">{user?.first_name} {user?.last_name}</h2>
                            <p className="text-sm text-gray-500">{user?.school_name}</p>
                        </div>

                        {/* <Button onClick={() => console.log('enteries', null)} size="sm" className="flex items-center gap-2">
                            <Printer className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => console.log('enteries', null)} size="sm" className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                        </Button> */}

                    </div>

                    {/* {["Guest", "CFW Beneficiary"].includes(session?.userData.role!) && (
                        <>
                            <div className="my-10 grid grid-cols-2 gap-2 text-center">
                                <div>
                                    <p className="text-xl font-bold">146</p>
                                    <p className="text-gray-500 text-sm">Working hours</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold">14</p>
                                    <p className="text-gray-500 text-sm">Overtime hours</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold">2</p>
                                    <p className="text-gray-500 text-sm">Sick days</p>
                                </div>
                                <div>
                                    <p className="text-xl font-bold">3</p>
                                    <p className="text-gray-500 text-sm">Days off</p>
                                </div>
                            </div>
                            <div className="space-y-2 text-sm">
                                <p><strong>Type:</strong> Hourly</p>
                                <p><strong>Period of :</strong> March 1 - 15, 2025</p>
                                <p><strong>Total Salary:</strong> 4,580</p>
                                <div className='flex gap-2 items-center'><p><strong>Payment date:</strong> March 15 2025</p> <StatusBadge status='completed' /></div>
                                <p><strong>Bank:</strong> Cash</p>
                                <p><strong>Bank Number:</strong> N/A</p>
                            </div>
                        </>)} */}
                </div>

                <Accordion type="multiple" className="w-full my-4" defaultValue={["item-1", "item-2"]}>
                    <AccordionItem value="item-1">
                        <AccordionTrigger className='font-bold w-full'>
                            <div className='flex justify-between items-center w-full mx-2'>
                                <span>Daily Time Record</span>
                                <span className='flex items-center'>
                                    <Tooltip>
                                        <TooltipTrigger asChild className="flex items-center">
                                            <CheckCircle className='h-7 w-7 mr-1 text-green-500' />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Reviewed at {bene?.daily_time_record_reviewed_date ? format(new Date(bene.daily_time_record_reviewed_date), 'PPpp') : ""}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <div className="rounded-lg mb-6">
                                <Card className='p-4'>
                                    <AppTable
                                        simpleView
                                        data={dtrlist}
                                        columns={DTRcolumns}
                                    />
                                </Card>
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className='font-bold'>
                            <div className='flex justify-between items-center w-full mx-2'>
                                <span>Accomplishment Report </span>
                                <span className='flex items-center'>
                                    <Tooltip>
                                        <TooltipTrigger asChild className="flex items-center">
                                            <CheckCircle className='h-7 w-7 mr-1 text-green-500' />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Reviewed at {bene?.accomplishment_report_reviewed_date ? format(new Date(bene.accomplishment_report_reviewed_date), 'PPpp') : ""}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent>
                            <Card className='p-4'>
                                <AccomplishmentUser
                                    assessment={assessment!}
                                    disabled={true}
                                    user={user}
                                    date={{ from: period_cover_from, to: period_cover_to }}
                                    session={session}
                                    accomplishmentReportId={bene?.accomplishment_report_id || ""}


                                />
                            </Card>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>

                <AppSubmitReview
                    openHistory
                    options={statusesOptions}
                    review={selectedStatus}
                    review_logs={submissionLogs}
                    session={session!}
                    onChange={(e) => console.log(e)}
                    onSubmit={(r) => handleSubmitReview(r)}
                />
            </CardContent>
        </Card>

    );
}