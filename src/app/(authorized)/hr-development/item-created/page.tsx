"use client"
import { AppTable } from '@/components/app-table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { IPositionItem } from '@/db/offline/Dexie/schema/hr-service';
import { useRouter } from 'next/navigation';
import React from 'react'
import { HRService } from '../HRService';

function ItemCreated() {
    const [data, setData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();
    const hrService = new HRService();

    React.useEffect(() => {
        async function loadRoles() {
          try {
            const data = await hrService.getOfflinePositionItems() as any;
            setData(data);
          } catch (error) {
            console.error(error);
          } finally {
            setLoading(false);
          }
        }
        loadRoles();
      }, []);


    const baseUrl = 'hr-development/item-created/'
    
    const handleEdit = (row: any) => {
        console.log('Edit:', row);
    };

    const handleDelete = (row: any) => {
        console.log('Delete:', row);
    };

    const handleRowClick = (row: any) => {
        console.log('Row clicked:', row);
        router.push(`/${baseUrl}/form/${row.id}`);
    };

    const handleAddNewRecord = (newRecord: any) => {
        console.log('handleAddNewRecord', newRecord)
    };
    debugger;
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
                Position: Item-Created
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
                    onDelete={handleDelete}
                    onRowClick={handleRowClick}
                    onAddNewRecordNavigate={() => router.push(`/${baseUrl}/form/0`)}
                />
            </div>
        </div>

    </CardContent>
    </Card>
  )
}

export default ItemCreated