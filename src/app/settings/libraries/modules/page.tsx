"use client"

import { fetchModules } from "@/components/_dal/libraries";
import { ButtonDelete } from "@/components/actions/button-delete";
import { ButtonEdit } from "@/components/actions/button-edit";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react";

export default function Modules(){
    const [modules, setModules] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
      async function loadModules() {
        try{
                const data = await fetchModules();
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
        return <p>Loading...</p>
    }

    return (
        <Table className="table-fixed w-full text-left">
          <TableCaption>A list of all System Modules.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Module</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modules.map((module:any) => (
              <TableRow key={module.id}>
                <TableCell className="font-medium">{module.module_description}</TableCell>
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