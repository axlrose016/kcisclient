import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";

export default function Details({ errors }: ErrorProps) {
    const [cfwOptions, setCfwOptions] = useState<LibraryOption[]>([]);
    const [selectedCfwCategory, setSelectedCfwCategory] = useState("");
    return (
        <>
            <div className="">
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 mb-2">
                    <div className="p-2">
                        <Label htmlFor="philsysno" className="block text-sm font-medium">PhilSys ID Number</Label>
                        <Input
                            id="philsysno"
                            name="philsysno"
                            type="text"
                            placeholder="Enter your PhilSys ID Number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.philsysno && (
                            <p className="mt-2 text-sm text-red-500">{errors.philsysno[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-3">
                        <Label htmlFor="cfw_category" className="block text-sm font-medium mb-[5px]">CFW Category</Label>
                        <FormDropDown
                            options={cfwOptions}
                            selectedOption={selectedCfwCategory}

                        />
                        {errors?.cfw_category && (
                            <p className="mt-2 text-sm text-red-500">{errors.cfw_category[0]}</p>
                        )}
                    </div >

                </div>

                <div className="grid sm:grid-cols-1 sm:grid-rows-1 mb-2">
                    <div className="p-2">
                        <Label htmlFor="health_condition" className="block text-sm font-medium mb-[5px]">Health Condition</Label>
                        <Textarea
                            id="health_condition"
                            name="health_condition"
                            placeholder="Enter your Health Condition"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />

                        {errors?.health_condition && (
                            <p className="mt-2 text-sm text-red-500">{errors.health_condition[0]}</p>
                        )}
                    </div>
                </div>
                <div className="grid sm:grid-cols-1 sm:grid-rows-1 mb-2">
                    <div className="p-2">
                        <Label htmlFor="number_of_children" className="block text-sm font-medium">Number of Children</Label>
                        <Input
                            id="number_of_children"
                            name="number_of_children"
                            type="number"
                            placeholder="Enter the number of children"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.number_of_children && (
                            <p className="mt-2 text-sm text-red-500">{errors.number_of_children[0]}</p>
                        )}
                    </div>
                </div>
                <div className="grid sm:grid-cols-1 sm:grid-rows-1 mb-2">
                    <div className="p-2">
                        <Label htmlFor="indigenous_group" className="block text-sm font-medium">Member of an Indigenous Group</Label>
                        <div className="mt-1">
                            <label className="inline-flex items-center">
                                <input type="radio" name="indigenous_group" value="yes" className="form-radio" />
                                <span className="ml-2">Yes</span>
                            </label>
                            <label className="inline-flex items-center ml-6">
                                <input type="radio" name="indigenous_group" value="no" className="form-radio" />
                                <span className="ml-2">No</span>
                            </label>
                        </div>
                        {errors?.indigenous_group && (
                            <p className="mt-2 text-sm text-red-500">{errors.indigenous_group[0]}</p>
                        )}
                    </div>
                </div>

                <div className="grid sm:grid-cols-1 sm:grid-rows-1 mb-2">
                    <div className="p-2">
                        <Label htmlFor="is_pantawid" className="block text-sm font-medium">Is Pantawid</Label>
                        <div className="mt-1">
                            <label className="inline-flex items-center">
                                <input type="radio" name="is_pantawid" value="yes" className="form-radio" />
                                <span className="ml-2">Yes</span>
                            </label>
                            <label className="inline-flex items-center ml-6">
                                <input type="radio" name="is_pantawid" value="no" className="form-radio" />
                                <span className="ml-2">No</span>
                            </label>
                        </div>
                        {errors?.is_pantawid && (
                            <p className="mt-2 text-sm text-red-500">{errors.is_pantawid[0]}</p>
                        )}
                    </div>
                </div>

                <div className="grid sm:grid-cols-1 sm:grid-rows-1 mb-2">
                    <div className="p-2">
                        <Label htmlFor="is_pantawid_leader" className="block text-sm font-medium">Is Pantawid Leader</Label>
                        <div className="mt-1">
                            <label className="inline-flex items-center">
                                <input type="radio" name="is_pantawid_leader" value="yes" className="form-radio" />
                                <span className="ml-2">Yes</span>
                            </label>
                            <label className="inline-flex items-center ml-6">
                                <input type="radio" name="is_pantawid_leader" value="no" className="form-radio" />
                                <span className="ml-2">No</span>
                            </label>
                        </div>
                        {errors?.is_pantawid_leader && (
                            <p className="mt-2 text-sm text-red-500">{errors.is_pantawid_leader[0]}</p>
                        )}
                    </div>
                </div>

                <div className="grid sm:grid-cols-1 sm:grid-rows-1 mb-2">
                    <div className="p-2">
                        <Label htmlFor="is_slp" className="block text-sm font-medium">Is SLP</Label>
                        <div className="mt-1">
                            <label className="inline-flex items-center">
                                <input type="radio" name="is_slp" value="yes" className="form-radio" />
                                <span className="ml-2">Yes</span>
                            </label>
                            <label className="inline-flex items-center ml-6">
                                <input type="radio" name="is_slp" value="no" className="form-radio" />
                                <span className="ml-2">No</span>
                            </label>
                        </div>
                        {errors?.is_slp && (
                            <p className="mt-2 text-sm text-red-500">{errors.is_slp[0]}</p>
                        )}
                    </div>
                </div>
            </div >


        </>
    )
}