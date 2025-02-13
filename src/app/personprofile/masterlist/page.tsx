"use client"
import { fetchProfiles } from "@/components/_dal/profiles";
import { ButtonDelete } from "@/components/actions/button-delete";
import { ButtonDialog } from "@/components/actions/button-dialog";
import { ButtonView } from "@/components/actions/button-view";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";

export default function PersonProfileMasterlist(){
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadProfiles(){
            try{
                const data = await fetchProfiles();
                setProfiles(data);
            }catch(error){
                console.error(error);
            }finally{
                setLoading(false);
            }
        }
        loadProfiles();
    }, []);

    if(loading){
        return <>Loading...</>
    }
    return (
        <Table className="table-fixed w-full text-left">
            <TableCaption>A list of all Users.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[200px]">First Name</TableHead>
                    <TableHead className="w-[200px]">Middle Name</TableHead>
                    <TableHead className="w-[200px]">Last Name</TableHead>
                    <TableHead className="w-[200px]">Push Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {profiles.map((profile:any) =>(
                    <TableRow key={profile.id}>
                        <TableCell className="font-medium">{profile.first_name}</TableCell>
                        <TableCell className="font-medium">{profile.middle_name}</TableCell>
                        <TableCell className="font-medium">{profile.last_name}</TableCell>
                        <TableCell className="font-medium">{profile.push_status_id}</TableCell>
                        <TableCell className="text-right">
                            <ButtonView path={`/personprofile/form?id=${profile.id}`} label="View" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}