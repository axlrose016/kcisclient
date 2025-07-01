"use client"
import { AppTable } from "@/components/app-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HRService } from "../../../../../../../../components/services/HRService";
import { IHiringProcedure } from "@/db/offline/Dexie/schema/hr-service";
import { useFormContext } from "react-hook-form";
import { FormValues } from "../page";


function HiringProcedures({setSubmitSource}: {setSubmitSource: (source: "hiring-procedures") => void;}) {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const hrService = new HRService();
    const params = useParams() || undefined; 
    const id = typeof params?.id === 'string' ? params.id : '';
    const [hiringProcedures, setHiringProcedures] = useState<any>(null);
    const { handleSubmit } = useFormContext();

    useEffect(() => {
        async function fetchHiringProcedures() {
          if (id) {
            const fetchedRecord = await hrService.getOfflineHiringProceduresByDitributionId(id) as IHiringProcedure[];
            setHiringProcedures(fetchedRecord);
          }
        }
        fetchHiringProcedures();
      }, [id]);

    const baseUrl = 'hr-development/hiring-and-deployment/item-distribution/'

    const handleEdit = (row: any) => {
        console.log('Edit:', row);
    };

    const handleDelete = (row: any) => {
        console.log('Delete:', row);
    };

    const handleRowClick = (row: any) => {
      console.log('Row clicked:', row);
      router.push(`/${baseUrl}/form/${row.position_item_distribution_id}/hiring-procedures/form/${row.id}`);
    };

    const handleNewRecord = async () => {
      setSubmitSource("hiring-procedures");
      handleSubmit(() => {})();
    }
    
    const columnsMasterlist =[
        {
          id: 'hiring procedure description',
          header: 'Description',
          accessorKey: 'hiring_procedure_description',
          filterType: 'text',   
          sortable: true,
          align: "left",
          cell: null,
        },
        {
          id: 'date target from',
          header: 'Target (From)',
          accessorKey: 'date_target_from',
          filterType: 'text',   
          sortable: true,
          align: "left",
          cell: null,
        },
        {
          id: 'date target to',
          header: 'Target (To)',
          accessorKey: 'date_target_to',
          filterType: 'text',   
          sortable: true,
          align: "left",
          cell: null,
        },
         {
          id: 'date actual from',
          header: 'Actual (From)',
          accessorKey: 'date_actual_from',
          filterType: 'text',   
          sortable: true,
          align: "left",
          cell: null,
        },
         {
          id: 'date actual to',
          header: 'Actual (To)',
          accessorKey: 'date_actual_to',
          filterType: 'text',   
          sortable: true,
          align: "left",
          cell: null,
        },
    ];

    return(
        <div>
            <AppTable
                data={hiringProcedures || []}
                columns={columnsMasterlist}
                onDelete={handleDelete}
                onRowClick={handleRowClick}
                onAddNewRecordNavigate={handleNewRecord}
            />
        </div>
        
    )
}

export default HiringProcedures