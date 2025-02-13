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

export default function Roles() {
  const [roles, setRoles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadRoles() {
      try {
        const data = await fetchRoles();
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
    return <p>Loading...</p>;
  }

  return (
    <Table className="table-fixed w-full text-left">
      <TableCaption>A list of all User Roles.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Role</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.map((role:any) => (
          <TableRow key={role.id}>
            <TableCell className="font-medium">{role.role_description}</TableCell>
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
