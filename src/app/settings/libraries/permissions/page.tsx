"use client"

import { fetchPermissions } from "@/components/_dal/libraries";
import { getOfflineLibPermissions } from "@/components/_dal/offline-libraries";
import { ButtonDelete } from "@/components/actions/button-delete";
import { ButtonEdit } from "@/components/actions/button-edit";
import { AppTable } from "@/components/app-table";
import LoadingScreen from "@/components/general/loading-screen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getLibrary } from "@/lib/libraries";
import { useRouter } from "next/navigation";
import React from "react";

export default function Permissions() {
    const [permissions, setPermissions] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();
    const baseUrl = 'settings/libraries/permissions'

    React.useEffect(() => {
        async function loadPermissions(){
            try{
                const data = await getOfflineLibPermissions();
                setPermissions(data);
            } catch(error){
                console.error(error);
            } finally{
                setLoading(false);
            }
        }
        loadPermissions();
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
                      data={permissions}
                      columns={permissions[0] ? Object.keys(permissions[0]).map((key, idx) => ({
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
  )
}

