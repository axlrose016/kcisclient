"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { IPositionItem } from "@/db/offline/Dexie/schema/hr-service"
import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { FormDropDown } from "@/components/forms/form-dropdown"
import { LibraryOption } from "@/components/interfaces/library-interface"
import { getOfflineLibLevel } from "@/components/_dal/offline-options"
import { dxFetchData } from "@/components/_dal/external-apis/dxcloud"
import { map } from "lodash"
import { IAllocation, IAllocationUacs } from "@/db/offline/Dexie/schema/finance-service"
import { AppTable } from "@/components/app-table"
import { FinanceService } from "@/app/(authorized)/finance/FinanceService"

const formSchema = z.object({
  id: z.string(),
  allocation_id: z.string(),
  allotment_class_id: z.coerce.number().int().positive("Classification is required"),
  component_id: z.coerce.number().int().positive("Component is required"),
  expense_id: z.coerce.number().int().positive("Expense is required"),
  allotment_amount: z.coerce.number().int().positive("Allotment Amount is required"),
});

type FormValues = z.infer<typeof formSchema>
const financeService = new FinanceService();

export default function FormAllocationUasc() {
  const router = useRouter();
  const params = useParams() || undefined; // for dynamic route segments
  const baseUrl = 'finance/allocation/'

  const [record, setRecord] = useState<any>(null);
  const [uacs, setUacs] = useState<any>(null);
  const [region, setRegion] = useState<LibraryOption[]>([]);
      
  const uacsId = typeof params?.uacsId === 'string' ? params.uacsId : '';
  const id = typeof params?.id === 'string' ? params.id : '';

  useEffect(() => {
    async function fetchLibrary(){
      await dxFetchData("regions", "/api-libs/psgc/regions", data => {
        const regionOptions = data.map((item: any) => ({
          id: item.code,
          name: item.name,
        }));
        setRegion(regionOptions);
      });
    }
    fetchLibrary();
  }, [])

  // Default values for the form (could come from API for editing)
  let defaultValues: Partial<FormValues> = {
    id: "",
    allocation_id: id || '', 
    allotment_class_id: 0,
    component_id: 0,
    expense_id: 0,
    allotment_amount: 0,
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  useEffect(() => {
  const fetchRecord = async () => {

    if (!uacsId) return;

    try {
        const fetchedRecord = await financeService.getOfflineAllocationUacsById(uacsId) as IAllocationUacs;
        setRecord(fetchedRecord);
        form.reset(fetchedRecord as any); // ✅ Apply fetched record to form
    } catch (error) {
      console.error("Failed to fetch position item:", error);
    }
  };

  fetchRecord();
  }, [uacsId]);

  useEffect(() => {
    if(!id) return;
    form.setValue('allocation_id', id);
  }, [id]);


  function onSubmit(data: FormValues) {
    debugger;
    // Perform your form submission logic here
    console.log("Form submitted:", data)
    // Here you would typically send the data to your API
    financeService.saveOfflineAllocationUacs(data).then((response:any) => {
      if (response) {
        router.push(`/${baseUrl}/form/${id}`);
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
        debugger;
        router.push(`/${baseUrl}/${row.user_id}/useraccess/${row.id}`);
    };
    const handleAddNewRecord = (newRecord: any) => {
    debugger;
        router.push(`/${baseUrl}/${id}/useraccess/0`)
    }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-full mx-auto">
        <CardHeader>
          <CardTitle>UACS</CardTitle>
          <CardDescription>Enter or update UACS details.</CardDescription>
        </CardHeader>
        <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="allocation_id"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Allocation ID</FormLabel>
                            <FormControl>
                            <Input placeholder="Allocation ID" {...field} readOnly/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="id"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>ID</FormLabel>
                            <FormControl>
                            <Input placeholder="Auto Generated ID" {...field} readOnly/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="allotment_class_id"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Allotment Class</FormLabel>
                            <FormControl>
                            <Input placeholder="Allotment Class" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="component_id"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Component</FormLabel>
                            <FormControl>
                            <Input placeholder="Component" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="expense_id"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Expense Title</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="expense_id"
                            options={region}
                            selectedOption={region.find(r => r.id === field.value)?.id || null}
                            onChange={(selected) => {
                            field.onChange(selected); 
                            }}
                        />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />

                <FormField
                  control={form.control}
                  name="allotment_amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allotment Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="Allotment Amount" {...field}/>
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
              <Button type="submit">Save</Button>
            </CardFooter>
          </form>
        </Form>
        </CardContent>
      </Card>
    </div>
  )
}
