"use client";

import React, { useEffect, useState } from 'react';
import { addDays, endOfMonth } from 'date-fns';
import { useParams } from 'next/navigation';
import { DateRange } from 'react-day-picker';
import { SessionPayload } from '@/types/globals';
import { getSession } from '@/lib/sessions-client';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { IAccomplishmentReport, IPersonProfile } from '@/components/interfaces/personprofile';
import { ILibSchoolProfiles, LibraryOption } from '@/components/interfaces/library-interface';
import { v4 as uuidv4 } from 'uuid';
import { useToast } from '@/hooks/use-toast';
import { getOfflineLibStatuses } from '@/components/_dal/offline-options';
import { ICFWPayrollBene, ISubmissionLog } from '@/components/interfaces/cfw-payroll';
import AppSubmitReview from '@/components/app-submit-review';
import { AccomplishmentUser } from '@/components/accomplishment-user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export type UserTypes = IPersonProfile & ILibSchoolProfiles;

export default function AccomplishmentReportUser() {
    const { toast } = useToast()
    const params = useParams<{ 'accomplishment-userid': string; id: string }>()
    const [user, setUser] = useState<UserTypes>();
    const [ar, setAR] = useState<IAccomplishmentReport>()

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
    const [statusesOptions, setStatusesOptions] = useState<LibraryOption[]>([]);
    const [payrollbene, setCFWPayrollBene] = useState<ICFWPayrollBene>()
    const [submissionLogs, setSubmissionLogs] = useState<ISubmissionLog[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<ISubmissionLog>({
        id: "",
        record_id: "",
        bene_id: "",
        module: "",
        comment: "",
        status: "",
        status_date: "",
        created_date: "",
        created_by: ""
    });



    useEffect(() => {
        (async () => {
            const _session = await getSession() as SessionPayload;
            try {
                if (!dexieDb.isOpen()) await dexieDb.open();
            } catch (error) {
                console.error('Error fetching data:', error);
            }

            const statuses = await getOfflineLibStatuses();
            const filteredStatuses = statuses.filter(status => [2, 10, 11, 10, 5, 17].includes(status.id));
            setStatusesOptions(filteredStatuses);

            setSession(_session)
            await getResults(_session)
        })();
    }, [])

    const getResults = async (session: SessionPayload) => {
        const user = await dexieDb.person_profile.where('user_id')
            .equals(params!['accomplishment-userid']).first();
        const merge = {
            ...await dexieDb.lib_school_profiles.where("id").equals(user!.school_id!).first(),
            ...user
        };
        setUser(merge as UserTypes);

        const arId = params?.id == "new" ? uuidv4() : params!.id

        const logsQuery = await dexieDb.submission_log.where("record_id").equals(arId)
        const logs = await logsQuery.sortBy("created_date")
        const logslast = logs.length > 0 ? logs[logs.length - 1] : null

        setSubmissionLogs(logs)
        setSelectedStatus(logslast ?? selectedStatus)

        const ar = await dexieDb.accomplishment_report.where("id").equals(arId).first()

        const pb = await dexieDb.cfwpayroll_bene.where({
            period_cover_from: date!.from!,
            period_cover_to: date!.to!,
            bene_id: user!.id
        }).first()
        setCFWPayrollBene(pb)

        setAR({
            id: arId,
            person_id: user!.user_id,
            period_cover_from: ar?.period_cover_from ?? date!.from!,
            period_cover_to: ar?.period_cover_to ?? date!.to!,
            work_plan_id: "",
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
    };

    const handleSaveAccomplishmentReport = () => {
        const id = `${ar?.id}`
        if (session?.userData.role == "Administrator") {
            (async () => {
                const raw = {
                    ...selectedStatus!,
                    id: uuidv4(),
                    record_id: id,
                    bene_id: user!.id,
                    module: "accomplishment report",
                    created_date: new Date().toISOString(),
                    created_by: session!.userData!.email!, 
                    push_status_id: 0,  
                }
                await dexieDb.submission_log.put(raw)
                if (raw.status == "2") {
                    const rev = {
                        id: payrollbene ? payrollbene.id : uuidv4(),
                        bene_id: user!.id,
                        daily_time_record_id: payrollbene?.daily_time_record_id || "",
                        daily_time_record_reviewed_date: payrollbene?.daily_time_record_reviewed_date || "",
                        accomplishment_report_id: id,
                        accomplishment_report_reviewed_date: new Date().toISOString(),
                        period_cover_from: getInitialDateRange().from!,
                        period_cover_to: getInitialDateRange().to!,
                        operation_status: "",
                        operation_status_date: "",
                        odnpm_status: "",
                        odnpm_status_date: "",
                        finance_status: "",
                        finance_status_date: "",
                        date_released: "",
                        date_received: "",
                    }
                    await dexieDb.cfwpayroll_bene.put(rev)
                }
                toast({
                    variant: "green",
                    title: "Submit Review",
                    description: "Your review has been submitted!",
                });
            })();
        } else {
            (async () => {
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
                if (id) {
                    await dexieDb.accomplishment_report.put(raw, id)
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
    }

    return (
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
                    <AccomplishmentUser
                        user={user}
                        date={date}
                        setDate={setDate}
                        session={session}
                        accomplishmentReportId={ar?.id}
                    />

                    <div className="m-3 no-print">
                        <AppSubmitReview
                            session={session!}
                            review_logs={submissionLogs}
                            options={statusesOptions}
                            review={selectedStatus}
                            onChange={(review) => setSelectedStatus(review)}
                            onSubmit={() => handleSaveAccomplishmentReport()}
                        />
                    </div>
                </CardContent>
            </div>
        </Card>
    );
}