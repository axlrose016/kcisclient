import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption, } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Edit, Trash } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function CFWProgramDetails({ errors }: ErrorProps) {
    const [cfwTypeOptions, setcfwTypeOptions] = useState<LibraryOption[]>([]);
    const [selectedRelation, setSelectedRelation] = useState("");
    const [SelectedIsCFWBene, setSelectedIsCFWBene] = useState("");


    return (
        <>
            <div  >
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 ">
                    <div className="p-2 sm:col-span-4">
                        <Label htmlFor="cfw_program_details" className="block text-sm font-medium">Has your family ever been a beneficiary of the Cash-for-Work Program of DSWD? (e.g., Tara Basa Program, CFW for Disaster, etc.)</Label>
                        <div className="mt-1">
                            <RadioGroup
                                defaultValue="No"
                                className="flex gap-4"
                                onValueChange={(value) => setSelectedIsCFWBene(value)}
                            >
                                <div className="flex items-center">
                                    <RadioGroupItem value="Yes" id="isCFWBeneYes" />
                                    <Label htmlFor="isCFWBeneYes" className="ml-2">Yes</Label>
                                </div>
                                <div className="flex items-center">
                                    <RadioGroupItem value="No" id="isCFWBeneNo" />
                                    <Label htmlFor="isCFWBeneNo" className="ml-2">No</Label>
                                </div>
                            </RadioGroup>
                        </div>
                        {errors?.cfw_program_details && (
                            <p className="mt-2 text-sm text-red-500">{errors.cfw_program_details[0]}</p>
                        )}
                    </div>


                    {SelectedIsCFWBene === "Yes" && (
                        <div className="p-2 col-span-4 ">

                            <div className="flex justify-end">
                                <Dialog>
                                    <DialogTrigger>

                                        <Button>Add Type of CFW</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>
                                                <h2>Add Type of CFW</h2>
                                            </DialogTitle>
                                            <DialogDescription>

                                                <div className="p-2 col-span-2">
                                                    <Label htmlFor="type_of_cfw" className="block text-sm font-medium mb-2">Type of CFW</Label>
                                                    <FormDropDown
                                                        options={cfwTypeOptions}
                                                        selectedOption={selectedRelation}

                                                    />
                                                    {errors?.type_of_cfw && (
                                                        <p className="mt-2 text-sm text-red-500">{errors.type_of_cfw[0]}</p>
                                                    )}
                                                </div>
                                                <div className="p-2 col-span-2">
                                                    <Label htmlFor="year_served" className="block text-sm font-medium">Year Served</Label>
                                                    <Input
                                                        id="year_served"
                                                        name="year_served"
                                                        type="text"
                                                        placeholder="Enter the year served"
                                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                    />
                                                    {errors?.year_served && (
                                                        <p className="mt-2 text-sm text-red-500">{errors.year_served[0]}</p>
                                                    )}
                                                </div>
                                                <div className="p-2 col-span-2 flex justify-end">
                                                    <Button variant="destructive">Add</Button>
                                                </div>

                                            </DialogDescription>
                                        </DialogHeader>

                                    </DialogContent>
                                </Dialog>
                            </div>
                            <div className="p-2 col-span-4">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Type of CFW</TableHead>
                                            <TableHead>Year Served</TableHead>
                                            <TableHead>Action</TableHead>

                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                Tara Basa
                                            </TableCell>
                                            <TableCell>
                                                2023
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex space-x-2">

                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Button variant="outline" className="text-blue-500 border-blue-500">
                                                                    <Edit className="w-4 h-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Edit Record</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger>
                                                                <Button variant="outline" className="text-red-500 border-red-500">
                                                                    <Trash className="w-4 h-4" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>Delete Record</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>




                                                </div>
                                            </TableCell>

                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </div>

                        </div>

                    )}

                </div>

            </div >


        </>
    )
}