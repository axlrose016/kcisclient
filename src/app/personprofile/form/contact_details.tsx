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
    const [selectedRegionId, setSelectedRegionId] = useState<string>();

    const [provinceOptions, setProvinceOptions] = useState<LibraryOption[]>([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);

    const [BarangayOptions, setBarangayOptions] = useState<LibraryOption[]>([]);
    const [selectedBarangay, setSelectedBarangay] = useState("");
    const [selectedBarangayId, setSelectedBarangayId] = useState<string | null>(null);

    const [cityOptions, setCityOptions] = useState<LibraryOption[]>([]);
    const [selectedCity, setSelectedCity] = useState("");
    const [selectedCityId, setSelectedCityId] = useState<string | null>(null);

    const [municipalityOptions, setMunicipalityOptions] = useState<LibraryOption[]>([]);
    const [selectedMunicipality, setSelectedMunicipality] = useState("");

    const [x, setX] = useState("");
 
 

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const province = await getProvinceLibraryOptions();
                // setProvinceOptions(province);
                // alert("Hello Lord!");
                // const region = await fetchPIMS();
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
    const handleRegionChange = (id: string) => {
        console.log("Selected Region ID:", id);
        updateCapturedData("common_data", "region_code", id);
        setSelectedRegionId(id);
    };
    const handleProvinceChange = (id: string) => {
        console.log("Selected Province ID:", id);
        updateCapturedData("common_data", "province_code", id);
        setSelectedProvinceId(id);
    };
    const handleCityChange = (id: string) => {
        console.log("Selected City ID:", id);
        updateCapturedData("common_data", "city_code", id);
        setSelectedCityId(id);
    };

    // const handleProvinceChange = (id: number) => {
    //     console.log("Selected Province Code:", id);
    //     updateCapturedData("common_data", "barangay_code", id);
    //     setSelectedBarangayId(id);
    // };

    const handleBarangayChange = (id: string) => {
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
                            value={capturedData.common_data.sitio}
                            onChange={(e) => updateCapturedData("common_data", 'sitio', e.target.value)}
                            id="sitio"
                            name="sitio"
                            type="text"
                            placeholder="Enter your House No/Street/Purok"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors?.sitio && (
                            <p className="mt-2 text-sm text-red-500">{errors.sitio}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="region_contact_details" className="block text-sm font-medium mb-[5px]">Region</Label>

                        <FormDropDown

                            onChange={handleRegionChange}
                            id="region_contact_details"
                            options={regionOptions}
                            // selectedOption={selectedRegionId}
                            selectedOption={capturedData.common_data.region_code}

                        />
                        {errors?.region_contact_details && (
                            <p className="mt-2 text-sm text-red-500">{errors.region_contact_details}</p>
                        )}
                    </div >
                    <div className="p-2 col-span-2">
                        <Label htmlFor="province_contact_details" className="block text-sm font-medium mb-[5px]">Province</Label>
                        <FormDropDown
                            id="province_contact_details"
                            options={provinceOptions}
                            // selectedOption={selectedProvinceId}
                            selectedOption={capturedData.common_data.province_code}
                            onChange={handleProvinceChange}
                        />
                        {errors?.province_contact_details && (
                            <p className="mt-2 text-sm text-red-500">{errors.province_contact_details}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="municipality_contact_number" className="block text-sm font-medium mb-[5px]">Municipality</Label>

                        <FormDropDown
                            id="municipality_contact_number"
                            options={cityOptions}
                            // selectedOption={selectedCityId}
                            selectedOption={capturedData.common_data.city_code}
                            onChange={handleCityChange}
                        />
                        {errors?.municipality_contact_number && (
                            <p className="mt-2 text-sm text-red-500">{errors.municipality_contact_number}</p>
                        )}
                    </div >
                    <div className="p-2 col-span-2">
                        <Label htmlFor="barangay_contact_details" className="block text-sm font-medium mb-[5px]">Barangay</Label>
                        <FormDropDown
                            id="barangay_contact_details"
                            options={BarangayOptions}
                            selectedOption={capturedData.common_data.barangay_code}
                            // selectedOption={selectedBarangayId}
                            onChange={handleBarangayChange}
                        />
                        {errors?.barangay_contact_details && (
                            <p className="mt-2 text-sm text-red-500">{errors.barangay_contact_details}</p>
                        )}
                    </div >
                    <div className="p-2 col-span-2">
                        <Label htmlFor="cellphone_no" className="block text-sm font-medium">Contact Number (Primary)</Label>
                        <Input
                            value={capturedData.common_data.cellphone_no}
                            id="cellphone_no"
                            name="cellphone_no"
                            type="text"
                            placeholder="Enter your primary contact number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(e) => updateCapturedData("common_data", "cellphone_no", e.target.value)}
                        />
                        {errors?.cellphone_no && (
                            <p className="mt-2 text-sm text-red-500">{errors.cellphone_no}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="cellphone_no_secondary" className="block text-sm font-medium">Contact Number (Secondary)</Label>
                        <Input
                            value={capturedData.common_data.cellphone_no_secondary}
                            id="cellphone_no_secondary"
                            name="cellphone_no_secondary"
                            type="text"
                            placeholder="Enter your secondary contact number"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(e) => updateCapturedData("common_data", "cellphone_no_secondary", e.target.value)}
                        />
                        {errors?.cellphone_no_secondary && (
                            <p className="mt-2 text-sm text-red-500">{errors.cellphone_no_secondary}</p>
                        )}
                    </div>
                    <div className="p-2 col-span-2">
                        <Label htmlFor="email" className="block text-sm font-medium">Active Email Address</Label>
                        <Input
                            value={capturedData.common_data.email}
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your active email address"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            onChange={(e) => updateCapturedData("common_data", 'email', e.target.value)}
                        />
                        {errors?.email && (
                            <p className="mt-2 text-sm text-red-500">{errors.email}</p>
                        )}
                    </div>
                </div>

            </div >


        </>
    )
}