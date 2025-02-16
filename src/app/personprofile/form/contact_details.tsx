import { fetchPIMS } from "@/components/_dal/libraries"; //region to
import { fetchPIMSProvince } from "@/components/_dal/libraries";
import { fetchPIMSCity } from "@/components/_dal/libraries";
import { fetchPIMSBrgy } from "@/components/_dal/libraries";
import { getProvinceLibraryOptions } from "@/components/_dal/options";
import { FormDropDown } from "@/components/forms/form-dropdown";
import { PictureBox } from "@/components/forms/picture-box";
import { LibraryOption } from "@/components/interfaces/library-interface";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";

export default function ContactDetails({ errors, capturedData, updateCapturedData, selectedModalityId }: { errors: any; capturedData: any; updateCapturedData: any, selectedModalityId: any }) {
    const [regionOptions, setRegionOptions] = useState<LibraryOption[]>([]);
    const [selectedRegion, setSelectedRegion] = useState("");
    const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);

    const [provinceOptions, setProvinceOptions] = useState<LibraryOption[]>([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedProvinceId, setSelectedProvinceId] = useState<number | null>(null);
    
    const [BarangayOptions, setBarangayOptions] = useState<LibraryOption[]>([]);
    const [selectedBarangay, setSelectedBarangay] = useState("");
    const [selectedBarangayId, setSelectedBarangayId] = useState<number | null>(null);

    const [cityOptions, setCityOptions] = useState<LibraryOption[]>([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCityId, setSelectedCityId] = useState<number | null>(null);

    const [municipalityOptions, setMunicipalityOptions] = useState<LibraryOption[]>([]);
    const [selectedMunicipality, setSelectedMunicipality] = useState("");
    // const [barangayOptions, setBarangayOptions] = useState<LibraryOption[]>([]);
    // const [selectedBarangay, setSelectedBarangay] = useState("");

 
    useEffect(() => {
        const fetchData = async () => {
            try {
                // const province = await getProvinceLibraryOptions();
                // setProvinceOptions(province);
                // alert("Hello Lord!");
                const region = await fetchPIMS();
                // Ensure the response has data and map it to LibraryOption format
                const mappedRegions: LibraryOption[] = region.map((item: any) => ({
                    id: item.Id,         // Assuming 'id' exists in fetched data
                    name: item.Name,     // Assuming 'name' exists in fetched data
                }));

                setRegionOptions(mappedRegions); // Update state with mapped data

                const province = await fetchPIMSProvince();

                const mappedProvince: LibraryOption[] = province.map((item: any) => ({
                    id: item.Id,
                    name: item.Name,
                }));

                setProvinceOptions(mappedProvince);

                const city = await fetchPIMSCity();

                const mappedCity: LibraryOption[] = city.map((item: any) => ({
                    id: item.Id,
                    name: item.Name,
                }));

                setCityOptions(mappedCity);

                const barangay = await fetchPIMSBrgy();

                const mappedBarangay: LibraryOption[] = barangay.map((item: any) => ({
                    id: item.Id,
                    name: item.Name,
                }));

                setBarangayOptions(mappedBarangay);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);
    const handleRegionChange = (id: number) => {
        console.log("Selected Region ID:", id);
        setSelectedRegionId(id);
    };
    const handleProvinceChange = (id: number) => {
        console.log("Selected Province ID:", id);
        setSelectedProvinceId(id);
    };
    const handleCityChange = (id: number) => {
        console.log("Selected City ID:", id);
        setSelectedCityId(id);
    };
    const handleBarangayChange = (id: number) => {
        console.log("Selected Barangay ID:", id);
        updateCapturedData("common_data", "barangay_code", id);
        setSelectedBarangayId(id);
    };

    return (
        <>
            <div className="space-y-12">
                <div className="grid sm:grid-cols-4 sm:grid-rows-2 mb-2">
                    <div className="p-2 col-span-2">
                        <Label htmlFor="sitio" className="block text-sm font-medium">House No/Street/Purok</Label>
                        <Input
                            id="sitio"
                            name="sitio"
                            type="text"
                            placeholder="Enter your House No/Street/Purok"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(e) => updateCapturedData("common_data", 'sitio', e.target.value)}
                        />
                        {errors?.sitio && (
                            <p className="mt-2 text-sm text-red-500">{errors.sitio[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="region_contact_details" className="block text-sm font-medium mb-[5px]">Region</Label>

                        <FormDropDown
                            id="region_contact_details"
                            options={regionOptions}
                            selectedOption={selectedRegionId}
                            onChange={handleRegionChange}


                        />
                        {errors?.region_contact_details && (
                            <p className="mt-2 text-sm text-red-500">{errors.region_contact_details[0]}</p>
                        )}
                    </div >
                    <div className="p-2 col-span-2">
                        <Label htmlFor="province_contact_details" className="block text-sm font-medium mb-[5px]">Province</Label>
                        <FormDropDown
                            id="province_contact_details"
                            options={provinceOptions}
                            selectedOption={selectedProvinceId}
                            onChange={handleProvinceChange}
                        />
                        {errors?.province_contact_details && (
                            <p className="mt-2 text-sm text-red-500">{errors.province_contact_details[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="municipality_contact_number" className="block text-sm font-medium mb-[5px]">Municipality</Label>

                        <FormDropDown
                            id="municipality_contact_number"
                            options={cityOptions}
                            selectedOption={selectedCityId}
                            onChange={handleCityChange}
                        />
                        {errors?.municipality_contact_number && (
                            <p className="mt-2 text-sm text-red-500">{errors.municipality_contact_number[0]}</p>
                        )}
                    </div >
                    <div className="p-2 col-span-2">
                        <Label htmlFor="barangay_contact_details" className="block text-sm font-medium mb-[5px]">Barangay</Label>
                        <FormDropDown
                        id="barangay_contact_details"
                            options={BarangayOptions}
                            selectedOption={selectedBarangayId}
                            onChange={handleBarangayChange}
                        />
                        {errors?.barangay_contact_details && (
                            <p className="mt-2 text-sm text-red-500">{errors.barangay_contact_details[0]}</p>
                        )}
                    </div >
                    <div className="p-2 col-span-2">
                        <Label htmlFor="cellphone_no" className="block text-sm font-medium">Contact Number (Primary)</Label>
                        <Input
                            id="cellphone_no"
                            name="cellphone_no"
                            type="text"
                            placeholder="Enter your primary contact number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.cellphone_no && (
                            <p className="mt-2 text-sm text-red-500">{errors.cellphone_no[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="cellphone_no_secondary" className="block text-sm font-medium">Contact Number (Secondary)</Label>
                        <Input
                            id="cellphone_no_secondary"
                            name="cellphone_no_secondary"
                            type="text"
                            placeholder="Enter your secondary contact number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.cellphone_no_secondary && (
                            <p className="mt-2 text-sm text-red-500">{errors.cellphone_no_secondary[0]}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="email" className="block text-sm font-medium">Active Email Address</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your active email address"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(e) => updateCapturedData("common_data", 'email', e.target.value)}
                        />
                        {errors?.email && (
                            <p className="mt-2 text-sm text-red-500">{errors.email[0]}</p>
                        )}
                    </div>
                </div>

            </div >


        </>
    )
}