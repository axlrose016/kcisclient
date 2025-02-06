"use client"

import { fetchPermissions } from "@/components/_dal/libraries";
import { ButtonDelete } from "@/components/actions/button-delete";
import { ButtonEdit } from "@/components/actions/button-edit";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getLibrary } from "@/lib/libraries";
import React from "react";

export default function Permissions() {
    const [permissions, setPermissions] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function loadPermissions(){
            try{
                const data = await fetchPermissions();
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
        return <p>Loading...</p>;
    }

    return (
        <Table className="table-fixed w-full text-left">
          <TableCaption>A list of all User Permissions.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Permission</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {permissions.map((permission:any) => (
              <TableRow key={permission.id}>
                <TableCell className="font-medium">{permission.permission_description}</TableCell>
                <TableCell className="text-right">
                  <ButtonEdit/>
                  <ButtonDelete/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
    );
}

