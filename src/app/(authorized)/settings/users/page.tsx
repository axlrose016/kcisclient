"use client"

import { getOfflineUsers } from "@/components/_dal/offline-users";
import { AppTable } from "@/components/app-table";
import LoadingScreen from "@/components/general/loading-screen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import React from "react"

export default function Users(){
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();
    const baseUrl = 'settings/users'

    React.useEffect(() => {
        async function loadUsers(){
            try{
                const data = await getOfflineUsers();
                setUsers(data);
            }catch(error){
                console.error(error);
            }finally{
                setLoading(false);
            }
        }
        loadUsers();
    }, []);


    if(loading){
        return <div>
            <LoadingScreen
                isLoading={loading}
                text={"Loading... Please wait."}
                style={"dots"}
                fullScreen={true}
                progress={0}
                timeout={0}
                onTimeout={() => console.log("Loading timed out")}
            />
        </div>
    }

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
        router.push(`/${baseUrl}/${newRecord.id}`);
    };
    return(
        <Card>
        <CardHeader>
            <CardTitle className="mb-2 flex flex-col md:flex-row items-center md:justify-between text-center md:text-left">
                {/* Logo Section */}
                <div className="flex-shrink-0">
                    <img src="/images/logos.png" alt="DSWD KC BAGONG PILIPINAS" className="h-12 w-auto" />
                </div>

                {/* Title Section */}
                <div className="text-lg font-semibold mt-2 md:mt-0">
                    Users
                </div>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="min-h-screen">
                <div className="min-h-screen">
                    <AppTable
                        data={users}
                        columns={users[0] ? Object.keys(users[0]).map((key, idx) => ({
                            id: key,
                            header: key,
                            accessorKey: key,
                            filterType: 'text',
                            sortable: true,
                        })) : []}
                        onDelete={handleDelete}
                        onRowClick={handleRowClick}
                        onAddNewRecord={handleAddNewRecord}
                    />
                </div>
            </div>

        </CardContent>
        </Card>
    )
}