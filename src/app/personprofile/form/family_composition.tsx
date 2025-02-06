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

export default function FamilyComposition({ errors }: ErrorProps) {
    const [cfwTypeOptions, setcfwTypeOptions] = useState<LibraryOption[]>([]);
    const [selectedRelation, setSelectedRelation] = useState("");
    const [SelectedIsCFWBene, setSelectedIsCFWBene] = useState("");


    return (
        <>
            <div  >
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 ">


                    <div className="p-2 col-span-4 ">
                        <div className="flex justify-end">
                            <Dialog>
                                <DialogTrigger>
                                    <Button>Add Family Member</Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[80vh] overflow-y-auto">


                                    <DialogHeader>
                                        <DialogTitle>
                                            <h2>Add Family Member</h2>
                                        </DialogTitle>
                                        <DialogDescription>

                                            <div className="p-2 col-span-1">
                                                <Label htmlFor="name" className="block text-sm font-medium mb-2">Name</Label>
                                                <Input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    placeholder="Enter the name"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                                {errors?.name && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.name[0]}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-1">
                                                <Label htmlFor="relationship" className="block text-sm font-medium mb-2">Relationship</Label>
                                                <FormDropDown
                                                    options={cfwTypeOptions}
                                                    selectedOption={selectedRelation}
                                                />
                                                {errors?.relationship && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.relationship[0]}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-2 flex space-x-4">
                                                <div className="w-1/2">
                                                    <Label htmlFor="birthday" className="block text-sm font-medium mb-2">Birthday</Label>
                                                    <Input id="birthday" name="birthday" type="date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                                                    {errors?.birthday && (
                                                        <p className="mt-2 text-sm text-red-500">{errors.birthday[0]}</p>
                                                    )}
                                                </div>
                                                <div className="w-1/2">
                                                    <Label htmlFor="age" className="block text-sm font-medium mb-2">Age</Label>
                                                    <Input id="age" name="age" type="number" disabled className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" />
                                                    {errors?.age && (
                                                        <p className="mt-2 text-sm text-red-500">{errors.age[0]}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="p-2 col-span-1">
                                                <Label htmlFor="educational_level" className="block text-sm font-medium mb-2">Educational Level</Label>
                                                <FormDropDown
                                                    options={cfwTypeOptions}
                                                    selectedOption={selectedRelation}
                                                />
                                                {errors?.educational_level && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.educational_level[0]}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-1">
                                                <Label htmlFor="occupation" className="block text-sm font-medium mb-2">Occupation</Label>
                                                <Input
                                                    id="occupation"
                                                    name="occupation"
                                                    type="text"
                                                    placeholder="Enter the occupation"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                                {errors?.occupation && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.occupation[0]}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-1">
                                                <Label htmlFor="monthly_income" className="block text-sm font-medium mb-2">Monthly Income</Label>
                                                <Input
                                                    id="monthly_income"
                                                    name="monthly_income"
                                                    type="number"
                                                    placeholder="Enter the monthly income"
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                                />
                                                {errors?.monthly_income && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.monthly_income[0]}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-1">
                                                <Label htmlFor="type_of_vulnerability" className="block text-sm font-medium mb-2">Type of Vulnerability</Label>
                                                <FormDropDown
                                                    options={cfwTypeOptions}
                                                    selectedOption={selectedRelation}
                                                />
                                                {errors?.type_of_vulnerability && (
                                                    <p className="mt-2 text-sm text-red-500">{errors.type_of_vulnerability[0]}</p>
                                                )}
                                            </div>
                                            <div className="p-2 col-span-1 flex justify-end">
                                                <Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white">
                                                    <span className="mr-1">+</span> Add Family Member
                                                </Button>
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
                                        <TableHead>Name</TableHead>
                                        <TableHead>Relationship</TableHead>
                                        <TableHead>Birthday</TableHead>
                                        <TableHead>Age</TableHead>
                                        <TableHead>Educational level</TableHead>
                                        <TableHead>Occupation</TableHead>
                                        <TableHead>Monthly Income</TableHead>
                                        <TableHead>Type of Vulnerability</TableHead>
                                        <TableHead>Action</TableHead>

                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <TableRow>


                                    </TableRow>
                                </TableBody>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>John Doe</TableCell>
                                        <TableCell>Father</TableCell>
                                        <TableCell>1980-01-01</TableCell>
                                        <TableCell>43</TableCell>
                                        <TableCell>College</TableCell>
                                        <TableCell>Engineer</TableCell>
                                        <TableCell>$5000</TableCell>
                                        <TableCell>None</TableCell>
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



                </div>

            </div >


        </>
    )
}