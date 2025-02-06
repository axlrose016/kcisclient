import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
export default function HighestEducationalAttainment({ errors }: ErrorProps) {
    const [relationOptions, setRelationOptions] = useState<LibraryOption[]>([]);
    const [selectedRelation, setSelectedRelation] = useState("");
    return (
        <>
            <div  >
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 ">
                    <div className="p-2 sm:col-span-4">
                        <Label htmlFor="school_name" className="block text-sm font-medium">Name of School</Label>
                        <Input
                            id="school_name"
                            name="school_name"
                            type="text"
                            placeholder="Enter Name of School"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.school_name && (
                            <p className="mt-2 text-sm text-red-500">{errors.school_name[0]}</p>
                        )}
                    </div>
                    <div className="p-2">
                        <Label htmlFor="campus" className="block text-sm font-medium">Campus</Label>
                        <Input
                            id="campus"
                            name="campus"
                            type="text"
                            placeholder="Enter Campus"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.campus && (
                            <p className="mt-2 text-sm text-red-500">{errors.campus[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-3">
                        <Label htmlFor="school_address" className="block text-sm font-medium">School Address</Label>
                        <Textarea
                            id="school_address"
                            name="school_address"
                            placeholder="Enter School Address"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows={4}
                        />
                        {errors?.school_address && (
                            <p className="mt-2 text-sm text-red-500">{errors.school_address[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-4">
                        <Label htmlFor="course" className="block text-sm font-medium">Course</Label>
                        <FormDropDown
                            options={relationOptions}
                            selectedOption={selectedRelation}
                        />
                        {errors?.course && (
                            <p className="mt-2 text-sm text-red-500">{errors.course[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-1">
                        <Label htmlFor="year_graduated" className="block text-sm font-medium">Year Graduated</Label>
                        <Input
                            id="year_graduated"
                            name="year_graduated"
                            type="text"
                            placeholder="Enter Year Graduated"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.year_graduated && (
                            <p className="mt-2 text-sm text-red-500">{errors.year_graduated[0]}</p>
                        )}
                    </div>
                    <div className="p-2">
                        <Label htmlFor="year_level" className="block text-sm font-medium">Year Level (if student)</Label>
                        <Input
                            id="year_level"
                            name="year_level"
                            type="text"
                            placeholder="Enter Year Level"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.year_level && (
                            <p className="mt-2 text-sm text-red-500">{errors.year_level[0]}</p>
                        )}
                    </div>
                </div>
            </div >


        </>
    )
}