import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
export default function PrefferedDeploymentArea({ errors }: ErrorProps) {
    const [relationOptions, setRelationOptions] = useState<LibraryOption[]>([]);
    const [selectedRelation, setSelectedRelation] = useState("");
    return (
        <>
            <div  >
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 ">
                    <div className="p-2 sm:col-span-4">
                        <Label htmlFor="office_name" className="block text-sm font-medium">Name of Office</Label>
                        <FormDropDown
                            options={relationOptions}
                            selectedOption={selectedRelation}
                        />
                        {errors?.office_name && (
                            <p className="mt-2 text-sm text-red-500">{errors.office_name[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-4">
                        <Label htmlFor="office_address" className="block text-sm font-medium">Office Address</Label>
                        <Textarea
                            id="office_address"
                            name="office_address"
                            placeholder="Enter Office Address"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            rows={4}
                        />
                        {errors?.office_address && (
                            <p className="mt-2 text-sm text-red-500">{errors.office_address[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-4">
                        <Label htmlFor="preferred_work_type" className="block text-sm font-medium">Preferred Type of Work</Label>
                        <FormDropDown
                            options={relationOptions}
                            selectedOption={selectedRelation}
                        />
                        {errors?.preferred_work_type && (
                            <p className="mt-2 text-sm text-red-500">{errors.preferred_work_type[0]}</p>
                        )}
                    </div>
                </div>
            </div >


        </>
    )
}