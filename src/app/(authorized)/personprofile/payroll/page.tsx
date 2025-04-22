"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Building2, CalendarIcon, Download, Edit, Plus, Printer, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AppTable } from '@/components/app-table';

const baseUrl = 'personprofile/payroll'


const initialData = [
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

const columns = [
    {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'school',
        header: 'School',
        accessorKey: 'school',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'contact_number',
        header: 'Contact',
        accessorKey: 'contact_number',
        filterType: 'text',
        sortable: true,
    },
    {
        id: 'status',
        header: 'Status',
        accessorKey: 'status',
        filterType: 'select',
        filterOptions: ['Active', 'Incoming', 'Hold', 'Cancelled'],
        sortable: true,
    },
];

const customActions = [
    {
      label: 'View Profile',
      icon: Users,
      onClick: (row: any) => console.log('View Profile:', row),
    },
    {
      label: 'View Department',
      icon: Building2,
      onClick: (row: any) => console.log('View Department:', row),
    },
];


export default function PayrollPage() {

    const router = useRouter();
    const [data, setData] = useState(initialData);

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
        setData((prevData) => [...prevData, { id: String(prevData.length + 1), ...newRecord }]);
    };

    const handleRefresh = async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setData(initialData);
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
                   
                        <AppTable
                            data={data}
                            columns={columns}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onRowClick={handleRowClick}
                            onRefresh={handleRefresh}
                            onAddNewRecord={handleAddNewRecord}
                            customActions={customActions}
                        /> 
                </div>

            </CardContent>
        </Card>

    );
}