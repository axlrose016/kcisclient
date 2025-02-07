import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
export default function VolunteerDetails({ errors }: ErrorProps) {
    const [relationOptions, setRelationOptions] = useState<LibraryOption[]>([]);
    const [selectedRelation, setSelectedRelation] = useState("");
    return (
        <>
            <div  >
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 ">
                    <div className="p-2 sm:col-span-1">
                        <Label htmlFor="date_first_appointment" className="block text-sm font-medium">Date of First Appointment</Label>
                        <Input
                            id="date_first_appointment"
                            name="date_first_appointment"
                            type="date"
                            placeholder="Enter Date of First Appointment"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.date_first_appointment && (
                            <p className="mt-2 text-sm text-red-500">{errors.date_first_appointment[0]}</p>
                        )}
                    </div>
                    <div className="p-2 Col-span-1">
                        <Label htmlFor="fund_source" className="block text-sm font-medium">Fund Source</Label>
                        <FormDropDown
                            options={relationOptions}
                            selectedOption={selectedRelation}
                        />
                        {errors?.fund_source && (
                            <p className="mt-2 text-sm text-red-500">{errors.fund_source[0]}</p>
                        )}
                    </div>
                    <div className="p-2 Col-span-1">
                        <Label htmlFor="cycle" className="block text-sm font-medium">Cycle</Label>
                        <FormDropDown
                            options={relationOptions}
                            selectedOption={selectedRelation}
                        />
                        {errors?.cycle && (
                            <p className="mt-2 text-sm text-red-500">{errors.cycle[0]}</p>
                        )}
                    </div>
                    <div className="p-2 Col-span-1">
                        <Label htmlFor="kc_mode" className="block text-sm font-medium">KC Mode</Label>
                        <FormDropDown
                            options={relationOptions}
                            selectedOption={selectedRelation}
                        />
                        {errors?.kc_mode && (
                            <p className="mt-2 text-sm text-red-500">{errors.kc_mode[0]}</p>
                        )}
                    </div>
                    <div className="p-2 Col-span-1">
                        <Label htmlFor="committee" className="block text-sm font-medium">Committee</Label>
                        <FormDropDown
                            options={relationOptions}
                            selectedOption={selectedRelation}
                        />
                        {errors?.committee && (
                            <p className="mt-2 text-sm text-red-500">{errors.committee[0]}</p>
                        )}
                    </div>
                    <div className="p-2 Col-span-1">
                        <Label htmlFor="position" className="block text-sm font-medium">Position</Label>
                        <FormDropDown
                            options={relationOptions}
                            selectedOption={selectedRelation}
                        />
                        {errors?.position && (
                            <p className="mt-2 text-sm text-red-500">{errors.position[0]}</p>
                        )}
                    </div>
                    <div className="p-2 sm:col-span-1">
                        <Label htmlFor="date_start" className="block text-sm font-medium">Date Start</Label>
                        <Input
                            id="date_start"
                            name="date_start"
                            type="date"
                            placeholder="Enter Date Start"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.date_start && (
                            <p className="mt-2 text-sm text-red-500">{errors.date_start[0]}</p>
                        )}
                    </div>
                    <div className="p-2 sm:col-span-1">
                        <Label htmlFor="date_end" className="block text-sm font-medium">Date End</Label>
                        <Input
                            id="date_end"
                            name="date_end"
                            type="date"
                            placeholder="Enter Date End"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.date_end && (
                            <p className="mt-2 text-sm text-red-500">{errors.date_end[0]}</p>
                        )}
                    </div>
                </div>
            </div >


        </>
    )
}