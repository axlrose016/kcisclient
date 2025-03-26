"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { CalendarIcon, Download, Edit, Plus, Printer, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { AppTable } from '@/components/app-table';

 

const initialReports  = [
    {
        id: 'SF-123678',
        name: 'Jane Cooper',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
        school: 'Quezon City University',
        contact_number: '09090909',
        status: 'Active'
    },
    {
        id: 'SA-464737',
        name: 'Jenny Wilson',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9',
        school: 'University Of the Philipines',
        contact_number: '09090909',
        status: 'Active'
    },
    {
        id: 'BD-112458',
        name: 'Albert Flores',
        avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12',
        school: 'Polytechnic University of the Philipines',
        contact_number: '09090909',
        status: 'Incoming'
    },
    {
        id: 'PM-589046',
        name: 'Cody Fisher',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        school: 'San Bartolome National High School',
        contact_number: '09090909',
        status: 'Hold'
    },
    {
        id: 'PM-589046',
        name: 'Cody Fisher',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
        school: 'Batasan National High School',
        contact_number: '09090909',
        status: 'Cancelled'
    }
];

const baseUrl = 'personprofile/daily-time-record'

export default function DailyTimeRecordPage() {

    const router = useRouter();
    const [data, setReports] = useState(initialReports);
    const [date, setDate] = React.useState<Date>(new Date())

    const handleEdit = (row: any) => {
        console.log('Edit:', row);
    };

    const handleDelete = (row: any) => {
        console.log('Delete:', row);
    };

    const handleRowClick = (row: any) => {
        console.log('Row clicked:', row);
        router.push(`/${baseUrl}/${row.id}`);
    };

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
                    <div className="min-h-screen">
                        <AppTable
                            data={data}
                            columns={data[0] ? Object.keys(data[0]).map((key, idx) => ({
                                id: key,
                                header: key,
                                accessorKey: key,
                                filterType: 'text',
                                sortable: true,
                            })) : []}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onRowClick={handleRowClick}
                            onAddNewRecord={handleAddNewRecord}
                        />
                    </div>
                </div>

            </CardContent>
        </Card>

    );
}