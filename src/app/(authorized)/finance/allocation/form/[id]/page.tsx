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
import { FinanceService } from "../../../FinanceService"
import { IAllocation, IAllocationUacs } from "@/db/offline/Dexie/schema/finance-service"
import { AppTable } from "@/components/app-table"

const formSchema = z.object({
  id: z.string(),
  date_allocation:z.date().nullable().optional().transform((val) => (val ? val.toISOString() : null)),
  region_code: z.string().min(1, "Region is required"),
  pap_id: z.coerce.number().int().positive("PAP is required"),
  budget_year_id: z.coerce.number().int().positive("Budget Year is required"),
  appropriation_source_id: z.coerce.number().int().positive("Appropriation Source is required"),
  appropriation_type_id: z.coerce.number().int().positive("Appropriation Type is required"), 
});

type FormValues = z.infer<typeof formSchema>
const financeService = new FinanceService();

export default function FormAllocation() {
  const router = useRouter();
  const params = useParams() || undefined; // for dynamic route segments
  const baseUrl = 'finance/allocation/'

  const [record, setRecord] = useState<any>(null);
  const [uacs, setUacs] = useState<any>(null);
  const [region, setRegion] = useState<LibraryOption[]>([]);
      
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
    date_allocation:null,
    region_code: "",
    pap_id: 0,
    budget_year_id: 0,
    appropriation_source_id: 0,
    appropriation_type_id: 0,
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  useEffect(() => {
  const fetchRecord = async () => {
    if (!id) return;

    try {
        const fetchedRecord = await financeService.getOfflineAllocationById(id) as IAllocation;
        setRecord(fetchedRecord);
        const fetchUacs = await financeService.getOfflineAllocationUacsByAllotmentId(id) as IAllocationUacs[];
        setUacs(fetchUacs);
        form.reset(fetchedRecord as any); // ✅ Apply fetched record to form
    } catch (error) {
      console.error("Failed to fetch position item:", error);
    }
  };

  fetchRecord();
  }, [id,form]);

  function onSubmit(data: FormValues) {
    debugger;
    // Perform your form submission logic here
    console.log("Form submitted:", data)
    // Here you would typically send the data to your API
    financeService.saveOfflineAllocation(data).then((response:any) => {
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
        debugger;
        router.push(`/${baseUrl}/form/${row.allocation_id}/uacs/${row.id}`);
    };
    const handleAddNewRecord = (newRecord: any) => {
    debugger;
        router.push(`/${baseUrl}/form/${id}/uacs/0`)
    }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-full mx-auto">
        <CardHeader>
          <CardTitle>WFP Allocation</CardTitle>
          <CardDescription>Enter or update WFP Allocation details.</CardDescription>
        </CardHeader>
        <CardContent>
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
                    name="date_allocation"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                        <FormLabel>Date Allocation</FormLabel>
                        <Popover>
                            <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                variant={"outline"}
                                className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                )}
                                >
                                {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                            </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={field.value || undefined}
                                onSelect={field.onChange}
                                disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                                initialFocus
                            />
                            </PopoverContent>
                        </Popover>
                        <FormMessage />
                        </FormItem>
                    )}
                    />  
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="budget_year_id"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Budget Year</FormLabel>
                            <FormControl>
                            <Input placeholder="Budget Year" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="region_code"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Region</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="region_code"
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
                  name="pap_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>PAP</FormLabel>
                      <FormControl>
                        <Input placeholder="Record ID" {...field}/>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                    control={form.control}
                    name="appropriation_source_id"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Appropriation Source</FormLabel>
                        <FormControl>
                            <FormDropDown
                            id="appropriation_source_id"
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
                  name="appropriation_type_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appropriation Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Record ID" {...field}/>
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
              <Button type="submit">Save Allocation</Button>
            </CardFooter>
          </form>
        </Form>
        <AppTable
            data={uacs ?? []}
            columns={
            uacs && uacs.length > 0
                ? Object.keys(uacs[0]).map((key) => ({
                    id: key,
                    header: key,
                    accessorKey: key,
                    filterType: 'text',
                    sortable: true,
                }))
                : [] // Fallback to empty columns if no data
            }
            onDelete={handleDelete}
            onRowClick={handleRowClick}
            onAddNewRecordNavigate={handleAddNewRecord}
        />
        </CardContent>
      </Card>
    </div>
  )
}
