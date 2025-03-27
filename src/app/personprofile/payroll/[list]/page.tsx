"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useParams, useRouter } from 'next/navigation';
import { CalendarIcon, Download, Edit, Plus, Printer, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppTable } from '@/components/app-table';



export const initialData = [
    {
        id: 'SF-123678',
        date_cover: 'Jan 1-15, 2024',
        total_hours: 80,
        status: 'Completed'
    },
    {
        id: 'SF-12234',
        date_cover: 'Jan 16-31, 2024',
        total_hours: 88,
        status: 'Completed'
    },
    {
        id: 'SF-23478',
        date_cover: 'Feb 1-15, 2024',
        total_hours: 72,
        status: 'Pending'
    }
];


const columns = [
    {
        id: 'date_cover',
        header: 'Date Cover',
        accessorKey: 'date_cover',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'total_hours',
        header: 'Total Hours',
        accessorKey: 'total_hours',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        filterType: 'select',
        filterOptions: ['Completed', 'Pending'],
        sortable: true,
    },
];

const baseUrl = 'personprofile/payroll'

export default function PayrollUserList() {

    const router = useRouter();
    const params = useParams<{ list: string; id: string }>()

    console.log('params', params)

    const [data, setData] = useState(initialData);

    const handleEdit = (row: any) => {
        console.log('Edit:', row);
    };

    const handleDelete = (row: any) => {
        console.log('Delete:', row);
    };

    const handleRowClick = (row: any) => {
        const r = `/${baseUrl}/${params?.list}/${row.id}`
        console.log('Row clicked:', { r, row });
        router.push(r);
    };

    const handleAddNewRecord = (newRecord: any) => {
        console.log('handleAddNewRecord:', newRecord);
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
                        Payroll
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>

                <div className="min-h-screen">

                    <div className="flex items-center space-x-4 mb-6">
                        <Avatar>
                            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330" alt="User name" />
                            <AvatarFallback>AF</AvatarFallback>
                        </Avatar>
                        <div className='flex-1'>
                            <h2 className="text-lg font-semibold">Jane Cooper</h2>
                            <p className="text-sm text-gray-500">Quezon City University</p>
                        </div>
                        <Button onClick={() => console.log('enteries', null)} size="sm" className="flex items-center gap-2">
                            <Printer className="h-4 w-4" />
                        </Button>
                        <Button onClick={() => console.log('enteries', null)} size="sm" className="flex items-center gap-2">
                            <Download className="w-4 h-4" />
                        </Button>

                    </div>

                    <AppTable
                        data={data}
                        columns={columns}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onRowClick={handleRowClick}
                        onAddNewRecord={handleAddNewRecord}
                        simpleView={true}
                        
                    />
                </div>

            </CardContent>
        </Card>

    );
}