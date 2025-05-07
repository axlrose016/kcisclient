"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { IModules, IRoles, LibraryOption } from "@/components/interfaces/library-interface"
import { UserService } from "../UserService"
import { IUser, IUserAccess } from "@/components/interfaces/iuser"
import { AppTable } from "@/components/app-table"
import { getOfflineRoles } from "@/components/_dal/offline-options"
import { FormDropDown } from "@/components/forms/form-dropdown"

const formSchema = z.object({
  id: z.string(),
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().min(1, { message: "Email is required" }),
  role_id: z.string().min(1, { message: "Role is required" }),
});

type FormValues = z.infer<typeof formSchema>
const userService = new UserService();

export default function FormModule() {
  const router = useRouter();
  const params = useParams() || undefined; // for dynamic route segments
  const baseUrl = 'settings/users/'

  const [record, setRecord] = useState<any>(null);
  const [access, setAccess] = useState<any>(null);
  const [roles, setRoles] = useState<LibraryOption[]>([]);

  const id = typeof params?.id === 'string' ? params.id : '';

  useEffect(() => {
    async function fetchLibrary(){
      const lib_roles = await getOfflineRoles(); //await getDeploymentAreaLibraryOptions();
      setRoles(lib_roles);
    }
    fetchLibrary();
  }, [])

  useEffect(() => {
      async function fetchRecordAndResetForm() {
        if (id) {
          const [fetchedRecord, lib_roles] = await Promise.all([
            userService.getOfflineUserById(id) as Promise<IUser>,
            getOfflineRoles()
          ]);
    
          const useraccess = await userService.getOfflineUserAccessById(id) as IUserAccess[];
          setRecord(fetchedRecord);
          setAccess(useraccess);
          setRoles(lib_roles);
    
          if (fetchedRecord) {
            debugger;
            form.reset({
              id: fetchedRecord.id,
              username: fetchedRecord.username,
              email: fetchedRecord.email,
              role_id: fetchedRecord.role_id
            });
          }
        }
      }
  
      fetchRecordAndResetForm();
    }, [id]);

  // Default values for the form (could come from API for editing)
  let defaultValues: Partial<FormValues> = {
    id: "",
    username: "",
    email: "",
    role_id: ""
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  useEffect(() => {
    const subscription = form.watch((values) => {
      console.log("Form values changed:", values);
    });
    return () => subscription.unsubscribe();
  }, [form]);

  function onSubmit(data: FormValues) {
      console.log("Form submitted:", data)
    
        userService.saveOfflineUser(data).then((response:any) => {
          if (response) {
            router.push(`/${baseUrl}/`);
            toast({
                variant: "green",
                title: "Success.",
                description: "Form submitted successfully!",
              })
          }
        });
  }

  const handleDelete = (row: any) => {
    console.log('Delete:', row);
};

const handleRowClick = (row: any) => {
    console.log('Row clicked:', row);
    router.push(`/${baseUrl}/form/${row.id}`);
};


  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-full mx-auto">
        <CardHeader>
          <CardTitle>User</CardTitle>
          <CardDescription>Enter User Details.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="id"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>ID</FormLabel>
                        <FormControl>
                            <Input placeholder="Record ID" {...field} readOnly/>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>User Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter User Name Description" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="Enter Email" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={form.control}
                        name="role_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Role</FormLabel>
                            <FormControl>
                              <FormDropDown
                                id="role_id"
                                options={roles}
                                selectedOption={roles.find(role => role.id === field.value)?.id || null}
                                onChange={(selected) => {
                                  console.log("Selected Role:", selected);
                                  field.onChange(selected); // usually enough if you don't need manual form.setValue
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" type="button" onClick={() => router.push(`/${baseUrl}/`)}>
                Cancel
              </Button>
              <Button type="submit">Save User</Button>
            </CardFooter>
          </form>
        </Form>
        <CardContent>
            {access && access.length > 0 ? (
                <AppTable
                data={access}
                columns={Object.keys(access[0]).map((key) => ({
                    id: key,
                    header: key,
                    accessorKey: key,
                    filterType: 'text',
                    sortable: true,
                }))}
                onDelete={handleDelete}
                onRowClick={handleRowClick}
                onAddNewRecordNavigate={() => router.push(`/${baseUrl}/form/0`)}
                />
            ) : (
                <div className="text-center text-gray-500 py-10 text-lg">
                No record found.
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  )
}
