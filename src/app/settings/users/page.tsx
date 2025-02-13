"use client"

import { fetchUsers } from "@/components/_dal/users";
import { ButtonDelete } from "@/components/actions/button-delete";
import { ButtonDialog } from "@/components/actions/button-dialog";
import { ButtonEdit } from "@/components/actions/button-edit";
import UserForm from "@/components/dialogs/settings/user/frmuser";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import React from "react"

export default function Users(){
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function loadUsers(){
            try{
                const data = await fetchUsers();
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
        return <>Loading...</>
    }
    return(
        <Table className="table-fixed w-full text-left">
            <TableCaption>A list of all Users.</TableCaption>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[200px]">User</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user:any) =>(
                    <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell className="text-right">
                            <ButtonDialog dialogForm={UserForm} dialog_title="User Profile" record_id={user.id} label="Edit" css="p-3 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white rounded-lg"/>
                            <ButtonDelete/>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}