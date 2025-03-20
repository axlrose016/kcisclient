import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { PhilSysInput } from "@/components/ui/philsys_mask";
import { getCFWCatLibraryOptions } from "@/components/_dal/options";
import { getOfflineLibCFWType } from "@/components/_dal/offline-options";
export default function Details({ errors }: { errors: any; }) {

    const [healthConcerns, setHealthConcerns] = useState(() => {
        const storedHealthConcerns = localStorage.getItem("healthConcerns");
        return storedHealthConcerns ? JSON.parse(storedHealthConcerns) : {}
    });

    useEffect(() => {
        localStorage.setItem("healthConcerns", JSON.stringify(healthConcerns));
    }, [healthConcerns]);

    const updatingHealthConcerns = (field: any, value: any) => {
        setHealthConcerns((prev: any) => ({
            ...prev, [field]: value
        }));
    }

    // debugger;
    const [selectedHealthConcern, setSelectedHealthConcern] = useState("");
    const [healthConcern, setHealthConcern] = useState("");


    const [cfwCatOptions, setCfwCatOptions] = useState<LibraryOption[]>([]);
    const [selectedCFWCat, setSelectedCFWCat] = useState("");
    const [selectedCFWCatId, setSelectedCFWCatId] = useState<number | null>(null);

    const [form_Data, setForm_Data] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const CFWCat = await getOfflineLibCFWType(); //await getCFWCatLibraryOptions();
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
        // updatingHealthConcerns("immediate_health_concern", value);
        // updatingHealthConcerns("has_immediate_health_concern", value);
        if (value === "no") {
            // updateCapturedData("cfw", "has_immediate_health_concern", 0);
            // updateCapturedData("cfw", "immediate_health_concern_details", ""); // Clear health concern details
            // updateCapturedData("cfw", "has_immediate_health_concern", 0, 4);
            // updateCapturedData("cfw", "immediate_health_concern", "", 4);
            // updatingHealthConcerns("immediate_health_concern", "");
            setHealthConcern("");
            updatingHealthConcerns("has_immediate_health_concern", 0);
            updatingHealthConcerns("immediate_health_concern", "");

        } else {
            // updateCapturedData("cfw", "has_immediate_health_concern", 1);
            // Updating cfw at index 4
            // updateCapturedData("cfw", "has_immediate_health_concern", 1, 4);
            // healthConcerns.immediate_health_concern = 1;
            updatingHealthConcerns("has_immediate_health_concern", 1);
        }

        if (event.target.value === "no") {
            (document.getElementById("immediate_health_concern") as HTMLTextAreaElement).value = "";
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
                                checked={healthConcerns.has_immediate_health_concern === 1}
                                // checked={capturedData.cfw[4].has_immediate_health_concern === 1}
                                onChange={handleHealthConcernChange}
                                id="has_immediate_health_concern_yes"
                                name="has_immediate_health_concern"
                                type="radio"
                                value="yes"
                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"

                            />
                            <Label htmlFor="health_concerns_yes" className="ml-3 block text-sm font-medium text-gray-700">
                                Yes
                            </Label>
                        </div>
                        <div className="flex items-center mt-2">
                            <input
                                checked={healthConcerns.has_immediate_health_concern === 0}
                                // checked={capturedData.cfw[4].has_immediate_health_concern === 0}
                                onChange={handleHealthConcernChange}
                                id="has_immediate_health_concern_no"
                                name="has_immediate_health_concern"
                                type="radio"
                                value="no"
                                className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
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
                <div className={`grid sm:grid-cols-1 sm:grid-rows-1 mb-2  ${healthConcerns.has_immediate_health_concern === 1 ? "" : "hidden"}`}>
                {/* <div className="grid sm:grid-cols-1 sm:grid-rows-1 mb-2"> */}
                    <div className="p-2">
                        <Label htmlFor="immediate_health_concern" className="block text-sm font-medium mb-[5px]">Health Condition</Label>
                        <Textarea
                            value={healthConcerns.immediate_health_concern}
                            // value={capturedData.cfw[4].immediate_health_concern}
                            onChange={(e) => updatingHealthConcerns('immediate_health_concern', e.target.value.toUpperCase())}
                            // onChange={(e) => updateCapturedData("cfw", 'immediate_health_concern', e.target.value, 4)}
                            id="immediate_health_concern"
                            name="immediate_health_concern"
                            placeholder="Enter your Health Condition"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            // value={selectedHealthConcern !== "yes" ? "" : healthConcern}
                            // disabled={healthConcerns && healthConcerns.has_immediate_health_concern === 0}
                        // disabled={selectedHealthConcern !== "yes"}
                        />

                        {errors?.immediate_health_concern && (
                            <p className="mt-2 text-sm text-red-500">{errors.immediate_health_concern}</p>
                        )}
                    </div>
                </div>




            </div >


        </>
    )
}

