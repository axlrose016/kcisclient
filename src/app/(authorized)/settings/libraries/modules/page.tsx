"use client"

import { fetchModules, fetchOfflineModules } from "@/components/_dal/libraries";
import { getOfflineLibModules } from "@/components/_dal/offline-libraries";
import { ButtonDelete } from "@/components/actions/button-delete";
import { ButtonEdit } from "@/components/actions/button-edit";
import { AppTable } from "@/components/app-table";
import LoadingScreen from "@/components/general/loading-screen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import React from "react";

export default function Module(){
    const [modules, setModules] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const router = useRouter();
    const baseUrl = 'settings/libraries/modules'

    React.useEffect(() => {
      async function loadModules() {
        try{
                const data = await getOfflineLibModules();
                setModules(data);
            } catch(error){
                console.error(error);
            } finally{
                setLoading(false);
            }
        }
        loadModules();
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

  const handleDelete = (row: any) => {
      console.log('Delete:', row);
  };

  const handleRowClick = (row: any) => {
      console.log('Row clicked:', row);
      router.push(`/${baseUrl}/form/${row.id}`);
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
                  Library: Modules
              </div>
          </CardTitle>

      </CardHeader>
      <CardContent>
          <div className="min-h-screen">
              <div className="min-h-screen">
                  <AppTable
                      data={modules}
                      columns={modules[0] ? Object.keys(modules[0]).map((key, idx) => ({
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
    );
}