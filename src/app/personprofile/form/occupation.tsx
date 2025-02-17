import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { getIDCardLibraryOptions } from "@/components/_dal/options";

export default function Occupation({ errors, capturedData, updateCapturedData, selectedModalityId }: { errors: any; capturedData: any; updateCapturedData: any, selectedModalityId: any }) {
    const [cfwOptions, setCfwOptions] = useState<LibraryOption[]>([]);
    const [selectedCfwCategory, setSelectedCfwCategory] = useState("");

    const [iDCardOptions, setIDCardOptions] = useState<LibraryOption[]>([]);
    const [selectedIDCard, setSelectedIDCard] = useState("");
    const [selectedIDCardId, setSelectedIDCardId] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const id_card = await getIDCardLibraryOptions();
                setIDCardOptions(id_card);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    const handleIDCardChange = (id: number) => {
        console.log("Selected ID Card ID:", id);
        updateCapturedData("cfw", "id_card", id, 4);
        setSelectedIDCardId(id);
    };
    return (
        <>
            <div className="">
                <div className="grid sm:grid-cols-4 sm:grid-rows-1 mb-2">
                    <div className="p-2 col-span-4">
                        <Label htmlFor="current_occupation" className="block text-sm font-medium">Occupation</Label>
                        <Input
                            value={capturedData.cfw[4].current_occupation}
                            id="current_occupation"
                            name="current_occupation"
                            type="text"
                            placeholder="Enter your Occupation"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(e) => updateCapturedData("cfw", 'current_occupation', e.target.value, 4)}
                        />
                        {errors?.current_occupation && (
                            <p className="mt-2 text-sm text-red-500">{errors.current_occupation[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-4 sm:col-span-4">

                        <Label htmlFor="occupation_id_card" className="block text-sm font-medium mb-[5px]">Valid ID</Label>
                        <FormDropDown
                            selectedOption={capturedData.cfw[4].id_card}
                            onChange={handleIDCardChange}
                            id="occupation_id_card"
                            options={iDCardOptions}
                        />
                        {errors?.occupation_id_card && (
                            <p className="mt-2 text-sm text-red-500">{errors.occupation_id_card[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-4 sm:col-span-4">

                        <Label htmlFor="occupation_id_card_number" className="block text-sm font-medium mb-[5px]">ID Number</Label>
                        <Input
                            value={capturedData.cfw[4].occupation_id_card_number}
                            id="occupation_id_card_number"
                            name="occupation_id_card_number"
                            type="text"
                            placeholder="Enter your ID Number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(e) => updateCapturedData("cfw", 'occupation_id_card_number', e.target.value, 4)}
                        />
                        {errors?.occupation_id_card_number && (
                            <p className="mt-2 text-sm text-red-500">{errors.occupation_id_card_number[0]}</p>
                        )}
                    </div>



                    <div className={`grid sm:grid-cols-1 sm:grid-rows-1 mb-2  ${selectedModalityId === 25 ? "hidden" : ""}  `}>
                        <div className="p-2">
                            <Label htmlFor="is_lgu_official" className="block text-sm font-medium">Is LGU Official</Label>
                            <div className="mt-1">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="is_lgu_official" value="yes" className="form-radio" />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input type="radio" name="is_lgu_official" value="no" className="form-radio" />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {errors?.is_lgu_official && (
                                <p className="mt-2 text-sm text-red-500">{errors.is_lgu_official[0]}</p>
                            )}
                        </div>
                        <div className="p-2">
                            <Label htmlFor="is_mdc" className="block text-sm font-medium">Is MDC</Label>
                            <div className="mt-1">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="is_mdc" value="yes" className="form-radio" />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input type="radio" name="is_mdc" value="no" className="form-radio" />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {errors?.is_mdc && (
                                <p className="mt-2 text-sm text-red-500">{errors.is_mdc[0]}</p>
                            )}
                        </div>
                        <div className="p-2">
                            <Label htmlFor="is_bdc" className="block text-sm font-medium">Is BDC</Label>
                            <div className="mt-1">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="is_bdc" value="yes" className="form-radio" />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input type="radio" name="is_bdc" value="no" className="form-radio" />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {errors?.is_bdc && (
                                <p className="mt-2 text-sm text-red-500">{errors.is_bdc[0]}</p>
                            )}
                        </div>
                        <div className="p-2">
                            <Label htmlFor="is_bspmc" className="block text-sm font-medium">Is BSPMC</Label>
                            <div className="mt-1">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="is_bspmc" value="yes" className="form-radio" />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input type="radio" name="is_bspmc" value="no" className="form-radio" />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {errors?.is_bspmc && (
                                <p className="mt-2 text-sm text-red-500">{errors.is_bspmc[0]}</p>
                            )}
                        </div>
                        <div className="p-2">
                            <Label htmlFor="is_bdrrmc_bdc_twg" className="block text-sm font-medium">Is BDRRMC/BDC-TWG</Label>
                            <div className="mt-1">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="is_bdrrmc_bdc_twg" value="yes" className="form-radio" />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input type="radio" name="is_bdrrmc_bdc_twg" value="no" className="form-radio" />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {errors?.is_bdrrmc_bdc_twg && (
                                <p className="mt-2 text-sm text-red-500">{errors.is_bdrrmc_bdc_twg[0]}</p>
                            )}
                        </div>
                        <div className="p-2">
                            <Label htmlFor="is_bdrrmc_expanded_bdrrmc" className="block text-sm font-medium">Is BDRRMC/EXPANDED BDRRMC?</Label>
                            <div className="mt-1">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="is_bdrrmc_expanded_bdrrmc" value="yes" className="form-radio" />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input type="radio" name="is_bdrrmc_expanded_bdrrmc" value="no" className="form-radio" />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {errors?.is_bdrrmc_expanded_bdrrmc && (
                                <p className="mt-2 text-sm text-red-500">{errors.is_bdrrmc_expanded_bdrrmc[0]}</p>
                            )}
                        </div>
                        <div className="p-2">
                            <Label htmlFor="is_mdrrmc" className="block text-sm font-medium">Is MDRRMC?</Label>
                            <div className="mt-1">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="is_mdrrmc" value="yes" className="form-radio" />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input type="radio" name="is_mdrrmc" value="no" className="form-radio" />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {errors?.is_mdrrmc && (
                                <p className="mt-2 text-sm text-red-500">{errors.is_mdrrmc[0]}</p>
                            )}
                        </div>
                        <div className="p-2">
                            <Label htmlFor="is_hh_head" className="block text-sm font-medium">Is HH Head?</Label>
                            <div className="mt-1">
                                <label className="inline-flex items-center">
                                    <input type="radio" name="is_hh_head" value="yes" className="form-radio" />
                                    <span className="ml-2">Yes</span>
                                </label>
                                <label className="inline-flex items-center ml-6">
                                    <input type="radio" name="is_hh_head" value="no" className="form-radio" />
                                    <span className="ml-2">No</span>
                                </label>
                            </div>
                            {errors?.is_hh_head && (
                                <p className="mt-2 text-sm text-red-500">{errors.is_hh_head[0]}</p>
                            )}
                        </div>
                    </div>


                </div>

            </div >


        </>
    )
}