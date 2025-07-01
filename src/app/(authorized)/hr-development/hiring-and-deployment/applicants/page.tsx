"use client"

import { AppTable } from '@/components/app-table';
import { PushStatusBadge } from '@/components/general/push-status-badge';
import { HRService } from '@/components/services/HRService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import React from 'react'

function ApplicantList() {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const hrService = new HRService();
    const router = useRouter();

    React.useEffect(() => {
        async function loadApplicants() {
            try {
            const data = await hrService.getOfflineApplicants() as any;
            setData(data);
            } catch (error) {
            console.error(error);
            } finally {
            setLoading(false);
            }
        }
        loadApplicants();
    }, []);

    const baseUrl = 'hr-development/hiring-and-deployment/applicants/'

    const handleRowClick = (row: any) => {
        console.log('Row clicked:', row);
        router.push(`/${baseUrl}/form/${row.id}`);
    };

    const handleAddNewRecord = (newRecord: any) => {
        console.log('handleAddNewRecord', newRecord)
        router.push(`/${baseUrl}/form/${newRecord.id}`);
    };

    const handleOnRefresh = async() => {
        //const fetchedUsers = await settingsService.syncDownloadUsers();
        //setUsers(fetchedUsers);
    }

    const handleOnSync = async() => {
        //const success = await settingsService.syncBulkUserData();
        //alert("Success" + success);
    }

    const handleDelete = (row: any) => {
        console.log('Delete:', row);
    };

     const columnsMasterlist = [
        {
            id: 'push status id',
            header: 'Uploading Status',
            accessorKey: 'push_status_id',
            filterType: 'select',
            filterOptions: ['Unknown', 'Uploaded', 'For Upload'],
            sortable: true,
            align: "center",
            cell: (value: any) =>  <PushStatusBadge push_status_id={value} size="md" />
        },
        {
            id: 'First Name',
            header: 'FirstName',
            accessorKey: 'first_name',
            filterType: 'text',
            sortable: true,
            align: "left",
            cell: null,
        },
        {
            id: 'Middle Name',
            header: 'MiddleName',
            accessorKey: 'middle_name',
            filterType: 'text',
            sortable: true,
            align: "left",
            cell: null,
        },
        {
            id: 'Last Name',
            header: 'LastName',
            accessorKey: 'last_name',
            filterType: 'text',
            sortable: true,
            align: "left",
            cell: null,
        },
        {
            id: 'Sex',
            header: 'Sex',
            accessorKey: 'sex',
            filterType: 'select',
            filterOptions: ['Male', 'Female'],
            sortable:true,
            align: "left",
            cell: null
        }
    ]

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
                    Applicants
                </div>
            </CardTitle>
        </CardHeader>
            <CardContent>
                <div className="min-h-screen">
                    <AppTable
                    data={data ?? []}
                    columns={columnsMasterlist}
                    onDelete={handleDelete}
                    onRowClick={handleRowClick}
                    onRefresh={handleOnRefresh}
                    onSync={handleOnSync}
                    />
                </div>
            </CardContent>
        </Card>
  )
}

export default ApplicantList
