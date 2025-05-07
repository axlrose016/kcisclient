"use client";

import React, { useEffect, useState } from 'react';
import { Clock, Plus, Trash2, Save, X, Printer, CalendarIcon, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppTable } from '@/components/app-table';
import { dexieDb } from '@/db/offline/Dexie/databases/dexieDb';
import { getSession } from '@/lib/sessions-client';
import { SessionPayload } from '@/types/globals';
import { IPersonProfile } from '@/components/interfaces/personprofile';
import { ILibSchoolProfiles } from '@/components/interfaces/library-interface';
import { formatInTimeZone } from 'date-fns-tz';
import { ICFWTimeLogs } from '@/components/interfaces/iuser';
import { toast, useToast } from '@/hooks/use-toast';


const columns = [
    {
        id: 'created_date',
        header: '',
        accessorKey: 'created_date',
        filterType: 'text',
        sortable: true,
        cell: (value: Date | undefined) => {
            if (value) {
                return formatInTimeZone(value, 'UTC', 'dd');
            }
            return "-";
        },
    },
    {
        id: 'created_dateX',
        header: 'Day',
        accessorKey: 'created_date',
        filterType: 'text',
        sortable: true,
        cell: (value: Date | undefined) => {
            if (value) {
                return format(value, "eeee");
            }
            return "-";
        },
    },
    {
        id: 'log_in',
        header: 'Time In',
        accessorKey: 'log_in',
        filterType: 'text',
        sortable: true,
        cell: (value: Date | undefined) => {
            if (value) {
                return format(value, "HH:mm");
            }
            return "-";
        },
        className: "text-center"
    },
    {
        id: 'log_out',
        header: 'Time Out',
        accessorKey: 'log_out',
        filterType: 'text',
        sortable: true,
        cell: (value: Date | undefined) => {
            if (value) {
                return format(value, "HH:mm");
            }
            return "-";
        },
        className: "text-center"
    },
    {
        id: 'remarks',
        header: 'Remarks',
        accessorKey: 'remarks',
        filterType: 'text',
        sortable: true,
        className: "text-center"
    },
]

type IUser = IPersonProfile & ILibSchoolProfiles;

export default function DailyTimeRecordUser() {

    const [data, setData] = useState<any[]>([]);
    const [user, setUser] = useState<IUser | any>();
    const [session, setSession] = useState<SessionPayload>();
    const params = useParams<{ id: string }>()

    useEffect(() => {
        (async () => {
            const _session = await getSession() as SessionPayload;
            setSession(_session);
            try {
                if (!dexieDb.isOpen()) await dexieDb.open(); // Ensure DB is open 
            } catch (error) {
                console.error('Error fetching data:', error);
            }
            setData(await getResults())
        })();
    }, [])


    const getResults = async () => {
        const user = await dexieDb.person_profile.where('user_id')
            .equals(params!.id).first();
        const merge = {
            ...await dexieDb.lib_school_profiles.where("id").equals(user!.school_id!).first(),
            ...user
        };
        setUser(merge);
        const results = await dexieDb.cfwtimelogs.where('created_by')
            .equals(user?.email ?? "")
            .sortBy("created_date"); // Ascending: oldest → latest  
        console.log('getResults', results)
        return results;
    };


    const handleEdit = (row: ICFWTimeLogs) => {
        (async () => {
            console.log('Edit:', row);
            await dexieDb.cfwtimelogs.put({
                ...row,
                last_modified_by: session!.userData!.email!,
                last_modified_date: new Date().toISOString()
            }, 'id')

            toast({
                variant: "default",
                title: "Update",
                description: "Record has been updated!",
            });
            setData(await getResults())
        })();
    };

    // const handleRowClick = (row: any) => {
    //     console.log('Row clicked:', row);
    //     router.push(`/${baseUrl}/${row.user_id}`);
    // };

    const handleAddNewRecord = (newRecord: any) => {
        console.log('handleAddNewRecord', newRecord)
    };


    return (

        <Card>
            <CardHeader>
                <CardTitle className="mb-2 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
                    {/* Logo Section */}
                    <div className="flex-shrink-0">
                        <img src="/images/logos.png" alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto" />
                    </div>

                    {/* Title Section */}
                    <div className="text-lg font-semibold mt-2 md:mt-0">
                        Daily Time Record
                    </div>
                </CardTitle>

            </CardHeader>

            <CardContent>

                <div className="min-h-screen">

                    <div className="flex items-center space-x-4 mb-6">
                        <Avatar>
                            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" alt="User name" />
                            <AvatarFallback>{user?.first_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                            <h2 className="text-lg font-semibold uppercase">{user?.first_name} {user?.last_name}</h2>
                            <p className="text-sm text-gray-500">{user?.school_name}</p>
                        </div>
                        <Button onClick={() => console.log('enteries', null)} size="sm" className="flex items-center gap-2">
                            <Printer className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => console.log('enteries', null)} size="sm" className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                        </Button>

                    </div>

                    <div className="rounded-lg">
                        <AppTable
                            data={data}
                            columns={columns}
                            onEditRecord={session?.userData.role !== "CFW Beneficiary" ? handleEdit:undefined}
                        />
                    </div>
                </div>

            </CardContent>
        </Card>

    );
}