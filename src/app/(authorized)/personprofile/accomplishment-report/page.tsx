"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { CalendarIcon, Download, Edit, Plus, Printer, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { AppTable } from '@/components/app-table';
import { SessionPayload } from '@/types/globals';
import { getSession } from '@/lib/sessions-client';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { ARService } from '@/components/services/ARservice';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';
import { libDb } from '@/db/offline/Dexie/databases/libraryDb';
import PersonProfileService from '@/components/services/PersonProfileService';
import { IPersonProfile } from '@/components/interfaces/personprofile';



const _session = await getSession() as SessionPayload;

const baseUrl = 'personprofile/accomplishment-report'

const columns = [
    {
        id: 'cfwp_id_no',
        header: 'CFW ID NO.',
        accessorKey: 'cfwp_id_no',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'first_name',
        header: 'First Name',
        accessorKey: 'first_name',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'last_name',
        header: 'Last Name',
        accessorKey: 'last_name',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'middle_name',
        header: 'Middle Name',
        accessorKey: 'middle_name',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'email',
        header: 'Email',
        accessorKey: 'email',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'school_name',
        header: 'School Name',
        accessorKey: 'school_name',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'campus',
        header: 'CAMPUS',
        accessorKey: 'campus',
        filterType: 'text',
        sortable: true,
    },
]


export default function AccomplishmentReport() {

    const router = useRouter();
    const [session, setSession] = useState<SessionPayload>();
    const [data, setData] = useState<any[]>([]);
 
    useEffect(() => {
        (async () => { 
            handleOnRefresh() 
        })();
    }, [session]) 

    useEffect(() => {
        console.log('DTR: session', _session)
        debugger;
        if (["CFW Beneficiary", "Guest"].includes(_session?.userData?.role || "")) {
            (async () => {
                const user = await dexieDb.person_profile.where('user_id')
                    .equals(_session.id!).first();
                router.push(`/${baseUrl}/${user?.id}`);
            })();
        } else {
            (async () => {
                const _session = await getSession() as SessionPayload;
                setSession(_session)
                try {
                    if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open 
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
                console.log('_session', _session)
            })();
        }
    }, [])


    const handleOnRefresh = async () => {
        try {

            if (!session) {
                console.log('handleOnRefresh > session is not available');
                return;
            }

            const results = await PersonProfileService.getBeneficiaries(`${session.id}/`, session!);
            setData(results as IPersonProfile[])
             
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

    const handleDelete = (row: any) => {
        console.log('Delete:', row);
    };

    const handleRowClick = (row: any) => {
        console.log('Row clicked:', row);
        router.push(`/${baseUrl}/${row.id}`);
    };

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
                        Accomplishment Report
                    </div>
                </CardTitle>

            </CardHeader>
            <CardContent>
                <div className="min-h-screen">
                    <div className="min-h-screen">
                        <AppTable
                            data={data}
                            columns={columns}
                            onRowClick={handleRowClick}
                            onRefresh={handleOnRefresh} />
                    </div>
                </div>

            </CardContent>
        </Card>

    );
}