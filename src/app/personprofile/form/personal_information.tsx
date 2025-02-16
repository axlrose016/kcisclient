import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { PhilSysInput } from "@/components/ui/philsys_mask";
import { getCFWCatLibraryOptions } from "@/components/_dal/options";
export default function Details({ errors, capturedData, updateCapturedData, selectedModalityId }: { errors: any; capturedData: any; updateCapturedData: any, selectedModalityId: any }) {
    const [selectedHealthConcern, setSelectedHealthConcern] = useState("");


    const [cfwCatOptions, setCfwCatOptions] = useState<LibraryOption[]>([]);
    const [selectedCFWCat, setSelectedCFWCat] = useState("");
    const [selectedCFWCatId, setSelectedCFWCatId] = useState<number | null>(null);

    const [form_Data, setForm_Data] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const CFWCat = await getCFWCatLibraryOptions();
                setCfwCatOptions(CFWCat);


            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleCFWCatChange = (id: number) => {
        console.log("Selected Province ID:", id);
        setSelectedCFWCatId(id);
    };

    const handleHealthConcernChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSelectedHealthConcern(value);

        if (value === "no") {
            updateCapturedData("cfw", "has_immediate_health_concern", 0);
            // updateCapturedData("cfw", "immediate_health_concern_details", ""); // Clear health concern details
            updateCapturedData("cfw", "has_immediate_health_concern", 0, 4);
        } else {
            // updateCapturedData("cfw", "has_immediate_health_concern", 1);
            // Updating cfw at index 4
            updateCapturedData("cfw", "has_immediate_health_concern", 1, 4);
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm_Data((prevData) => {
            const updatedData = { ...prevData, [name]: value };
            localStorage.setItem('formData', JSON.stringify(updatedData)); // Save to localStorage
            return updatedData;
        });
    };



    return (
        <>
            <div className="">
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 mb-2">


                    {/* admin-side to */}
                    {/* <div className="p-2 col-span-3">
                        <Label htmlFor="cwf_category_id" className="block text-sm font-medium mb-[5px]">CFW Category</Label>
                        <FormDropDown
                        // onBlur={handleBlur}
                            id="cwf_category_id"
                            options={cfwCatOptions}
                            selectedOption={selectedCFWCatId}
                            onChange={handleCFWCatChange}
                        />
                        {errors?.cwf_category_id && (
                            <p className="mt-2 text-sm text-red-500">{errors.cwf_category_id}</p>
                        )}
                    </div > */}

                </div>
                <div className="p-2 col-span-1">
                    <Label htmlFor="has_immediate_health_concern" className="block text-sm font-medium">Do you have any immediate health concerns that you think may affect your work?</Label>
                    <div className="mt-2">
                        <div className="flex items-center">
                            <input
                                id="has_immediate_health_concern_yes"
                                name="has_immediate_health_concern"
                                type="radio"
                                value="yes"
                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                onChange={handleHealthConcernChange}


                            />
                            <Label htmlFor="health_concerns_yes" className="ml-3 block text-sm font-medium text-gray-700">
                                Yes
                            </Label>
                        </div>
                        <div className="flex items-center mt-2">
                            <input
                                id="has_immediate_health_concern_no"
                                name="has_immediate_health_concern"
                                type="radio"
                                value="no"
                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                onChange={handleHealthConcernChange}
                            // onChange={(e) => updateCapturedData("common_data", "has_immediate_health_concern", e.target.value)}
                            />
                            <Label htmlFor="health_concerns_no" className="ml-3 block text-sm font-medium text-gray-700">
                                No
                            </Label>
                        </div>
                    </div>
                    {errors?.has_immediate_health_concern && (
                        <p className="mt-2 text-sm text-red-500">{errors.has_immediate_health_concern}</p>
                    )}
                </div>
                <div className="grid sm:grid-cols-1 sm:grid-rows-1 mb-2">
                    <div className="p-2">
                        <Label htmlFor="immediate_health_concern" className="block text-sm font-medium mb-[5px]">Health Condition</Label>
                        <Textarea
                            id="immediate_health_concern"
                            name="immediate_health_concern"
                            placeholder="Enter your Health Condition"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(e) => updateCapturedData("cfw", 'immediate_health_concern', e.target.value, 4)}
                            disabled={selectedHealthConcern !== "yes"}
                        />

                        {errors?.immediate_health_concern && (
                            <p className="mt-2 text-sm text-red-500">{errors.immediate_health_concern}</p>
                        )}
                    </div>
                </div>
                <div className={`grid sm:grid-cols-1 sm:grid-rows-1 mb-2 ${selectedModalityId === 25 ? "" : "hidden"}`}>
                    <div className="p-2">
                        <Label htmlFor="no_of_children" className="block text-sm font-medium">Number of Children</Label>
                        <Input
                            id="no_of_children"
                            name="no_of_children"
                            type="number"
                            placeholder="Enter the number of children"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.no_of_children && (
                            <p className="mt-2 text-sm text-red-500">{errors.no_of_children}</p>
                        )}
                    </div>
                </div>



            </div >


        </>
    )
}

