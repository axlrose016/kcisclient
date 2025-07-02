"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import { ChevronUp, ChevronDown, Edit, Info, Plus, Printer, Trash2, UserCheck2Icon, UserRoundCheckIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppTable } from '@/components/app-table';
import { SessionPayload } from '@/types/globals';
import { getSession } from '@/lib/sessions-client';
import Image from 'next/image';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { ICFWPayroll, ICFWPayrollBene } from '@/components/interfaces/cfw-payroll';
import { IPersonProfile } from '@/components/interfaces/personprofile';
import { Badge } from '@/components/ui/badge';
import { ILibSchoolProfiles, LibraryOption } from '@/components/interfaces/library-interface';
import { libDb } from '@/db/offline/Dexie/databases/libraryDb';
import { uuidv5 } from '@/lib/utils';
import { CFWPayrollService } from '@/components/services/CFWPayrollService';
import AppSubmitReview from '@/components/app-submit-review';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { getOfflineLibStatuses } from '@/components/_dal/offline-options';
import { toast } from '@/hooks/use-toast';

const KeyToken = process.env.NEXT_PUBLIC_DXCLOUD_KEY;
const session = await getSession() as SessionPayload;

const baseUrl = 'personprofile/payroll'

type IUser = ICFWPayrollBene & IPersonProfile & { no_hours: number, rate: number, amount: number };

export default function PayrollUserList() {

    const params = useParams<{ 'payroll-list': string; id: string }>()
    console.log('params', params)

    return (
        <Card>
            <CardHeader>
                <CardTitle className="mb-2 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
                    {/* Logo Section */}
                    <div className="flex-shrink-0">
                        <Image src="/images/logos.png" width={300} height={300} alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto" />
                    </div>

                    {/* Title Section */}
                    <div className="text-lg font-semibold mt-2 md:mt-0">
                        Payroll
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                {["Guest", "CFW Beneficiary"].includes(session!.userData!.role!) && <PayrollBene />}
                {!["Guest", "CFW Beneficiary"].includes(session!.userData!.role!) && <PayrollAdmin />}
            </CardContent>
        </Card>

    );
}


function PayrollAdmin() {

    const router = useRouter();
    const params = useParams<{ 'payroll-list': string; id: string }>()
    const [payroll, setPayrollData] = useState<ICFWPayroll>()
    const [data, setPayrollBeneData] = useState<IUser[] | any[]>([])
    const [cfwSubmissions, setCfwSubmission] = useState<any[]>()
    const [libstatus, setOptionStatus] = useState<LibraryOption[]>([])

    const [regions, setRegions] = useState<any[]>()
    // const [prov, setProv] = useState<any[]>()
    // const [muni, setMuni] = useState<any[]>()

    const dateRange = params?.['payroll-list']!.split('-').map(dateStr => {
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        return new Date(`${year}-${month}-${day}`);
    });

    const [period_cover_from, period_cover_to] = dateRange || [];
    // console.log('params!.list!', { period_cover_from, period_cover_to }) 
    useEffect(() => {
        (async () => {
            const statuses = await getOfflineLibStatuses();
            const filteredStatuses = statuses.filter(status => [2, 10].includes(status.id));
            console.log('filteredStatuses', filteredStatuses)
            setOptionStatus(filteredStatuses);

            const response = await fetch("/api-libs/psgc/regions", {
                headers: {
                    Authorization: `Bearer ${KeyToken}`,
                    "Content-Type": "application/json",
                }
            });
            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            if (data?.status) {
                setRegions(data.data)
                // console.log('regions > data', data)
            }

            await handleOnRefresh()
        })();
    }, []);


    const handleRowClick = (row: any) => {
        (async () => {
            const r = `/${baseUrl}/${params!['payroll-list']!}/${row.person_profile_id}`
            console.log('Row clicked:', { r, row });
            router.push(r);
        })()
    };
    // console.log('PayrollAdmin > params', { data, payroll, cfwSubmissions })


    const columns = [
        {
            id: 'id',
            header: 'TRANSACTION ID',
            accessorKey: 'id',
            filterType: 'text',
            sortable: true,
        },
        {
            id: 'region',
            header: 'REGION',
            accessorKey: 'region_name',
            filterType: 'text',
            sortable: true,
        },
        // {
        //     id: 'province',
        //     header: 'PROVINCE',
        //     accessorKey: 'province',
        //     filterType: 'text',
        //     sortable: true,
        // },
        // {
        //     id: 'municipality',
        //     header: 'MUNICIPALITY',
        //     accessorKey: 'municipality',
        //     filterType: 'text',
        //     sortable: true,
        // }, 
        {
            id: 'school',
            header: 'SCHOOL NAME',
            accessorKey: 'school_name',
            filterType: 'text',
            sortable: true
        },
        {
            id: 'person_profile_id',
            header: 'BENE. ID',
            accessorKey: 'cfwp_id_no',
            filterType: 'text',
            sortable: true,
        },
        {
            id: 'bene_name',
            header: 'BENE. NAME',
            accessorKey: 'bene_name',
            filterType: 'text',
            sortable: true,
        },
        {
            id: 'operation_status',
            header: 'OPERATIONS STATUS',
            accessorKey: 'operation_status',
            filterType: 'text',
            sortable: true,
            cell: (value: string) => (
                <Badge variant={value == "Approved" || value == "Complete" ? "green" :
                    value == "For Compliance" ? "warning" :
                        value == "For Review" ? "destructive" : "default"
                } >
                    {value}
                </Badge>
            )
        },
        {
            id: 'operation_reviewed_by',
            header: 'OPERATIONS REVIEWED BY',
            accessorKey: 'operation_reviewed_by',
            filterType: 'text',
            sortable: true
        },
        {
            id: 'operation_status_date',
            header: 'OPERATION REVIEWED DATE',
            accessorKey: 'operation_status_date',
            filterType: 'text',
            sortable: true,
            cell: (value: string) => value ? format(value, 'PPpp') : ""
        },
        {
            id: 'odnpm_status',
            header: 'ODNPM STATUS',
            accessorKey: 'odnpm_status',
            filterType: 'text',
            cell: (value: string) => (
                <Badge variant={value == "Approved" || value == "Complete" ? "green" :
                    value == "For Compliance" ? "warning" :
                        value == "For Review" ? "destructive" : "default"
                } >
                    {value}
                </Badge>
            )
        },
        {
            id: 'odnpm_reviewed_by',
            header: 'ODNPM REVIEWED BY',
            accessorKey: 'odnpm_reviewed_by',
            filterType: 'text',
            sortable: true
        },
        {
            id: 'odnpm_status_date',
            header: 'ODNPM REVIEWED DATE',
            accessorKey: 'odnpm_status_date',
            filterType: 'text',
            sortable: true,
            cell: (value: string) => value ? format(value, 'PPpp') : ""
        },
        {
            id: 'finance_status',
            header: 'FINANCE STATUS',
            accessorKey: 'finance_status',
            filterType: 'text',
            sortable: true,
            cell: (value: string) => (
                <Badge variant={value == "Approved" || value == "Complete" ? "green" :
                    value == "For Compliance" ? "warning" :
                        value == "For Review" ? "destructive" : "default"
                } >
                    {value}
                </Badge>
            )
        },
        {
            id: 'finance_reviewed_by',
            header: 'FINANCE REVIEWED BY',
            accessorKey: 'finance_reviewed_by',
            filterType: 'text',
            sortable: true
        },
        {
            id: 'finance_status_date',
            header: 'FINANCE STATUS DATE',
            accessorKey: 'finance_status_date',
            filterType: 'text',
            sortable: true,
            cell: (value: string) => value ? format(value, 'PPpp') : ""
        },
        {
            id: 'date_received',
            header: 'DATE RECEIEVED (PAYOUT)',
            accessorKey: 'date_received',
            filterType: 'text',
            sortable: true,
            cell: (value: string) => value ? format(value, 'PPpp') : ""
        },

    ];

    const handleOnRefresh = async () => {
        console.log('handleOnRefresh')
        try {

            if (!session) {
                console.log('handleOnRefresh > session is not available');
                return;
            }

            const results = await new CFWPayrollService().syncDLCFWPayrollReady(`cfw_payroll_beneficiary/view/report/${params!['payroll-list']}/`);
            if (!results) {
                console.log('Failed to fetch time records: fetching offine');
                console.log('PayrollAdmin > period_cover_from', { period_cover_from, period_cover_to })
                const pbd = await dexieDb.cfwpayroll_bene
                    .where({
                        period_cover_from: format(period_cover_from, 'yyyy-MM-dd'),
                        period_cover_to: format(period_cover_to, 'yyyy-MM-dd')
                    })
                    .toArray()
                    .then(async (payrollRecords) => {
                        const mergedRecords = await Promise.all(
                            payrollRecords.map(async (record) => {
                                const personProfile = await dexieDb.person_profile
                                    .where("id")
                                    .equals(record.person_profile_id)
                                    .first();

                                const period_cover = format(new Date(period_cover_from!), 'MMM dd') + "-" + format(new Date(period_cover_to!), 'dd, yyyy')
                                const id = uuidv5(period_cover, '108747ef-6b5d-4b5d-b608-ddb684aff5f2') //GeneralID// dont change!

                                const region = regions?.find(i => i.code.includes(personProfile!.region_code))

                                // console.log('regions')
                                // const municipality = await dexieDb.person_profile
                                //     .where("region_code")
                                //     .equals(region!.region_code)
                                //     .first();

                                const school = period_cover_to ? await libDb.lib_school_profiles
                                    .where("id")
                                    .equals(parseInt(personProfile!.school_id!.toString()))
                                    .first() : {} as any;


                                return {
                                    ...record,
                                    id: id,
                                    region: region?.name,
                                    province: personProfile?.province_code,
                                    municipality: personProfile?.city_code,
                                    bene_name: personProfile?.first_name + " " + personProfile?.last_name,
                                    // middle_name: personProfile?.middle_name, 
                                    school: school?.school_name,
                                    person_profile_id: personProfile?.id,
                                    cfwp_id_no: personProfile?.cfwp_id_no,
                                    operation_status: libstatus?.find(i => i.id == parseInt(record.operation_status))?.name ?? "",
                                    odnpm_status: libstatus?.find(i => i.id == parseInt(record.odnpm_status))?.name ?? "",
                                    finance_status: libstatus?.find(i => i.id == parseInt(record.finance_status))?.name ?? "",
                                };
                            })
                        );
                        return mergedRecords;
                    });

                console.log('PayrollAdmin > pbd', pbd)
                setPayrollBeneData(pbd)
            }

            setPayrollBeneData(results)
            // await getResults()   
        } catch (error) {
            console.error('Error syncing time records:', error);
            toast({
                variant: "warning",
                title: "Unable to Fetch Latest Data",
                description: error instanceof Error
                    ? `Error: ${error.message}`
                    : "Unable to sync DTR records. Please try logging out and back in to refresh your session.",
            });
        }
    }

    // Modal state for batch review
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedRowsForReview, setSelectedRowsForReview] = useState<any[]>([]);

    const review_defaults = {
        id: undefined,
        record_id: undefined,
        person_profile_id: undefined,
        module: 'payroll',
        comment: '',
        status_id: 0,
        status_date: '',
        created_date: '',
        created_by: ''
    }

    const [review, setReview] = useState(review_defaults);

    return (
        <>
            <AppTable
                enableRowSelection={true}
                onRowSelectionChange={(selection) => {
                    setSelectedRowsForReview(selection);
                }}
                data={data as []}
                columns={columns}
                iconEdit={<UserCheck2Icon className="h-[55px] w-[55px] text-blue-500" />}
                onClickEdit={(record) => console.log('onClickEdit > ecord', record)}
                onRowClick={handleRowClick}
                onRefresh={handleOnRefresh}
                onDelete={handleRowClick}
                selectedRowsLayout={(selectedRows) => (
                    <>
                        <Button
                            onClick={() => {
                                setSelectedRowsForReview(selectedRows);
                                setShowReviewModal(true);
                            }}
                            className="gap-2"
                        >
                            {selectedRows.length} Submit Review
                        </Button>
                        <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
                            <DialogTitle></DialogTitle>
                            <DialogContent className="max-w-2xl">
                                <div className="m-1 no-print">
                                    <AppSubmitReview
                                        session={session}
                                        options={libstatus || []}
                                        review_logs={[]}
                                        review={review}
                                        onChange={setReview}
                                        onSubmit={(reviewData) => {
                                            setShowReviewModal(false);
                                            setReview(review_defaults)
                                            // You can replace this with your actual batch review handler
                                            console.log('Batch review submitted:', { review: reviewData, selectedRows: selectedRowsForReview });
                                        }}
                                    />
                                </div>
                            </DialogContent>
                        </Dialog>
                    </>
                )}
            />
        </>
    )
}


const cPayrollBene = [
    {
        id: 'Period',
        header: 'Period Cover',
        accessorKey: 'period_cover_from',
        filterType: 'text',
        sortable: true,
        cellRow: (row: any) => {
            return format(row.period_cover_from, 'LLL dd') + " - " + format(row.period_cover_to, 'dd,y');
        },
    },
    {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        filterType: 'text',
        sortable: true,
        cellRow: (row: any) => {
            const [showChecklist, setShowChecklist] = useState(false);

            const getStatusInfo = () => {
                // Check if required documents are submitted
                const isAccomplishmentSubmitted = row.accomplishment_report_id !== "" && row.accomplishment_report_date !== null;
                const isDailyTimeRecordSubmitted = row.daily_time_record_id !== "" && row.daily_time_record_date !== null;

                // Check if all statuses are approved
                const isOperationApproved = row.operation_status !== "" && row.operation_status_date !== null;
                const isFinanceApproved = row.finance_status !== "" && row.finance_status_date !== null;
                const isOdnpmApproved = row.odnpm_status !== "" && row.odnpm_status_date !== null;

                // Create checklist items
                const checklistItems = [
                    {
                        label: "Accomplishment Report",
                        completed: isAccomplishmentSubmitted,
                        date: row.accomplishment_report_date
                    },
                    {
                        label: "Daily Time Record",
                        completed: isDailyTimeRecordSubmitted,
                        date: row.daily_time_record_date
                    },
                    {
                        label: "Operation Review",
                        completed: isOperationApproved,
                        date: row.operation_status_date
                    },
                    {
                        label: "Finance Review",
                        completed: isFinanceApproved,
                        date: row.finance_status_date
                    },
                    {
                        label: "ODNPM Review",
                        completed: isOdnpmApproved,
                        date: row.odnpm_status_date
                    }
                ];

                // Determine overall status
                const completedItems = checklistItems.filter(item => item.completed);
                const totalItems = checklistItems.length;

                if (completedItems.length === 0) {
                    return {
                        status: "pending",
                        badge: <Badge variant="destructive">Pending Documents</Badge>,
                        details: "No documents submitted",
                        checklist: checklistItems
                    };
                }

                if (completedItems.length < totalItems) {
                    return {
                        status: "processing",
                        badge: <Badge variant="secondary">In Progress</Badge>,
                        details: `${completedItems.length}/${totalItems} completed`,
                        checklist: checklistItems
                    };
                }

                return {
                    status: "completed",
                    badge: <Badge variant="green">Completed</Badge>,
                    details: "All requirements met",
                    checklist: checklistItems
                };
            };

            const statusInfo = getStatusInfo();

            return (
                <div className="flex flex-col gap-2 w-[300px] bg-gray-100 p-1.5 rounded-md">
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="lg"
                            className="!flex w-full h-4 px-2 text-[13px] hover:text-gay-600 hover:bg-gray-100"
                            onClick={() => setShowChecklist(!showChecklist)}
                        >
                            <Info className="w-3 h-3 mr-0.5" />
                            <span className='text-md flex-1 text-left font-bold capitalize'> {statusInfo.status}</span>

                            {showChecklist ? (
                                <ChevronUp className="w-2.5 h-2.5 ml-0.5" />
                            ) : (
                                <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
                            )}
                        </Button>
                    </div>

                    {showChecklist && (
                        <div className="text-[10px] w-[300px] text-red-500  p-1.5 rounded-md">
                            {statusInfo.checklist.map((item, index) => (
                                <div key={index} className="flex items-center gap-2 text-xs">
                                    <div className={`w-3 h-3 rounded-full border ${item.completed
                                        ? 'bg-green-500 border-green-500'
                                        : 'bg-gray-200 border-gray-300'
                                        }`}>
                                        {item.completed && (
                                            <svg className="w-2 h-2 text-white mx-auto mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className={item.completed ? 'text-green-700' : 'text-gray-500'}>
                                        {item.label}
                                        {item.date && (
                                            <span className="text-gray-400 ml-1">
                                                ({format(new Date(item.date), 'MMMd,yyyy')})
                                            </span>
                                        )}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}


                </div>
            );
        }
    },
    {
        id: 'Received',
        header: 'Received',
        accessorKey: 'date_received',
        filterType: 'text',
        sortable: true,
        cellRow: (row: any) => {
            return row.date_received ? format(row.date_received, 'MMM dd, yyyy') : null;
        },
    },
]


type UserTypes = IPersonProfile & ILibSchoolProfiles;
function PayrollBene() {

    const router = useRouter();
    const params = useParams<{ 'payroll-list': string; id: string }>()
    const [user, setUser] = useState<UserTypes>();
    const [session, setSession] = useState<SessionPayload>();
    const [data, setData] = useState<ICFWPayrollBene[] | any[]>([]);


    useEffect(() => {
        (async () => {
            const _session = await getSession() as SessionPayload;
            setSession(_session)
            await getResults(_session)

        })();
    }, [])


    useEffect(() => {
        (async () => {
            try {
                if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        })();
    }, [session])

    const getResults = async (session: SessionPayload) => {
        console.log('getResults > session', { session, params })
        const user = await dexieDb.person_profile.where('user_id')
            .equals(session!.id).first();

        const merge = {
            ...await libDb.lib_school_profiles.where("id").equals(user!.school_id!).first(),
            ...user
        };
        // console.log('getResults > user', { user, dtr, id: params!.id })
        setUser(merge as UserTypes);
        const data = await dexieDb.cfwpayroll_bene.where("person_profile_id").equals(merge.id!).toArray()

        console.log('payroll > data', { session, data })
        const groupedData = data.reduce((acc: any[], curr) => {
            const existingGroup = acc.find(group =>
                new Date(group.period_cover_from).getTime() === new Date(curr.period_cover_from).getTime() &&
                new Date(group.period_cover_to).getTime() === new Date(curr.period_cover_to).getTime()
            );

            if (!existingGroup) {
                acc.push({
                    ...curr,
                    period_cover_from: format(new Date(curr.period_cover_from), 'yyyy-MM-dd HH:mm:ss'),
                    period_cover_to: format(new Date(curr.period_cover_to), 'yyyy-MM-dd HH:mm:ss')
                });
            }
            return acc;
        }, []);
        setData(groupedData)
        console.log('payroll > data', { groupedData })
    }


    const handleOnRefresh = async () => {
        try {

            if (!session) {
                console.log('handleOnRefresh > session is not available');
                return;
            }

            const results = await new CFWPayrollService().syncDLCFWPayrollBene(`cfwpayroll_bene/view/by_supervisor/${session.id}/`);
            if (!results) {
                console.log('Failed to fetch time records');
                return;
            }

            await getResults(session);
        } catch (error) {
            console.error('Error syncing time records:', error);
            toast({
                variant: "warning",
                title: "Unable to Fetch Latest Data",
                description: error instanceof Error
                    ? `Error: ${error.message}`
                    : "Unable to sync DTR records. Please try logging out and back in to refresh your session.",
            });
        }
    };

    const handleRowClick = (row: any) => {
        const r = `/${baseUrl}/${params!['payroll-list']!}/${row.id}`
        console.log('Row clicked:', { r, row });
        router.push(r);
    };

    const handleAddNewRecord = (newRecord: any) => {
        console.log('handleAddNewRecord:', newRecord);
    };

    return (
        <>
            <div className="min-h-screen">

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
                    </div>

                    {/* {["CFW Beneficiary"].includes(session?.userData.role!) && (
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

                    <div className="min-h-screen mt-10">
                        <AppTable
                            columns={cPayrollBene}
                            simpleView={true}
                            data={data}
                            onRefresh={handleOnRefresh}
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
