"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ButtonEdit } from "@/components/actions/button-edit";
import { ButtonDelete } from "@/components/actions/button-delete";
import { fetchRoles } from "@/components/_dal/libraries";
import LoadingScreen from "@/components/general/loading-screen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppTable } from "@/components/app-table";
import { useRouter } from "next/navigation";
import { getOfflineLibRoles } from "@/components/_dal/offline-libraries";

export default function Roles() {
  const [roles, setRoles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();
  const baseUrl = 'settings/libraries/roles'

  React.useEffect(() => {
    async function loadRoles() {
      try {
        const data = await getOfflineLibRoles();
        setRoles(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadRoles();
  }, []);

  if (loading) {
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
    router.push(`/${baseUrl}/form/${row.id}`);
  };

  const handleAddNewRecord = (newRecord: any) => {
      console.log('handleAddNewRecord', newRecord)
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
                Library: Role
            </div>
        </CardTitle>

    </CardHeader>
    <CardContent>

        <div className="min-h-screen">
            <div className="min-h-screen">
                <AppTable
                    data={roles}
                    columns={roles[0] ? Object.keys(roles[0]).map((key, idx) => ({
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
