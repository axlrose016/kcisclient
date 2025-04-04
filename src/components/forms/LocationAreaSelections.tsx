import { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormDropDown } from "./form-dropdown";
import { LibraryOption } from "../interfaces/library-interface";

const KeyToken = process.env.NEXT_PUBLIC_DXCLOUD_KEY;

interface Location {
    label: any;
    id: any,
    name: string
}

interface Options {
    regions: Location[];
    provinces: Location[];
    municipalities: Location[];
    barangays: Location[];
}

interface SelectedOption {
    region_code: string;
    province_code: string;
    city_code: string;
    brgy_code: string;
}

interface LocationAreaSelectionsProps {
    selectedOption?: SelectedOption;
    onChange: (selection: SelectedOption) => void;
    ids?: { region?: string, province?: string, city?: string, barangay?: string };
    errors?: any;
}

const cache: Record<string, any> = {};

function newAbortSignal(timeoutMs: number) {
    const abortController = new AbortController();
    setTimeout(() => abortController.abort(), timeoutMs || 0);
    return abortController.signal;
}

export default function LocationAreaSelections({
    selectedOption = { region_code: "", province_code: "", city_code: "", brgy_code: "" },
    onChange,
    ids = {},
    errors
}: LocationAreaSelectionsProps) {
    const [options, setOptions] = useState<Options>({ regions: [], provinces: [], municipalities: [], barangays: [] });
    const [selectedRegion, setSelectedRegion] = useState(selectedOption.region_code);
    const [selectedProvince, setSelectedProvince] = useState<string>(selectedOption.province_code);
    const [selectedMunicipality, setSelectedMunicipality] = useState<string>(selectedOption.city_code);
    const [selectedBarangay, setSelectedBarangay] = useState<string>(selectedOption.brgy_code);



    const fetchData = async (key: string, endpoint: string, updateOptions: (data: any) => void) => {
        if (cache[key]) {
            updateOptions(cache[key]);
            return;
        }

        const signal = newAbortSignal(5000);
        try {
            const response = await fetch(endpoint, {
                // signal,
                headers: {
                    Authorization: `Bearer ${KeyToken}`,
                    "Content-Type": "application/json",
                }
            });


            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            if (data?.status) {
                cache[key] = data;
                updateOptions(data);
            }


        } catch (error: any) {
            if (error.name === "AbortError") {
                console.log("Request canceled", error.message);
            } else {
                console.error("Error fetching data:", error);
            }
        }
    };

    useEffect(() => {
        console.log('LocationAreaSelections > selectedOption', {
            selectedOption,
            selectedRegion,
            selectedProvince,
            selectedMunicipality,
            selectedBarangay
        })
        setSelectedRegion(selectedOption.region_code);
        setSelectedProvince(selectedOption.province_code)
        setSelectedMunicipality(selectedOption.city_code);
        setSelectedBarangay(selectedOption.brgy_code);
    }, [selectedOption])

    useEffect(() => {

        fetchData("regions", "/api-libs/psgc/regions", (data) => {
            // console.log('LocationAreaSelections > regions', data)
            if (data?.status) {
                // Ensure the response has data and map it to LibraryOption format
                const mappedRegions: LibraryOption[] = data.data.map((item: any) => ({
                    id: item.code,         // Assuming 'id' exists in fetched data
                    name: item.name,     // Assuming 'name' exists in fetched data
                }));
                setOptions((prev) => ({ ...prev, regions: mappedRegions }))
            }
        });
    }, []);

    useEffect(() => {
        if (selectedRegion) {
            fetchData(`provinces-${selectedRegion}`, `/api-libs/psgc/provincesByRegion?region=${selectedRegion}`, (data) => {
                // console.log('LocationAreaSelections > provinces', data)
                if (data?.status) {
                    const mappedProvince: LibraryOption[] = data.data.provinces.map((item: any) => ({
                        id: item.code,         // Assuming 'id' exists in fetched data
                        name: item.name,     // Assuming 'name' exists in fetched data
                    }));
                    setOptions((prev) => ({ ...prev, provinces: mappedProvince }))
                }
            }
            );
        }
    }, [selectedRegion]);



    useEffect(() => {
        if (selectedProvince) {
            fetchData(`muni-${selectedProvince}`, `/api-libs/psgc/municipalityByProvince?province=${selectedProvince}`, (data) => {
                // console.log('LocationAreaSelections > municipalities', data)
                if (data?.status) {
                    const mappedCity: LibraryOption[] = data.data.municipalities.map((item: any) => ({
                        id: item.code,         // Assuming 'id' exists in fetched data
                        name: item.name,     // Assuming 'name' exists in fetched data
                    }));
                    setOptions((prev) => ({ ...prev, municipalities: mappedCity }))
                }
            }
            );
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedMunicipality) {
            fetchData(`barangays-${selectedMunicipality}`, `/api-libs/psgc/barangayByMunicipality?municipality=${selectedMunicipality}`, (data) => {
                // console.log('LocationAreaSelections > barangays', data)
                if (data?.status) {
                    const mappedBarangay: LibraryOption[] = data.data.barangay.map((item: any) => ({
                        id: item.code,         // Assuming 'id' exists in fetched data
                        name: item.name,     // Assuming 'name' exists in fetched data
                    }));
                    setOptions((prev) => ({ ...prev, barangays: mappedBarangay }))
                }
            }
            );
        }
    }, [selectedMunicipality]);


    const handleRegionChange = (id: string) => {
        // console.log("Selected Region ID:", id);
        setSelectedRegion(id);
        setSelectedProvince("")
        setSelectedMunicipality("");
        setSelectedBarangay("");
        setOptions({ ...options, provinces: [], municipalities: [], barangays: [] })
        onChange({
            region_code: id,
            province_code: "",
            city_code: "",
            brgy_code: ""
        });
    };


    const handleProvinceChange = (id: string) => {
        // console.log("Selected Province ID:", id);
        setSelectedProvince(id);
        setSelectedMunicipality("");
        setSelectedBarangay("");
        setOptions({ ...options, municipalities: [], barangays: [] })
        onChange({
            region_code: selectedRegion,
            province_code: id,
            city_code: "",
            brgy_code: ""
        });
    };

    const handleCityChange = (id: string) => {
        // console.log("Selected City ID:", { id, options });
        // updateCapturedData("common_data", "city_code", id);
        setSelectedMunicipality(id);
        setSelectedBarangay("");
        setOptions({ ...options, barangays: [] })
        onChange({
            region_code: selectedRegion,
            province_code: selectedProvince,
            city_code: id,
            brgy_code: ""
        });


    };

    const handleBarangayChange = (id: string) => {
        // console.log("Selected Barangay ID:", id);
        // updateCapturedData("common_data", "brgy_code", id);
        setSelectedBarangay(id);
        onChange({
            region_code: selectedRegion,
            province_code: selectedProvince,
            city_code: selectedMunicipality,
            brgy_code: id
        })
    };

    return (
        <>
            <div className="p-2 col-span-2">
                <Label htmlFor={ids.region || "region_contact_details_permanent_address"} className="block text-sm font-medium mb-[5px]">Region<span className='text-red-500'> *</span></Label>

                <FormDropDown
                    selectedOption={selectedOption.region_code}
                    onChange={handleRegionChange}
                    id={ids.region || "region_contact_details_permanent_address"}
                    options={options.regions}
                />
                {errors?.region_error && (
                    <p className="mt-2 text-sm text-red-500">{errors.region_error}</p>
                )}
            </div >
            <div className="p-2 col-span-2">
                <Label htmlFor={ids.province || "province_contact_details_permanent_address"} className="block text-sm font-medium mb-[5px]">Province<span className='text-red-500'> *</span></Label>
                <FormDropDown
                    id={ids.province || "province_contact_details_permanent_address"}
                    options={options.provinces}
                    selectedOption={selectedOption.province_code}
                    onChange={handleProvinceChange}
                />
                {errors?.province_error && (
                    <p className="mt-2 text-sm text-red-500">{errors.province_error}</p>
                )}
            </div>
            <div className="p-2 col-span-2">
                <Label htmlFor={ids.city || "municipality_contact_details_permanent_address"} className="block text-sm font-medium mb-[5px]">Municipality<span className='text-red-500'> *</span></Label>
                <FormDropDown
                    id={ids.city || "municipality_contact_details_permanent_address"}
                    options={options.municipalities}
                    selectedOption={selectedOption.city_code}
                    onChange={handleCityChange}
                />
                {errors?.municipality_error && (
                    <p className="mt-2 text-sm text-red-500">{errors.municipality_error}</p>
                )}
            </div >
            <div className="p-2 col-span-2 mb-3">
                <Label htmlFor={ids.barangay || "barangay_contact_details_permanent_address"} className="block text-sm font-medium mb-[5px]">Barangay<span className='text-red-500'> *</span></Label>
                <FormDropDown
                    id={ids.barangay || "barangay_contact_details_permanent_address"}
                    options={options.barangays}
                    selectedOption={selectedOption.brgy_code}
                    onChange={handleBarangayChange}
                />
                {errors?.barangay_error && (
                    <p className="mt-2 text-sm text-red-500">{errors.barangay_error}</p>
                )}
            </div >
        </>
    );
}
